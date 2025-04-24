<?php

namespace App\Http\Controllers;

use Illuminate\Http\{
    Request,
    RedirectResponse
};
use Inertia\{
    Inertia,
    Response
};
use App\Models\{
    User,
    File,
    FileExtension
};
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Exports\StorageStatisticsExport;
use Maatwebsite\Excel\Facades\Excel;
use App\Services\Admin\UserService;
use PDF;

class AdminController extends Controller {

    public function __construct(
        protected UserService $userService,
    ) {}

    /**
     * Отображает список пользователей в админке
     *
     * @return Response
     */
    public function index(): Response
    {
        return Inertia::render('Admin/Users', [
            'users' => User::with('quota')
            ->withCount(['files', 'folders'])
            ->addSelect(['total_file_size' => File::select(DB::raw('COALESCE(SUM(size),0)'))
                ->whereColumn('user_id', 'users.id')
            ])->get(),
        ]);
    }

    /**
     * Обновление роли пользователя
     *
     * @param User $user
     * @param Request $request
     * @return RedirectResponse
     */
    public function update_role(User $user, Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'is_admin' => 'required|boolean',
        ]);

        $user = User::find($user->id);
        if (!$user) {
            return redirect()->back()->with('msg', [
                'title' => "Пользователь не найден",
            ]);
        }

        $this->userService->updateRole($user, $validated['is_admin']);
        return redirect()->back()->with('msg', [
            'title' => "Роль пользователя {$user->name} изменена",
        ]);
    }

    /**
     * Обновление пароля пользователя
     *
     * @param User $user
     * @param Request $request
     * @return RedirectResponse
     */
    public function update_password(User $user, Request $request) : RedirectResponse {
        $newPassword = $request->input('password');

        $this->userService->updatePassword($newPassword, $user);

        return back()->with('msg', ['title' => 'Пароль успешно сброшен']);
    }

    /**
     * Отображение статистики
     *
     * @return Response
     */
    public function stats() : Response
    {
        $userStats = $this->getUserStats();
        $storageStats = $this->getStorageStats();
        $fileStats = $this->getFileStats();

        return Inertia::render('Admin/Stats', [
            'chartData' => $userStats,
            'storage' => $storageStats,
            'fileStats' => $fileStats,
        ]);
    }

    /**
     * Статистика регистраций пользователей за 90 дней
     *
     * @return array
     */
    private function getUserStats() : array
    {
        $endDate = Carbon::now();
        $startDate = $endDate->copy()->subDays(90);

        return DB::table('users')
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get()
            ->map(function ($row) {
                return [
                    'date' => $row->date,
                    'desktop' => $row->count,
                ];
            })
            ->values()
            ->toArray();
    }

    /**
     * Статистика использования хранилища
     *
     * @return array
     */
    private function getStorageStats() : array
    {
        $totalSpace = disk_total_space(storage_path()) / 1024 / 1024 / 1024;
        $freeSpace = disk_free_space(storage_path()) / 1024 / 1024 / 1024;
        $usedSpace = $totalSpace - $freeSpace;
        $storageUsage = ($usedSpace / $totalSpace) * 100;

        return [
            'total' => round($totalSpace, 2),
            'used' => round($usedSpace, 2),
            'free' => round($freeSpace, 2),
            'percentage' => round($storageUsage, 2),
        ];
    }

    /**
     * Статистика детализации файлов по категориям
     *
     * @return array
     */
    private function getFileStats() : array
    {
        $fileCategories = [
            'Документы' => ['docx', 'xlsx', 'pdf', 'pptx', 'txt'],
            'Фото' => ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'],
            'Видео' => ['mp4', 'avi', 'mov', 'webm', 'mkv'],
            'Архивы' => ['zip', 'rar', 'tar', 'gz', '7z'],
            'Базы_данных' => ['sql', 'db', 'sqlite', 'mdb', 'accdb'],
            'Код' => ['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'cpp', 'c', 'h', 'php', 'html', 'css'],
            'Аудио' => ['mp3', 'wav', 'flac'],
            'Презентации' => ['ppt', 'key'],
            'Таблицы' => ['xls', 'csv'],
        ];

        return DB::table('files')
            ->join('file_extensions', 'files.extension_id', '=', 'file_extensions.id')
            ->select('file_extensions.extension', DB::raw('SUM(files.size) as total_size'), DB::raw('COUNT(files.id) as count'))
            ->whereNull('files.deleted_at')
            ->groupBy('file_extensions.extension')
            ->get()
            ->groupBy(function ($file) use ($fileCategories) {
                foreach ($fileCategories as $category => $extensions) {
                    if (in_array($file->extension, $extensions)) {
                        return $category;
                    }
                }
                return 'Другое';
            })
            ->map(function ($files) {
                return [
                    'size' => $files->sum('total_size'),
                    'count' => $files->sum('count'),
                ];
            })
            ->toArray();
    }

    /**
     * Экспорт статистики хранилища в Excel
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    public function excel(Request $request) {
        $filename = 'статистика_хранилища_' . Carbon::now()->format('Y-m-d_H-i-s') . '.xlsx';
        return Excel::download(new StorageStatisticsExport(), $filename);
    }

    /**
     * Генерация PDF-отчета о хранилище
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function generateReport(Request $request) {
        $request->validate([
            'period' => 'nullable|in:week,month,year',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $period = $request->input('period', 'month');
        $userId = $request->input('user_id');

        if (!auth()->user()->is_admin && $userId != auth()->id()) {
            $userId = auth()->id();
        }

        switch ($period) {
            case 'week':
                $startDate = Carbon::now()->subWeek();
                $periodTitle = 'за последнюю неделю';
                break;
            case 'year':
                $startDate = Carbon::now()->subYear();
                $periodTitle = 'за последний год';
                break;
            default:
                $startDate = Carbon::now()->subMonth();
                $periodTitle = 'за последний месяц';
                break;
        }

        $query = File::query();

        if ($userId) {
            $query->where('user_id', $userId);
            $user = User::find($userId);
            $userTitle = $user ? "пользователя {$user->name}" : "выбранного пользователя";
        } else {
            $userTitle = "всех пользователей";
        }

        $data = [
            'title' => "Отчет о состоянии хранилища {$periodTitle} для {$userTitle}",
            'generated_at' => Carbon::now()->format('d.m.Y H:i:s'),
            'period' => $periodTitle,
            'user_filter' => $userTitle,

            'total_files' => $query->count(),
            'total_size' => $this->formatBytes($query->sum('size')),
            'avg_file_size' => $this->formatBytes($query->avg('size') ?: 0),

            'extensions' => DB::table('files')
                ->join('file_extensions', 'files.extension_id', '=', 'file_extensions.id')
                ->select('file_extensions.extension', DB::raw('COUNT(*) as count'), DB::raw('SUM(files.size) as total_size'))
                ->when($userId, function ($q) use ($userId) {
                    return $q->where('files.user_id', $userId);
                })
                ->groupBy('file_extensions.extension')
                ->orderBy('count', 'desc')
                ->limit(5)
                ->get()
                ->map(function ($item) {
                    $item->formatted_size = $this->formatBytes($item->total_size);
                    return $item;
                }),

            'recent_uploads' => $query->clone()
                ->with(['extension', 'user'])
                ->where('created_at', '>=', $startDate)
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get()
                ->map(function ($file) {
                    return [
                        'name' => $file->name,
                        'extension' => $file->extension ? $file->extension->extension : 'Н/Д',
                        'size' => $this->formatBytes($file->size),
                        'user' => $file->user ? $file->user->name : 'Н/Д',
                        'created_at' => $file->created_at->format('d.m.Y H:i:s'),
                    ];
                }),

            'activity' => DB::table('files')
                ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as count'))
                ->when($userId, function ($q) use ($userId) {
                    return $q->where('user_id', $userId);
                })
                ->where('created_at', '>=', $startDate)
                ->groupBy('date')
                ->orderBy('date', 'desc')
                ->get()
                ->map(function ($item) {
                    $item->formatted_date = Carbon::parse($item->date)->format('d.m.Y');
                    return $item;
                }),
        ];

        $pdf = PDF::loadView('reports.storage-report', $data);
        $pdf->setPaper('a4', 'portrait');
        $pdf->setOptions([
            'defaultFont' => 'sans-serif',
            'isHtml5ParserEnabled' => true,
            'isRemoteEnabled' => true,
        ]);
        $filename = "отчет_хранилище_{$period}_" . Carbon::now()->format('Y-m-d') . ".pdf";

        return $pdf->download($filename);
    }

    /**
     * Форматирование байтов в читаемый формат
     *
     * @param int $bytes
     * @param int $precision
     * @return string
     */
    private function formatBytes($bytes, $precision = 2) {
        $units = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ'];

        $bytes = max((int)$bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);

        $bytes /= (1 << (10 * $pow));

        return round($bytes, $precision) . ' ' . $units[$pow];
    }
}

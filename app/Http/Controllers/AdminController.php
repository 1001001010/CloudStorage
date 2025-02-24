<?php

namespace App\Http\Controllers;

use Illuminate\Http\{Request, RedirectResponse};
use Inertia\{Inertia, Response};
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminController extends Controller
{
    /**
     * Отображает список пользователей в админке
     *
     * @return Response
     */
    public function index(): Response {
        return Inertia::render('Admin/Users', [
            'users' => User::withCount(['files', 'folders'])->get(),
        ]);
    }

    /**
     * Обновляет роль пользователя
     *
     * @param User $user Объект пользователя, роль которого нужно изменить.
     * @param Request $request HTTP-запрос с данными о новой роли.
     * @return RedirectResponse
     */
    public function update_role(User $user, Request $request): RedirectResponse {
        $request->merge([
            'is_admin' => filter_var($request->input('is_admin'), FILTER_VALIDATE_BOOLEAN),
        ]);

        $validated = $request->validate([
            'is_admin' => 'required|boolean',
        ]);

        $user = User::find($user->id);

        if (!$user) {
            return redirect()->back()->with('msg', [
                'title' => "Пользователь не найден",
            ]);
        }

        $user->is_admin = $validated['is_admin'];
        $user->save();

        return redirect()->back()->with('msg', [
            'title' => "Роль пользователя $user->name изменена",
        ]);
    }

    /**
     * Генерирует статистику регистрации пользователей за последние 90 дней.
     *
     * @return Response
     */
    public function stats(): Response
    {
        $endDate = Carbon::now();
        $startDate = $endDate->copy()->subDays(90);

        // Статистика пользователей
        $userStats = DB::table('users')
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
            ->values();

        // Получаем информацию о хранилище
        $totalSpace = disk_total_space(storage_path()) / 1024 / 1024 / 1024; // Общий объем (GB)
        $freeSpace = disk_free_space(storage_path()) / 1024 / 1024 / 1024; // Свободное место (GB)
        $usedSpace = $totalSpace - $freeSpace; // Использованное место (GB)
        $storageUsage = ($usedSpace / $totalSpace) * 100; // В процентах

        // Категории файлов и соответствующие расширения
        $fileCategories = [
            'Документы' => ['docx', 'xlsx', 'pdf', 'pptx', 'txt'],
            'Фото' => ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'],
            'Видео' => ['mp4', 'avi', 'mov', 'webm', 'mkv'],
            'Архивы' => ['zip', 'rar', 'tar', 'gz', '7z'],
            'Базы данных' => ['sql', 'db', 'sqlite', 'mdb', 'accdb'],
            'Код' => ['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'cpp', 'c', 'h', 'php', 'html', 'css'],
            'Аудио' => ['mp3', 'wav', 'flac'],
            'Презентации' => ['ppt', 'key'],
            'Таблицы' => ['xls', 'csv'],
        ];

        // Получаем статистику по файлам
        $fileStats = DB::table('files')
            ->join('file_extensions', 'files.extension_id', '=', 'file_extensions.id')
            ->select('file_extensions.extension', DB::raw('SUM(files.size) as total_size'), DB::raw('COUNT(files.id) as count'))
            ->whereNull('files.deleted_at') // Учитываем мягко удаленные файлы
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
            });

        return Inertia::render('Admin/Stats', [
            'chartData' => $userStats->toArray(),
            'storage' => [
                'total' => round($totalSpace, 2),
                'used' => round($usedSpace, 2),
                'free' => round($freeSpace, 2),
                'percentage' => round($storageUsage, 2),
            ],
            'fileStats' => $fileStats, // передаем статистику файлов
        ]);

    }



}

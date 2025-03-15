<?php

namespace App\Exports\Sheets;

use App\Models\File;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithDrawings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Chart\Chart;
use PhpOffice\PhpSpreadsheet\Chart\DataSeries;
use PhpOffice\PhpSpreadsheet\Chart\DataSeriesValues;
use PhpOffice\PhpSpreadsheet\Chart\Legend;
use PhpOffice\PhpSpreadsheet\Chart\PlotArea;
use PhpOffice\PhpSpreadsheet\Chart\Title;

class UserActivitySheet implements FromCollection, WithTitle, WithHeadings, WithStyles, WithDrawings, ShouldAutoSize
{
    protected $period;
    protected $userId;

    public function __construct($period = 'month', $userId = null)
    {
        $this->period = $period;
        $this->userId = $userId;
    }

    public function collection()
    {
        // Определение периода
        switch ($this->period) {
            case 'week':
                $startDate = Carbon::now()->subWeek();
                $groupFormat = '%Y-%m-%d'; // Используем MySQL формат
                $labelFormat = 'd.m';
                break;
            case 'year':
                $startDate = Carbon::now()->subYear();
                $groupFormat = '%Y-%m'; // Используем MySQL формат
                $labelFormat = 'F Y';
                break;
            default: // month
                $startDate = Carbon::now()->subMonth();
                $groupFormat = '%Y-%m-%d'; // Используем MySQL формат
                $labelFormat = 'd.m';
                break;
        }

        $query = File::query();

        if ($this->userId) {
            $query->where('user_id', $this->userId);
        }

        // Получение данных о загрузках по дням/месяцам с использованием MySQL DATE_FORMAT
        $uploadStats = $query->where('created_at', '>=', $startDate)
            ->select(DB::raw("DATE_FORMAT(created_at, '{$groupFormat}') as date"), DB::raw('COUNT(*) as count'), DB::raw('SUM(size) as total_size'))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Преобразование дат в читаемый формат с проверкой на корректность
        $uploadStats = $uploadStats->map(function ($item) use ($labelFormat) {
            try {
                // Проверяем, что дата корректна
                if (!empty($item->date) && strtotime($item->date)) {
                    $date = Carbon::parse($item->date);
                    $formattedDate = $date->format($labelFormat);
                } else {
                    $formattedDate = 'Н/Д';
                }

                return [
                    'date' => $formattedDate,
                    'count' => $item->count,
                    'total_size' => $item->total_size ?? 0,
                ];
            } catch (\Exception $e) {
                // В случае ошибки возвращаем безопасные значения
                return [
                    'date' => 'Ошибка даты',
                    'count' => $item->count ?? 0,
                    'total_size' => $item->total_size ?? 0,
                ];
            }
        });

        // Получение топ пользователей по количеству файлов
        $topUsersByCount = DB::table('files')
            ->join('users', 'files.user_id', '=', 'users.id')
            ->select('users.name', DB::raw('COUNT(*) as count'))
            ->groupBy('users.id', 'users.name')
            ->orderBy('count', 'desc')
            ->limit(10)
            ->get();

        // Получение топ пользователей по размеру файлов
        $topUsersBySize = DB::table('files')
            ->join('users', 'files.user_id', '=', 'users.id')
            ->select('users.name', DB::raw('SUM(files.size) as total_size'))
            ->groupBy('users.id', 'users.name')
            ->orderBy('total_size', 'desc')
            ->limit(10)
            ->get();

        $result = collect([
            ['Активность загрузок за период', '', ''],
            ['Дата', 'Количество файлов', 'Общий размер'],
        ]);

        foreach ($uploadStats as $stat) {
            $result->push([
                $stat['date'],
                $stat['count'],
                $this->formatBytes($stat['total_size']),
            ]);
        }

        $result->push(['', '', '']);
        $result->push(['Топ пользователей по количеству файлов', '', '']);
        $result->push(['Пользователь', 'Количество файлов', '']);

        foreach ($topUsersByCount as $user) {
            $result->push([
                $user->name ?? 'Неизвестный пользователь',
                $user->count ?? 0,
                '',
            ]);
        }

        $result->push(['', '', '']);
        $result->push(['Топ пользователей по размеру файлов', '', '']);
        $result->push(['Пользователь', 'Общий размер', '']);

        foreach ($topUsersBySize as $user) {
            $result->push([
                $user->name ?? 'Неизвестный пользователь',
                $this->formatBytes($user->total_size ?? 0),
                '',
            ]);
        }

        return $result;
    }

    public function headings(): array
    {
        return [];
    }

    public function title(): string
    {
        return 'Активность пользователей';
    }

    public function styles(Worksheet $sheet)
    {
        // Стили для заголовков секций
        $sheet->getStyle('A1')->applyFromArray([
            'font' => [
                'bold' => true,
                'size' => 14,
                'color' => ['rgb' => 'FFFFFF'],
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '4472C4'],
            ],
        ]);

        // Находим индексы строк для других заголовков
        $lastRow = $sheet->getHighestRow();
        $topUsersCountRow = null;
        $topUsersSizeRow = null;

        for ($i = 1; $i <= $lastRow; $i++) {
            $value = $sheet->getCell('A' . $i)->getValue();
            if ($value == 'Топ пользователей по количеству файлов') {
                $topUsersCountRow = $i;
            } elseif ($value == 'Топ пользователей по размеру файлов') {
                $topUsersSizeRow = $i;
            }
        }

        if ($topUsersCountRow) {
            $sheet->getStyle('A' . $topUsersCountRow)->applyFromArray([
                'font' => [
                    'bold' => true,
                    'size' => 14,
                    'color' => ['rgb' => 'FFFFFF'],
                ],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '4472C4'],
                ],
            ]);
        }

        if ($topUsersSizeRow) {
            $sheet->getStyle('A' . $topUsersSizeRow)->applyFromArray([
                'font' => [
                    'bold' => true,
                    'size' => 14,
                    'color' => ['rgb' => 'FFFFFF'],
                ],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '4472C4'],
                ],
            ]);
        }

        // Объединение ячеек для заголовков
        $sheet->mergeCells('A1:C1');

        if ($topUsersCountRow) {
            $sheet->mergeCells('A' . $topUsersCountRow . ':C' . $topUsersCountRow);
        }

        if ($topUsersSizeRow) {
            $sheet->mergeCells('A' . $topUsersSizeRow . ':C' . $topUsersSizeRow);
        }

        return [];
    }

    public function drawings()
    {
        // Создание линейной диаграммы для активности загрузок
        $activityChart = new Chart(
            'activity_chart',
            new Title('Активность загрузок за период'),
            new Legend(Legend::POSITION_TOP),
            new PlotArea(null, [
                new DataSeries(
                    DataSeries::TYPE_LINECHART,
                    DataSeries::GROUPING_STANDARD,
                    range(0, 0),
                    [new DataSeriesValues('String', 'Активность пользователей!$B$2', null, 1)],
                    [new DataSeriesValues('String', 'Активность пользователей!$A$3:$A$20', null, 18)],
                    [new DataSeriesValues('Number', 'Активность пользователей!$B$3:$B$20', null, 18)]
                )
            ])
        );

        $activityChart->setTopLeftPosition('E1');
        $activityChart->setBottomRightPosition('K15');

        return [$activityChart];
    }

    private function formatBytes($bytes, $precision = 2)
    {
        $units = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ'];

        $bytes = max((int)$bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);

        $bytes /= (1 << (10 * $pow));

        return round($bytes, $precision) . ' ' . $units[$pow];
    }
}

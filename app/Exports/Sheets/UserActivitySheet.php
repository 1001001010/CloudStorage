<?php

namespace App\Exports\Sheets;

use App\Models\{
    File,
    User
};
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\{
    FromCollection,
    WithTitle,
    WithHeadings,
    WithStyles,
    WithDrawings,
    ShouldAutoSize
};
use PhpOffice\PhpSpreadsheet\{
    Worksheet\Worksheet,
    Style\Fill,
    Style\Border,
    Chart\Chart,
    Chart\DataSeries,
    Chart\DataSeriesValues,
    Chart\Legend,
    Chart\PlotArea,
    Chart\Title
};

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
        switch ($this->period) {
            case 'week':
                $startDate = Carbon::now()->subWeek();
                $groupFormat = '%Y-%m-%d';
                $labelFormat = 'd.m';
                break;
            case 'year':
                $startDate = Carbon::now()->subYear();
                $groupFormat = '%Y-%m';
                $labelFormat = 'F Y';
                break;
            default:
                $startDate = Carbon::now()->subMonth();
                $groupFormat = '%Y-%m-%d';
                $labelFormat = 'd.m';
                break;
        }

        $query = File::query();

        if ($this->userId) {
            $query->where('user_id', $this->userId);
        }

        $uploadStats = $query->where('created_at', '>=', $startDate)
            ->select(DB::raw("DATE_FORMAT(created_at, '{$groupFormat}') as date"), DB::raw('COUNT(*) as count'), DB::raw('SUM(size) as total_size'))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $uploadStats = $uploadStats->map(function ($item) use ($labelFormat) {
            try {
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
                return [
                    'date' => 'Ошибка даты',
                    'count' => $item->count ?? 0,
                    'total_size' => $item->total_size ?? 0,
                ];
            }
        });

        $topUsersByCount = DB::table('files')
            ->join('users', 'files.user_id', '=', 'users.id')
            ->select('users.name', DB::raw('COUNT(*) as count'))
            ->groupBy('users.id', 'users.name')
            ->orderBy('count', 'desc')
            ->limit(10)
            ->get();

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

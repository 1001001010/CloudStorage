<?php

namespace App\Exports\Sheets;

use App\Models\File;
use App\Models\User;
use Illuminate\Support\Facades\DB;
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

class StorageUsageSheet implements FromCollection, WithTitle, WithHeadings, WithStyles, WithDrawings, ShouldAutoSize
{
    protected $userId;

    public function __construct($userId = null)
    {
        $this->userId = $userId;
    }

    public function collection()
    {
        // Общая статистика использования хранилища
        $totalSize = File::sum('size');
        $totalFiles = File::count();
        $totalUsers = User::count();
        $avgSizePerUser = $totalUsers > 0 ? $totalSize / $totalUsers : 0;
        $avgFilesPerUser = $totalUsers > 0 ? $totalFiles / $totalUsers : 0;

        // Использование хранилища по пользователям
        $userStats = DB::table('files')
            ->join('users', 'files.user_id', '=', 'users.id')
            ->select('users.name', DB::raw('COUNT(*) as file_count'), DB::raw('SUM(files.size) as total_size'))
            ->groupBy('users.id', 'users.name')
            ->orderBy('total_size', 'desc')
            ->get();

        $result = collect([
            ['Общая статистика использования хранилища', '', ''],
            ['Метрика', 'Значение', ''],
            ['Общий размер хранилища', $this->formatBytes($totalSize), $totalSize . ' байт'],
            ['Общее количество файлов', $totalFiles, ''],
            ['Общее количество пользователей', $totalUsers, ''],
            ['Средний размер на пользователя', $this->formatBytes($avgSizePerUser), round($avgSizePerUser, 2) . ' байт'],
            ['Среднее количество файлов на пользователя', round($avgFilesPerUser, 2), ''],
            ['', '', ''],
            ['Использование хранилища по пользователям', '', ''],
            ['Пользователь', 'Количество файлов', 'Занимаемое место'],
        ]);

        foreach ($userStats as $stat) {
            $result->push([
                $stat->name,
                $stat->file_count,
                $this->formatBytes($stat->total_size),
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
        return 'Использование хранилища';
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

        $sheet->getStyle('A9')->applyFromArray([
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

        // Стили для заголовков таблиц
        $sheet->getStyle('A2:C2')->applyFromArray([
            'font' => [
                'bold' => true,
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => 'D9E1F2'],
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                ],
            ],
        ]);

        $sheet->getStyle('A10:C10')->applyFromArray([
            'font' => [
                'bold' => true,
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => 'D9E1F2'],
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                ],
            ],
        ]);

        // Стили для данных
        $sheet->getStyle('A3:C7')->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                ],
            ],
        ]);

        $lastRow = $sheet->getHighestRow();
        $sheet->getStyle('A11:C' . $lastRow)->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                ],
            ],
        ]);

        // Объединение ячеек для заголовков
        $sheet->mergeCells('A1:C1');
        $sheet->mergeCells('A9:C9');

        return [];
    }

    public function drawings()
    {
        // Создание круговой диаграммы для использования хранилища по пользователям
        $storageChart = new Chart(
            'storage_chart',
            new Title('Распределение хранилища по пользователям'),
            new Legend(Legend::POSITION_RIGHT),
            new PlotArea(null, [
                new DataSeries(
                    DataSeries::TYPE_PIECHART,
                    null,
                    range(0, 0),
                    [new DataSeriesValues('String', 'Использование хранилища!$C$10', null, 1)],
                    [new DataSeriesValues('String', 'Использование хранилища!$A$11:$A$20', null, 10)],
                    [new DataSeriesValues('Number', 'Использование хранилища!$C$11:$C$20', null, 10)]
                )
            ])
        );

        $storageChart->setTopLeftPosition('E1');
        $storageChart->setBottomRightPosition('K15');

        return [$storageChart];
    }

    private function formatBytes($bytes, $precision = 2)
    {
        $units = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ'];

        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);

        $bytes /= (1 << (10 * $pow));

        return round($bytes, $precision) . ' ' . $units[$pow];
    }
}

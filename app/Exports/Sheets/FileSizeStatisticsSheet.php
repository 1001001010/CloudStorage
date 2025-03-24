<?php

namespace App\Exports\Sheets;

use App\Models\File;
use Illuminate\Support\Facades\DB;
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

class FileSizeStatisticsSheet implements FromCollection, WithTitle, WithHeadings, WithStyles, WithDrawings, ShouldAutoSize
{
    protected $userId;

    public function __construct($userId = null)
    {
        $this->userId = $userId;
    }

    public function collection()
    {
        $query = File::query();

        if ($this->userId) {
            $query->where('user_id', $this->userId);
        }

        $ranges = [
            ['min' => 0, 'max' => 1024, 'label' => 'До 1 КБ'],
            ['min' => 1024, 'max' => 10240, 'label' => '1-10 КБ'],
            ['min' => 10240, 'max' => 102400, 'label' => '10-100 КБ'],
            ['min' => 102400, 'max' => 1048576, 'label' => '100 КБ - 1 МБ'],
            ['min' => 1048576, 'max' => 10485760, 'label' => '1-10 МБ'],
            ['min' => 10485760, 'max' => 104857600, 'label' => '10-100 МБ'],
            ['min' => 104857600, 'max' => 1073741824, 'label' => '100 МБ - 1 ГБ'],
            ['min' => 1073741824, 'max' => PHP_INT_MAX, 'label' => 'Более 1 ГБ'],
        ];

        $sizeStats = [];

        foreach ($ranges as $range) {
            $count = $query->clone()->whereBetween('size', [$range['min'], $range['max']])->count();
            $totalSize = $query->clone()->whereBetween('size', [$range['min'], $range['max']])->sum('size');

            $sizeStats[] = [
                'label' => $range['label'],
                'count' => $count,
                'total_size' => $totalSize,
            ];
        }

        $result = collect([
            ['Распределение файлов по размерам', '', ''],
            ['Диапазон размеров', 'Количество файлов', 'Общий размер'],
        ]);

        foreach ($sizeStats as $stat) {
            $result->push([
                $stat['label'],
                $stat['count'],
                $this->formatBytes($stat['total_size']),
            ]);
        }

        $result->push(['', '', '']);
        $result->push(['Топ-10 самых больших файлов', '', '']);
        $result->push(['Имя файла', 'Расширение', 'Размер']);

        $largestFiles = $query->clone()
            ->with(['extension'])
            ->orderBy('size', 'desc')
            ->limit(10)
            ->get();

        foreach ($largestFiles as $file) {
            $result->push([
                $file->name,
                $file->extension ? $file->extension->extension : 'Н/Д',
                $this->formatBytes($file->size),
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
        return 'Статистика по размерам';
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

        $sheet->getStyle('A12')->applyFromArray([
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

        $sheet->getStyle('A13:C13')->applyFromArray([
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

        $sheet->getStyle('A3:C10')->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                ],
            ],
        ]);

        $sheet->getStyle('A14:C23')->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                ],
            ],
        ]);

        $sheet->mergeCells('A1:C1');
        $sheet->mergeCells('A12:C12');

        return [];
    }

    public function drawings()
    {
        $sizeChart = new Chart(
            'size_chart',
            new Title('Распределение файлов по размерам'),
            new Legend(Legend::POSITION_TOP),
            new PlotArea(null, [
                new DataSeries(
                    DataSeries::TYPE_BARCHART,
                    DataSeries::GROUPING_STANDARD,
                    range(0, 1),
                    [
                        new DataSeriesValues('String', 'Статистика по размерам!$B$2', null, 1),
                        new DataSeriesValues('String', 'Статистика по размерам!$C$2', null, 1),
                    ],
                    [new DataSeriesValues('String', 'Статистика по размерам!$A$3:$A$10', null, 8)],
                    [
                        new DataSeriesValues('Number', 'Статистика по размерам!$B$3:$B$10', null, 8),
                        new DataSeriesValues('Number', 'Статистика по размерам!$C$3:$C$10', null, 8),
                    ]
                )
            ])
        );

        $sizeChart->setTopLeftPosition('E1');
        $sizeChart->setBottomRightPosition('K15');

        return [$sizeChart];
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

<?php

namespace App\Exports\Sheets;

use App\Models\{
    File,
    FileExtension,
    MimeType
};
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
    Style\Alignment,
    Chart\Chart,
    Chart\DataSeries,
    Chart\DataSeriesValues,
    Chart\Legend,
    Chart\PlotArea,
    Chart\Title
};

class FileTypeStatisticsSheet implements FromCollection, WithTitle, WithHeadings, WithStyles, WithDrawings, ShouldAutoSize
{
    protected $userId;
    protected $data;

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

        $extensionStats = DB::table('files')
            ->join('file_extensions', 'files.extension_id', '=', 'file_extensions.id')
            ->select('file_extensions.extension', DB::raw('COUNT(*) as count'), DB::raw('SUM(files.size) as total_size'))
            ->groupBy('file_extensions.extension')
            ->orderBy('count', 'desc')
            ->limit(10)
            ->get();

        $mimeStats = DB::table('files')
            ->join('mime_types', 'files.mime_type_id', '=', 'mime_types.id')
            ->select('mime_types.mime_type', DB::raw('COUNT(*) as count'), DB::raw('SUM(files.size) as total_size'))
            ->groupBy('mime_types.mime_type')
            ->orderBy('count', 'desc')
            ->limit(10)
            ->get();

        $result = collect([
            ['Статистика по расширениям файлов', '', ''],
            ['Расширение', 'Количество файлов', 'Общий размер'],
        ]);

        foreach ($extensionStats as $stat) {
            $result->push([
                $stat->extension,
                $stat->count,
                $this->formatBytes($stat->total_size),
            ]);
        }

        $result->push(['', '', '']);
        $result->push(['Статистика по MIME-типам', '', '']);
        $result->push(['MIME-тип', 'Количество файлов', 'Общий размер']);

        foreach ($mimeStats as $stat) {
            $result->push([
                $stat->mime_type,
                $stat->count,
                $this->formatBytes($stat->total_size),
            ]);
        }

        $this->data = $result;
        return $result;
    }

    public function headings(): array
    {
        return [];
    }

    public function title(): string
    {
        return 'Статистика по типам';
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

        $sheet->getStyle('A5')->applyFromArray([
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

        $sheet->getStyle('A6:C6')->applyFromArray([
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

        $extensionLastRow = 2 + min(10, count($this->data) - 2);
        $sheet->getStyle('A3:C' . $extensionLastRow)->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                ],
            ],
        ]);

        $mimeLastRow = 6 + min(10, count($this->data) - 6);
        $sheet->getStyle('A7:C' . $mimeLastRow)->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                ],
            ],
        ]);

        $sheet->mergeCells('A1:C1');
        $sheet->mergeCells('A5:C5');

        return [];
    }

    public function drawings()
    {
        $extensionChart = new Chart(
            'extension_chart',
            new Title('Распределение файлов по расширениям'),
            new Legend(Legend::POSITION_RIGHT),
            new PlotArea(null, [
                new DataSeries(
                    DataSeries::TYPE_PIECHART,
                    null,
                    range(0, 0),
                    [new DataSeriesValues('String', 'Статистика по типам!$B$2', null, 1)],
                    [new DataSeriesValues('String', 'Статистика по типам!$A$3:$A$12', null, 10)],
                    [new DataSeriesValues('Number', 'Статистика по типам!$B$3:$B$12', null, 10)]
                )
            ])
        );

        $extensionChart->setTopLeftPosition('E1');
        $extensionChart->setBottomRightPosition('K15');

        $mimeChart = new Chart(
            'mime_chart',
            new Title('Распределение файлов по MIME-типам'),
            new Legend(Legend::POSITION_RIGHT),
            new PlotArea(null, [
                new DataSeries(
                    DataSeries::TYPE_PIECHART,
                    null,
                    range(0, 0),
                    [new DataSeriesValues('String', 'Статистика по типам!$B$6', null, 1)],
                    [new DataSeriesValues('String', 'Статистика по типам!$A$7:$A$16', null, 10)],
                    [new DataSeriesValues('Number', 'Статистика по типам!$B$7:$B$16', null, 10)]
                )
            ])
        );

        $mimeChart->setTopLeftPosition('E16');
        $mimeChart->setBottomRightPosition('K30');

        return [$extensionChart, $mimeChart];
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

<?php

namespace App\Exports\Sheets;

use App\Models\{
    File,
    User,
    FileExtension,
    MimeType
};
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\{
    FromCollection,
    WithTitle,
    WithHeadings,
    WithStyles,
    ShouldAutoSize
};
use PhpOffice\PhpSpreadsheet\{
    Worksheet\Worksheet,
    Style\Fill,
    Style\Border,
    Style\Alignment
};

class GeneralStatisticsSheet implements FromCollection, WithTitle, WithHeadings, WithStyles, ShouldAutoSize
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

        $totalFiles = $query->count();
        $totalSize = $query->sum('size');
        $avgFileSize = $totalFiles > 0 ? $totalSize / $totalFiles : 0;
        $largestFile = $query->max('size');
        $smallestFile = $query->min('size');
        $uniqueExtensions = FileExtension::whereIn('id', $query->pluck('extension_id')->unique())->count();
        $uniqueMimeTypes = MimeType::whereIn('id', $query->pluck('mime_type_id')->unique())->count();

        $latestUpload = $query->latest('created_at')->first();
        $latestUploadDate = $latestUpload ? $latestUpload->created_at->format('Y-m-d H:i:s') : 'Н/Д';

        $oldestUpload = $query->oldest('created_at')->first();
        $oldestUploadDate = $oldestUpload ? $oldestUpload->created_at->format('Y-m-d H:i:s') : 'Н/Д';

        $totalUsers = User::count();
        $activeUsers = User::whereIn('id', $query->pluck('user_id')->unique())->count();

        return collect([
            ['Метрика', 'Значение', 'Дополнительная информация'],
            ['Общее количество файлов', $totalFiles, ''],
            ['Общий размер хранилища', $this->formatBytes($totalSize), $totalSize . ' байт'],
            ['Средний размер файла', $this->formatBytes($avgFileSize), round($avgFileSize, 2) . ' байт'],
            ['Размер самого большого файла', $this->formatBytes($largestFile), $largestFile . ' байт'],
            ['Размер самого маленького файла', $this->formatBytes($smallestFile), $smallestFile . ' байт'],
            ['Количество уникальных расширений', $uniqueExtensions, ''],
            ['Количество уникальных MIME-типов', $uniqueMimeTypes, ''],
            ['Дата последней загрузки', $latestUploadDate, ''],
            ['Дата самой старой загрузки', $oldestUploadDate, ''],
            ['Общее количество пользователей', $totalUsers, ''],
            ['Количество активных пользователей', $activeUsers, $activeUsers > 0 ? round(($activeUsers / $totalUsers) * 100, 2) . '% от общего числа' : '0%'],
        ]);
    }

    public function headings(): array
    {
        return [];
    }

    public function title(): string
    {
        return 'Общая статистика';
    }

    public function styles(Worksheet $sheet)
    {
        $sheet->mergeCells('A1:C1');
        $sheet->setCellValue('A1', 'ОБЩАЯ СТАТИСТИКА ХРАНИЛИЩА');

        $sheet->getStyle('A1')->applyFromArray([
            'font' => [
                'bold' => true,
                'size' => 16,
                'color' => ['rgb' => 'FFFFFF'],
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '4472C4'],
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
        ]);

        $sheet->getStyle('A2:C2')->applyFromArray([
            'font' => [
                'bold' => true,
                'color' => ['rgb' => 'FFFFFF'],
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '4472C4'],
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => '000000'],
                ],
            ],
        ]);

        $lastRow = $sheet->getHighestRow();
        $sheet->getStyle('A3:C' . $lastRow)->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => '000000'],
                ],
            ],
        ]);

        for ($row = 3; $row <= $lastRow; $row++) {
            if ($row % 2 == 0) {
                $sheet->getStyle('A' . $row . ':C' . $row)->applyFromArray([
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => ['rgb' => 'E9EFF7'],
                    ],
                ]);
            }
        }

        $sheet->getStyle('A2:A' . $lastRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
        $sheet->getStyle('B2:C' . $lastRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);

        $sheet->getRowDimension(1)->setRowHeight(30);

        return [];
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

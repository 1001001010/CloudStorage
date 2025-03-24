<?php

namespace App\Exports;

use App\Models\{
    File,
    User,
    FileExtension,
    MimeType
};
use App\Exports\Sheets\{
    GeneralStatisticsSheet,
    FileTypeStatisticsSheet,
    FileSizeStatisticsSheet,
    UserActivitySheet,
    StorageUsageSheet
};
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\{
    WithMultipleSheets,
    Exportable
};

class StorageStatisticsExport implements WithMultipleSheets
{
    use Exportable;

    protected $period;
    protected $userId;

    public function __construct($period = 'month', $userId = null)
    {
        $this->period = $period;
        $this->userId = $userId;
    }

    /**
     * @return array
     */
    public function sheets(): array
    {
        return [
            'Общая статистика' => new GeneralStatisticsSheet($this->userId),
            'Статистика по типам' => new FileTypeStatisticsSheet($this->userId),
            'Статистика по размерам' => new FileSizeStatisticsSheet($this->userId),
            'Активность пользователей' => new UserActivitySheet($this->period, $this->userId),
            'Использование хранилища' => new StorageUsageSheet($this->userId),
        ];
    }
}

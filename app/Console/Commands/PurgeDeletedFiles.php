<?php

namespace App\Console\Commands;

use App\Models\File;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class PurgeDeletedFiles extends Command
{
    /**
     * Имя консольной команды.
     *
     * @var string
     */
    protected $signature = 'files:purge-deleted';

    /**
     * Описание консольной команды
     *
     * @var string
     */
    protected $description = 'Purge deleted files older than 30 days';
    
    /**
     * Выполнение консольной команды
     */
    public function handle(): void
    {
        $thirtyDaysAgo = Carbon::now()->subDays(30);

        File::onlyTrashed()
            ->where('deleted_at', '<=', $thirtyDaysAgo)
            ->forceDelete();

        $this->info('Deleted files older than 30 days have been purged.');
    }
}

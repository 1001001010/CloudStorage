<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class GenerateEncryptionKey extends Command
{
    protected $signature = 'generate:encryption-key';
    protected $description = 'Generate a new encryption key for file encryption and save it in .env';

    /**
     * Выполнение команды генерации ключа
     *
     * @return void
     */
    public function handle()
    {
        $key = base64_encode(random_bytes(32));
        $envPath = base_path('.env');

        if (!File::exists($envPath)) {
            $this->error('.env file not found!');
            return;
        }

        $env = File::get($envPath);

        if (str_contains($env, 'FILE_ENCRYPTION_KEY=')) {
            $env = preg_replace('/FILE_ENCRYPTION_KEY=.*/', "FILE_ENCRYPTION_KEY={$key}", $env);
        } else {
            $env .= "\nFILE_ENCRYPTION_KEY={$key}\n";
        }

        File::put($envPath, $env);

        $this->info("Encryption key generated successfully: {$key}");
    }
}

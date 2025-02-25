<?php

namespace App\Services;

class FileEncryptionService
{
    public function encryptFile(string $filePath, string $key): string
    {
        $data = file_get_contents($filePath);
        $iv = random_bytes(openssl_cipher_iv_length('AES-256-CBC'));
        $encrypted = openssl_encrypt($data, 'AES-256-CBC', $key, 0, $iv);
        file_put_contents($filePath, base64_encode($iv . $encrypted));

        return $filePath;
    }

    public function decryptFile(string $filePath, string $key): string
    {
        $data = base64_decode(file_get_contents($filePath));
        $ivLength = openssl_cipher_iv_length('AES-256-CBC');
        $iv = substr($data, 0, $ivLength);
        $encryptedData = substr($data, $ivLength);
        $decrypted = openssl_decrypt($encryptedData, 'AES-256-CBC', $key, 0, $iv);
        $tempPath = storage_path('app/temp_' . basename($filePath));
        file_put_contents($tempPath, $decrypted);

        return $tempPath;
    }
}

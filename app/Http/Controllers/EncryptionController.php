<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class EncryptionController extends Controller
{
    /**
     * Шифрование данных
     *
     * @param string $data
     * @return string
     */
    public function encryptFile(string $data): string {
        $key = base64_decode(env('FILE_ENCRYPTION_KEY'));
        $iv = random_bytes(16);

        $encrypted = openssl_encrypt($data, 'aes-256-cbc', $key, 0, $iv);

        if ($encrypted === false) {
            throw new \Exception('Ошибка шифрования файла');
        }

        return base64_encode($iv . $encrypted);
    }

    /**
     * Дешифрование данных
     *
     * @param string $data
     * @return string
     */
    public function decryptFile(string $data): string {
        $key = base64_decode(env('FILE_ENCRYPTION_KEY'));
        $decoded = base64_decode($data);

        $iv = substr($decoded, 0, 16);
        $encryptedData = substr($decoded, 16);

        $decrypted = openssl_decrypt($encryptedData, 'aes-256-cbc', $key, 0, $iv);

        if ($decrypted === false) {
            throw new \Exception('Ошибка дешифрования файла');
        }

        return $decrypted;
    }
}

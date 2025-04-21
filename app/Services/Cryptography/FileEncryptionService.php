<?php

namespace App\Services\Cryptography;

use App\Models\User;
use Illuminate\Support\Facades\Auth;

class FileEncryptionService
{
    /**
     * Шифрование данных
     *
     * @param string $data
     * @return string
     */
    public function encryptFile(string $data): string
    {
        $key = base64_decode(Auth::user()->getEncryptionKeyAttribute());
        $iv = random_bytes(16);

        $encrypted = openssl_encrypt($data, 'aes-256-cbc', $key, 0, $iv);

        return base64_encode($iv . $encrypted);
    }

    /**
     * Дешифрование данных
     *
     * @param string $data
     * @param User|null $user
     * @return string
     */
    public function decryptFile(string $data, User $user = null): string
    {
        $user ??= Auth::user();

        $key = base64_decode($user->getEncryptionKeyAttribute());
        $decoded = base64_decode($data);

        $iv = substr($decoded, 0, 16);
        $encryptedData = substr($decoded, 16);

        $decrypted = openssl_decrypt($encryptedData, 'aes-256-cbc', $key, 0, $iv);

        return $decrypted;
    }
}

<?php

namespace App\Services\Admin;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserService
{
    /**
     * Обновление пароля пользователя
     *
     * @param string $newPassword
     * @param User $user
     * @return bool
     */
    public function updatePassword(string $newPassword, User $user): bool {
        return $user->update([
            'password' => Hash::make($newPassword),
        ]);
    }
}

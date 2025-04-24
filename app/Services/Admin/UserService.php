<?php

namespace App\Services\Admin;

use App\Models\{User, File};
use Illuminate\Support\Facades\{Hash, DB, Auth};
use Carbon\Carbon;


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

    /**
     * Обновление роли пользователя (админ/не админ)
     *
     * @param User $user
     * @param bool $isAdmin
     * @return bool
     */
    public function updateRole(User $user, bool $isAdmin): bool
    {
        $user->is_admin = $isAdmin;
        return $user->save();
    }
}

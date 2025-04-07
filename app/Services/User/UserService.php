<?php

namespace App\Services\User;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Auth\Events\Registered;

class UserService
{
    /**
     * Регистрация нового пользователя
     *
     * @param array $data
     * @return \App\Models\User
     */
    public function registerUser(array $data) {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'encryption_key' => User::generateEncryptionKey()
        ]);

        event(new Registered($user));
        Auth::login($user);

        return $user;
    }

    /**
     * Обновление пароля пользователя
     *
     * @param string $newPassword
     * @return bool
     */
    public function updatePassword(string $newPassword) : bool
    {
        $user = Auth::user();
        return $user->update([
            'password' => Hash::make($newPassword),
        ]);
    }
}

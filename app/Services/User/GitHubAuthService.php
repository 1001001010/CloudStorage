<?php

namespace App\Services\User;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

class GitHubAuthService
{
    /**
     * Получение или создание пользователя через GitHub
     *
     * @return \App\Models\User
     */
    public function handleGithubCallback()
    {
        $user = Socialite::driver('github')->user();
        $existingUser = User::where('email', $user->email)->first();

        if (!$existingUser) {
            $newUser = User::create([
                'name' => $user->nickname,
                'email' => $user->email,
                'provider' => 'github',
                'password' => Hash::make(Str::random(16)),
                'encryption_key' => User::generateEncryptionKey(),
            ]);

            Auth::login($newUser);

            return $newUser;
        } else {
            if ($existingUser->provider === 'github') {
                Auth::login($existingUser);
                return $existingUser;
            } else {
                return null;
            }
        }
    }
}

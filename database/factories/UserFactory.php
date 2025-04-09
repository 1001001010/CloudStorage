<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * Указываем, какую модель фабрика создаёт
     */
    protected $model = User::class;

    /**
     * Текущий пароль, используемый фабрикой
     */
    protected static ?string $password;

    /**
     * Определение состояния модели по умолчанию
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'encryption_key' => Str::random(10),
            'created_at' => fake()->dateTimeBetween('-3 month', 'now'),
        ];
    }
}

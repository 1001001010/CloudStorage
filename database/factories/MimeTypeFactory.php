<?php

namespace Database\Factories;

use App\Models\MimeType;
use Illuminate\Database\Eloquent\Factories\Factory;

class MimeTypeFactory extends Factory
{
    protected $model = MimeType::class;

    /**
     * Определение состояния модели
     *
     * @return array
     */
    public function definition(): array
    {
        $mimeTypes = ['image/jpeg', 'image/png', 'application/pdf', 'text/plain'];

        return [
            'mime_type' => $this->faker->randomElement($mimeTypes),
        ];
    }
}

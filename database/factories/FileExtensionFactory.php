<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class FileExtensionFactory extends Factory
{
    protected $model = FileExtension::class;

    /**
     * Определение состояния модели.
     *
     * @return array
     */
    public function definition(): array
    {
        $extensions = ['jpg', 'png', 'pdf', 'txt', 'zip', 'docx'];

        return [
            'extension' => $this->faker->randomElement($extensions),
        ];
    }
}

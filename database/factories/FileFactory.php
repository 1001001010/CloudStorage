<?php

namespace Database\Factories;

use App\Models\{
    FileExtension,
    MimeType,
    Folder,
    User,
    File
};
use Illuminate\Database\Eloquent\Factories\Factory;

class FileFactory extends Factory
{
    protected $model = File::class;

    /**
     * Определение состояния модели.
     *
     * @return array
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->word(),
            'path' => 'files/' . $this->faker->uuid() . '.jpg',
            'extension_id' => FileExtension::factory(),
            'mime_type_id' => MimeType::factory(),
            'file_hash' => $this->faker->sha256(),
            'folder_id' => Folder::factory(),
            'user_id' => User::factory(),
            'size' => $this->faker->numberBetween(1000, 5000000),
        ];
    }
}

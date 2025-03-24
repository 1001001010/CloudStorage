<?php

namespace Database\Factories;

use App\Models\{
    Folder,
    User
};
use Illuminate\Database\Eloquent\Factories\Factory;

class FolderFactory extends Factory
{
    protected $model = Folder::class;

    /**
     * Определение состояния модели
     *
     * @return array
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->word(),
            'parent_id' => null,
            'user_id' => User::factory(),
        ];
    }

    /**
     * Установка родительской папки для дочерней папки
     *
     * @param Folder $parent
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function child(Folder $parent)
    {
        return $this->state([
            'parent_id' => $parent->id,
        ]);
    }
}

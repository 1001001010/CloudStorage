<?php

namespace Tests\Feature\File;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\{User, File};

class RenameFileTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Успешное переименование файла
     *
     * @return void
     */
    public function test_rename_file_success()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $file = File::factory()->create(['user_id' => $user->id]);
        $newName = 'newFileName.txt';
        $response = $this->patch(route('file.rename', ['file' => $file->id]), [
            'name' => $newName
        ]);

        $file->refresh();
        $this->assertEquals($newName, $file->name);

        $response->assertRedirect();
        $response->assertSessionHas('msg', [
            'title' => 'Название успешно изменено',
        ]);
    }

    /**
     * Попытка переименования файла с невалидным именем
     *
     * @return void
     */
    public function test_rename_file_invalid_name()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $file = File::factory()->create(['user_id' => $user->id]);
        $response = $this->patch(route('file.rename', ['file' => $file->id]), [
            'name' => ''
        ]);

        $file->refresh();
        $this->assertNotEquals('', $file->name);

        $response->assertSessionHasErrors('name');
    }

    /**
     * Попытка переименования файла, который не принадлежит текущему пользователю
     *
     * @return void
     */
    public function test_rename_file_not_belonging_to_user()
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $this->actingAs($user);

        $file = File::factory()->create(['user_id' => $otherUser->id]);
        $response = $this->patch(route('file.rename', ['file' => $file->id]), [
            'name' => 'newFileName.txt'
        ]);

        $response->assertStatus(404);

        $file->refresh();
        $this->assertNotEquals('newFileName.txt', $file->name);

        $response->assertStatus(404);
    }

    /**
     * Попытка переименования несуществующего файла
     *
     * @return void
     */
    public function test_rename_non_existent_file()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->patch(route('file.rename', ['file' => 999]), [
            'name' => 'newFileName.txt'
        ]);

        $response->assertStatus(404);
    }

}

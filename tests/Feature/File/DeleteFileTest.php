<?php

namespace Tests\Feature\File;

use App\Models\{
    User,
    Folder,
    File
};
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Testing\Fluent\AssertableJson;
use Tests\TestCase;

class DeleteFileTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Тест успешного мягкого удаления файла
     *
     * @return void
     */
    public function test_successful_file_delete()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $folder = Folder::factory()->create(['user_id' => $user->id]);
        $file = File::factory()->create(['user_id' => $user->id, 'folder_id' => $folder->id]);
        $response = $this->delete(route('file.delete', $file));

        $this->assertSoftDeleted($file);

        $response->assertRedirect(route('index'));
        $response->assertSessionHas('msg', [
            'title' => 'Файл перемещён в корзину',
            'description' => 'Вы можете его восстановить из корзины'
        ]);
    }

    /**
     * Тест на случай, если файл не существует
     *
     * @return void
     */
    public function test_file_not_found()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->delete(route('file.delete', ['file' => 999]));
        $response->assertStatus(404);
    }

    /**
     * Тест на попытку удалить файл другого пользователя
     *
     * @return void
     */
    public function test_cannot_delete_file_of_another_user()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $this->actingAs($user1);

        $folder = Folder::factory()->create(['user_id' => $user2->id]);
        $file = File::factory()->create(['user_id' => $user2->id, 'folder_id' => $folder->id]);

        $response = $this->delete(route('file.delete', $file));

        $this->assertDatabaseHas('files', ['id' => $file->id]);

        $response->assertRedirect();
        $response->assertSessionHas('msg', [
            'title' => 'Файл не найден'
        ]);
    }
}

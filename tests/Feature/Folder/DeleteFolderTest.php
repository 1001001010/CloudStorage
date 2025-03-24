<?php

namespace Tests\Feature\Folder;

use App\Models\{
    Folder,
    User
};
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DeleteFolderTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Удаление существующей папки
     *
     * @return void
     */
    public function test_delete_folder_successfully() {
        $user = User::factory()->create();
        $this->actingAs($user);

        $folder = Folder::factory()->create(['user_id' => $user->id]);
        $response = $this->delete(route('folder.delete', ['folder' => $folder->id]));

        $this->assertDatabaseMissing('folders', [
            'id' => $folder->id,
            'user_id' => $user->id,
        ]);

        $response->assertRedirect(route('index'));
        $response->assertSessionHas('msg', [
            'title' => 'Папка успешно удалена',
        ]);
    }

    /**
     * Попытка удаления папки, которая не принадлежит текущему пользователю
     *
     * @return void
     */
    public function test_delete_folder_not_belonging_to_user() {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $this->actingAs($user);

        $folder = Folder::factory()->create(['user_id' => $otherUser->id]);
        $response = $this->delete(route('folder.delete', ['folder' => $folder->id]));

        $this->assertDatabaseHas('folders', [
            'id' => $folder->id,
            'user_id' => $otherUser->id,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('msg', [
            'title' => 'Папка не найдена или не принадлежит вам',
        ]);
    }

    /**
     * Попытка удаления несуществующей папки
     *
     * @return void
     */
    public function test_delete_non_existent_folder() {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->delete(route('folder.delete', ['folder' => 999]));
        $response->assertStatus(404);
    }
}

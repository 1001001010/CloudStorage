<?php

namespace Tests\Feature\Folder;

use App\Models\{
    Folder,
    User
};
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RenameFolderTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Переименование папки, принадлежащей текущему пользователю
     *
     * @return void
     */
    public function test_rename_folder_successfully()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $folder = Folder::factory()->create(['user_id' => $user->id]);
        $response = $this->patch(route('folder.rename', ['folder' => $folder->id]), [
            'name' => 'New Folder Name',
        ]);

        $folder->refresh();
        $this->assertEquals('New Folder Name', $folder->title);

        $response->assertRedirect();
        $response->assertSessionHas('msg', [
            'title' => 'Папка успешно переименована',
        ]);
    }

    /**
     * Попытка переименования папки, которая не принадлежит текущему пользователю
     *
     * @return void
     */
    public function test_rename_folder_not_belonging_to_user()
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $this->actingAs($user);

        $folder = Folder::factory()->create(['user_id' => $otherUser->id]);
        $response = $this->patch(route('folder.rename', ['folder' => $folder->id]), [
            'name' => 'Unauthorized Rename',
        ]);

        $folder->refresh();
        $this->assertNotEquals('Unauthorized Rename', $folder->title);

        $response->assertRedirect();
        $response->assertSessionHas('msg', [
            'title' => 'Папка не найдена или не принадлежит вам',
        ]);
    }

    /**
     * Попытка переименования папки с некорректными данными (пустое имя)
     *
     * @return void
     */
    public function test_rename_folder_invalid_data()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $folder = Folder::factory()->create(['user_id' => $user->id]);
        $response = $this->patch(route('folder.rename', ['folder' => $folder->id]), [
            'name' => '',
        ]);

        $response->assertSessionHasErrors('name');
        $folder->refresh();

        $this->assertNotEmpty($folder->title);
    }
}

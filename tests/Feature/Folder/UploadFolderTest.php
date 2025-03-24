<?php

namespace Tests\Feature\Folder;

use App\Models\{
    Folder,
    User
};
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UploadFolderTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Создание новой папки без родительской папки
     *
     * @return void
     */
    public function test_upload_folder_without_parent()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->post(route('folder.upload'), [
            'title' => 'Test Folder',
            'folder' => 0
        ]);

        $this->assertDatabaseHas('folders', [
            'title' => 'Test Folder',
            'user_id' => $user->id,
            'parent_id' => null
        ]);

        $response->assertRedirect();
    }

    /**
     * Создание новой папки с родительской папкой
     *
     * @return void
     */
    public function test_upload_folder_with_parent()
    {
        $user = User::factory()->create();
        $parentFolder = Folder::factory()->create(['user_id' => $user->id]);

        $this->actingAs($user);

        $response = $this->post(route('folder.upload'), [
            'title' => 'Subfolder',
            'folder' => $parentFolder->id
        ]);

        $this->assertDatabaseHas('folders', [
            'title' => 'Subfolder',
            'user_id' => $user->id,
            'parent_id' => $parentFolder->id
        ]);

        $response->assertRedirect();
    }

    /**
     * Попытка создания папки без авторизации
     *
     * @return void
     */
    public function test_upload_folder_unauthenticated()
    {
        $response = $this->post(route('folder.upload'), [
            'title' => 'Unauthorized Folder',
        ]);

        $response->assertRedirect('/login');
    }
}

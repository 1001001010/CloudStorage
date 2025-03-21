<?php

namespace Tests\Feature\File;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;
use App\Models\{User, Folder, File};

class FileUploadTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Тест успешной загрузки файла
     *
     */
    public function test_file_upload_success() {
        $user = User::factory()->create();
        $this->actingAs($user);

        $folder = Folder::factory()->create(['user_id' => $user->id]);
        $file = UploadedFile::fake()->create('testfile.jpg', 1024);

        $data = [
            'files' => [$file],
            'folder_id' => $folder->id
        ];

        $response = $this->post(route('file.upload'), $data);
        $response->assertStatus(302);

        $this->assertDatabaseHas('files', [
            'name' => 'testfile',
            'user_id' => $user->id,
            'folder_id' => $folder->id
        ]);
    }

    /**
     * Тест на отклонение файлов с неразрешенными расширениями
     *
     */
    public function test_file_upload_rejects_disallowed_extensions() {
        $user = User::factory()->create();
        $this->actingAs($user);

        $folder = Folder::factory()->create(['user_id' => $user->id]);
        $disallowedFile = UploadedFile::fake()->create('script.sh', 1024);

        $data = [
            'files' => [$disallowedFile],
            'folder_id' => $folder->id
        ];

        $response = $this->post(route('file.upload'), $data);
        $response->assertSessionHas('msg');

        $this->assertDatabaseMissing('files', ['name' => 'script']);
    }

    /**
     * Тест на детекцию дубликатов
     *
     */
    public function test_file_upload_detects_duplicates() {
        $user = User::factory()->create();
        $this->actingAs($user);

        $folder = Folder::factory()->create(['user_id' => $user->id]);
        $file = UploadedFile::fake()->create('duplicate.jpg', 1024);

        $this->post(route('file.upload'), ['files' => [$file], 'folder_id' => $folder->id]);
        $this->assertDatabaseCount('files', 1);

        $response = $this->post(route('file.upload'), ['files' => [$file], 'folder_id' => $folder->id]);
        $response->assertRedirect();
        $response->assertSessionHas('msg');

        $this->assertDatabaseCount('files', 1);
    }
}

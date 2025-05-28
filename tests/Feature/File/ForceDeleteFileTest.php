<?php

namespace Tests\Feature\File;

use App\Models\File;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Testing\Fluent\AssertableJson;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;


class ForceDeleteFileTest extends TestCase
{
    use RefreshDatabase;

    // /**
    //  * Тест полного удаления файла
    //  *
    //  * @return void
    //  */
    // public function test_force_delete_file()
    // {
    //     $user = User::factory()->create();
    //     $this->actingAs($user);

    //     $file = File::factory()->create([
    //         'user_id' => $user->id,
    //     ]);

    //     $file->delete();
    //     $this->assertNotNull(File::onlyTrashed()->find($file->id));

    //     $response = $this->delete(route('file.force.delete', ['file' => $file->id]));
    //     $this->assertDatabaseMissing('files', ['id' => $file->id]);
    //     $this->assertNull(File::onlyTrashed()->find($file->id));

    //     Storage::disk('private')->assertMissing($file->path);

    //     $response->assertRedirect();
    //     $response->assertSessionHas('msg', ['title' => 'Файл полностью удален']);
    // }

    /**
     * Попытка удалить несуществующий файл
     *
     * @return void
     */
    public function test_force_delete_non_existent_file()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->delete(route('file.force.delete', ['file' => 999]));

        $response->assertStatus(404);
    }
}
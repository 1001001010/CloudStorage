<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\{Inertia, Response};
use App\Models\User;

class AdminController extends Controller
{
    /**
     * Рендеринг страницы Admin/Users
     */
    public function index(): Response {
        return Inertia::render('Admin/Users', [
            'users' => User::withCount(['files', 'folders'])->get(),
        ]);
    }

    /**
     * Обновление роли пользователя
     */
    public function update_role($id, Request $request) {
        $request->merge([
            'is_admin' => filter_var($request->input('is_admin'), FILTER_VALIDATE_BOOLEAN),
        ]);

        $validated = $request->validate([
            'is_admin' => 'required|boolean',
        ]);

        $user = User::find($id);

        if (!$user) {
            return redirect()->back()->with('msg', [
                'title' => "Пользователь не найден",
            ]);
        }

        $user->is_admin = $validated['is_admin'];
        $user->save();

        return redirect()->back()->with('msg', [
            'title' => "Роль пользователя $user->name изменена",
        ]);
    }
}

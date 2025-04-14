<?php

namespace App\Http\Controllers\Auth;

use App\Services\User\UserService;
use App\Http\Requests\Auth\UpdatePasswordRequest;
use App\Http\Controllers\Controller;
use Illuminate\Http\{
    RedirectResponse,
    Request
};
use Illuminate\Support\Facades\Hash;

class PasswordController extends Controller {
    public function __construct(
        protected UserService $userService,
    ) {}

    /**
     * Обновление пароля пользователя
     *
     */
    public function update(UpdatePasswordRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $this->userService->updatePassword($data['password']);

        return back()->with('msg', 'Пароль успешно обновлён');
    }
}

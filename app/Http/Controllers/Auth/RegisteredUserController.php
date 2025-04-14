<?php

namespace App\Http\Controllers\Auth;

use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Controllers\Controller;
use App\Services\User\UserService;
use Illuminate\Http\{
    RedirectResponse,
    Request
};
use Illuminate\Support\Facades\{
    Auth,
    Hash
};
use Inertia\{
    Inertia,
    Response
};

class RegisteredUserController extends Controller {

    public function __construct(
        protected UserService $userService,
    ) {}

    /**
     * Рендер страницы регистрации
     *
     * @return \Inertia\Response
     */
    public function create() : Response {
        return Inertia::render('Auth/Register');
    }

    /**
     * Обробатываем запрос регистрации
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(RegisterRequest $request) : RedirectResponse {
        $data = $request->validated();

        $this->userService->registerUser($data);

        return redirect(route('profile.index', absolute: false));
    }
}

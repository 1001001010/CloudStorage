<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Http\{Request, RedirectResponse};
use Illuminate\Support\Facades\{Redirect, Auth};
use Inertia\{Response, Inertia};
use App\Models\{User, Session};

class ProfileController extends Controller
{
    /**
     * Отображает страницу профиля пользователя.
     *
     * @param Request $request HTTP-запрос, позволяющий получить заголовки и данные пользователя.
     * @return Response Возвращает ответ с визуализацией страницы профиля, включая активные сессии и информацию об устройстве.
     */
    public function index(Request $request): Response
    {
        $userAgent = $request->header('User-Agent');

        return Inertia::render('Profile/Index', [
            'activeSession' => Session::with('user')->where('user_id', Auth::id())->get(),
            'BreadLvl1' => 'Профиль',
            'userAgent' => $userAgent,
        ]);
    }

    /**
     * Отображает страницу редактирования данных пользователя.
     *
     * @param Request $request HTTP-запрос для получения данных.
     * @return Response
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Index', [
            'status' => session('status'),
        ]);
    }

    /**
     * Обновление данных пользователя
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        $request->user()->save();

        return Redirect::route('profile.index');
    }

    /**
     * Удаление сессии пользователя
     */
    public function destroy(Request $request): RedirectResponse
    {
        Session::where('payload', $request->payload)->delete();
        return redirect()->back();
    }
}

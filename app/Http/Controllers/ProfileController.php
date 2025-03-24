<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Http\{
    Request,
    RedirectResponse
};
use Illuminate\Support\Facades\{
    Redirect,
    Auth
};
use Inertia\{
    Response,
    Inertia
};
use App\Models\{
    User,
    Session
};

class ProfileController extends Controller
{
    /**
     * Отображает профиль пользователя
     *
     * @param Request $request
     * @return Response
     */
    public function index(Request $request): Response {
        $userAgent = $request->header('User-Agent');

        return Inertia::render('Profile/Index', [
            'activeSession' => Session::with('user')->where('user_id', Auth::id())->get(),
            'BreadLvl1' => 'Профиль',
            'userAgent' => $userAgent,
        ]);
    }

    /**
     * Обновление данных пользователя
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse {
        $request->user()->fill($request->validated());

        $request->user()->save();

        return Redirect::route('profile.index');
    }

    /**
     * Удаление сессии пользователя
     */
    public function destroy(Request $request): RedirectResponse {
        Session::where('payload', $request->payload)->delete();
        return redirect()->back();
    }
}

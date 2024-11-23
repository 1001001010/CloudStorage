<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Рендер страницы профиля
     */
    public function index(Request $request): Response
    {
        return Inertia::render('Profile/Index');
    }

    /**
     * Рендер страницы изменения данных
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

        return Redirect::route('profile.edit');
    }
}

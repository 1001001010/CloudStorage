<?php

namespace App\Http\Controllers;

use Illuminate\Http\{Request, RedirectResponse};
use Illuminate\Support\Facades\{
    Storage,
    Auth
};
use Inertia\{
    Response,
    Inertia
};
use App\Models\File;
use App\Services\Trash\TrashService;

class TrashController extends Controller
{

    protected TrashService $trashService;

    public function __construct(TrashService $trashService)
    {
        $this->trashService = $trashService;
    }

    /**
     * Отображение корзины
     *
     * @return Response
     */
    public function index(): Response {
        return Inertia::render('Trash', $this->trashService->getTrashDataForUser(Auth::id()));
    }

    /**
     * Очистка корзины
     *
     * @return RedirectResponse
     */
    public function destroy(): RedirectResponse
    {
        $this->trashService->emptyTrashForUser(Auth::id());

        return redirect()->back()->with('msg', ['title' => 'Корзина очищена']);
    }
}

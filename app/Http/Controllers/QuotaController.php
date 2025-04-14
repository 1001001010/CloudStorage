<?php

namespace App\Http\Controllers;

use App\Services\Quota\QuotaService;
use App\Http\Requests\QuotaUpdateRequest;
use App\Models\User;
use Illuminate\Http\{
    Request,
    RedirectResponse
};

class QuotaController extends Controller {

    public function __construct (
        protected QuotaService $quotaService
     ) {}

    /**
     * Обновление квоты пользователя
     *
     * @param User $user
     * @param QuotaUpdateRequest $request
     * @return RedirectResponse
     */
    public function update(User $user, QuotaUpdateRequest $request) : RedirectResponse {
        $data = $request->validated();

        $this->quotaService->updateUserQuota($user, $data['quota']);

        return redirect()->back()->with('msg', [
            'title' => "Квота успешно обновлена"
        ]);
    }
}

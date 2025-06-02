<?php

namespace App\Http\Controllers;

use App\Services\Quota\QuotaService;
use App\Http\Requests\Update\QuotaUpdateRequest;
use App\Models\User;
use Illuminate\Http\{
    Request,
    RedirectResponse
};

class QuotaController extends Controller
{

    public function __construct(
        protected QuotaService $quotaService
    ) {
    }

    /**
     * Обновление квоты пользователя
     *
     * @param User $user
     * @param QuotaUpdateRequest $request
     * @return RedirectResponse
     */
    public function update(User $user, QuotaUpdateRequest $request): RedirectResponse
    {
        $data = $request->validated();

        // Получаем значение и единицу измерения
        $quotaValue = $data['quota'];
        $quotaUnit = $data['unit'] ?? 'GB'; // По умолчанию ГБ, если не указано

        $this->quotaService->updateUserQuota($user, $quotaValue, $quotaUnit);

        return redirect()->back()->with('msg', [
            'title' => "Квота успешно обновлена"
        ]);
    }

}

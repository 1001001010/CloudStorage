<?php

namespace App\Services\Quota;

use Illuminate\Http\{
    Request,
    RedirectResponse
};
use App\Models\{
    User,
    Quota
};

class QuotaService {

    /**
     * Обновляет квоту пользователя.
     *
     * @param User $user
     * @param int|float $newQuotaGb Квота в гигабайтах
     * @return void
     */
    public function updateUserQuota(User $user, $newQuotaGb): void {
        $quotaSizeMb = $newQuotaGb * 1024;
        $quota = Quota::firstOrCreate(
            ['size' => $quotaSizeMb],
            ['created_at' => now(), 'updated_at' => now()]
        );

        $user->quota()->associate($quota);
        $user->save();
    }
}

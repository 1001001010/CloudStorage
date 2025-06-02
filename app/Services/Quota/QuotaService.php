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

class QuotaService
{

    /**
     * Обновляет квоту пользователя.
     *
     * @param User $user
     * @param int|float $quotaValue Значение квоты
     * @param string $unit Единица измерения ('MB' или 'GB')
     * @return void
     */
    public function updateUserQuota(User $user, $quotaValue, string $unit = 'GB'): void
    {
        $quotaSizeMb = match ($unit) {
            'MB' => $quotaValue,
            'GB' => $quotaValue * 1024,
            default => $quotaValue * 1024,
        };

        $quota = Quota::firstOrCreate(
            ['size' => $quotaSizeMb],
            ['created_at' => now(), 'updated_at' => now()]
        );

        $user->quota()->associate($quota);
        $user->save();
    }
}
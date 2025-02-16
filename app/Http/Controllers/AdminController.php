<?php

namespace App\Http\Controllers;

use Illuminate\Http\{Request, RedirectResponse};
use Inertia\{Inertia, Response};
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminController extends Controller
{
    /**
     * Отображает страницу списка пользователей в админке.
     *
     * @return Response
     */
    public function index(): Response {
        return Inertia::render('Admin/Users', [
            'users' => User::withCount(['files', 'folders'])->get(),
        ]);
    }

    /**
     * Обновляет роль пользователя (администратор или пользователь) на основе данных из тела запроса.
     *
     * @param User $user Объект пользователя, роль которого нужно изменить.
     * @param Request $request HTTP-запрос с данными о новой роли.
     * @return RedirectResponse
     */
    public function update_role(User $user, Request $request): RedirectResponse {
        $request->merge([
            'is_admin' => filter_var($request->input('is_admin'), FILTER_VALIDATE_BOOLEAN),
        ]);

        $validated = $request->validate([
            'is_admin' => 'required|boolean',
        ]);

        $user = User::find($user->id);

        if (!$user) {
            return redirect()->back()->with('msg', [
                'title' => "Пользователь не найден",
            ]);
        }

        $user->is_admin = $validated['is_admin'];
        $user->save();

        return redirect()->back()->with('msg', [
            'title' => "Роль пользователя $user->name изменена",
        ]);
    }

    /**
     * Генерирует статистику регистрации пользователей за последние 90 дней.
     *
     * @return Response
     */
    public function stats(): Response
    {
        $endDate = Carbon::now();
        $startDate = $endDate->copy()->subDays(90);

        $userStats = DB::table('users')
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get()
            ->map(function ($row) {
                return [
                    'date' => $row->date, // дата
                    'desktop' => $row->count, // количество пользователей
                ];
            })
            ->values();  // Сброс индексов массива

        return Inertia::render('Admin/Stats', [
            'chartData' => $userStats->toArray(),  // Преобразуем коллекцию в массив
        ]);
    }

}

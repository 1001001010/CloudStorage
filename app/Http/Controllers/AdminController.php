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
     * Рендеринг страницы Admin/Users
     */
    public function index(): Response {
        return Inertia::render('Admin/Users', [
            'users' => User::withCount(['files', 'folders'])->get(),
        ]);
    }

    /**
     * Обновление роли пользователя
     */
    public function update_role($id, Request $request): RedirectResponse {
        $request->merge([
            'is_admin' => filter_var($request->input('is_admin'), FILTER_VALIDATE_BOOLEAN),
        ]);

        $validated = $request->validate([
            'is_admin' => 'required|boolean',
        ]);

        $user = User::find($id);

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

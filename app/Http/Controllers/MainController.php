<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MainController extends Controller
{
    /**
     * Отображение главной страницы.
     */
    public function index() : Response {
        return Inertia::render('Welcome');
    }
}

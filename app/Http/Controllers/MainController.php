<?php

namespace App\Http\Controllers;

use App\HelperClass;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Folder;

class MainController extends Controller
{
    /**
     * Рендеринг главной страницы
     *
     * @param string|null $category
     * @return Response
     */
    public function index($category = null) : Response {
        return Inertia::render('Welcome');
    }
}

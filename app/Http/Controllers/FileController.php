<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class FileController extends Controller
{
    /**
     * Загрузка файла
     */
    public function upload(Request $request) : RedirectResponse {
        dd($request->all());
    }
}

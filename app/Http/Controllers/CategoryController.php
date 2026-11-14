<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function get()
    {
        $categories = Category::limit(6)->get();

        return response()->json([
            'categories' => $categories,
            'message' => 'Success',
        ]);
    }

    public function view()
    {
        $categories = Category::query()
            ->withCount('products')
            ->orderBy('name')
            ->get();

        return Inertia::render('categories/index', [
            'categories' => $categories,
        ]);
    }
}

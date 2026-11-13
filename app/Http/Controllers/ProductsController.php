<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductsController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'category' => ['nullable', 'integer', 'exists:categories,id'],
            'min_price' => ['nullable', 'numeric', 'min:0'],
            'max_price' => ['nullable', 'numeric', 'min:0', 'gte:min_price'],
            'sort' => ['nullable', 'in:latest,price_asc,price_desc,name_asc'],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);

        $products = Product::query()
            ->with(['category', 'product_images'])
            ->when($filters['q'] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when(
                $filters['category'] ?? null,
                fn ($query, $categoryId) => $query->where('category_id', $categoryId)
            )
            ->when(
                $filters['min_price'] ?? null,
                fn ($query, $minPrice) => $query->where('price', '>=', $minPrice)
            )
            ->when(
                $filters['max_price'] ?? null,
                fn ($query, $maxPrice) => $query->where('price', '<=', $maxPrice)
            );

        match ($filters['sort'] ?? 'latest') {
            'price_asc' => $products->orderBy('price')->orderBy('id'),
            'price_desc' => $products->orderByDesc('price')->orderByDesc('id'),
            'name_asc' => $products->orderBy('name')->orderBy('id'),
            default => $products->latest(),
        };

        return Inertia::render('products', [
            'products' => $products
                ->paginate(12)
                ->withQueryString(),
            'categories' => Category::query()
                ->orderBy('name')
                ->get(['id', 'name']),
            'filters' => [
                'q' => $filters['q'] ?? '',
                'category' => $filters['category'] ?? '',
                'min_price' => $filters['min_price'] ?? '',
                'max_price' => $filters['max_price'] ?? '',
                'sort' => $filters['sort'] ?? 'latest',
            ],
        ]);
    }
}

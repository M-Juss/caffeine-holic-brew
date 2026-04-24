<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use App\Models\Menu;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $favorites = Favorite::with('menu.sizes')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json([
            'message' => 'Favorites retrieved successfully.',
            'data'    => $favorites,
        ]);
    }

    public function toggle(Request $request): JsonResponse
    {
        $request->validate([
            'menu_id' => ['required', 'integer', 'exists:menus,id'],
        ]);

        $existing = Favorite::where('user_id', $request->user()->id)
            ->where('menu_id', $request->menu_id)
            ->first();

        if ($existing) {
            $existing->delete();

            return response()->json([
                'message'     => 'Removed from favorites.',
                'is_favorited' => false,
            ]);
        }

        Favorite::create([
            'user_id' => $request->user()->id,
            'menu_id' => $request->menu_id,
        ]);

        return response()->json([
            'message'      => 'Added to favorites.',
            'is_favorited' => true,
        ], 201);
    }

}

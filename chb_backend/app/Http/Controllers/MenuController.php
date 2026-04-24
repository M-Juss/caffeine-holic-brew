<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateMenuRequest;
use App\Http\Requests\EditMenuRequest;
use App\Http\Resources\MenuResource;
use App\Models\Menu;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\JsonResponse;
use Throwable;

class MenuController extends Controller
{
    public function index()
    {
        try {
            $menus = Menu::with('sizes')->get();

            return response()->json([
                'message' => 'success',
                'data' => MenuResource::collection($menus)
            ], 200);
        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Failed to fetch menus',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function store(CreateMenuRequest $request): JsonResponse
    {
        try {
            $menu = DB::transaction(function () use ($request) {

                $data = $request->validated();

                $imagePath = $request->file('image')->store('menu-images', 'public');

                $menu = Menu::create([
                    'image_path' => $imagePath,
                    'name' => $data['name'],
                    'description' => $data['description'],
                    'is_available' => (bool) $data['is_available'],
                    'category' => $data['category'] ?? 'Coffee',
                ]);

                foreach ($data['sizes'] as $size) {
                    $menu->sizes()->create([
                        'size' => $size['name'],
                        'price' => $size['price'],
                    ]);
                }

                return $menu->load('sizes'); 
            });

            return response()->json([
                'message' => 'Menu created successfully',
                'data' => new MenuResource($menu)
            ], 201);

        } catch (Throwable $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 500);
        }
    }


    public function update(EditMenuRequest $request, Menu $menu): JsonResponse
    {
        try {
            $menu = DB::transaction(function () use ($request, $menu) {

                $data = $request->validated();

                if ($request->hasFile('image')) {
                    if ($menu->image_path) {
                        Storage::disk('public')->delete($menu->image_path);
                    }

                    $imagePath = $request->file('image')->store('menu-images', 'public');
                    $data['image_path'] = $imagePath;
                }

                $menu->update([
                    'name' => $data['name'] ?? $menu->name,
                    'description' => $data['description'] ?? $menu->description,
                    'image_path' => $data['image_path'] ?? $menu->image_path,
                    'is_available' => $data['is_available'] ?? $menu->is_available,
                    'category' => $data['category'] ?? 'Coffee',
                ]);

                if (isset($data['sizes'])) {
                    $menu->sizes()->delete();

                    $menu->sizes()->createMany(
                        collect($data['sizes'])->map(function ($size) {
                            return [
                                'size' => $size['menu'],
                                'price' => $size['price'],
                            ];
                        })->toArray()
                    );
                }

                return $menu->load('sizes');
            });

            return response()->json([
                'message' => 'Menu updated successfully',
                'data' => new MenuResource($menu)
            ], 200);
        } catch (Throwable $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Menu $menu): JsonResponse
    {
        try {
            DB::transaction(function () use ($menu) {

                $menu->sizes()->delete();

                if ($menu->image_path && Storage::disk('public')->exists($menu->image_path)) {
                    Storage::disk('public')->delete($menu->image_path);
                }

                $menu->delete();
            });

            return response()->json([
                'message' => 'Menu deleted successfully'
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 500);
        }
    }
}

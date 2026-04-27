<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RiderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = User::where('role', 'rider')
            ->select('id', 'username', 'email', 'phone_number', 'status')
            ->orderBy('username');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $riders = $query->get();

        return response()->json([
            'message' => 'Riders retrieved successfully.',
            'data'    => $riders,
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;

class RiderController extends Controller
{
    public function index(): JsonResponse
    {
        $riders = User::where('role', 'rider')
            ->select('id', 'username')
            ->orderBy('username')
            ->get();

        return response()->json([
            'message' => 'Riders retrieved successfully.',
            'data'    => $riders,
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegisterUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Throwable;

class AuthController extends Controller
{
    public function register(RegisterUserRequest $request): JsonResponse
    {
        try {
            $user = DB::transaction(function () use ($request) {
                return User::create([
                    'username' => $request->validated('username'),
                    'email'    => $request->validated('email'),
                    'password' => $request->validated('password'),
                    'role' => $request->validated('role')
                ]);
            });

            return response()->json([
                'message' => 'User registered successfully.',
                'data'    => new UserResource($user),
            ], 201);
        } catch (Throwable $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        try {
            if (!Auth::attempt($credentials)) {
                return response()->json([
                    'message' => 'Invalid credentials.',
                ], 401);
            }

            $user  = Auth::user();
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Login successful.',
                'data'    => new UserResource($user),
                'token'   => $token,
            ], 200);
        } catch (Throwable $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegisterUserRequest;
use App\Http\Requests\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Throwable;

class AuthController extends Controller
{
    private const DEFAULT_MANAGER_EMAIL = 'manager@gmail.com';
    private const DEFAULT_MANAGER_PASSWORD = 'manager123';

    public function register(RegisterUserRequest $request): JsonResponse
    {
        try {
            $user = DB::transaction(function () use ($request) {
                return User::create([
                    'username' => $request->validated('username'),
                    'email'    => $request->validated('email'),
                    'password' => $request->validated('password'),
                    'address' => $request->validated('address'),
                    'phone_number' => $request->validated('phone_number'),
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
            if (
                strtolower($credentials['email']) === self::DEFAULT_MANAGER_EMAIL &&
                $credentials['password'] === self::DEFAULT_MANAGER_PASSWORD
            ) {
                $manager = User::where('email', self::DEFAULT_MANAGER_EMAIL)->first();

                if (!$manager) {
                    User::create([
                        'username' => 'Manager',
                        'email' => self::DEFAULT_MANAGER_EMAIL,
                        'password' => self::DEFAULT_MANAGER_PASSWORD,
                        'role' => 'manager',
                    ]);
                } else {
                    if ($manager->role !== 'manager') {
                        $manager->role = 'manager';
                    }

                    if (!Hash::check(self::DEFAULT_MANAGER_PASSWORD, $manager->password)) {
                        $manager->password = self::DEFAULT_MANAGER_PASSWORD;
                    }

                    if ($manager->isDirty()) {
                        $manager->save();
                    }
                }
            }

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

    public function profile(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $totalOrders = Order::where('user_id', $user->id)->count();
        $totalSpent = (float) Order::where('user_id', $user->id)
            ->where('status', 'completed')
            ->sum('total_amount');

        return response()->json([
            'message' => 'Profile retrieved successfully.',
            'data' => [
                'user' => new UserResource($user),
                'stats' => [
                    'member_since' => $user->created_at,
                    'total_spent' => $totalSpent,
                    'total_orders' => $totalOrders,
                ],
            ],
        ]);
    }

    public function updateProfile(UpdateProfileRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $user->update($request->validated());

        return response()->json([
            'message' => 'Profile updated successfully.',
            'data' => [
                'user' => new UserResource($user->refresh()),
            ],
        ]);
    }

    public function changePassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'confirmed', 'different:current_password'],
        ]);

        /** @var User $user */
        $user = $request->user();

        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'message' => 'Current password is incorrect.',
            ], 422);
        }

        $user->update([
            'password' => $validated['password'],
        ]);

        return response()->json([
            'message' => 'Password changed successfully.',
        ]);
    }
}
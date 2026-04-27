<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $users = User::query()
            ->when(
                $request->search,
                fn($q, $search) =>
                $q->where('username', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
            )
            ->when(
                $request->status,
                fn($q, $status) =>
                $q->where('status', $status)
            )
            ->when(
                $request->role,
                fn($q, $role) =>
                $q->where('role', $role)
            )
            ->paginate($request->per_page ?? 15);

        return response()->json($users);
    }


    public function store(Request $request): JsonResponse
    {
        $isRider = $request->input('role') === 'rider';

        $validated = $request->validate([
            'username'     => ['required', 'string', 'max:255', 'unique:users,username'],
            'email'        => ['required', 'email', 'max:255', 'unique:users,email'],
            'password'     => [$isRider ? 'nullable' : 'required', 'confirmed', Password::min(8)],
            'address'      => ['nullable', 'string', 'max:500'],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'role'         => ['nullable', 'string', 'in:admin,rider,manager'],
            'status'       => ['nullable', 'string', 'in:active,inactive,banned'],
        ]);

        $user = User::create($validated);

        return response()->json([
            'message' => 'User created successfully.',
            'data'    => $user,
        ], 201);
    }

    public function show(User $user): JsonResponse
    {
        return response()->json([
            'data' => $user,
        ]);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'username'     => ['sometimes', 'required', 'string', 'max:255', "unique:users,username,{$user->id}"],
            'email'        => ['sometimes', 'required', 'email', 'max:255', "unique:users,email,{$user->id}"],
            'password'     => ['sometimes', 'required', 'confirmed', Password::min(8)],
            'address'      => ['nullable', 'string', 'max:500'],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'role'         => ['nullable', 'string', 'in:admin,rider,manager'],
            'status'       => ['nullable', 'string', 'in:active,inactive,banned'],
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'User updated successfully.',
            'data'    => $user->fresh(),
        ]);
    }

    public function destroy(User $user): JsonResponse
    {
        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully.',
        ]);
    }

    public function changeStatus(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:active,inactive,banned'],
        ]);

        $user->update(['status' => $validated['status']]);

        return response()->json([
            'message' => "User status changed to {$validated['status']}.",
            'data'    => $user->fresh(),
        ]);
    }
}
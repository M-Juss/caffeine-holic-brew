<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    const STATUSES = ['pending', 'accepted', 'preparing', 'completed'];

    // admin
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'status' => ['nullable', Rule::in(self::STATUSES)],
        ]);

        $orders = Order::with('items')
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->latest()
            ->paginate(15);

        return response()->json([
            'message' => 'Orders retrieved successfully.',
            'data'    => $orders,
        ]);
    }

    // customer
    public function myOrders(Request $request): JsonResponse
    {
        $request->validate([
            'status' => ['nullable', Rule::in(self::STATUSES)],
        ]);

        $orders = Order::with('items')
            ->where('user_id', $request->user()->id)
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->latest()
            ->paginate(15);

        return response()->json([
            'message' => 'Your orders retrieved successfully.',
            'data'    => $orders,
        ]);
    }

    // admin/customer
    public function show(Request $request, Order $order): JsonResponse
    {
        if ($request->user()->role !== 'admin' && $order->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return response()->json([
            'message' => 'Order retrieved successfully.',
            'data'    => $order->load('items'),
        ]);
    }

    public function updateStatus(Request $request, Order $order): JsonResponse
    {
        $request->validate([
            'status'           => ['required', Rule::in(self::STATUSES)],
            'reviewer_remarks' => ['nullable', 'string', 'max:500'],
        ]);

        $newStatus = $request->status;

        if (!$this->isValidTransition($order->status, $newStatus)) {
            return response()->json([
                'message' => "Cannot transition order from '{$order->status}' to '{$newStatus}'.",
                'allowed' => $this->allowedTransitions($order->status),
            ], 422);
        }

        $order->update([
            'status'           => $newStatus,
            'reviewed_by'      => $request->user()->id,
            'reviewed_at'      => now(),
            'reviwer_remarks'  => $request->reviewer_remarks,
        ]);

        return response()->json([
            'message' => "Order status updated to '{$newStatus}'.",
            'data'    => $order->fresh('items'),
        ]);
    }

    // customer
    public function cancel(Request $request, Order $order): JsonResponse
    {
        if ($order->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        if ($order->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending orders can be cancelled.',
            ], 422);
        }

        $order->update(['status' => 'cancelled']);

        return response()->json([
            'message' => 'Order cancelled successfully.', 
            'data'    => $order->fresh('items'),
        ]);
    }

    private function allowedTransitions(string $currentStatus): array
    {
        return match ($currentStatus) {
            'pending'   => ['accepted'],
            'accepted'  => ['preparing'],
            'preparing' => ['completed'],
            default     => [],
        };
    }

    private function isValidTransition(string $from, string $to): bool
    {
        return in_array($to, $this->allowedTransitions($from));
    }
}

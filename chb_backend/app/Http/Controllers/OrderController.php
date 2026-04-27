<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    const STATUSES = ['pending', 'accepted', 'preparing', 'completed', 'cancelled'];

    private array $relations = [
        'items',
        'user:id,username,email,address,phone_number',
        'reviewer:id,username',
        'assigned_rider:id,username,phone_number',
    ];

    // admin
    public function getDashboardStats(): JsonResponse
    {
        $totalSales = Order::where('status', 'completed')->sum('total_amount');
        $totalOrders = Order::where('status', 'completed')->count();

        // Get popular item from completed orders
        $popularItem = Order::where('status', 'completed')
            ->with('items')
            ->get()
            ->flatMap(fn($order) => $order->items)
            ->groupBy('name')
            ->map(fn($items) => $items->sum('quantity'))
            ->sortDesc()
            ->first();

        return response()->json([
            'message' => 'Dashboard stats retrieved successfully.',
            'data' => [
                'total_sales' => $totalSales,
                'total_orders' => $totalOrders,
                'popular_item' => $popularItem ? array_key_first($popularItem) : 'N/A',
            ],
        ]);
    }

    // admin
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'status' => ['nullable', Rule::in(self::STATUSES)],
        ]);

        $orders = Order::with($this->relations)
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

        $orders = Order::with($this->relations)
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
            'data'    => $order->load($this->relations),
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
            'reviewer_remarks' => $request->reviewer_remarks,
        ]);

        // Set rider status to occupied when order is accepted
        if ($newStatus === 'accepted' && $order->assigned_rider) {
            $rider = User::find($order->assigned_rider);
            if ($rider) {
                $rider->update(['status' => 'occupied']);
            }
        }

        // Set rider status back to active when order is completed
        if ($newStatus === 'completed' && $order->assigned_rider) {
            $rider = User::find($order->assigned_rider);
            if ($rider) {
                $rider->update(['status' => 'active']);
            }
        }

        return response()->json([
            'message' => "Order status updated to '{$newStatus}'.",
            'data'    => $order->fresh($this->relations),
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
            'data'    => $order->fresh($this->relations),
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

    // admin
    public function assignRider(Request $request, Order $order): JsonResponse
    {
        $request->validate([
            'assigned_rider' => ['required', 'integer', 'exists:users,id'],
        ]);

        if ($order->delivery_method !== 'delivery') {
            return response()->json([
                'message' => 'Cannot assign a rider to a pick-up order.',
            ], 422);
        }

        $rider = User::find($request->assigned_rider);

        if (!$rider || $rider->role !== 'rider' || $rider->status !== 'active') {
            return response()->json([
                'message' => 'Rider must be an active rider.',
            ], 422);
        }

        // Assign rider to the order
        $order->update([
            'assigned_rider' => $request->assigned_rider,
        ]);

        return response()->json([
            'message' => 'Rider assigned successfully.',
            'data'    => $order->fresh($this->relations),
        ]);
    }
}

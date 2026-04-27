<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\JsonResponse;


class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $totalSales = Order::whereNotIn('status', ['cancelled'])
            ->sum('total_amount');

        $totalOrders = Order::count();

        $mostPopularItem = OrderItem::selectRaw('name, SUM(quantity) as total_ordered')
            ->groupBy('name')
            ->orderByDesc('total_ordered')
            ->first();

        $recentOrders = Order::with([
            'items',
            'user:id,username,email',
            'reviewer:id,username',
            'assigned_rider',
        ])
            ->latest()
            ->limit(5)
            ->get();

        return response()->json([
            'message' => 'Dashboard data retrieved successfully.',
            'data'    => [
                'total_sales'        => $totalSales,
                'total_orders'       => $totalOrders,
                'most_popular_item'  => $mostPopularItem,
                'recent_orders'      => $recentOrders,
            ],
        ]);
    }
}
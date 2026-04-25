<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Menu;
use App\Models\MenuSize;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CartController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $cart = Cart::with('items')
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$cart) {
            return response()->json([
                'message' => 'No active cart found.',
                'data'    => null,
            ]);
        }

        return response()->json([
            'message' => 'Cart retrieved successfully.',
            'data'    => $cart,
        ]);
    }

    public function addItem(Request $request): JsonResponse
    {
        $request->validate([
            'menu_id'  => ['required', 'integer', 'exists:menus,id'],
            'size'     => ['required', 'string'],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $user = $request->user();
        $menu = Menu::findOrFail($request->menu_id);

        if (!$menu->is_available) {
            return response()->json([
                'message' => 'This menu item is currently unavailable.',
            ], 422);
        }

        $menuSize = MenuSize::where('menu_id', $menu->id)
            ->where('size', $request->size)
            ->first();

        if (!$menuSize) {
            return response()->json([
                'message' => 'The selected size is not available for this item.',
            ], 422);
        }

        DB::beginTransaction();

        try {
            $cart = Cart::firstOrCreate(
                ['user_id' => $user->id],
                ['total_amount' => 0, 'total_items' => 0]
            );

            $existingItem = CartItem::where('cart_id', $cart->id)
                ->where('menu_id', $menu->id)
                ->where('size', $request->size)
                ->first();

            if ($existingItem) {
                $existingItem->quantity += $request->quantity;
                $existingItem->save();
            } else {
                CartItem::create([
                    'cart_id'     => $cart->id,
                    'menu_id'     => $menu->id,
                    'image_path'  => $menu->image_path,
                    'name'        => $menu->name,
                    'description' => $menu->description,
                    'size'        => $request->size,
                    'price'       => $menuSize->price,
                    'quantity'    => $request->quantity,
                ]);
            }

            $this->recalculateCart($cart);

            DB::commit();

            return response()->json([
                'message' => 'Item added to cart successfully.',
                'data'    => $cart->load('items'),
            ], 201);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to add item to cart.', 'error' => $e->getMessage()], 500);
        }
    }

    public function increaseQuantity(Request $request, CartItem $cartItem): JsonResponse
    {
        $this->authorizeCartItem($request, $cartItem);

        $cartItem->increment('quantity');
        $this->recalculateCart($cartItem->cart);

        return response()->json([
            'message' => 'Quantity increased.',
            'data'    => $cartItem->cart->load('items'),
        ]);
    }

    public function decreaseQuantity(Request $request, CartItem $cartItem): JsonResponse
    {
        $this->authorizeCartItem($request, $cartItem);

        if ($cartItem->quantity <= 1) {
            return $this->removeItem($request, $cartItem);
        }

        $cartItem->decrement('quantity');
        $this->recalculateCart($cartItem->cart);

        return response()->json([
            'message' => 'Quantity decreased.',
            'data'    => $cartItem->cart->load('items'),
        ]);
    }

    public function removeItem(Request $request, CartItem $cartItem): JsonResponse
    {
        $this->authorizeCartItem($request, $cartItem);

        $cart = $cartItem->cart;
        $cartItem->delete();
        $this->recalculateCart($cart);

        return response()->json([
            'message' => 'Item removed from cart.',
            'data'    => $cart->load('items'),
        ]);
    }

    public function clearCart(Request $request): JsonResponse
    {
        $cart = Cart::where('user_id', $request->user()->id)->first();

        if (!$cart) {
            return response()->json(['message' => 'No active cart found.'], 404);
        }

        $cart->items()->delete();
        $this->recalculateCart($cart);

        return response()->json(['message' => 'Cart cleared successfully.']);
    }

    public function checkout(Request $request): JsonResponse
    {
        $request->validate([
            'customer_remarks' => ['nullable', 'string', 'max:500'],
            'discount_amount'  => ['nullable', 'numeric', 'min:0'],
            'delivery_method'  => ['required', 'string', 'in:pick_up,delivery'],
            'payment'          => ['required', 'numeric', 'min:0'],
            'assigned_rider'   => [
                'required_if:delivery_method,delivery',
                'nullable',
                'integer',
                'exists:users,id',
            ],
        ]);

        $user = $request->user();

        $cart = Cart::with('items')->where('user_id', $user->id)->first();

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json(['message' => 'Your cart is empty.'], 422);
        }

        $discountAmount  = $request->discount_amount ?? 0;
        $deliveryMethod  = $request->delivery_method;
        $deliveryFee     = $deliveryMethod === 'delivery' ? 50 : 0;
        $totalAmount     = ($cart->total_amount - $discountAmount) + $deliveryFee;

        if ((float) $request->payment !== (float) $totalAmount) {
            return response()->json([
                'message' => 'Payment amount must equal the total amount due.',
                'total_amount_due' => $totalAmount,
            ], 422);
        }

        DB::beginTransaction();

        try {
            $order = Order::create([
                'user_id'          => $user->id,
                'order_number'     => 'ORD-' . strtoupper(Str::random(10)),
                'total_amount'     => $totalAmount,
                'discount_amount'  => $discountAmount,
                'total_items'      => $cart->total_items,
                'customer_remarks' => $request->customer_remarks,
                'status'           => 'pending',
                'delivery_method'  => $deliveryMethod,
                'delivery_fee'     => $deliveryFee,
                'payment'          => $request->payment,
                'assigned_rider'   => $deliveryMethod === 'delivery' ? $request->assigned_rider : null,
            ]);

            $orderItems = $cart->items->map(fn(CartItem $item) => [
                'order_id'    => $order->id,
                'menu_id'     => $item->menu_id,
                'image_path'  => $item->image_path,
                'name'        => $item->name,
                'description' => $item->description,
                'size'        => $item->size,
                'price'       => $item->price,
                'quantity'    => $item->quantity,
                'created_at'  => now(),
                'updated_at'  => now(),
            ])->toArray();

            OrderItem::insert($orderItems);

            $cart->items()->delete();
            $cart->delete();

            DB::commit();

            return response()->json([
                'message' => 'Order placed successfully.',
                'data'    => $order->load('items'),
            ], 201);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['message' => 'Checkout failed.', 'error' => $e->getMessage()], 500);
        }
    }

    private function recalculateCart(Cart $cart): void
    {
        $cart->refresh();
        $cart->load('items');

        $cart->total_amount = $cart->items->sum(fn($i) => $i->price * $i->quantity);
        $cart->total_items  = $cart->items->sum('quantity');
        $cart->save();
    }

    private function authorizeCartItem(Request $request, CartItem $cartItem): void
    {
        $cart = Cart::where('user_id', $request->user()->id)->firstOrFail();
        abort_if($cartItem->cart_id !== $cart->id, 403, 'Unauthorized action.');
    }
}

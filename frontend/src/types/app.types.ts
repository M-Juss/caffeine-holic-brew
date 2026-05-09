// API Types
export type MenuCategory = "Coffee" | "Non Coffee" | "Pastries" | "Snacks";

export type MenuResponse = {
  message: string;
  data: {
    id: number;
    image_path: string;
    name: string;
    description: string;
    category: MenuCategory;
    is_available: boolean;
    sizes: Array<{
      size: string;
      price: number;
    }>;
  };
};

export type MenuListResponse = {
  message: string;
  data: MenuResponse["data"][];
};

export type CreateMenuPayload = {
  image: File;
  name: string;
  description: string;
  category: MenuCategory;
  is_available: boolean;
  sizes: Array<{
    name: string;
    price: number;
  }>;
};

export type UpdateMenuPayload = {
  image?: File;
  name?: string;
  description?: string;
  category?: MenuCategory;
  is_available?: boolean;
  sizes?: Array<{
    menu: string;
    price: number;
  }>;
};

export type CartItemResponse = {
  id: number;
  cart_id: number;
  menu_id: number;
  image_path: string;
  name: string;
  description: string;
  size: string;
  price: number;
  quantity: number;
  created_at: string;
  updated_at: string;
};

export type CartResponseData = {
  id: number;
  user_id: string;
  total_amount: number;
  total_items: number;
  created_at: string;
  updated_at: string;
  items: CartItemResponse[];
};

export type CartResponse = {
  message: string;
  data: CartResponseData | null;
};

export type AddCartItemPayload = {
  menu_id: number;
  size: string;
  quantity: number;
};

export type CheckoutPayload = {
  customer_remarks?: string;
  discount_amount?: number;
  delivery_method: "delivery";
  payment: number;
  customer_name: string;
  customer_number: string;
  customer_address: string;
};

export type OrderStatus =
  | "pending"
  | "accepted"
  | "preparing"
  | "out_for_delivery"
  | "completed"
  | "cancelled";
export type OrderStatusUpdatable =
  | "pending"
  | "accepted"
  | "preparing"
  | "out_for_delivery"
  | "completed";

export type OrderUser = {
  id: number;
  username: string;
  email?: string;
  address?: string;
  phone_number?: string;
};

export type OrderItem = {
  id: number;
  order_id: number;
  menu_id: number | null;
  image_path: string;
  name: string;
  description: string;
  size: string;
  price: number;
  quantity: number;
  created_at: string;
  updated_at: string;
};

export type OrderData = {
  id: number;
  user_id: number;
  order_number: string;
  total_amount: number;
  discount_amount: number;
  total_items: number;
  customer_remarks: string | null;
  status: OrderStatus;
  reviewed_by: number | null;
  reviewed_at: string | null;
  reviewer_remarks?: string | null;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  user?: OrderUser;
  delivery_method?: "pick_up" | "delivery";
  delivery_fee?: number;
  payment?: string;
  assigned_rider?: {
    id: number;
    username: string;
    phone_number?: string;
  } | null;
  customer_name?: string;
  customer_number?: string;
  customer_address?: string;
};

export type PaginatedResponse<T> = {
  current_page: number;
  data: T[];
  last_page: number;
  per_page: number;
  total: number;
};

export type OrdersApiResponse = {
  message: string;
  data: PaginatedResponse<OrderData>;
};

export type OrderApiResponse = {
  message: string;
  data: OrderData;
};

export type FavoriteMenuSize = {
  id: number;
  menu_id: number;
  size: string;
  price: number;
  created_at: string;
  updated_at: string;
};

export type FavoriteMenu = {
  id: number;
  image_path: string;
  name: string;
  description: string;
  is_available: boolean;
  category: "Coffee" | "Non Coffee" | "Pastries" | "Snacks";
  created_at: string;
  updated_at: string;
  sizes: FavoriteMenuSize[];
};

export type FavoriteItem = {
  id: number;
  user_id: number;
  menu_id: number;
  created_at: string;
  updated_at: string;
  menu: FavoriteMenu;
};

export type FavoriteListResponse = {
  message: string;
  data: FavoriteItem[];
};

export type ToggleFavoritePayload = {
  menu_id: number;
};

export type ToggleFavoriteResponse = {
  message: string;
  is_favorited: boolean;
};

export type ProfileResponse = {
  message: string;
  data: {
    user: {
      id: number;
      username: string;
      email: string;
      address: string;
      phone_number: string;
      role: string;
      created_at: string;
    };
    stats: {
      member_since: string;
      total_spent: number;
      total_orders: number;
    };
  };
};

export type UpdateProfilePayload = {
  username: string;
  address: string;
  phone_number: string;
  email: string;
};

export type ChangePasswordPayload = {
  current_password: string;
  password: string;
  password_confirmation: string;
};

export type Admin = {
  id: number;
  username: string;
  email: string;
  phone_number: string;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export type CreateAdminResponse = {
  message: string;
  data: Admin;
};

export type GetAdminsResponse = {
  message: string;
  data: Admin[];
};

export type UpdateAdminResponse = {
  message: string;
  data: Admin;
};

export type DeleteAdminResponse = {
  message: string;
};

export type Rider = {
  id: number;
  username: string;
  email: string;
  phone_number: string;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export type CreateRiderResponse = {
  message: string;
  data: Rider;
};

export type GetRidersResponse = {
  message: string;
  data: Rider[];
};

export type UpdateRiderResponse = {
  message: string;
  data: Rider;
};

export type DeleteRiderResponse = {
  message: string;
  data: Rider;
};

// API Utility Types
export type ApiParams = Record<
  string,
  string | number | boolean | null | undefined
>;

export type ApiOptions = RequestInit & {
  params?: ApiParams;
};

// UI Types
export type DisplayStatus =
  | "Pending"
  | "Accepted"
  | "Preparing"
  | "Out for Delivery"
  | "Completed"
  | "Cancelled";
export type StatusFilter = "All" | DisplayStatus;

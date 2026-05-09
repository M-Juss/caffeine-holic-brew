interface OrderBadgeProps {
  status:
    | "Pending"
    | "Out for Delivery"
    | "Accepted"
    | "Preparing"
    | "Completed"
    | "Cancelled";
}

export default function OrderBadge({ status }: OrderBadgeProps) {
  const colors = {
    Pending: "bg-yellow-100 text-yellow-800",
    "Out for Delivery": "bg-purple-100 text-purple-800",
    Accepted: "bg-indigo-100 text-indigo-800",
    Preparing: "bg-blue-100 text-blue-800",
    Completed: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm ${colors[status]}`}>
      {status}
    </span>
  );
}

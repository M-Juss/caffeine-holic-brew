interface OrderBadgeProps {
  status: "Pending" | "Preparing" | "Completed";
}

export default function OrderBadge({ status }: OrderBadgeProps) {
  const colors = {
    Pending: "bg-yellow-100 text-yellow-800",
    Preparing: "bg-blue-100 text-blue-800",
    Completed: "bg-green-100 text-green-800",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm ${colors[status]}`}>
      {status}
    </span>
  );
}

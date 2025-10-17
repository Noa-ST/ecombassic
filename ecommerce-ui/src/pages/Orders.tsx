import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("🔒 Please login to view orders");
      navigate("/login");
      return;
    }
    api
      .get("/orders")
      .then((res) => setOrders(res.data))
      .catch(() => toast.error("❌ Failed to load orders"));
  }, [token]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📜 Order History</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((o) => (
          <div key={o.id} className="border p-4 rounded mb-3">
            <p className="font-semibold">Order #{o.id}</p>
            <p>Status: {o.status}</p>
            <p>Total: ${o.totalAmount}</p>
          </div>
        ))
      )}
    </div>
  );
}

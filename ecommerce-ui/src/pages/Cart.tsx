import { useEffect, useState } from "react";
import api from "../api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState<any>(null);
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("🔒 Please login first!");
      navigate("/login");
      return;
    }
    api
      .get("/cart")
      .then((res) => setCart(res.data))
      .catch(() => toast.error("❌ Failed to load cart"));
  }, [token]);

  const removeItem = async (id: number) => {
    await api.delete(`/cart/${id}`);
    setCart({
      ...cart,
      items: cart.items.filter((i: any) => i.id !== id),
    });
    toast.success("🗑 Item removed");
  };

  if (!cart) return <p className="p-6">Loading cart...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">🛒 Your Cart</h2>
      {cart.items.map((i: any) => (
        <div key={i.id} className="flex justify-between py-2 border-b">
          <span>{i.product.name}</span>
          <span>
            {i.quantity} × ${i.product.price}
          </span>
          <button
            onClick={() => removeItem(i.id)}
            className="text-red-500 hover:underline"
          >
            Remove
          </button>
        </div>
      ))}
      <div className="text-right mt-4 font-bold text-lg">
        Total: ${cart.total}
      </div>
    </div>
  );
}

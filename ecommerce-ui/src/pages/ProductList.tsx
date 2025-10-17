import { useEffect, useState } from "react";
import api from "../api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    api
      .get("/products")
      .then((res) => setProducts(res.data))
      .catch(() => toast.error("❌ Failed to fetch products"));
  }, []);

  const addToCart = async (productId: number) => {
    if (!isAuthenticated) {
      toast.error("⚠️ Please login first!");
      return;
    }
    try {
      await api.post("/cart", { productId, quantity: 1 });
      toast.success("🛒 Added to cart!");
    } catch {
      toast.error("❌ Failed to add to cart!");
    }
  };

  const handleDelete = async (id: number) => {
    if (!isAuthenticated) return toast.error("🔒 Login required");
    if (!window.confirm("Delete this product?")) return;

    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
      toast.success("🗑 Deleted successfully");
    } catch {
      toast.error("❌ Failed to delete product");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">📦 Product List</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            {p.imageUrl && (
              <img
                src={p.imageUrl}
                alt={p.name}
                className="w-full h-[220px] object-contain bg-gray-50"
              />
            )}
            <div className="p-4 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <p className="text-gray-500 text-sm">{p.description}</p>
                <p className="text-green-600 font-bold mt-2">${p.price}</p>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <button
                  onClick={() => addToCart(p.id)}
                  className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  🛒 Add to Cart
                </button>

                {isAuthenticated && (
                  <div className="flex gap-2">
                    <Link
                      to={`/edit/${p.id}`}
                      className="flex-1 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 text-center"
                    >
                      ✏ Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600"
                    >
                      🗑 Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

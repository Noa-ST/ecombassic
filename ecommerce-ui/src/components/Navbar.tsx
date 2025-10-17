// src/components/Navbar.tsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-blue-600 p-4 flex justify-between items-center shadow-md">
      <h1
        onClick={() => navigate("/")}
        className="text-white text-xl font-bold cursor-pointer"
      >
        🛍 My Shop
      </h1>

      <div className="space-x-4">
        {!user ? (
          <>
            <Link
              to="/login"
              className="text-white font-semibold hover:underline"
            >
              Login
            </Link>
          </>
        ) : (
          <>
            <Link to="/products" className="text-white hover:underline">
              Products
            </Link>
            <Link to="/cart" className="text-white hover:underline">
              Cart
            </Link>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

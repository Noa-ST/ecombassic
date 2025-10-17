// src/pages/Landing.tsx
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="text-center mt-16">
      <h1 className="text-4xl font-bold mb-4 text-blue-700">
        👕 Welcome to MyShop
      </h1>
      <p className="text-gray-600 mb-8">
        Mua sắm dễ dàng – thời trang cho mọi người. Đăng ký ngay để khám phá
        hàng trăm sản phẩm hấp dẫn!
      </p>

      {/* Banner */}
      <div className="mx-auto max-w-3xl mb-8">
        <img
          src="https://res.cloudinary.com/dblw5v3br/image/upload/v1739684230/banner.jpg"
          alt="banner"
          className="rounded-xl shadow-lg w-full"
        />
      </div>

      {/* Login / Register buttons */}
      <div className="flex justify-center gap-4">
        <Link
          to="/login"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300"
        >
          Register
        </Link>
      </div>
    </div>
  );
}

import toast from "react-hot-toast";

export default function Checkout() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  const handleCheckout = () => {
    localStorage.setItem("orders", JSON.stringify(cart));
    localStorage.removeItem("cart");
    toast.success("✅ Order placed!");
    window.location.href = "/payment-success";
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <p>Total items: {cart.length}</p>
      <button
        onClick={handleCheckout}
        className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Confirm & Pay
      </button>
    </div>
  );
}

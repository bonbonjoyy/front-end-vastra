import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../../utils/api"; // pastikan ini merujuk ke utils/api.js Anda

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Coba load cart dari localStorage jika ada
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  // Simpan cart ke localStorage setiap kali berubah
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === product.id && item.size === product.size
      );

      if (existingItemIndex > -1) {
        // Update quantity jika item sudah ada
        const newItems = [...prevItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + product.quantity,
        };
        return newItems;
      }

      // Tambah item baru jika belum ada
      return [...prevItems, product];
    });
  };

  const removeFromCart = (productId, size) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => !(item.id === productId && item.size === size))
    );
  };

  const updateQuantity = (productId, size, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId && item.size === size
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Fungsi untuk checkout
  const checkout = async (userId, shippingDetails) => {
    try {
      const token = localStorage.getItem("token");
      const orderData = {
        user_id: userId,
        items: cartItems,
        shipping_details: shippingDetails,
        total: getCartTotal(),
      };

      // Kirim data pesanan ke backend untuk diproses
      const response = await api.post("/api/checkout", orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        clearCart(); // Clear the cart setelah checkout sukses
        alert("Checkout berhasil!");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Terjadi kesalahan saat melakukan checkout.");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemsCount,
        checkout, // Menambahkan fungsi checkout ke context
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

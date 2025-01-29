//frontned/src/api/product.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://back-end-vastra.vercel.app/api",
});

export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
};

export const getAllProducts = async (category) => {
  try {
    const response = await api.get(`/products/category/${category}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
};



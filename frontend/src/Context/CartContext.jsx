import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCart, addToCart as addToCartAPI, updateCartItem, removeFromCart as removeFromCartAPI, clearCart as clearCartAPI } from '../Utils/api';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Check if user is logged in
    const isLoggedIn = () => {
        const userInfo = localStorage.getItem('userInfo');
        return !!userInfo;
    };

    // Fetch cart from backend
    const fetchCart = async () => {
        if (!isLoggedIn()) {
            console.log('User not logged in, skipping cart fetch');
            setCart(null);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await getCart();
            setCart(data);
        } catch (err) {
            console.error('Error fetching cart:', err);
            console.error('Error response:', err.response);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch cart';
            setError(errorMessage);
            // If error is 401, don't set cart to null - might be token issue
            if (err.response?.status !== 401) {
                setCart(null);
            }
        } finally {
            setLoading(false);
        }
    };

    // Add item to cart
    const addToCart = async (productId, quantity = 1) => {
        if (!isLoggedIn()) {
            throw new Error('Please login to add items to cart');
        }

        try {
            setLoading(true);
            setError(null);
            const data = await addToCartAPI(productId, quantity);
            setCart(data);
            return data;
        } catch (err) {
            console.error('Error adding to cart:', err);
            const errorMessage = err.response?.data?.message || 'Failed to add to cart';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Update cart item quantity
    const updateQuantity = async (itemId, quantity) => {
        try {
            setLoading(true);
            setError(null);
            const data = await updateCartItem(itemId, quantity);
            setCart(data);
            return data;
        } catch (err) {
            console.error('Error updating cart:', err);
            const errorMessage = err.response?.data?.message || 'Failed to update cart';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Remove item from cart
    const removeFromCart = async (itemId) => {
        try {
            setLoading(true);
            setError(null);
            const data = await removeFromCartAPI(itemId);
            setCart(data);
            return data;
        } catch (err) {
            console.error('Error removing from cart:', err);
            const errorMessage = err.response?.data?.message || 'Failed to remove from cart';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Clear entire cart
    const clearCart = async () => {
        try {
            setLoading(true);
            setError(null);
            await clearCartAPI();
            setCart({ items: [], totalItems: 0, totalPrice: 0 });
        } catch (err) {
            console.error('Error clearing cart:', err);
            const errorMessage = err.response?.data?.message || 'Failed to clear cart';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Get cart item count
    const getCartCount = () => {
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((total, item) => total + item.quantity, 0);
    };

    // Get cart total
    const getCartTotal = () => {
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    // Load cart on mount and when user logs in
    useEffect(() => {
        if (isLoggedIn()) {
            fetchCart();
        }
    }, []);

    const value = {
        cart,
        loading,
        error,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartCount,
        getCartTotal,
        isLoggedIn,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

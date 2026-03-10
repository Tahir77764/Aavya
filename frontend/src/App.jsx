import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './Context/CartContext';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import ForgotPassword from './Pages/ForgotPassword';
import ResetPassword from './Pages/ResetPassword';
import VerifyOtp from './Pages/VerifyOtp';
import Profile from './Pages/Profile';
import Cart from './Pages/Cart';
import Bangles from './Pages/Bangles';
import Necklaces from './Pages/Necklaces';
import Earrings from './Pages/Earrings';
import Rings from './Pages/Rings';
import MaleCollection from './Pages/MaleCollection';
import FemaleCollection from './Pages/FemaleCollection';
import BabyCollection from './Pages/BabyCollection';
import AdminTrial from './Pages/AdminTrial';
import AdminProductCreate from './Pages/AdminProductCreate';
import ProductDetails from './Pages/ProductDetails';
import Contact from './Pages/Contact';
import FAQ from './Pages/FAQ';
import ShippingPolicy from './Pages/ShippingPolicy';
import ReturnsExchanges from './Pages/ReturnsExchanges';
import ScrollToTop from './Components/ScrollToTop';
import Home from './Components/Home';
import AllProducts from './Pages/AllProducts';
import About from './Pages/About';
import SearchResults from './Pages/SearchResults';
import Location from './Pages/Location';

const HomeScreen = () => (
    <>
        <Home />
    </>
);

function App() {
    return (
        <CartProvider>
            <Router>
                <ScrollToTop />
                <div className="min-h-screen bg-white">
                    <Navbar />
                    <main>
                        <Routes>
                            <Route path="/" element={<HomeScreen />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/verify-otp" element={<VerifyOtp />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="/reset-password/:token" element={<ResetPassword />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/necklaces" element={<Necklaces />} />
                            <Route path="/bangles" element={<Bangles />} />
                            <Route path="/earrings" element={<Earrings />} />
                            <Route path="/rings" element={<Rings />} />
                            <Route path="/male-collection" element={<MaleCollection />} />
                            <Route path="/female-collection" element={<FemaleCollection />} />
                            <Route path="/baby-collection" element={<BabyCollection />} />
                            <Route path="/collections" element={<AllProducts />} />
                            <Route path="/admin-trial" element={<AdminTrial />} />
                            <Route path="/admin/product/create" element={<AdminProductCreate />} />
                            <Route path="/product/:id" element={<ProductDetails />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/faq" element={<FAQ />} />
                            <Route path="/shipping-policy" element={<ShippingPolicy />} />
                            <Route path="/returns-exchanges" element={<ReturnsExchanges />} />
                            <Route path="/search" element={<SearchResults />} />
                            <Route path="/location" element={<Location />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </CartProvider>
    );
}

export default App;

import React, { useState, useEffect } from 'react';
import api from '../Utils/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { AlertCircle, ArrowLeft, Plus } from 'lucide-react';

const AdminProductCreate = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [gender, setGender] = useState('Male');
    const [images, setImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch Categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await api.get('/api/categories');
                setCategories(data);
                if (data.length > 0) setCategory(data[0]._id);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch categories');
            }
        };
        fetchCategories();
    }, []);

    const uploadFileHandler = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('description', description);
        formData.append('brand', brand);
        formData.append('category', category);
        formData.append('stock', countInStock);
        formData.append('gender', gender);

        images.forEach(image => {
            formData.append('images', image);
        });

        try {
            setUploading(true);
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            await api.post('/api/products', formData, config);
            setUploading(false);
            toast.success('Product created successfully');
            navigate('/admin-trial');
        } catch (error) {
            console.error(error);
            setUploading(false);
            setError(error.response && error.response.data.message ? error.response.data.message : error.message);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <button onClick={() => navigate('/admin-trial')} className="mb-4 text-blue-500 hover:underline">Go Back</button>
            <h1 className="text-3xl font-bold mb-6">Create New Product</h1>
            {error && (
                <div className="bg-gray-900 border-l-4 border-avaya-gold p-4 mb-6 shadow-xl animate-in slide-in-from-top-2 duration-300 rounded-r-xl">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="text-avaya-gold h-5 w-5" />
                        <p className="text-sm text-gray-200 font-bold uppercase tracking-widest">{error}</p>
                    </div>
                </div>
            )}

            <form onSubmit={submitHandler} className="space-y-4 bg-white p-6 rounded shadow-md">

                {/* Name */}
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                    <input
                        type="text"
                        placeholder="Enter name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>

                {/* Price */}
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Price</label>
                    <input
                        type="number"
                        placeholder="Enter price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                    <textarea
                        placeholder="Enter description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    ></textarea>
                </div>

                {/* Category */}
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Gender */}
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Gender</label>
                    <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Kids">Baby</option>
                    </select>
                </div>

                {/* Count In Stock */}
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Count In Stock</label>
                    <input
                        type="number"
                        placeholder="Enter stock"
                        value={countInStock}
                        onChange={(e) => setCountInStock(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Images</label>
                    <input
                        type="file"
                        id="image-file"
                        onChange={uploadFileHandler}
                        multiple
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                    disabled={uploading}
                >
                    {uploading ? 'Creating...' : 'Create Product'}
                </button>
            </form>
        </div>
    );
};

export default AdminProductCreate;

import React from 'react';
import { Link } from 'react-router-dom';
import male from '../Assets/male.png';
import female from '../Assets/female.jpg';
import baby from '../Assets/baby.jpg';

const categories = [
    {
        image: male,
        name: 'MALE',
        link: '/male-collection'
    },
    {
        image: baby,
        name: 'BABY',
        link: '/baby-collection'
    },
    {
        image: female,
        name: 'FEMALE',
        link: '/female-collection'
    }
];

const Categories = () => {
    return (
        <section className="py-20 bg-gray-50 group relative">
            <div className="absolute top-8 left-0 right-0 text-center opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 ease-out z-10">
                <h2 className="text-3xl md:text-4xl font-trajan text-avaya-gold tracking-[0.2em] uppercase">
                    Shop By Collection
                </h2>
                <div className="w-24 h-1 bg-avaya-gold mx-auto mt-2"></div>
            </div>

            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 transition-all duration-500 group-hover:mt-16">
                {categories.map((cat, index) => (
                    <Link to={cat.link} key={index} className="flex flex-col items-center group/item cursor-pointer transition-transform duration-300 hover:scale-105">
                        <div className="w-full w-80 h-96 overflow-hidden shadow-lg rounded-sm relative">
                            <img
                                src={cat.image}
                                alt={cat.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110"
                            />
                            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <h3 className="mt-4 text-2xl font-serif tracking-widest text-gray-800 uppercase border-b-2 border-transparent group-hover/item:border-avaya-gold pb-1 transition-all duration-300">
                            {cat.name}
                        </h3>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default Categories;

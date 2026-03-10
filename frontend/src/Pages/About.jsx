import React from 'react';
import jpeg from '../Assets/about.jpeg';
import aboutHero from '../Assets/about_hero.png';
import { Hammer, Leaf, Sparkles, Award, Globe, Heart } from 'lucide-react';

const About = () => {
    return (
        <div className="bg-white text-gray-800 font-trajan">
            {/* Hero Section */}
            {/* Hero Section */}
            <div className="relative h-[70vh] min-h-[500px] overflow-hidden flex items-center justify-center bg-black">
                <div className="absolute inset-0">
                    <img
                        className="w-full h-full object-cover"
                        src={aboutHero}
                        alt="Jewelry crafting"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                </div>
                <div className="relative z-10 max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl md:text-8xl font-bold tracking-[0.3em] text-white font-trajan text-avaya-gold uppercase drop-shadow-2xl">
                        Our Story
                    </h1>
                    <div className="w-32 h-1 bg-avaya-gold mx-auto my-8"></div>
                    <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto font-trajan leading-relaxed tracking-widest drop-shadow-lg italic">
                        A legacy of brilliance, crafting timeless elegance for the modern world.
                    </p>
                </div>
            </div>

            {/* Introduction Section */}
            <div className="py-16 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-base font-semibold text-avaya-gold tracking-wide uppercase font-trajan">Who We Are</h2>
                        <h3 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl font-trajan">
                            Aavya Jewellery
                        </h3>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                            At Aavya, we believe that jewellery is more than just an accessory; it is an expression of self, a marker of milestones, and a heirloom for generations.
                        </p>
                    </div>

                    <div className="mt-16">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            <div className="pt-6">
                                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                                    <div className="-mt-6">
                                        <div className="inline-flex items-center justify-center p-3 bg-avaya-gold rounded-md shadow-lg transform -translate-y-1/2">
                                            <Hammer className="h-6 w-6 text-white" />
                                        </div>
                                        <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight font-trajan">Unmatched Craftsmanship</h3>
                                        <p className="mt-5 text-base text-gray-500">
                                            Every piece is meticulously handcrafted by artisans with decades of experience, ensuring perfection in every detail.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6">
                                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                                    <div className="-mt-6">
                                        <div className="inline-flex items-center justify-center p-3 bg-avaya-gold rounded-md shadow-lg transform -translate-y-1/2">
                                            <Sparkles className="h-6 w-6 text-white" />
                                        </div>
                                        <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight font-trajan">Ethically Sourced</h3>
                                        <p className="mt-5 text-base text-gray-500">
                                            We are committed to responsible sourcing. Our diamonds and gemstones are conflict-free, and our gold is sourced from certified refiners.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6">
                                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                                    <div className="-mt-6">
                                        <div className="inline-flex items-center justify-center p-3 bg-avaya-gold rounded-md shadow-lg transform -translate-y-1/2">
                                            <Award className="h-6 w-6 text-white" />
                                        </div>
                                        <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight font-trajan">Timeless Designs</h3>
                                        <p className="mt-5 text-base text-gray-500">
                                            Our collections blend traditional artistry with contemporary aesthetics, creating pieces that remain stylish forever.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Founder Section */}
            <div className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
                        <div className="relative">
                            <div className="relative text-lg font-medium text-gray-700">
                                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl font-trajan">
                                    Meet the Visionary
                                </h2>
                                <p className="mt-3 text-avaya-gold font-bold uppercase tracking-widest text-sm">Founder & Creative Director</p>
                                <div className="mt-6 text-gray-500 space-y-6 font-trajan">
                                    <p className="italic">
                                        "Jewellery is the art of capturing light and emotion in a timeless form. My journey began with a simple passion for stones and stories, evolved into a lifelong pursuit of perfection."
                                    </p>
                                    <p>
                                        With over 20 years of experience in gemology and design, Munna Lal Swarnkar has dedicated his life to creating pieces that are not just worn, but cherished as symbols of love and legacy.
                                    </p>
                                </div>
                                <div className="mt-8 border-l-4 border-avaya-gold pl-4">
                                    <h3 className="text-xl font-bold text-gray-900 font-trajan tracking-widest">Sri.Munna Lal Swarnkar</h3>
                                    <p className="text-avaya-gold font-bold text-sm">Founder & Creative Visionary</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-10 -mx-4 relative lg:mt-0" aria-hidden="true">
                            <img
                                className="relative mx-auto rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-500"
                                width={490}
                                src={jpeg}
                                alt="Founder"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Vision Section */}
            <div className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <h2 className="text-base font-semibold text-avaya-gold tracking-wide uppercase font-trajan">Our Vision</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl font-trajan">
                            Adorning the World with Elegance
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                            To become a global symbol of trust and luxury, bringing the finest handcrafted jewellery to discerning customers who value both tradition and modernity.
                        </p>
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="py-16 bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        <div>
                            <Globe className="h-10 w-10 text-avaya-gold mx-auto mb-4" />
                            <h4 className="text-lg font-bold font-trajan mb-2">Global Presence</h4>
                            <p className="text-gray-500 text-sm">Serving elegance to customers across continents with care and precision.</p>
                        </div>
                        <div>
                            <Heart className="h-10 w-10 text-avaya-gold mx-auto mb-4" />
                            <h4 className="text-lg font-bold font-trajan mb-2">Customer First</h4>
                            <p className="text-gray-500 text-sm">Your stories and milestones are at the heart of everything we create.</p>
                        </div>
                        <div>
                            <Leaf className="h-10 w-10 text-avaya-gold mx-auto mb-4" />
                            <h4 className="text-lg font-bold font-trajan mb-2">Eco-Conscious</h4>
                            <p className="text-gray-500 text-sm">Sustainability is woven into our craft, from sourcing to packaging.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;

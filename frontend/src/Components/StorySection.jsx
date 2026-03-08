import React from 'react';
import { Play } from 'lucide-react';
import storyVideo from '../Assets/storyVideo.mp4';

const StorySection = () => {
    return (
        <section className="py-12 md:py-20 bg-white overflow-hidden">
            <div className="container mx-auto px-6 sm:px-8 lg:px-12 flex flex-col md:flex-row items-center gap-10 md:gap-16">

                {/* Left: Image/Video Placeholder */}
                <div className="w-full md:w-2/3 relative h-[350px] sm:h-[500px] lg:h-[550px] group/image">
                    <video
                        src={storyVideo}
                        autoPlay
                        loop
                        muted
                        className="w-full h-full object-cover rounded-sm shadow-2xl duration-700"
                    />

                </div>

                {/* Right: Content */}
                <div className="w-full md:w-1/2 space-y-6 md:space-y-10">
                    <div className="space-y-4">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-gray-900 leading-tight">
                            The Art & Soul <br className="hidden sm:block" />
                            Behind Our Jewellery
                        </h2>
                        <div className="w-20 h-1 bg-avaya-gold"></div>
                    </div>

                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base max-w-lg">
                        You might decide your sparkly faux-diamond necklace is a bit dressy for your everyday wear, but elegance meets eternity in every piece we craft. Our artisans pour their soul into every detail, ensuring each creation tells a unique story.
                    </p>

                    <div className="bg-gradient-to-br from-avaya-teal to-emerald-900 text-white p-6 sm:p-8 lg:p-10 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 rounded-lg shadow-2xl border-t-4 border-avaya-gold relative overflow-hidden group hover:-translate-y-2 transition-all duration-300">
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-avaya-gold/5 rounded-full blur-xl -ml-12 -mb-12 pointer-events-none"></div>

                        <div className="text-center border-b sm:border-b-0 sm:border-r border-white/10 relative z-10 py-4 sm:py-2">
                            <div className="text-3xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 text-avaya-gold drop-shadow-sm">100</div>
                            <div className="text-xs uppercase tracking-[0.2em] text-teal-100 font-medium font-sans">Categories</div>
                        </div>
                        <div className="text-center border-b sm:border-b-0 sm:border-r border-white/10 relative z-10 py-4 sm:py-2">
                            <div className="text-3xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 text-avaya-gold drop-shadow-sm">500</div>
                            <div className="text-xs uppercase tracking-[0.2em] text-teal-100 font-medium font-sans">Products</div>
                        </div>
                        <div className="text-center relative z-10 py-4 sm:py-2">
                            <div className="text-3xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 text-avaya-gold drop-shadow-sm">99%</div>
                            <div className="text-xs uppercase tracking-[0.2em] text-teal-100 font-medium font-sans">Satisfied</div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default StorySection;

import { Link } from 'react-router-dom';
import hero from '../Assets/hero.png';
import heroMobile from '../Assets/hero_mobile.png';

const Hero = () => {
    return (
        // Desktop: 620px tall | Tablet (md): 50vh | Mobile (sm): 60vh
        <section className="relative w-full h-[500px] sm:h-[600px] md:h-[620px] min-[1060px]:h-[620px]">

            {/* Responsive image — browser picks automatically */}
            <picture className="absolute inset-0 w-full h-full">
                {/* Screens BELOW 768px → hero_mobile.png */}
                <source media="(max-width: 767px)" srcSet={heroMobile} />
                {/* Screens 768px to 1060px (tablet) → hero_mobile.png */}
                <source media="(max-width: 1060px)" srcSet={heroMobile} />
                {/* Default → hero.png (desktop) */}
                <img
                    src={hero}
                    alt="Hero Background"
                    className="w-full h-full object-cover object-center"
                />
            </picture>

            {/* Content:
                - Mobile/Tablet: pushed to BOTTOM so text appears below the logo in hero_mobile image
                - Desktop (lg+): vertically centred, left-aligned — original layout
            */}
            <div className="
                relative w-full h-full flex flex-col
                px-6 sm:px-8 min-[1060px]:px-24
                items-center text-center
                justify-end pb-8 sm:pb-10 md:pb-12
                min-[1060px]:container min-[1060px]:mx-auto min-[1060px]:justify-center min-[1060px]:items-start min-[1060px]:text-left min-[1060px]:ml-[-22px] min-[1060px]:pb-0
            ">
                <h1 className="
                    font-trajan font-bold leading-tight uppercase tracking-[0.2em]
                    text-transparent bg-clip-text
                    bg-gradient-to-b from-[#fcf6ba] via-[#d4af37] to-[#997b2f]
                    drop-shadow-lg mb-3 sm:mb-4 min-[1061px]:mb-6
                    text-xl sm:text-2xl md:text-3xl min-[1061px]:text-4xl min-[1400px]:text-5xl 
                ">
                    Adorn Yourself <br />
                    with Timeless <br />
                    Elegance at Aavya
                </h1>
                <p className="
                    font-trajan tracking-[0.25em] text-[#fcf6ba] uppercase mb-5 sm:mb-6 min-[1061px]:mb-8
                    text-[10px] sm:text-xs md:text-sm min-[1061px]:text-xl min-[1400px]:text-2xl
                ">
                    Where Elegance Meets Eternity
                </p>
                <Link to="/collections">
                    <button className="
                        bg-gradient-to-r from-[#b88746] to-[#fdf5a6]
                        text-black font-trajan font-bold uppercase tracking-widest
                        rounded-full shadow-2xl hover:shadow-xl
                        transition-all transform hover:scale-105 w-max
                        px-6 py-2 text-[10px]
                        sm:px-8 sm:py-2.5 sm:text-xs
                        min-[1061px]:px-12 min-[1061px]:py-3 min-[1061px]:text-sm
                    ">
                        Shop Now
                    </button>
                </Link>
            </div>
        </section>
    );
};

export default Hero;


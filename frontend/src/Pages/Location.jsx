import React from 'react';
import { MapPin, Clock, Phone, Mail, Navigation, ExternalLink } from 'lucide-react';
import locationHero from '../Assets/location_hero.png';
import { Link } from 'react-router-dom';

const Location = () => {
    return (
        <div className="bg-white text-gray-800 font-trajan">
            {/* Hero Section */}
            <div className="relative h-[60vh] min-h-[400px] overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0">
                    <img
                        className="w-full h-full object-cover"
                        src={locationHero}
                        alt="Aavya Jewelry Store"
                    />
                    <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
                </div>
                <div className="relative text-center px-4">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-[0.2em] text-white uppercase mb-4 drop-shadow-2xl">
                        Visit Our Shop
                    </h1>
                    <div className="w-24 h-1 bg-avaya-gold mx-auto mb-6"></div>
                    <p className="text-white text-lg md:text-xl tracking-[0.1em] font-trajan max-w-2xl mx-auto drop-shadow-lg">
                        Experience the elegance of Aavya in person at our flagship store.
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                    {/* Store Info */}
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-widest uppercase border-b border-avaya-gold pb-4 inline-block">Chhedi Lal Munna Lal Jewellers</h2>
                            <p className="text-avaya-gold font-bold text-sm mb-6 tracking-widest uppercase italic">Best Jewellery Showroom In Prayagraj | Diamond And Gold Jewellery in Allahabad</p>
                            <div className="space-y-6 mt-8">
                                <div className="flex items-start gap-4 group">
                                    <div className="p-3 bg-avaya-gold/10 rounded-full group-hover:bg-avaya-gold group-hover:text-white transition-all duration-300">
                                        <MapPin className="h-6 w-6 text-avaya-gold group-hover:text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1 tracking-wider uppercase">Our Address</h3>
                                        <p className="text-gray-600 leading-relaxed font-sans">
                                            Power House Rd, Avas Vikas Colony II, Sector Number 2,<br />
                                            Jhusi, Prayagraj, Uttar Pradesh 211019
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 group">
                                    <div className="p-3 bg-avaya-gold/10 rounded-full group-hover:bg-avaya-gold group-hover:text-white transition-all duration-300">
                                        <Clock className="h-6 w-6 text-avaya-gold group-hover:text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1 tracking-wider uppercase">Shop Hours</h3>
                                        <div className="text-gray-600 space-y-1 font-sans">
                                            <p className="flex justify-between w-68"><span>Monday - Saturday:</span> <span>  10:30 AM - 8:30 PM</span></p>
                                            <p className="flex justify-between w-68"><span>Sunday:</span> <span>11:00 AM - 6:00 PM</span></p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 group">
                                    <div className="p-3 bg-avaya-gold/10 rounded-full group-hover:bg-avaya-gold group-hover:text-white transition-all duration-300">
                                        <Phone className="h-6 w-6 text-avaya-gold group-hover:text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1 tracking-wider uppercase">Contact</h3>
                                        <p className="text-gray-600 font-sans">+91 94506 20567</p>
                                        <p className="text-gray-600 font-sans">info@aavyajewels.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-avaya-dark p-8 rounded-lg text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-avaya-gold/10 rounded-full -mr-16 -mt-16"></div>
                            <h3 className="text-xl font-bold mb-4 tracking-widest text-avaya-gold uppercase">Personal Consultation</h3>
                            <p className="text-gray-400 mb-6 leading-relaxed font-sans">
                                Looking for something truly unique? Schedule a private viewing or custom design consultation with our master craftsmen.
                            </p>
                            <Link to="/contact" className="bg-avaya-gold hover:bg-white hover:text-avaya-dark text-white px-8 py-3 rounded transition-all duration-300 font-bold uppercase tracking-widest text-sm inline-flex items-center gap-2">
                                Book Now
                            </Link>
                        </div>
                    </div>

                    {/* Map Section */}
                    <div className="h-full min-h-[500px] rounded-lg overflow-hidden shadow-2xl border-4 border-white relative group">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d700.5929532421293!2d81.91281397134863!3d25.425171983231753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39854b5680492a1f%3A0xd26bfca27abc4a77!2sChhedi%20Lal%20Munna%20Lal%20Jewellers%20-%20Best%20Jewellery%20Showroom%20In%20Prayagraj%20%7C%20Diamond%20And%20Gold%20Jewellery%20in%20Allahabad!5e0!3m2!1sen!2sin!4v1773129108379!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0, minHeight: '500px' }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Chhedi Lal Munna Lal Jewellers"
                            className="grayscale hover:grayscale-0 transition-all duration-1000"
                        ></iframe>

                        <div className="absolute bottom-6 right-6">
                            <a
                                href="https://maps.app.goo.gl/VLcxaUMovySF4Jxv6"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white text-avaya-dark px-6 py-3 shadow-xl rounded-full font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-avaya-gold hover:text-white transition-all"
                            >
                                Get Directions <ExternalLink className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom CTA */}
            <div className="bg-gray-50 py-16 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold tracking-widest uppercase mb-4 text-gray-900">Follow Our Journey</h2>
                    <p className="text-gray-500 mb-8 max-w-xl mx-auto font-sans">
                        Discover daily inspiration, behind-the-scenes craft, and our latest collections on social media.
                    </p>
                    <div className="flex justify-center gap-8">
                        {['Instagram', 'Facebook', 'Youtube'].map((social) => (
                            <a key={social} href="#" className="text-gray-400 hover:text-avaya-gold font-bold tracking-widest text-sm uppercase transition-colors">
                                {social}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Location;


import React, { useState } from 'react';
import api from '../Utils/api';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import backgroundImage from '../Assets/background.png';
import { toast } from 'react-hot-toast';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
        subject: ''
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            await api.post('/api/contact', formData);
            toast.success('Message sent successfully!');
            setFormData({ name: '', email: '', message: '', subject: '' });
        } catch (error) {
            toast.error('Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-serif bg-fixed bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="max-w-6xl mx-auto w-full bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row border border-white/20">

                {/* Contact Info Side */}
                <div className="bg-avaya-dark text-white p-10 md:w-1/3 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-avaya-gold/10 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-avaya-gold/10 rounded-full blur-3xl translate-y-16 -translate-x-16"></div>

                    <div className="relative z-10">
                        <h2 className="text-3xl font-trajan font-bold mb-2 text-avaya-gold tracking-widest">Get in Touch</h2>
                        <p className="text-gray-300 font-light mb-10 leading-relaxed">
                            We'd love to hear from you. Our team is always here to chat about custom designs or answer any questions.
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-start gap-4 group">
                                <div className="p-3 bg-white/5 rounded-lg group-hover:bg-avaya-gold/20 transition-colors">
                                    <Phone className="w-6 h-6 text-avaya-gold" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white tracking-wide mb-1">Phone</h3>
                                    <p className="text-gray-400 text-sm group-hover:text-white transition-colors">+1 (009) 123-4567</p>
                                    <p className="text-gray-400 text-sm group-hover:text-white transition-colors">Mon-Fri 9am-6pm</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="p-3 bg-white/5 rounded-lg group-hover:bg-avaya-gold/20 transition-colors">
                                    <Mail className="w-6 h-6 text-avaya-gold" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white tracking-wide mb-1">Email</h3>
                                    <p className="text-gray-400 text-sm group-hover:text-white transition-colors">info@avayajewellery.com</p>
                                    <p className="text-gray-400 text-sm group-hover:text-white transition-colors">support@avayajewellery.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="p-3 bg-white/5 rounded-lg group-hover:bg-avaya-gold/20 transition-colors">
                                    <MapPin className="w-6 h-6 text-avaya-gold" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white tracking-wide mb-1">Location</h3>
                                    <p className="text-gray-400 text-sm group-hover:text-white transition-colors">
                                        123 Jewelry Lane, <br />
                                        Gold City, NY 10001
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Side */}
                <div className="p-10 md:w-2/3 bg-white/50 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold text-avaya-dark mb-8 font-trajan border-b border-avaya-gold/30 pb-4 inline-block">Send us a Message</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-avaya-dark tracking-wide">Your Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-avaya-gold focus:ring-1 focus:ring-avaya-gold transition-all"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-avaya-dark tracking-wide">Your Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-avaya-gold focus:ring-1 focus:ring-avaya-gold transition-all"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-avaya-dark tracking-wide">Subject</label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-avaya-gold focus:ring-1 focus:ring-avaya-gold transition-all"
                                placeholder="Inquiry about custom rings..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-avaya-dark tracking-wide">Message</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows="5"
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-avaya-gold focus:ring-1 focus:ring-avaya-gold transition-all resize-none"
                                placeholder="How can we help you today?"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full md:w-auto px-8 py-3 bg-avaya-dark text-avaya-gold rounded-lg font-bold tracking-widest uppercase text-sm hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                            {loading ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;

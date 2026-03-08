import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import backgroundImage from '../Assets/background.png';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-gray-200">
            <button
                className="w-full py-4 text-left flex justify-between items-center focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={`text-lg font-medium ${isOpen ? 'text-avaya-gold' : 'text-gray-800'}`}>
                    {question}
                </span>
                {isOpen ? <ChevronUp className="text-avaya-gold" /> : <ChevronDown className="text-gray-400" />}
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}
            >
                <p className="text-gray-600 leading-relaxed">{answer}</p>
            </div>
        </div>
    );
};

const FAQ = () => {
    const faqs = [
        {
            question: "Do you offer international shipping?",
            answer: "Yes, we ship to most countries worldwide. International shipping usually takes 7-14 business days depending on the destination. Please note that customers are responsible for any customs duties or taxes."
        },
        {
            question: "How do I care for my jewelry?",
            answer: "We recommend storing your jewelry in a dry place, preferably in the provided box or a soft pouch. Avoid contact with perfumes, lotions, and harsh chemicals. Clean gently with a soft cloth to maintain its shine."
        },
        {
            question: "Can I customize a piece of jewelry?",
            answer: "Yes! We offer customization services for select items, including engraving and resizing. Please contact our support team at info@avayajewellery.com to discuss your requirements."
        },
        {
            question: "Is your gold and silver authentic?",
            answer: "Absolutely. All our jewelry is crafted from genuine precious metals and gemstones. Each piece comes with a certificate of authenticity guaranteeing the purity and quality of the materials used."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and direct bank transfers. All transactions are secured with industry-standard encryption."
        },
        {
            question: "How can I track my order?",
            answer: "Once your order is shipped, you will receive an email confirmation with a tracking number. You can use this number on our website or the carrier's tracking page to monitor your shipment."
        }
    ];

    return (
        <div
            className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-serif bg-fixed bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="max-w-3xl mx-auto w-full bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl p-8 sm:p-12 border border-white/20">
                <h1 className="text-4xl font-bold text-center text-avaya-dark mb-12 uppercase tracking-widest font-trajan border-b border-avaya-gold/30 pb-6">
                    Frequently Asked Questions
                </h1>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} question={faq.question} answer={faq.answer} />
                    ))}
                </div>

                <div className="mt-16 text-center bg-gray-50/80 p-8 rounded-xl border border-gray-100 shadow-inner">
                    <p className="text-gray-600 mb-6 font-medium italic">Can't find what you're looking for?</p>
                    <Link to="/contact" className="inline-block bg-avaya-dark text-avaya-gold px-8 py-3 rounded-sm uppercase text-sm font-bold tracking-[0.2em] hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FAQ;

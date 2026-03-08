import React from 'react';
import backgroundImage from '../Assets/background.png';

const ShippingPolicy = () => {
    return (
        <div
            className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-serif bg-fixed bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="max-w-4xl mx-auto w-full bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl p-8 sm:p-12 border border-white/20">
                <h1 className="text-4xl font-bold text-center text-avaya-dark mb-10 uppercase tracking-widest font-trajan border-b border-avaya-gold/30 pb-6">
                    Shipping Policy
                </h1>

                <div className="space-y-10 text-gray-700 leading-relaxed font-light">
                    <section>
                        <h2 className="text-2xl font-semibold text-avaya-gold mb-4 font-trajan tracking-wide">Order Processing</h2>
                        <p className="text-lg">
                            All orders are processed within <span className="font-semibold text-avaya-dark">2-3 business days</span>. Orders are not shipped or delivered on weekends or holidays.
                        </p>
                        <p className="mt-4 text-gray-600 bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                            If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery.
                            If there will be a significant delay in shipment of your order, we will contact you via email or telephone.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-avaya-gold mb-4 font-trajan tracking-wide">Shipping Rates &amp; Delivery Estimates</h2>
                        <p className="mb-4">Shipping charges for your order will be calculated and displayed at checkout.</p>
                        <ul className="space-y-3 bg-gray-50/80 p-6 rounded-xl border border-gray-100">
                            <li className="flex items-center justify-between border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                                <span className="font-semibold text-avaya-dark">Standard Shipping</span>
                                <span className="text-gray-600">5-7 business days <span className="text-green-600 font-bold ml-2">(Free over ₹5,000)</span></span>
                            </li>
                            <li className="flex items-center justify-between border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                                <span className="font-semibold text-avaya-dark">Express Shipping</span>
                                <span className="text-gray-600">2-3 business days <span className="text-avaya-dark font-bold ml-2">₹250</span></span>
                            </li>
                            <li className="flex items-center justify-between border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                                <span className="font-semibold text-avaya-dark">Overnight Shipping</span>
                                <span className="text-gray-600">1-2 business days <span className="text-avaya-dark font-bold ml-2">₹500</span></span>
                            </li>
                        </ul>
                        <p className="mt-3 text-sm text-gray-500 italic">* Delivery delays can occasionally occur.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-avaya-gold mb-4 font-trajan tracking-wide">Shipment Confirmation &amp; Order Tracking</h2>
                        <p>
                            You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s).
                            The tracking number will be active within 24 hours.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-avaya-gold mb-4 font-trajan tracking-wide">Customs, Duties and Taxes</h2>
                        <p>
                            Avaya Jewelry is not responsible for any customs and taxes applied to your order. All fees imposed during or after shipping are the responsibility of the customer (tariffs, taxes, etc.).
                        </p>
                    </section>

                    <section className="bg-red-50/60 p-6 rounded-xl border-l-4 border-red-300">
                        <h2 className="text-xl font-bold text-red-800 mb-2 font-trajan">Damages</h2>
                        <p className="text-red-700/80">
                            Avaya Jewelry is not liable for any products damaged or lost during shipping. If you received your order damaged, please contact the shipment carrier to file a claim.
                            Please save all packaging materials and damaged goods before filing a claim.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ShippingPolicy;

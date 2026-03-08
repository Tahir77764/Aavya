import React from 'react';
import backgroundImage from '../Assets/background.png';

const ReturnsExchanges = () => {
    return (
        <div
            className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-serif bg-fixed bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="max-w-4xl mx-auto w-full bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl p-8 sm:p-12 border border-white/20">
                <h1 className="text-4xl font-bold text-center text-avaya-dark mb-10 uppercase tracking-widest font-trajan border-b border-avaya-gold/30 pb-6">
                    Returns &amp; Exchanges
                </h1>

                <div className="space-y-10 text-gray-700 leading-relaxed font-light">
                    <section>
                        <h2 className="text-2xl font-semibold text-avaya-gold mb-4 font-trajan tracking-wide">Our Return Policy</h2>
                        <p className="text-lg">
                            At Avaya Jewelry, we want you to be completely satisfied with your purchase. If you are not entirely happy, we're here to help.
                            You have <span className="font-semibold text-avaya-dark">30 calendar days</span> to return an item from the date you received it.
                        </p>
                        <p className="mt-4 text-gray-600">
                            To be eligible for a return, your item must be unused and in the same condition that you received it. Your item must be in the original packaging.
                            Your item needs to have the receipt or proof of purchase.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-avaya-gold mb-4 font-trajan tracking-wide">Refunds</h2>
                        <p>
                            Once we receive your item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item.
                            If your return is approved, we will initiate a refund to your credit card (or original method of payment).
                            You will receive the credit within a certain amount of days, depending on your card issuer's policies.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-avaya-gold mb-4 font-trajan tracking-wide">Exchanges</h2>
                        <p>
                            We only replace items if they are defective or damaged. If you need to exchange it for the same item, send us an email at <a href="mailto:info@avayajewellery.com" className="text-avaya-dark underline decoration-avaya-gold decoration-2 underline-offset-4 hover:text-avaya-gold transition-colors">info@avayajewellery.com</a> and send your item to our returns center.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-avaya-gold mb-4 font-trajan tracking-wide">Shipping</h2>
                        <p>
                            You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable.
                            If you receive a refund, the cost of return shipping will be deducted from your refund.
                        </p>
                    </section>

                    <section className="bg-gray-50/80 p-6 rounded-xl border-l-4 border-avaya-gold">
                        <h2 className="text-xl font-bold text-avaya-dark mb-2 font-trajan">Contact Us</h2>
                        <p className="text-gray-600">
                            If you have any questions on how to return your item to us, contact us at <span className="font-semibold text-avaya-dark">info@avayajewellery.com</span> or call <span className="font-semibold text-avaya-dark">+1 (009) 123-4567</span>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ReturnsExchanges;

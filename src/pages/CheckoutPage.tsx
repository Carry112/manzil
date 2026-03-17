import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import { getSessionId } from '../lib/session';
import { Texture } from '../components/Texture';
import { Lock } from 'lucide-react';
import type { ShippingInfo } from '../types';

export function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [shipping, setShipping] = useState<ShippingInfo>({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    phone: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const sessionId = getSessionId();

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          session_id: sessionId,
          email: shipping.email,
          total,
          status: 'pending',
          shipping_info: shipping,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product.name,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price: item.product.price,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

      if (itemsError) throw itemsError;

      await clearCart();
      setStep(3);
    } catch (error) {
      console.error('Order error:', error);
      alert('There was an error processing your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0 && step !== 3) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-serif text-3xl text-[#2C2C2C] mb-4">Your cart is empty</h2>
          <a
            href="/shop"
            className="relative inline-block px-8 py-3 bg-[#C1876B] text-white hover:bg-[#C1876B]/90 transition-colors overflow-hidden group"
          >
            <Texture type="leather" opacity={0.08} className="group-hover:opacity-0" />
            <span className="relative z-10 text-sm uppercase tracking-wider">Continue Shopping</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-sm transition-colors ${
                    step >= s
                      ? 'bg-[#C1876B] text-white'
                      : 'bg-[#E8DCC4] text-[#A8A8A8]'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-16 h-0.5 transition-colors ${
                      step > s ? 'bg-[#C1876B]' : 'bg-[#E8DCC4]'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="text-center">
            <h1 className="font-serif text-3xl text-[#2C2C2C]">
              {step === 1 && 'Shipping Information'}
              {step === 2 && 'Payment'}
              {step === 3 && 'Order Complete'}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            {step === 1 && (
              <form onSubmit={handleShippingSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-sm uppercase tracking-wider text-[#2C2C2C] mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={shipping.name}
                      onChange={(e) => setShipping({ ...shipping, name: e.target.value })}
                      className="w-full px-4 py-3 border border-[#E8DCC4] focus:outline-none focus:border-[#C1876B] transition-colors"
                    />
                  </div>

                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm uppercase tracking-wider text-[#2C2C2C] mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={shipping.email}
                      onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                      className="w-full px-4 py-3 border border-[#E8DCC4] focus:outline-none focus:border-[#C1876B] transition-colors"
                    />
                  </div>

                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm uppercase tracking-wider text-[#2C2C2C] mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      required
                      value={shipping.phone}
                      onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-[#E8DCC4] focus:outline-none focus:border-[#C1876B] transition-colors"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm uppercase tracking-wider text-[#2C2C2C] mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      required
                      value={shipping.address}
                      onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                      className="w-full px-4 py-3 border border-[#E8DCC4] focus:outline-none focus:border-[#C1876B] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm uppercase tracking-wider text-[#2C2C2C] mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={shipping.city}
                      onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                      className="w-full px-4 py-3 border border-[#E8DCC4] focus:outline-none focus:border-[#C1876B] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm uppercase tracking-wider text-[#2C2C2C] mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      required
                      value={shipping.state}
                      onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                      className="w-full px-4 py-3 border border-[#E8DCC4] focus:outline-none focus:border-[#C1876B] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm uppercase tracking-wider text-[#2C2C2C] mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      required
                      value={shipping.zip}
                      onChange={(e) => setShipping({ ...shipping, zip: e.target.value })}
                      className="w-full px-4 py-3 border border-[#E8DCC4] focus:outline-none focus:border-[#C1876B] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm uppercase tracking-wider text-[#2C2C2C] mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      required
                      value={shipping.country}
                      onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                      className="w-full px-4 py-3 border border-[#E8DCC4] focus:outline-none focus:border-[#C1876B] transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="relative w-full px-8 py-4 bg-[#C1876B] text-white hover:bg-[#C1876B]/90 transition-colors overflow-hidden group"
                >
                  <Texture type="leather" opacity={0.08} className="group-hover:opacity-0" />
                  <span className="relative z-10 text-sm uppercase tracking-wider">
                    Continue to Payment
                  </span>
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handlePayment} className="space-y-6">
                <div className="p-6 bg-[#F5F1E8] rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Lock className="w-5 h-5 text-[#A8A8A8]" />
                    <p className="text-sm text-[#A8A8A8]">Secure payment processing</p>
                  </div>
                  <p className="text-[#2C2C2C]">
                    Payment integration is ready to be configured. This is a demo checkout flow.
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 px-8 py-4 border border-[#E8DCC4] hover:border-[#C1876B] transition-colors text-sm uppercase tracking-wider"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="relative flex-1 px-8 py-4 bg-[#C1876B] text-white hover:bg-[#C1876B]/90 transition-colors overflow-hidden group disabled:opacity-50"
                  >
                    <Texture type="leather" opacity={0.08} className="group-hover:opacity-0" />
                    <span className="relative z-10 text-sm uppercase tracking-wider">
                      {isProcessing ? 'Processing...' : 'Place Order'}
                    </span>
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-[#C1876B] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="font-serif text-3xl text-[#2C2C2C] mb-4">Order Complete!</h2>
                <p className="text-[#A8A8A8] mb-8">
                  Thank you for your order. We'll send you a confirmation email shortly.
                </p>
                <a
                  href="/shop"
                  className="relative inline-block px-8 py-3 bg-[#C1876B] text-white hover:bg-[#C1876B]/90 transition-colors overflow-hidden group"
                >
                  <Texture type="leather" opacity={0.08} className="group-hover:opacity-0" />
                  <span className="relative z-10 text-sm uppercase tracking-wider">
                    Continue Shopping
                  </span>
                </a>
              </div>
            )}
          </div>

          {step !== 3 && (
            <div className="relative lg:sticky lg:top-24 h-fit">
              <div className="relative bg-white p-6 rounded-lg">
                <Texture type="paper" opacity={0.03} />
                <div className="relative z-10">
                  <h3 className="font-serif text-xl text-[#2C2C2C] mb-6">Order Summary</h3>

                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-16 h-16 bg-[#F5F1E8] rounded overflow-hidden flex-shrink-0">
                          {item.product.images[0] && (
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm text-[#2C2C2C] truncate">{item.product.name}</h4>
                          <p className="text-xs text-[#A8A8A8]">
                            {item.size} / {item.color} / Qty: {item.quantity}
                          </p>
                          <p className="text-sm font-mono text-[#2C2C2C] mt-1">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[#E8DCC4] pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#A8A8A8]">Subtotal</span>
                      <span className="font-mono text-[#2C2C2C]">${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#A8A8A8]">Shipping</span>
                      <span className="font-mono text-[#2C2C2C]">Free</span>
                    </div>
                    <div className="border-t border-[#E8DCC4] pt-4 flex justify-between">
                      <span className="font-serif text-lg text-[#2C2C2C]">Total</span>
                      <span className="font-mono text-xl text-[#2C2C2C]">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

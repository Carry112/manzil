import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export function Cart() {
  const { items, updateQuantity, removeItem, total, isOpen, closeCart } = useCart();

  return (
    <>
      <div
        className={`fixed inset-0 bg-[#3D2B3D]/30 backdrop-blur-sm z-50 transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      />

      <div
        className={`fixed inset-y-0 right-0 w-full md:w-[480px] bg-[#FFF8F0] z-50 transform transition-transform duration-500 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Decorative background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#FFCCE0]/40 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#C8DCFF]/30 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative h-full flex flex-col z-10">
          <div className="p-6 border-b border-[#FFB3D1]/25">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl text-[#3D2B3D]">Your Cart</h2>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-[#FFCCE0] rounded-full transition-colors duration-300"
                aria-label="Close cart"
              >
                <X className="w-5 h-5 text-[#FFB3D1]" />
              </button>
            </div>
            <p className="text-sm text-[#B0A0B0] mt-1">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FFCCE0] to-[#C8DCFF]/50 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-10 h-10 text-[#FFB3D1]" />
                </div>
                <h3 className="font-serif text-xl text-[#3D2B3D] mb-2">Your cart is empty</h3>
                <p className="text-[#B0A0B0] mb-6 text-sm">Start your journey with Manzil</p>
                <a
                  href="/shop"
                  className="px-8 py-3 bg-gradient-to-r from-[#FFB3D1] to-[#A8C4FF] text-white rounded-xl hover:shadow-lg hover:shadow-[#FFB3D1]/30 transition-all font-medium"
                  onClick={closeCart}
                >
                  Shop Now
                </a>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="group">
                    <div className="flex gap-4 p-4 bg-white rounded-2xl border border-[#FFB3D1]/15 hover:border-[#FFB3D1]/40 hover:shadow-md hover:shadow-[#FFB3D1]/10 transition-all">
                      <div className="relative w-24 h-24 flex-shrink-0 bg-gradient-to-b from-[#FFCCE0]/30 to-[#C8DCFF]/30 rounded-xl overflow-hidden">
                        {item.product.images[0] && (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-base text-[#3D2B3D] mb-1 truncate">
                          {item.product.name}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-[#B0A0B0] mb-2">
                          <span>Size: {item.size}</span>
                          <span className="w-1 h-1 bg-[#FFB3D1] rounded-full" />
                          <span>Color: {item.color}</span>
                        </div>
                        <p className="font-mono text-sm text-[#3D2B3D] font-semibold">
                          ${item.product.price.toFixed(2)}
                        </p>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center border border-[#FFB3D1]/40 hover:border-[#FFB3D1] hover:bg-[#FFCCE0] transition-colors rounded-lg"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3 text-[#FFB3D1]" />
                            </button>
                            <span className="font-mono text-sm w-8 text-center text-[#3D2B3D]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center border border-[#A8C4FF]/40 hover:border-[#A8C4FF] hover:bg-[#C8DCFF]/40 transition-colors rounded-lg"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3 text-[#A8C4FF]" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-xs text-[#B0A0B0] hover:text-[#FFB3D1] transition-colors uppercase tracking-wider"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="p-6 border-t border-[#FFB3D1]/20 bg-[#FFF8F0]">
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm uppercase tracking-wider text-[#7A6A7A]">Subtotal</span>
                <span className="font-mono text-2xl text-[#3D2B3D] font-bold">${total.toFixed(2)}</span>
              </div>

              <a
                href="/checkout"
                className="block w-full px-8 py-4 bg-gradient-to-r from-[#FFB3D1] to-[#A8C4FF] text-white text-center rounded-xl hover:shadow-lg hover:shadow-[#FFB3D1]/30 transition-all font-medium tracking-wide"
                onClick={closeCart}
              >
                Proceed to Checkout
              </a>

              <p className="text-xs text-[#B0A0B0] text-center mt-4">
                Shipping calculated at checkout
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

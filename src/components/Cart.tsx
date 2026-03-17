import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Texture } from './Texture';

export function Cart() {
  const { items, updateQuantity, removeItem, total, isOpen, closeCart } = useCart();

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      />

      <div
        className={`fixed inset-y-0 right-0 w-full md:w-[480px] bg-[#FAF9F6] z-50 transform transition-transform duration-500 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="relative h-full flex flex-col">
          <Texture type="paper" opacity={0.04} />

          <div className="relative z-10 p-6 border-b border-[#E8DCC4]">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl text-[#2C2C2C]">Your Cart</h2>
              <button
                onClick={closeCart}
                className="p-2 hover:scale-110 transition-transform duration-300"
                aria-label="Close cart"
              >
                <X className="w-5 h-5 text-[#2C2C2C]" />
              </button>
            </div>
            <p className="text-sm text-[#A8A8A8] mt-1">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          <div className="relative z-10 flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                <ShoppingBag className="w-16 h-16 text-[#E8DCC4] mb-4" />
                <h3 className="font-serif text-xl text-[#2C2C2C] mb-2">Your cart is empty</h3>
                <p className="text-[#A8A8A8] mb-6">Start your journey with Manzil</p>
                <a
                  href="/shop"
                  className="relative px-8 py-3 bg-[#C1876B] text-white hover:bg-[#C1876B]/90 transition-colors overflow-hidden group"
                  onClick={closeCart}
                >
                  <Texture type="leather" opacity={0.08} className="group-hover:opacity-0" />
                  <span className="relative z-10">Shop Now</span>
                </a>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="relative group">
                    <div className="flex gap-4 p-4 bg-white rounded-lg transition-shadow hover:shadow-md">
                      <div className="relative w-24 h-24 flex-shrink-0 bg-[#F5F1E8] rounded overflow-hidden">
                        {item.product.images[0] && (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-base text-[#2C2C2C] mb-1 truncate">
                          {item.product.name}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-[#A8A8A8] mb-2">
                          <span>Size: {item.size}</span>
                          <span className="w-1 h-1 bg-[#A8A8A8] rounded-full" />
                          <span>Color: {item.color}</span>
                        </div>
                        <p className="font-mono text-sm text-[#2C2C2C]">
                          ${item.product.price.toFixed(2)}
                        </p>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center border border-[#E8DCC4] hover:border-[#C1876B] hover:bg-[#C1876B] hover:text-white transition-colors rounded"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-mono text-sm w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center border border-[#E8DCC4] hover:border-[#C1876B] hover:bg-[#C1876B] hover:text-white transition-colors rounded"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-xs text-[#A8A8A8] hover:text-[#C1876B] transition-colors uppercase tracking-wider"
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
            <div className="relative z-10 p-6 border-t border-[#E8DCC4] bg-[#FAF9F6]">
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm uppercase tracking-wider text-[#A8A8A8]">Subtotal</span>
                <span className="font-mono text-2xl text-[#2C2C2C]">${total.toFixed(2)}</span>
              </div>

              <a
                href="/checkout"
                className="relative block w-full px-8 py-4 bg-[#C1876B] text-white text-center hover:bg-[#C1876B]/90 transition-colors overflow-hidden group"
                onClick={closeCart}
              >
                <Texture type="leather" opacity={0.08} className="group-hover:opacity-0" />
                <span className="relative z-10 text-sm uppercase tracking-wider">
                  Proceed to Checkout
                </span>
              </a>

              <p className="text-xs text-[#A8A8A8] text-center mt-4">
                Shipping calculated at checkout
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

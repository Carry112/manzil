import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { Texture } from '../components/Texture';
import type { Product } from '../types';

export function ProductPage({ slug }: { slug: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>('materials');
  const { addItem, openCart } = useCart();

  useEffect(() => {
    loadProduct();
  }, [slug]);

  const loadProduct = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (data) {
      setProduct(data);
      if (data.sizes && data.sizes.length > 0) {
        setSelectedSize(data.sizes[0]);
      }
      if (data.colors && data.colors.length > 0) {
        setSelectedColor(data.colors[0].name);
      }
    }
  };

  const handleAddToCart = async () => {
    if (!product || !selectedSize || !selectedColor) return;

    await addItem(product.id, selectedSize, selectedColor, 1);
    openCart();
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <p className="text-[#A8A8A8]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] pt-20">
      <div className="max-w-[1920px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-5rem)]">
          <div className="lg:col-span-7 relative">
            <div className="sticky top-20 flex gap-4 p-6 md:p-12">
              <div className="hidden md:flex flex-col gap-3 w-20">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-[#F5F1E8] overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-[#C1876B]' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              <div className="flex-1 aspect-[3/4] bg-[#F5F1E8] overflow-hidden group cursor-zoom-in">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative bg-[#F5F1E8]">
            <Texture type="canvas" opacity={0.05} />

            <div className="sticky top-20 p-6 md:p-12 h-[calc(100vh-5rem)] overflow-y-auto">
              <div className="relative z-10">
                <h1 className="font-serif text-4xl md:text-5xl text-[#2C2C2C] mb-4">
                  {product.name}
                </h1>
                <p className="font-mono text-2xl text-[#2C2C2C] mb-8">
                  ${product.price.toFixed(2)}
                </p>

                <p className="text-[#A8A8A8] leading-relaxed mb-8">{product.description}</p>

                {product.colors && product.colors.length > 0 && (
                  <div className="mb-8">
                    <label className="block text-sm uppercase tracking-wider text-[#2C2C2C] mb-4">
                      Color: {selectedColor}
                    </label>
                    <div className="flex gap-3">
                      {product.colors.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => setSelectedColor(color.name)}
                          className={`w-12 h-12 rounded-full border-2 transition-all ${
                            selectedColor === color.name
                              ? 'border-[#C1876B] scale-110'
                              : 'border-[#E8DCC4] hover:border-[#A8A8A8]'
                          }`}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {product.sizes && product.sizes.length > 0 && (
                  <div className="mb-8">
                    <label className="block text-sm uppercase tracking-wider text-[#2C2C2C] mb-4">
                      Size
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-3 border transition-colors ${
                            selectedSize === size
                              ? 'border-[#C1876B] bg-[#C1876B] text-white'
                              : 'border-[#E8DCC4] hover:border-[#C1876B] bg-white'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleAddToCart}
                  disabled={!selectedSize || !selectedColor}
                  className="relative w-full px-8 py-4 bg-[#C1876B] text-white hover:bg-[#C1876B]/90 transition-colors overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed mb-8"
                >
                  <Texture type="leather" opacity={0.08} className="group-hover:opacity-0" />
                  <span className="relative z-10 text-sm uppercase tracking-wider">
                    Add to Cart
                  </span>
                </button>

                <div className="space-y-4">
                  <AccordionSection
                    title="Materials"
                    isExpanded={expandedSection === 'materials'}
                    onToggle={() =>
                      setExpandedSection(expandedSection === 'materials' ? null : 'materials')
                    }
                  >
                    <p className="text-[#A8A8A8] leading-relaxed">{product.materials}</p>
                  </AccordionSection>

                  <AccordionSection
                    title="Care Instructions"
                    isExpanded={expandedSection === 'care'}
                    onToggle={() => setExpandedSection(expandedSection === 'care' ? null : 'care')}
                  >
                    <p className="text-[#A8A8A8] leading-relaxed">{product.care_instructions}</p>
                  </AccordionSection>

                  <AccordionSection
                    title="Shipping"
                    isExpanded={expandedSection === 'shipping'}
                    onToggle={() =>
                      setExpandedSection(expandedSection === 'shipping' ? null : 'shipping')
                    }
                  >
                    <p className="text-[#A8A8A8] leading-relaxed">
                      Free shipping on orders over $100. Standard shipping takes 3-5 business days.
                      Express shipping available at checkout.
                    </p>
                  </AccordionSection>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AccordionSection({
  title,
  isExpanded,
  onToggle,
  children,
}: {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-[#E8DCC4]">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left hover:text-[#C1876B] transition-colors"
      >
        <span className="text-sm uppercase tracking-wider text-[#2C2C2C]">{title}</span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-[#A8A8A8]" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[#A8A8A8]" />
        )}
      </button>
      {isExpanded && <div className="pb-4">{children}</div>}
    </div>
  );
}

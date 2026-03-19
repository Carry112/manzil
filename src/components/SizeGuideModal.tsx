import { X } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  if (!isOpen) return null;

  const sizes = [
    { us: '6', uk: '5.5', eu: '39', cm: '24' },
    { us: '7', uk: '6.5', eu: '40', cm: '25' },
    { us: '8', uk: '7.5', eu: '41', cm: '26' },
    { us: '9', uk: '8.5', eu: '42', cm: '27' },
    { us: '10', uk: '9.5', eu: '43', cm: '28' },
    { us: '11', uk: '10.5', eu: '44', cm: '29' },
    { us: '12', uk: '11.5', eu: '45', cm: '30' },
    { us: '13', uk: '12.5', eu: '46', cm: '31' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-[#3D2B3D]/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl bg-[#FFF8F0] rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-8 py-6 border-b border-[#FFB3D1]/20 bg-white/50">
          <div>
            <h2 className="font-serif text-2xl text-[#3D2B3D]">Size Guide</h2>
            <p className="text-sm text-[#B0A0B0] mt-1">Find your perfect fit</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-[#FFCCE0] rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-[#FFB3D1]" />
          </button>
        </div>

        <div className="p-8 max-h-[70vh] overflow-y-auto">
          <div className="overflow-x-auto rounded-xl border border-[#FFB3D1]/20">
            <table className="w-full text-sm text-center bg-white">
              <thead>
                <tr className="border-b border-[#FFB3D1]/30 bg-[#FFF8F0]">
                  <th className="py-4 font-semibold text-[#3D2B3D] uppercase tracking-wider">US</th>
                  <th className="py-4 font-semibold text-[#3D2B3D] uppercase tracking-wider hidden sm:table-cell">UK</th>
                  <th className="py-4 font-semibold text-[#3D2B3D] uppercase tracking-wider hidden sm:table-cell">EU</th>
                  <th className="py-4 font-semibold text-[#3D2B3D] uppercase tracking-wider">CM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FFB3D1]/10">
                {sizes.map((size) => (
                  <tr key={size.us} className="hover:bg-[#FFF8F0] transition-colors">
                    <td className="py-4 font-mono font-medium text-[#3D2B3D]">US {size.us}</td>
                    <td className="py-4 font-mono text-[#7A6A7A] hidden sm:table-cell">{size.uk}</td>
                    <td className="py-4 font-mono text-[#7A6A7A] hidden sm:table-cell">{size.eu}</td>
                    <td className="py-4 font-mono text-[#7A6A7A]">{size.cm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 p-6 bg-white rounded-xl border border-[#FFB3D1]/20 text-sm text-[#7A6A7A] leading-relaxed shadow-sm">
            <p className="font-semibold text-[#3D2B3D] mb-3 uppercase tracking-wider text-xs flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#FFCCE0] text-[#3D2B3D] flex items-center justify-center font-bold">i</span>
              How to measure
            </p>
            <ul className="space-y-2 ml-8 list-none relative">
              <li className="relative">
                <span className="absolute -left-6 top-1.5 w-1.5 h-1.5 rounded-full bg-[#FFB3D1]"></span>
                Place your heel against a flat wall.
              </li>
              <li className="relative">
                <span className="absolute -left-6 top-1.5 w-1.5 h-1.5 rounded-full bg-[#FFB3D1]"></span>
                Measure from the wall to the tip of your longest toe in centimeters (CM).
              </li>
              <li className="relative">
                <span className="absolute -left-6 top-1.5 w-1.5 h-1.5 rounded-full bg-[#FFB3D1]"></span>
                If you are between sizes, we strongly recommend sizing up for a comfortable fit.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

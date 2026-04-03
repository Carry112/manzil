import { Search } from 'lucide-react';
import { useState } from 'react';

interface AnimatedGlowingSearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function AnimatedGlowingSearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
}: AnimatedGlowingSearchBarProps) {
  const [internalValue, setInternalValue] = useState('');
  const resolvedValue = value ?? internalValue;

  const handleValueChange = (nextValue: string) => {
    if (value === undefined) {
      setInternalValue(nextValue);
    }
    onChange?.(nextValue);
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className="group relative flex items-center justify-center transition-transform duration-500 ease-out will-change-transform hover:scale-[1.01] focus-within:scale-[1.01]">
        <div className="absolute z-[-1] h-full w-full max-h-[62px] max-w-[308px] overflow-hidden rounded-xl blur-[2.5px] animate-[search-pulse_6s_ease-in-out_infinite]
                        before:absolute before:left-1/2 before:top-1/2 before:z-[-2] before:h-[820px] before:w-[820px] before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']
                        before:bg-[conic-gradient(rgba(0,0,0,0),#ff8fc3_11%,rgba(0,0,0,0)_42%,rgba(0,0,0,0)_57%,#6fa3ff_78%,rgba(0,0,0,0)_100%)]
                        before:animate-[orbital-spin_14s_linear_infinite]
                        group-hover:before:animate-[orbital-spin_7s_linear_infinite] group-focus-within:before:animate-[orbital-spin_4s_linear_infinite]" />

        <div className="absolute z-[-1] h-full w-full max-h-[58px] max-w-[304px] overflow-hidden rounded-lg blur-[1.5px] animate-[search-pulse_7s_ease-in-out_infinite]
                        before:absolute before:left-1/2 before:top-1/2 before:z-[-2] before:h-[680px] before:w-[680px] before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']
                        before:bg-[conic-gradient(rgba(0,0,0,0),#ffa9d3,rgba(0,0,0,0)_14%,rgba(0,0,0,0)_52%,#a8c4ff,rgba(0,0,0,0)_62%)]
                        before:animate-[orbital-spin-reverse_18s_linear_infinite]
                        group-hover:before:animate-[orbital-spin-reverse_8s_linear_infinite] group-focus-within:before:animate-[orbital-spin-reverse_5s_linear_infinite]" />

        <div className="relative">
          <input
            value={resolvedValue}
            onChange={(event) => handleValueChange(event.target.value)}
            placeholder={placeholder}
            type="text"
            className="h-[52px] w-[292px] rounded-lg border border-[#ffb3d1]/35 bg-[#fffdfb] pl-12 pr-4 text-[15px] text-[#2f2230] outline-none transition-[border-color,box-shadow,transform,background-color,color] duration-300 ease-out placeholder:text-[#9a879a] placeholder:opacity-100 placeholder:transition-colors focus:border-[#ff8fc3] focus:bg-white focus:shadow-[0_0_0_3px_rgba(255,143,195,0.16)]"
            aria-label="Search"
          />

          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8f7d8f] transition-all duration-300 ease-out group-hover:text-[#ff8fc3] group-focus-within:text-[#ff8fc3] group-focus-within:scale-110">
            <Search className="h-[19px] w-[19px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnimatedGlowingSearchBar;

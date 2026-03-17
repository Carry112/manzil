interface TextureProps {
  type?: 'leather' | 'canvas' | 'paper' | 'concrete';
  opacity?: number;
  className?: string;
}

export function Texture({ type = 'paper', opacity = 0.05, className = '' }: TextureProps) {
  const patterns = {
    leather: (
      <pattern id="leather" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <filter id="noise-leather">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
        </filter>
        <rect width="100" height="100" filter="url(#noise-leather)" opacity={opacity} />
      </pattern>
    ),
    canvas: (
      <pattern id="canvas" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
        <filter id="noise-canvas">
          <feTurbulence type="turbulence" baseFrequency="0.5" numOctaves="2" />
        </filter>
        <rect width="200" height="200" filter="url(#noise-canvas)" opacity={opacity} />
      </pattern>
    ),
    paper: (
      <pattern id="paper" x="0" y="0" width="300" height="300" patternUnits="userSpaceOnUse">
        <filter id="noise-paper">
          <feTurbulence type="fractalNoise" baseFrequency="0.3" numOctaves="3" />
        </filter>
        <rect width="300" height="300" filter="url(#noise-paper)" opacity={opacity} />
      </pattern>
    ),
    concrete: (
      <pattern id="concrete" x="0" y="0" width="400" height="400" patternUnits="userSpaceOnUse">
        <filter id="noise-concrete">
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="5" />
        </filter>
        <rect width="400" height="400" filter="url(#noise-concrete)" opacity={opacity} />
      </pattern>
    ),
  };

  return (
    <svg className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}>
      <defs>{patterns[type]}</defs>
      <rect width="100%" height="100%" fill={`url(#${type})`} />
    </svg>
  );
}

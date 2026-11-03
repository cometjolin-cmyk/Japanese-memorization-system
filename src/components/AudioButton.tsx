import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { speakJapanese } from '../utils/audio';

interface AudioButtonProps {
  text: string;
  rate?: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'subtle' | 'ghost' | 'pill';
  className?: string;
  autoPlay?: boolean;
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  text,
  rate = 0.85,
  label,
  size = 'md',
  variant = 'subtle',
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) return;
    setIsPlaying(true);
    await speakJapanese(text, rate);
    setIsPlaying(false);
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-1 gap-1',
    md: 'text-sm px-2.5 py-1.5 gap-1.5',
    lg: 'text-base px-3.5 py-2 gap-2',
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20,
  };

  const variantStyles = {
    primary: 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs',
    subtle: 'bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-800 border border-stone-200/80',
    ghost: 'hover:bg-amber-50 text-stone-600 hover:text-amber-700',
    pill: 'bg-amber-50 text-amber-800 border border-amber-200/60 hover:bg-amber-100',
  };

  return (
    <button
      type="button"
      onClick={handleSpeak}
      title={`聆聽日語發音: ${text}`}
      className={`inline-flex items-center justify-center font-medium rounded-lg transition-colors cursor-pointer active:scale-95 select-none focus-visible:outline-2 focus-visible:outline-amber-600 ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      <Volume2
        size={iconSizes[size]}
        className={`${isPlaying ? 'text-amber-500 animate-pulse' : 'currentColor'} shrink-0`}
      />
      {label && <span>{label}</span>}
      {isPlaying && <span className="sr-only">正在播放語音</span>}
    </button>
  );
};

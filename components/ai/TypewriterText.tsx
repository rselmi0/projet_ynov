import React, { useState, useEffect } from 'react';
import { Text } from '@/components/ui/text';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  onCharacter?: () => void; // Called each time a character is typed
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 1, // milliseconds per character
  className,
  onComplete,
  onCharacter,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
        onCharacter?.(); // Call scroll callback
      }, speed);

      return () => clearTimeout(timer);
    } else if (currentIndex === text.length && onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  // Reset when text changes
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);

  return (
    <Text className={className}>
      {displayedText}
      {currentIndex < text.length && (
        <Text className="opacity-50 animate-pulse">|</Text>
      )}
    </Text>
  );
};

export default TypewriterText; 
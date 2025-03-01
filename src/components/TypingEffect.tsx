
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

interface TypingEffectProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  cursor?: boolean;
  onComplete?: () => void;
}

const TypingEffect: React.FC<TypingEffectProps> = ({
  text,
  className,
  speed = 40,
  delay = 0,
  cursor = true,
  onComplete
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const startTyping = setTimeout(() => {
      setIsTyping(true);
      let index = 0;
      
      const typingInterval = setInterval(() => {
        if (index < text.length) {
          setDisplayText(text.substring(0, index + 1));
          index++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
          setIsComplete(true);
          if (onComplete) onComplete();
        }
      }, speed);
      
      return () => clearInterval(typingInterval);
    }, delay);
    
    return () => clearTimeout(startTyping);
  }, [text, speed, delay, onComplete]);

  return (
    <span className={cn(className, cursor && !isComplete && "cursor")}>
      {displayText}
    </span>
  );
};

export default TypingEffect;

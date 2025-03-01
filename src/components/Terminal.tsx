
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

interface TerminalProps {
  className?: string;
  children: React.ReactNode;
  title?: string;
  fullWidth?: boolean;
  autoType?: boolean;
  typeDelay?: number;
}

const Terminal: React.FC<TerminalProps> = ({
  className,
  children,
  title = "terminal@growyourniche:",
  fullWidth = false,
  autoType = false,
  typeDelay = 30
}) => {
  const [displayedContent, setDisplayedContent] = useState(autoType ? "" : children);
  const [isTyping, setIsTyping] = useState(autoType);
  
  useEffect(() => {
    if (!autoType) return;
    
    let contentAsString = "";
    if (typeof children === 'string') {
      contentAsString = children;
    } else {
      contentAsString = "Command executed successfully.";
    }
    
    let currentIndex = 0;
    setDisplayedContent("");
    setIsTyping(true);
    
    const typingInterval = setInterval(() => {
      if (currentIndex < contentAsString.length) {
        setDisplayedContent(prev => prev + contentAsString[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, typeDelay);
    
    return () => clearInterval(typingInterval);
  }, [children, autoType, typeDelay]);

  return (
    <div className={cn(
      "terminal-window", 
      fullWidth ? "w-full" : "max-w-3xl",
      className
    )}>
      <div className="terminal-header">
        <div className="terminal-header-dot bg-red-500"></div>
        <div className="terminal-header-dot bg-yellow-500"></div>
        <div className="terminal-header-dot bg-green-500"></div>
        <div className="ml-2 text-xs text-terminal-white opacity-80">{title}</div>
      </div>
      <div className="terminal-content">
        <div className="flex">
          <span className="text-terminal-red mr-2">$</span>
          <div className={isTyping ? "cursor" : ""}>
            {displayedContent}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terminal;

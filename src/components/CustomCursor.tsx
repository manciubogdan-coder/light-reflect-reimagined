
import { useEffect, useState } from "react";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hidden, setHidden] = useState(true);
  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setHidden(false);
    };

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    const handleLinkHoverStart = () => setLinkHovered(true);
    const handleLinkHoverEnd = () => setLinkHovered(false);

    const addListenersToElements = () => {
      const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, [role="button"]');
      
      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', handleLinkHoverStart);
        el.addEventListener('mouseleave', handleLinkHoverEnd);
      });
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseenter', () => setHidden(false));
    window.addEventListener('mouseleave', () => setHidden(true));

    // Add listeners for interactive elements
    if (typeof window !== 'undefined') {
      // Initial setup
      addListenersToElements();
      
      // MutationObserver to handle dynamically added elements
      const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
          if (mutation.type === 'childList') {
            addListenersToElements();
          }
        });
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      // Clean up observer on unmount
      return () => {
        observer.disconnect();
        window.removeEventListener('mousemove', updatePosition);
        window.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('mouseenter', () => setHidden(false));
        window.removeEventListener('mouseleave', () => setHidden(true));
      };
    }
  }, []);

  return (
    <>
      <div 
        className={`cursor-dot ${hidden ? 'opacity-0' : 'opacity-100'} ${clicked ? 'scale-50' : 'scale-100'}`}
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px` 
        }}
      />
      <div 
        className={`cursor-outline ${hidden ? 'opacity-0' : 'opacity-100'} ${clicked ? 'scale-75' : 'scale-100'} ${linkHovered ? 'w-12 h-12 border-electric-blue' : ''}`}
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          transitionDuration: '0.15s', 
          transitionTimingFunction: 'ease-out'
        }}
      />
    </>
  );
};

export default CustomCursor;

import { useState, useRef, useEffect } from "react";
interface InteractiveTextProps {
  children: string;
  className?: string;
}
export const InteractiveText = ({
  children,
  className = ""
}: InteractiveTextProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const textRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!textRef.current) return;
      const spans = textRef.current.querySelectorAll("span");
      let closestIndex = null;
      let closestDistance = Infinity;
      spans.forEach((span, index) => {
        const rect = span.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2));
        if (distance < 50 && distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });
      setHoveredIndex(closestIndex);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  const characters = children.split("");
  return <div ref={textRef} className={`interactive-text cursor-target text-center ${className}`}>
      {characters.map((char, index) => <span key={index} style={{
      color: hoveredIndex === index ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
      transform: hoveredIndex === index ? "scale(1.3)" : hoveredIndex !== null && Math.abs(hoveredIndex - index) === 1 ? "scale(1.15)" : "scale(1)",
      transformOrigin: "center"
    }} className="inline-block transition-all duration-200 font-light">
          {char === " " ? "\u00A0" : char}
        </span>)}
    </div>;
};
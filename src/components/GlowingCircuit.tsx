
import { useRef, useEffect } from "react";

interface GlowingCircuitProps {
  className?: string;
}

const GlowingCircuit = ({ className = "" }: GlowingCircuitProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    
    // Circuit nodes
    const nodes: { x: number; y: number; connections: number[] }[] = [];
    const nodeCount = canvas.width < 768 ? 15 : 30;
    
    // Create random nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        connections: []
      });
    }
    
    // Create connections between nodes
    nodes.forEach((node, i) => {
      // Find 2-3 closest nodes to connect
      const distances = nodes.map((otherNode, j) => {
        if (i === j) return { index: j, distance: Infinity };
        const dx = node.x - otherNode.x;
        const dy = node.y - otherNode.y;
        return { index: j, distance: Math.sqrt(dx * dx + dy * dy) };
      });
      
      distances.sort((a, b) => a.distance - b.distance);
      const connections = Math.floor(Math.random() * 2) + 1; // 1-2 connections
      
      for (let j = 0; j < connections && j < distances.length; j++) {
        if (distances[j].distance < canvas.width / 3) {
          node.connections.push(distances[j].index);
        }
      }
    });
    
    // Animation variables
    let pulseOffsets: number[] = [];
    for (let i = 0; i < nodes.length; i++) {
      pulseOffsets.push(Math.random() * 2 * Math.PI);
    }
    
    // Animation loop
    let animationFrameId: number;
    const render = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections
      nodes.forEach((node, i) => {
        node.connections.forEach(connectionIndex => {
          const connectedNode = nodes[connectionIndex];
          
          // Calculate pulse animation
          const pulseTime = time / 1000;
          const pulse = Math.sin(pulseTime + pulseOffsets[i]) * 0.5 + 0.5;
          
          // Draw line with gradient
          const gradient = ctx.createLinearGradient(
            node.x, node.y, connectedNode.x, connectedNode.y
          );
          
          gradient.addColorStop(0, `rgba(0, 119, 255, ${0.1 + pulse * 0.2})`);
          gradient.addColorStop(0.5, `rgba(0, 255, 255, ${0.2 + pulse * 0.3})`);
          gradient.addColorStop(1, `rgba(0, 119, 255, ${0.1 + pulse * 0.2})`);
          
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(connectedNode.x, connectedNode.y);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1;
          ctx.stroke();
        });
      });
      
      // Draw nodes
      nodes.forEach((node, i) => {
        const pulseTime = time / 1000;
        const pulse = Math.sin(pulseTime + pulseOffsets[i]) * 0.5 + 0.5;
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2 + pulse * 2, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, 4 + pulse * 2
        );
        gradient.addColorStop(0, "rgba(0, 255, 255, 0.8)");
        gradient.addColorStop(1, "rgba(0, 119, 255, 0)");
        ctx.fillStyle = gradient;
        ctx.fill();
      });
      
      animationFrameId = requestAnimationFrame(render);
    };
    
    animationFrameId = requestAnimationFrame(render);
    
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className={`absolute inset-0 z-0 w-full h-full opacity-30 ${className}`}
    />
  );
};

export default GlowingCircuit;

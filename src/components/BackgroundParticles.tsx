
import { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useIsMobile } from "../hooks/use-mobile";

// Generate random points in a 3D space
function generateSpherePoints(count: number, radius: number) {
  const points = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    const r = radius * Math.cbrt(Math.random());
    
    points[i3] = r * Math.sin(phi) * Math.cos(theta);
    points[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    points[i3 + 2] = r * Math.cos(phi);
  }
  
  return points;
}

function ParticleField({ count = 1000, radius = 10 }) {
  const isMobile = useIsMobile();
  const pointsCount = isMobile ? Math.floor(count / 2) : count;
  
  const points = useRef<THREE.Points>(null);
  const [sphere] = useState(() => generateSpherePoints(pointsCount, radius));

  useFrame((state) => {
    if (!points.current) return;
    
    const time = state.clock.getElapsedTime() * 0.1;
    points.current.rotation.x = time * 0.05;
    points.current.rotation.y = time * 0.075;
  });

  return (
    <Points
      ref={points}
      positions={sphere}
      stride={3}
      frustumCulled={false}
    >
      <PointMaterial
        transparent
        color="#0077FF"
        size={0.06}
        sizeAttenuation={true}
        depthWrite={false}
        // Using NormalBlending instead of AdditiveBlending for compatibility
        blending={THREE.NormalBlending}
      />
    </Points>
  );
}

export default function BackgroundParticles() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  if (!mounted) return null;
  
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <ambientLight intensity={0.1} />
        <ParticleField count={2000} radius={12} />
      </Canvas>
    </div>
  );
}

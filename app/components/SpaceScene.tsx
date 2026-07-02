"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Sphere } from "@react-three/drei";
import * as THREE from "three";

function Jupiter() {
  const planetRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  // Track mouse movement globally so parallax works even when hovering UI elements
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((_, delta) => {
    // Slow, constant rotation of the planet
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.03;
    }

    // Smooth parallax effect reacting to the mouse
    if (groupRef.current) {
      const targetX = mouse.current.x * 0.25;
      const targetY = mouse.current.y * 0.25;

      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -targetY,
        0.05
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetX,
        0.05
      );
    }
  });

  return (
    <group ref={groupRef}>
      <Sphere ref={planetRef} args={[2.5, 64, 64]} position={[0, 0, 0]}>
        {/* High-end monochromatic material */}
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.7}
          metalness={0.1}
        />
      </Sphere>
    </group>
  );
}

export default function SpaceScene() {
  return (
    <div className="absolute inset-0 z-0 bg-black">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        {/* Subtle ambient light to keep shadows deep and rich */}
        <ambientLight intensity={0.02} />
        
        {/* Main cinematic key light creating a beautiful crescent phase */}
        <directionalLight position={[5, 3, 5]} intensity={2.5} color="#ffffff" />
        
        {/* Subtle deep-space blue rim light for depth */}
        <directionalLight position={[-5, -3, -5]} intensity={0.5} color="#1a2b4c" />

        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={0.5}
        />

        <Jupiter />
      </Canvas>
    </div>
  );
}
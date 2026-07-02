"use client";

import { useRef, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, useGLTF } from "@react-three/drei";
import * as THREE from "three";

// --- 1. NEW: RED FALLING STARS (METEOR SHOWER) ---
function RedFallingStars({ count = 15 }) {
  const groupRef = useRef<THREE.Group>(null);

  // Initialize random starting positions, speeds, and lengths for each meteor
  const starsData = useMemo(() => {
    return new Array(count).fill(0).map(() => ({
      x: THREE.MathUtils.randFloat(-100, 50),
      // Randomly spawn them very high up so they enter the screen at different times
      y: THREE.MathUtils.randFloat(20, 150), 
      z: THREE.MathUtils.randFloat(-40, -10), // Random depth behind/in front of Saturn
      speed: THREE.MathUtils.randFloat(30, 80), // Super fast movement
      scale: THREE.MathUtils.randFloat(3, 8), // Length of the meteor's tail
    }));
  }, [count]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    groupRef.current.children.forEach((child, i) => {
      const data = starsData[i];
      
      // Move diagonally (Down and Right)
      child.position.y -= data.speed * delta;
      child.position.x += data.speed * delta;

      // When the meteor goes off the bottom of the screen, reset it back to the top left
      if (child.position.y < -40) {
        child.position.y = THREE.MathUtils.randFloat(30, 150);
        child.position.x = THREE.MathUtils.randFloat(-120, 0); 
        data.speed = THREE.MathUtils.randFloat(30, 80);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {starsData.map((data, i) => (
        <mesh 
          key={i} 
          position={[data.x, data.y, data.z]} 
          // Rotate 45 degrees so the "head" points down and right matching the movement
          rotation={[0, 0, Math.PI / 4]} 
        >
          {/* A cylinder that acts as a streak of light: thin tail at the top, wider head at the bottom */}
          <cylinderGeometry args={[0.001, 0.05, data.scale, 8]} />
          
          {/* Vibrant Red color with Additive Blending so it fiercely glows in the dark */}
          <meshBasicMaterial 
            color="#ff1122" 
            transparent 
            opacity={0.8} 
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// --- 2. BACKGROUND SCENE (SATURN + STARS + FALLING STARS) ---
function Saturn() {
  const { scene } = useGLTF("/saturn.glb");
  const saturnRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (saturnRef.current) {
      saturnRef.current.rotation.y += delta * 0.05;
      saturnRef.current.rotation.z = 0.05;

      const scrollY = window.scrollY;
      const viewportH = window.innerHeight;
      const progress = Math.min(scrollY / viewportH, 1);
      
      const targetY = -25 + (progress * 25);
      
      saturnRef.current.position.y = THREE.MathUtils.lerp(
        saturnRef.current.position.y,
        targetY,
        0.05
      );
    }
  });

  return (
    <group ref={saturnRef} position={[0, -25, -10]}>
      <primitive object={scene} scale={8} />
    </group>
  );
}

export function BackgroundScene() {
  return (
    <div className="fixed inset-0 z-0 bg-black pointer-events-none overflow-hidden">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }} gl={{ antialias: true }}>
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#4b6584" />
        
        {/* Subtle background static stars */}
        <Stars radius={100} depth={50} count={6000} factor={4} fade speed={0.5} />
        
        {/* Our New Red Meteor Shower */}
        <RedFallingStars count={12} />

        <Suspense fallback={null}>
          <Saturn />
        </Suspense>
      </Canvas>
    </div>
  );
}

// --- 3. INLINE MOON CANVAS ---
function Moon() {
  const { scene } = useGLTF("/moon.glb");
  const moonRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (moonRef.current) {
      moonRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={moonRef}>
      <primitive object={scene} scale={1.65} />
    </group>
  );
}

export function MoonCanvas() {
  return (
    <div className="relative inline-flex items-center justify-center w-[0.95em] h-[0.95em] align-middle ml-[0.3em] mr-[0.01em] -mt-[0.06em]">
      <Canvas 
        camera={{ position: [0, 0, 6], fov: 40 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 3, 5]} intensity={3} color="#ffffff" />
        <directionalLight position={[-5, -3, -5]} intensity={1} color="#a0c0ff" />
        <Suspense fallback={null}>
          <Moon />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/saturn.glb");
useGLTF.preload("/moon.glb");
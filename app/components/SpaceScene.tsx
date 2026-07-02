"use client";

import { useRef, Suspense, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, useGLTF } from "@react-three/drei";
import * as THREE from "three";

// --- 1. RED FALLING STARS (METEOR SHOWER) ---
function RedFallingStars({ count = 15 }) {
  const groupRef = useRef<THREE.Group>(null);

  const starsData = useMemo(() => {
    return new Array(count).fill(0).map(() => ({
      x: THREE.MathUtils.randFloat(-100, 50),
      y: THREE.MathUtils.randFloat(20, 150), 
      z: THREE.MathUtils.randFloat(-40, -10),
      speed: THREE.MathUtils.randFloat(30, 80),
      scale: THREE.MathUtils.randFloat(3, 8),
    }));
  }, [count]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      const data = starsData[i];
      
      child.position.y -= data.speed * delta;
      child.position.x += data.speed * delta;

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
        <mesh key={i} position={[data.x, data.y, data.z]} rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.001, 0.05, data.scale, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

// --- 2. BACKGROUND SCENE ---
export function BackgroundScene() {
  return (
    <div className="fixed inset-0 z-0 bg-black pointer-events-none overflow-hidden">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }} gl={{ antialias: true }}>
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#4b6584" />
        <Stars radius={100} depth={50} count={6000} factor={4} fade speed={0.5} />
        <RedFallingStars count={12} />
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
      <primitive object={scene} scale={1.9} />
    </group>
  );
}

export function MoonCanvas() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="relative flex items-center justify-center w-[0.85em] h-[0.85em] ml-[0.25em] -mr-[0.04em]">
      
      {/* 
        NO MORE TEXTURED BACKGROUND! 
        Just the pure 3D canvas so we don't get that weird double-edge/halo effect.
      */}
      {isMounted && (
        <Canvas 
          className="absolute inset-0 z-10 rounded-full"
          style={{ background: 'transparent' }}
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
      )}
    </div>
  );
}

useGLTF.preload("/moon.glb");
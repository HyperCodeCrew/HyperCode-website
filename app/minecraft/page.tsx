'use client';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { useMemo } from 'react';
import { OrbitControls } from '@react-three/drei';
import SimplexNoise from 'simplex-noise';

export default function Home() {
  const size = 80; // Reduce size for performance

  // Generate 2D noise once
  const noiseData = useMemo(() => {
    const simplex = new SimplexNoise();
    const data: number[][] = [];

    for (let x = 0; x < size; x++) {
      data[x] = [];
      for (let z = 0; z < size; z++) {
        const nx = x / size - 0.5;
        const nz = z / size - 0.5;
        const value = simplex.noise2D(nx * 5, nz * 5); // frequency
        const normalized = (value + 1) / 2; // Normalize to [0,1]
        data[x][z] = normalized;
      }
    }

    return data;
  }, [size]);

  return (
    <div style={{ height: '100vh' }}>
      <Canvas camera={{ position: [size / 2, size / 2, size / 2], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        {noiseData.map((row, x) =>
          row.map((value, z) => (
            <Block
              key={`${x}-${z}`}
              position={[x - size / 2, Math.floor(value * 8), z - size / 2]}
              color={getColor(value)}
            />
          ))
        )}
        <OrbitControls />
      </Canvas>
    </div>
  );
}

function getColor(value: number): string {
  if (value < 0.3) return '#1e90ff'; // Water
  if (value < 0.45) return '#f4e2d8'; // Sand
  if (value < 0.7) return '#228B22'; // Grass
  if (value < 0.85) return '#8B4513'; // Dirt
  return '#ffffff'; // Snow
}

function Block({
  position,
  color,
}: {
  position: [number, number, number];
  color: string;
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Line, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo, useRef, useState } from 'react';

function rotate4D([x, y, z, w]: number[], angle: number) {
  const sin = Math.sin(angle);
  const cos = Math.cos(angle);

  const x1 = x * cos - w * sin;
  const w1 = x * sin + w * cos;

  const y1 = y * cos - z * sin;
  const z1 = y * sin + z * cos;

  return [x1, y1, z1, w1];
}

function Tesseract() {
  const [angle, setAngle] = useState(0);
  const groupRef = useRef<THREE.Group>(null);

  const baseVertices = useMemo(() => {
    const points = [];
    for (let i = 0; i < 16; i++) {
      const x = (i & 1) ? 1 : -1;
      const y = (i & 2) ? 1 : -1;
      const z = (i & 4) ? 1 : -1;
      const w = (i & 8) ? 1 : -1;
      points.push([x, y, z, w]);
    }
    return points;
  }, []);

  const projectedRef = useRef<THREE.Vector3[]>([]);
  const linesRef = useRef<[THREE.Vector3, THREE.Vector3][]>([]);

  useFrame((state, delta) => {
    const newAngle = angle + delta;
    setAngle(newAngle);

    const rotated = baseVertices.map(v => rotate4D(v, newAngle));
    const projected = rotated.map(([x, y, z, w]) => {
      const wScale = 1 / (3 - w);
      return new THREE.Vector3(x * wScale, y * wScale, z * wScale);
    });

    projectedRef.current = projected;

    const newLines: [THREE.Vector3, THREE.Vector3][] = [];
    for (let i = 0; i < 16; i++) {
      for (let j = i + 1; j < 16; j++) {
        const diff = i ^ j;
        if (diff && !(diff & (diff - 1))) {
          newLines.push([projected[i], projected[j]]);
        }
      }
    }

    linesRef.current = newLines;
  });

  return (
    <group ref={groupRef}>
      {linesRef.current.map(([start, end], index) => (
        <Line key={index} points={[start, end]} color="hotpink" lineWidth={1} />
      ))}
    </group>
  );
}

export default function CubeScene() {
  return (
    <Canvas 
      style={{ height: '100vh', width: '100vw' }} 
      camera={{ position: [5, 5, 5], fov: 60 }}
    >
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Tesseract />
      <OrbitControls />
    </Canvas>
  );
}

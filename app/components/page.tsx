'use client';

import dynamic from 'next/dynamic';

const CubeScene = dynamic(() => import('./CubeScene'), { ssr: false });

export default function CubeSceneWrapper() {
  return <CubeScene />;
}

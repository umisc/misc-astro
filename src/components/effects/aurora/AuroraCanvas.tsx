import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { createAuroraMaterial, type AuroraMaterial } from './auroraShader';

interface Props {
  amplitude?: number;
  speed?: number;
  colorStops?: string[];
  colorStops2?: string[];
}

type CssPalette = { canvas: string; aurora: string[] };

function readCssPalette(): CssPalette {
  const styles = getComputedStyle(document.documentElement);
  const read = (property: string) => {
    const value = styles.getPropertyValue(property).trim();
    if (!value) throw new Error(`Missing required brand token: ${property}`);
    return value;
  };

  return {
    canvas: read('--canvas'),
    aurora: [
      read('--aurora-teal'),
      read('--aurora-blue'),
      read('--aurora-violet'),
    ],
  };
}

function AuroraMesh({
  amplitude,
  speed,
  colorStops,
  colorStops2,
  onFirstFrame,
}: Required<Props> & { onFirstFrame: () => void }) {
  const materialRef = useRef<AuroraMaterial>(null);
  const hasRendered = useRef(false);
  const geometry = useMemo(() => {
    const value = new THREE.BufferGeometry();
    value.setAttribute(
      'position',
      new THREE.BufferAttribute(
        new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]),
        3,
      ),
    );
    value.setAttribute(
      'uv',
      new THREE.BufferAttribute(new Float32Array([0, 0, 2, 0, 0, 2]), 2),
    );
    return value;
  }, []);
  const material = useMemo(
    () => createAuroraMaterial(colorStops, colorStops2),
    [colorStops, colorStops2],
  );

  useFrame((state) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime * speed;
    if (!hasRendered.current) {
      hasRendered.current = true;
      onFirstFrame();
    }
    materialRef.current.uniforms.uAmplitude.value =
      state.size.width < 768 ? amplitude * 1.8 : amplitude;
  });

  return (
    <mesh frustumCulled={false} geometry={geometry}>
      <primitive ref={materialRef} object={material} attach="material" />
    </mesh>
  );
}

export function AuroraCanvas({
  amplitude = 1,
  speed = 1.5,
  colorStops,
  colorStops2,
}: Props) {
  const [ready, setReady] = useState(false);
  const [cssPalette, setCssPalette] = useState<CssPalette | null>(null);

  return (
    <Canvas
      className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${ready ? 'opacity-100' : 'opacity-0'}`}
      orthographic
      dpr={0.1}
      camera={{ position: [0, 0, 1], near: 0.1, far: 10, zoom: 1 }}
      gl={{
        alpha: false,
        antialias: false,
        powerPreference: 'high-performance',
      }}
      onCreated={({ gl }) => {
        const palette = readCssPalette();
        gl.setClearColor(palette.canvas, 1);
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.NoToneMapping;
        setCssPalette(palette);
      }}
    >
      {cssPalette && (
        <AuroraMesh
          amplitude={amplitude}
          speed={speed}
          colorStops={colorStops ?? cssPalette.aurora}
          colorStops2={colorStops2 ?? cssPalette.aurora}
          onFirstFrame={() => setReady(true)}
        />
      )}
    </Canvas>
  );
}

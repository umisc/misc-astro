import { HandPointingIcon } from '@phosphor-icons/react';
import {
  Center,
  OrthographicCamera,
  Environment,
  Html,
  Lightformer,
  OrbitControls,
  useGLTF,
} from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Component, Suspense, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import * as THREE from 'three';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

const SWAY = Math.PI / 10;

// The model's swept envelope at the maximum combined camera/model yaw (±63°).
// Keep HEAD_SCALE as the single tuning point: 1 is a tangent fit, values below
// 1 add a small antialiasing buffer without changing the view's aspect ratio.
const HEAD_WIDTH = 4.35;
const HEAD_HEIGHT = 4.636;
const HEAD_SCALE = 0.995;

function HeadCamera() {
  const camera = useRef<THREE.OrthographicCamera>(null);
  const { size } = useThree();

  useFrame(() => {
    if (!camera.current) return;
    const zoom =
      HEAD_SCALE * Math.min(size.width / HEAD_WIDTH, size.height / HEAD_HEIGHT);
    if (camera.current.zoom !== zoom) {
      camera.current.zoom = zoom;
      camera.current.updateProjectionMatrix();
    }
  });

  return (
    <OrthographicCamera
      ref={camera}
      makeDefault
      position={[0, 0, 10]}
      near={0.1}
      far={2000}
    />
  );
}

function HeadModel({
  interacted,
  dragging,
  reducedMotion,
  onReady,
}: {
  interacted: boolean;
  dragging: boolean;
  reducedMotion: boolean;
  onReady: () => void;
}) {
  const { scene } = useGLTF('/home/misc-head.glb');
  const group = useRef<THREE.Group>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const fitFrames = useRef(0);
  const swayWake = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { invalidate } = useThree();

  useFrame((state) => {
    const fitting = fitFrames.current < 4;
    if (fitting) {
      fitFrames.current += 1;
      if (fitFrames.current === 4) onReady();
      invalidate();
    }
    if (!group.current) return;
    const phase = state.clock.elapsedTime % 10;
    const idle = !interacted && !dragging;
    const swayActive = idle && !reducedMotion && phase > 5 && phase < 10;
    const settling =
      !reducedMotion && Math.abs(group.current.rotation.y) > 0.001;
    const showCursor = !reducedMotion && idle && phase > 5 && phase < 10;
    if (cursor.current) cursor.current.style.opacity = showCursor ? '1' : '0';
    const target = swayActive
      ? Math.sin(((phase - 5) / 5) * Math.PI * 2) * SWAY
      : 0;
    if (reducedMotion) {
      group.current.rotation.y = 0;
    } else {
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        target,
        0.1,
      );
    }

    if (!idle || reducedMotion) {
      if (swayWake.current) {
        clearTimeout(swayWake.current);
        swayWake.current = null;
      }
    }
    if (fitting || dragging || swayActive || settling) {
      invalidate();
    } else if (idle && !reducedMotion && !swayWake.current) {
      swayWake.current = setTimeout(
        () => {
          swayWake.current = null;
          invalidate();
        },
        (5 - phase) * 1000,
      );
    }
  });

  return (
    <group ref={group}>
      <Center>
        <primitive object={scene} />
      </Center>
      <Html
        ref={cursor}
        center
        position={[0, 0, 1]}
        style={{
          opacity: 0,
          transition: 'opacity 0.4s ease-in-out',
          pointerEvents: 'none',
        }}
      >
        <HandPointingIcon
          weight="duotone"
          size={26}
          color="white"
          aria-hidden="true"
          className="drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]"
        />
      </Html>
    </group>
  );
}

class WebGLErrorBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  override state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  override componentDidCatch() {
    this.props.onError();
  }
  override render() {
    return this.state.failed ? null : this.props.children;
  }
}

function Lighting() {
  return (
    <Environment resolution={256} background={false}>
      <Lightformer
        intensity={8}
        color="#c5e4ff"
        scale={[9, 9, 8]}
        position={[0, -4.5, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <Lightformer
        intensity={10}
        color="#e9e6ff"
        scale={[9, 20, 8]}
        position={[0, 10, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </Environment>
  );
}

type FallbackImage = {
  src: string;
  srcSet?: string;
  sizes?: string;
  width?: number;
  height?: number;
};

export default function MiscHead({
  fallbackImage,
}: {
  fallbackImage: FallbackImage;
}) {
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const [modelReady, setModelReady] = useState(false);
  const cursor = dragging ? 'grabbing' : hovered ? 'grab' : 'default';

  return (
    <div
      className="absolute inset-0"
      style={{ cursor, touchAction: 'pan-y' }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => {
        setHovered(false);
        setDragging(false);
      }}
    >
      <img
        src={fallbackImage.src}
        srcSet={fallbackImage.srcSet}
        sizes={fallbackImage.sizes}
        alt="3D MISC head"
        width={fallbackImage.width}
        height={fallbackImage.height}
        fetchPriority="high"
        decoding="async"
        className={`absolute inset-0 size-full object-contain transition-opacity duration-500 motion-reduce:transition-none ${modelReady ? 'opacity-0' : 'opacity-100'}`}
      />
      <WebGLErrorBoundary onError={() => setModelReady(false)}>
        <Canvas
          frameloop="demand"
          className={`absolute inset-0 transition-opacity duration-500 motion-reduce:transition-none ${modelReady ? 'opacity-100' : 'opacity-0'}`}
          camera={{ fov: 30, near: 0.1, far: 2000 }}
          gl={{ alpha: true, antialias: true }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 2.3;
            gl.outputColorSpace = THREE.SRGBColorSpace;
          }}
        >
          <HeadCamera />
          <Lighting />
          <Suspense fallback={null}>
            <HeadModel
              interacted={interacted}
              dragging={dragging}
              reducedMotion={reducedMotion}
              onReady={() => setModelReady(true)}
            />
          </Suspense>
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minAzimuthAngle={-Math.PI / 3}
            maxAzimuthAngle={Math.PI / 3}
            onStart={() => {
              setDragging(true);
              setInteracted(true);
            }}
            onEnd={() => setDragging(false)}
          />
        </Canvas>
        {reducedMotion && !interacted && (
          <div
            className="pointer-events-none absolute inset-0 z-10 grid place-items-center"
            aria-hidden="true"
          >
            <HandPointingIcon
              weight="duotone"
              size={26}
              color="white"
              className="drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]"
            />
          </div>
        )}
      </WebGLErrorBoundary>
    </div>
  );
}

useGLTF.preload('/home/misc-head.glb');

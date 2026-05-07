import { Suspense, useRef } from "react";
import { Canvas, useFrame, type ThreeElements } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import * as THREE from "three";

function Candle({ waxColor = "#3a2820" }: { waxColor?: string }) {
  const flame = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const flick = Math.sin(t * 14) * 0.04 + Math.sin(t * 7.3) * 0.05 + (Math.random() - 0.5) * 0.03;
    if (flame.current) {
      flame.current.scale.set(1 + flick, 1.25 + flick * 1.6, 1 + flick);
      flame.current.position.x = Math.sin(t * 3) * 0.02;
    }
    if (halo.current) {
      const s = 1 + Math.sin(t * 6) * 0.08 + flick;
      halo.current.scale.set(s, s, s);
      const m = halo.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.35 + Math.sin(t * 9) * 0.08;
    }
    if (light.current) {
      light.current.intensity = 8 + Math.sin(t * 11) * 1.4 + flick * 4;
    }
  });

  return (
    <group position={[0, -0.4, 0]}>
      {/* Plate */}
      <mesh position={[0, -1.1, 0]} receiveShadow>
        <cylinderGeometry args={[1.05, 1.15, 0.06, 64]} />
        <meshStandardMaterial color="#0f0b08" metalness={0.6} roughness={0.35} />
      </mesh>

      {/* Wax pillar */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.78, 0.82, 1.9, 64]} />
        <meshPhysicalMaterial
          color={waxColor}
          roughness={0.55}
          metalness={0.05}
          sheen={1}
          sheenColor={"#ffb46b"}
          clearcoat={0.2}
          transmission={0.05}
        />
      </mesh>

      {/* Top wax dip */}
      <mesh position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.78, 0.78, 0.03, 64]} />
        <meshStandardMaterial color={waxColor} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.93, 0]}>
        <cylinderGeometry args={[0.62, 0.7, 0.04, 64]} />
        <meshStandardMaterial color={"#1a120c"} roughness={0.9} />
      </mesh>

      {/* Wick */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.12, 16]} />
        <meshStandardMaterial color={"#1a1a1a"} />
      </mesh>

      {/* Flame */}
      <mesh ref={flame} position={[0, 1.2, 0]}>
        <coneGeometry args={[0.08, 0.28, 24]} />
        <meshBasicMaterial color={"#ffb46b"} transparent opacity={0.95} toneMapped={false} />
      </mesh>
      <mesh position={[0, 1.18, 0]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color={"#fff7d6"} toneMapped={false} />
      </mesh>

      {/* Halo */}
      <mesh ref={halo} position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.35, 24, 24]} />
        <meshBasicMaterial color={"#ff8a3d"} transparent opacity={0.35} toneMapped={false} depthWrite={false} />
      </mesh>

      {/* Warm flame light */}
      <pointLight ref={light} position={[0, 1.3, 0]} color={"#ff9a55"} intensity={9} distance={6} decay={2} />
    </group>
  );
}

function ParallaxRig({ children }: { children: React.ReactNode }) {
  const group = useRef<ThreeElements["group"]>(null!);
  useFrame(({ pointer }) => {
    if (!group.current) return;
    // @ts-ignore
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, pointer.x * 0.35, 0.06);
    // @ts-ignore
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -pointer.y * 0.18, 0.06);
  });
  // @ts-ignore
  return <group ref={group}>{children}</group>;
}

export function HeroCandle({ waxColor }: { waxColor?: string }) {
  return (
    <Canvas
      camera={{ position: [0, 0.4, 4.2], fov: 38 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.25} color={"#ffb88a"} />
        <directionalLight position={[3, 4, 2]} intensity={0.4} color={"#ffd2a6"} />
        <ParallaxRig>
          <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
            <Candle waxColor={waxColor} />
          </Float>
        </ParallaxRig>
        <Environment preset="sunset" />
      </Suspense>
    </Canvas>
  );
}

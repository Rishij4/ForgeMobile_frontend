import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  RoundedBox,
  Environment
} from "@react-three/drei";

/* =========================
   PHONE MODEL
========================= */

const PhoneModel = ({ config }) => {
  return (
    <group rotation={[0.2, -0.5, 0]}>

      {/* PHONE BODY */}

      <RoundedBox
        args={[2.2, 4.5, 0.08]}
        radius={0.15}
        smoothness={4}
      >
        <meshStandardMaterial
          color="#111827"
          metalness={0.8}
          roughness={0.3}
        />
      </RoundedBox>

      {/* SCREEN */}

      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[1.95, 4.15]} />
        <meshStandardMaterial
          color="#4f46e5"
          metalness={0.4}
          roughness={0.2}
          emissive="#312e81"
        />
      </mesh>

      {/* SPEAKER CUTOUT */}

      <mesh position={[0, 2, 0.06]}>
        <boxGeometry args={[0.4, 0.05, 0.01]} />
        <meshStandardMaterial color="black" />
      </mesh>

      {/* CAMERA MODULE */}

      {config?.camera && (
        <>
          {/* Camera base */}

          <mesh position={[-0.55, 1.45, -0.06]}>
            <boxGeometry args={[0.7, 0.7, 0.04]} />
            <meshStandardMaterial color="#111111" />
          </mesh>

          {/* Lens 1 */}

          <mesh position={[-0.72, 1.55, -0.08]}>
            <cylinderGeometry args={[0.09, 0.09, 0.03, 32]} />
            <meshStandardMaterial color="black" />
          </mesh>

          {/* Lens 2 */}

          <mesh position={[-0.4, 1.55, -0.08]}>
            <cylinderGeometry args={[0.09, 0.09, 0.03, 32]} />
            <meshStandardMaterial color="black" />
          </mesh>

          {/* Lens 3 */}

          <mesh position={[-0.55, 1.25, -0.08]}>
            <cylinderGeometry args={[0.09, 0.09, 0.03, 32]} />
            <meshStandardMaterial color="black" />
          </mesh>
        </>
      )}

      {/* PROCESSOR CHIP */}

      {config?.processor && (
        <mesh position={[0, 0.8, 0]}>
          <boxGeometry args={[0.55, 0.55, 0.04]} />
          <meshStandardMaterial
            color="#3b82f6"
            emissive="#2563eb"
          />
        </mesh>
      )}

      {/* BATTERY */}

      {config?.battery && (
        <mesh position={[0, -0.9, 0]}>
          <boxGeometry args={[1.2, 1.5, 0.04]} />
          <meshStandardMaterial
            color="#22c55e"
            emissive="#166534"
          />
        </mesh>
      )}

      {/* SIDE BUTTONS */}

      <mesh position={[1.12, 0.7, 0]}>
        <boxGeometry args={[0.03, 0.4, 0.03]} />
        <meshStandardMaterial color="#374151" />
      </mesh>

      <mesh position={[1.12, 0, 0]}>
        <boxGeometry args={[0.03, 0.25, 0.03]} />
        <meshStandardMaterial color="#374151" />
      </mesh>

      {/* CHARGING PORT */}

      <mesh position={[0, -2.25, 0]}>
        <boxGeometry args={[0.35, 0.03, 0.02]} />
        <meshStandardMaterial color="black" />
      </mesh>

    </group>
  );
};

/* =========================
   MAIN CANVAS
========================= */

const Phone3D = ({ config }) => {
  return (
    <div className="w-full h-[600px] rounded-3xl overflow-hidden">

      <Canvas camera={{ position: [0, 0, 6] }}>

        {/* LIGHTING */}

        <ambientLight intensity={1.2} />

        <directionalLight
          position={[2, 2, 2]}
          intensity={2}
        />

        <pointLight
          position={[0, 4, 2]}
          intensity={2}
        />

        {/* ENVIRONMENT */}

        <Environment preset="city" />

        {/* PHONE MODEL */}

        <PhoneModel config={config} />

        {/* CONTROLS */}

        <OrbitControls
          enableZoom={true}
          autoRotate={false}
        />

      </Canvas>

    </div>
  );
};

export default Phone3D;
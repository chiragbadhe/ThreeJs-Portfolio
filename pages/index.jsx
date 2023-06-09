/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Robot from "@/components/Robot";
import Character from "@/components/Character";
import BaseModel from "@/components/BaseModel";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Chirag Badhe</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="globe">
        <Canvas
          className="bg-blue-500"
          shadows
          dpr={[1, 2]}
          camera={{ position: [2, 0.7, 3.5], fov: 50 }}
        >
          <ambientLight intensity={0.7} />
          <spotLight
            intensity={0.4}
            angle={10}
            penumbra={1}
            position={[2, 5, 5]}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-bias={-0.0001}
          />
          <Suspense fallback={null}>
            <BaseModel receiveShadow />
            <Character receiveShadow />
            <Robot castShadow receiveShadow />
          </Suspense>
          <OrbitControls
            false
            minDistance={1}
            maxDistance={5}
            maxPolarAngle={Math.PI / 2 - 0.05} // set the minimum angle to 45 degrees
            minPolarAngle={Math.PI / 4}
            enablePan={false}
            // enableDamping={true}
          />
        </Canvas>
      </div>
    </div>
  );
}

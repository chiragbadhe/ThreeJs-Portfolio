/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import { useAnimations } from "@react-three/drei";
import { useDrag } from "react-use-gesture";
import Robot from "@/components/Robot";

const useKeyPress = (targetKey) => {
  const [keyPressed, setKeyPressed] = useState(false);

  const downHandler = ({ key }) => {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  };

  const upHandler = ({ key }) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [downHandler, upHandler]);

  return keyPressed;
};

const ModelHouse = () => {
  const gltf = useLoader(GLTFLoader, "/models/city.glb");

  return (
    <>
      <primitive object={gltf.scene} scale={0.09} position={[0, -0.09, 0]} />
    </>
  );
};

const Soldier = () => {
  const gltf = useLoader(GLTFLoader, "/models/soldier.glb");
  const soldierRef = useRef();
  const { actions, mixer } = useAnimations(gltf.animations, soldierRef);
  const [moving, setMoving] = useState(false);
  const [turningLeft, setTurningLeft] = useState(false);
  const [turningRight, setTurningRight] = useState(false);
  const [TurningBack, setTurningBack] = useState(null);

  const forestWalk = new Audio("/sounds/forest-walk.mp3");

  const handleKeyDown = (event) => {
    switch (event.code) {
      case "ArrowUp":
        actions["Run"].play();
        setMoving(true);
        // forestWalk.play(); // pause the forestWalk sound
        break;
      case "ArrowLeft":
        actions["Walk"].play();
        // forestWalk.play();
        setTurningLeft(true);
        break;
      case "ArrowRight":
        actions["Walk"].play();
        forestWalk.play();
        setTurningRight(true);
        break;
      case "ArrowDown":
        actions["Walk"].play();
        // forestWalk.play();
        setTurningBack(true);
        break;
      default:
        break;
    }
  };

  const handleKeyUp = (event) => {
    switch (event.code) {
      case "ArrowUp":
        actions["Run"].stop();
        actions["Idle"].play();
        forestWalk.pause(); // pause the forestWalk sound
        setMoving(false);
        break;

      case "ArrowLeft":
        actions["Walk"].stop();
        setTurningLeft(false);
        break;
      case "ArrowRight":
        actions["Walk"].stop();
        setTurningRight(false);
        break;
      case "ArrowDown":
        actions["Idle"].play();
        setTurningBack(false);
        setMoving(false);
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useFrame((state, delta) => {
    const speed = 1;
    const forward = new THREE.Vector3(0, 0, -1);
    const direction = new THREE.Vector3();
    const angle = soldierRef.current.rotation.y;
    direction.copy(forward).applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
    direction.multiplyScalar(speed * delta);

    if (turningLeft) {
      soldierRef.current.rotation.y += delta * 3;
    }
    if (turningRight) {
      soldierRef.current.rotation.y -= delta * 3;
    }

    if (moving) {
      const newPos = soldierRef.current.position.clone().add(direction);
      // Check if the new position is within the boundaries
      if (newPos.x < -5 || newPos.x > 5 || newPos.z < -5 || newPos.z > 5) {
        setMoving(false);
      } else {
        soldierRef.current.position.copy(newPos);
      }
    }

    mixer.update(delta);

    // Define camera offset vector
    const cameraOffset = new THREE.Vector3(0.3, 0.4, 1);
    // Rotate camera offset vector to match soldier's rotation
    cameraOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
    // Calculate camera position
    const cameraPosition = soldierRef.current.position
      .clone()
      .add(cameraOffset);
    state.camera.position.copy(cameraPosition);
    state.camera.lookAt(soldierRef.current.position);
  });

  return (
    <primitive
      object={gltf.scene}
      scale={0.17}
      ref={soldierRef}
      position={[1, -0.09, -4]}
      castShadow
      receiveShadow
    />
  );
};

export default function Home() {
  const groundRef = useRef();

  return (
    <div>
      <Head>
        <title>CB - Portfolio</title>
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
          <spotLight intensity={0.4} angle={10} penumbra={1} />

          <Suspense fallback={null}>
            <ModelHouse />
            <Soldier />
            <ambientLight intensity={0.7}>
              <Robot />{" "}
            </ambientLight>
          </Suspense>
          <OrbitControls
            false
            minDistance={1} // set the minimum distance to 2 units
            maxDistance={5} // set the maximum distance to 5 units
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

import React, { useEffect, useRef } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { useAnimations } from "@react-three/drei";


const Robot = () => {
  const gltf = useLoader(GLTFLoader, "/models/robot.glb");
  const robotRef = useRef();

  const { actions, mixer } = useAnimations(gltf.animations, robotRef);

  useEffect(() => {
    actions["Wave"].play();
  }, []);

  return (
    <>
      <primitive
        ref={robotRef}
        object={gltf.scene}
        scale={0.03}
        position={[0, -0.09, 0]}
      />
    </>
  );
};

export default Robot;

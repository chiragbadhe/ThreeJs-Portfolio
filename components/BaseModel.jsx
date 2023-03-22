import React, { useEffect, useRef } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { useAnimations } from "@react-three/drei";

const BaseModel = () => {
  const gltf = useLoader(GLTFLoader, "/models/basemodel.glb");

  return (
    <>
      <primitive object={gltf.scene} scale={0.09} position={[0, -0.09, 0]} />
    </>
  );
};
export default BaseModel;

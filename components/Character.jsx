/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import { useAnimations } from "@react-three/drei";

const Character = () => {
  const gltf = useLoader(GLTFLoader, "/models/character.glb");
  const characterRef = useRef();
  const { actions, mixer } = useAnimations(gltf.animations, characterRef);
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
    const angle = characterRef.current.rotation.y;
    direction.copy(forward).applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
    direction.multiplyScalar(speed * delta);

    if (turningLeft) {
      characterRef.current.rotation.y += delta * 3;
    }
    if (turningRight) {
      characterRef.current.rotation.y -= delta * 3;
    }
    if (moving) {
      const newPos = characterRef.current.position.clone().add(direction);
      // Check if the new position is within the boundaries
      if (newPos.x < -5 || newPos.x > 5 || newPos.z < -5 || newPos.z > 5) {
        setMoving(false);
      } else {
        characterRef.current.position.copy(newPos);
      }
    }

    if (TurningBack) {
      characterRef.current.rotation.y += delta / 4;
      const back = new THREE.Vector3(0, 0, 1);
      const backDirection = new THREE.Vector3();
      const backAngle = characterRef.current.rotation.y;
      backDirection
        .copy(back)
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), backAngle);
      backDirection.multiplyScalar(speed * delta);
      const newBackPos = characterRef.current.position
        .clone()
        .add(backDirection);
      // Check if the new position is within the boundaries
      if (
        newBackPos.x < -5 ||
        newBackPos.x > 5 ||
        newBackPos.z < -5 ||
        newBackPos.z > 5
      ) {
        setTurningBack(false);
      } else {
        characterRef.current.position.copy(newBackPos);
      }
    }

    mixer.update(delta);

    // Define camera offset vector
    const cameraOffset = new THREE.Vector3(0.3, 0.4, 1);
    // Rotate camera offset vector to match character's rotation
    cameraOffset.applyAxisAngle(new THREE.Vector3(0, 1.1, 0), angle);
    // Calculate camera position
    const cameraPosition = characterRef.current.position
      .clone()
      .add(cameraOffset);
    state.camera.position.copy(cameraPosition);
    state.camera.lookAt(characterRef.current.position);
  });

  return (
    <primitive
      object={gltf.scene}
      scale={0.17}
      ref={characterRef}
      position={[2, -0.09, -4]}
      castShadow
      receiveShadow
    />
  );
};

export default Character;

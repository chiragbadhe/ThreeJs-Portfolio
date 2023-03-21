import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import Joystick from "react-joystick";

const SoldierControls = ({ setMoving, setTurningLeft, setTurningRight }) => {
  const [joystick, setJoystick] = useState({ x: 0, y: 0 });

  const handleJoystickMove = (event, data) => {
    setJoystick({ x: data.x, y: data.y });
  };

  useFrame((state, delta) => {
    const speed = 1;
    const forward = new THREE.Vector3(0, 0, -1);
    const direction = new THREE.Vector3();
    const angle = soldierRef.current.rotation.y;
    direction.copy(forward).applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
    direction.multiplyScalar(speed * delta);

    if (joystick.y > 0.2) {
      actions["Run"].play();
      setMoving(true);
    } else {
      actions["Run"].stop();
      actions["Idle"].play();
      setMoving(false);
    }

    if (joystick.x > 0.2) {
      actions["Walk"].play();
      setTurningRight(true);
    } else if (joystick.x < -0.2) {
      actions["Walk"].play();
      setTurningLeft(true);
    } else {
      actions["Walk"].stop();
      setTurningLeft(false);
      setTurningRight(false);
    }

    const newPos = soldierRef.current.position
      .clone()
      .add(direction.multiplyScalar(joystick.y * delta));
    // Check if the new position is within the boundaries
    if (newPos.x < -5 || newPos.x > 5 || newPos.z < -5 || newPos.z > 5) {
      setMoving(false);
    } else {
      soldierRef.current.position.copy(newPos);
    }

    if (joystick.x > 0.2) {
      soldierRef.current.rotation.y -= delta * 3;
    } else if (joystick.x < -0.2) {
      soldierRef.current.rotation.y += delta * 3;
    }

    mixer.update(delta);

    const cameraOffset = new THREE.Vector3(0.4, 0.7, 1);
    const cameraPosition = soldierRef.current.position
      .clone()
      .add(cameraOffset);
    state.camera.position.copy(cameraPosition);
    state.camera.lookAt(soldierRef.current.position);
  });

  return (
    <Joystick
      size={100}
      baseColor="#333"
      stickColor="#ffc107"
      move={handleJoystickMove}
    />
  );
};

import * as THREE from "three";
import React, { useRef, useState } from "react";
import Joystick from "react-joystick";
import { useFrame } from "@react-three/fiber";

const SoldierControls = () => {
  const [joystick, setJoystick] = useState({ x: 0, y: 0 });

  const handleJoystickMove = (event, data) => {
    setJoystick({ x: data.x, y: data.y });
  };

  return (
    <div>
      {" "}
      <Joystick
        size={100}
        baseColor="#333"
        stickColor="#ffc107"
        move={handleJoystickMove}
      />
    </div>
  );
};

export default SoldierControls;

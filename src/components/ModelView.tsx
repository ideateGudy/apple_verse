import { OrbitControls, PerspectiveCamera, View } from "@react-three/drei";
import { Suspense, type RefObject } from "react";
import * as THREE from "three";
import Lights from "./Lights";
import IPhone from "./IPhone";
import Loader from "./Loader";

interface ModelItem {
  title: string;
  color: string[];
  img: string;
}

interface ModelViewProps {
  index: number;
  groupRef: RefObject<THREE.Group | null>;
  gsapType: string;
  controlRef: RefObject<any>;
  setRotationState: (rotation: number) => void;
  item: ModelItem;
}

const ModelView = ({
  index,
  groupRef,
  gsapType,
  controlRef,
  setRotationState,
  item,
}: ModelViewProps) => {
  return (
    <View
      index={index}
      id={gsapType}
      className={`w-full h-full absolute ${
        index === 2 ? "-right-full" : ""
      }`}
    >
      {/* Ambient Light */}
      <ambientLight intensity={0.3} />

      <PerspectiveCamera makeDefault position={[0, 0, 4]} />

      <Lights />

      <OrbitControls
      makeDefault
      ref={controlRef}
      enableZoom={false}
      enablePan={false}
      rotateSpeed={0.4}
      target={new THREE.Vector3(0, 0, 0)} // x, y, z center of the model
      onEnd={() => setRotationState(controlRef.current.getAzimuthalAngle())}
      />

      <group
        ref={groupRef}
        name={`${index === 1 ? "small" : "large"}`}
        position={[0, 0, 0]}
      >
        <Suspense
          fallback={
            <Loader />
          }
        >
          <IPhone
          scale={index === 1 ? [15, 15, 15] : [18, 18, 18]}
          item={item}
          />
        </Suspense>
      </group>
    </View>
  );
};

export default ModelView;

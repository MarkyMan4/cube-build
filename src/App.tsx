import { Canvas, ThreeEvent, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { useEffect, useState } from 'react';

interface IPosition {
  x: number
  y: number
  z: number
}

function Box({x, y, z, clickCallback}: {x: number, y: number, z: number, clickCallback: (ev: ThreeEvent<PointerEvent>) => void}) {
  return (
    <mesh onPointerDown={ clickCallback } position={[x, y, z]}>
      <boxGeometry attach="geometry" args={[1, 1, 1]} />
      <meshMatcapMaterial attach="material" color="dodgerblue" />
    </mesh>
  );
}

function App() {
  const [boxes, setBoxes] = useState<Array<IPosition>>([]);

  useEffect(() => {
    setBoxes([{x: 0, y: 0, z: 0}]);
  }, []);

  const handleCubeFaceClicked = (ev: ThreeEvent<PointerEvent>) => {
    ev.stopPropagation();

    // left click adds cube, right click removes cube
    if(ev.button === 0) {
      let normal = ev.face!.normal;
      let pos = ev.eventObject.position;
      let newPos: IPosition = {
        x: normal.x + pos.x,
        y: normal.y + pos.y,
        z: normal.z + pos.z,
      };

      setBoxes(prevBoxes => [...prevBoxes, newPos]);
    }
    else if(ev.button === 2) {
      let pos = ev.eventObject.position;
      console.log(boxes.filter((b) => b.x !== pos.x || b.y !== pos.y || b.z !== pos.z))
      setBoxes(prevBoxes => prevBoxes.filter((b) => b.x !== pos.x || b.y !== pos.y || b.z !== pos.z));
    }
  }

  return (
    <Canvas >
      <OrbitControls />
      <Stars />
      <ambientLight intensity={1} color={0xffffff} />
      <directionalLight position={[100, 200, 150]} color={0xffffff} />
      { boxes.map((b, i) => <Box key={i} x={b.x} y={b.y} z={b.z} clickCallback={ handleCubeFaceClicked } />) }
    </Canvas>
  );
}

export default App

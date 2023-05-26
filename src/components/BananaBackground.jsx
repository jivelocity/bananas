import * as THREE from 'three';
import {Suspense, useRef, useState} from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import {  EffectComposer, DepthOfField } from '@react-three/postprocessing';



function Banana({z}){
    const ref = useRef()
    const { nodes, materials } = useGLTF('/banana-transformed.glb')
  
    const {viewport, camera}  = useThree()
    const {width , height} = viewport.getCurrentViewport(camera, [0,0,z])
  
    const [data] = useState({
      x:THREE.MathUtils.randFloatSpread(2), 
      y:THREE.MathUtils.randFloatSpread(height),
      rY: Math.random() * Math.PI,
      rX: Math.random() * Math.PI,
      rZ: Math.random() * Math.PI,
    }) 
  
    useFrame((state)=>{
      ref.current.rotation.set((data.rX += 0.001),(data.rY += 0.004),(data.rZ += 0.001 ))
      ref.current.position.set(data.x *  width, (data.y += 0.025), z) 
      if (data.y > height ) data.y = -height 
    })
  
    return (
        <mesh ref={ref} geometry={nodes.Object_2.geometry} material={materials.Banana_High} material-emissive="orange" />
    )
  }


  export default function BananaBackground({count = 100, depth = 80}){
    return (
        <Canvas className='canvas' gl={{alpha:false}} camera={{near: 0.01, far:110, fov:30}}>
          <color attach='background' args={["#FFE089"]} />
          <spotLight position={[10,10,10]} intensity={1}/>
          <Suspense fallback={null}>
            <Environment preset='sunset' />
            {Array.from({length: count}, (_,i) => (<Banana key={i} z={(-i / count)* depth -20}  />))}
       
            <EffectComposer>
              <DepthOfField target={[0,0,depth / 2]} focalLength={0.5} bokehScale={11} height={700} />
            </EffectComposer>
          </Suspense>
        </Canvas>
      )
}
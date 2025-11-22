'use client';

import React, { useRef, useMemo, useEffect, RefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

type AgentState = null | 'thinking' | 'listening' | 'talking';

interface OrbProps {
  colors?: [string, string];
  colorsRef?: RefObject<[string, string]>;
  resizeDebounce?: number;
  seed?: number;
  agentState?: AgentState;
  volumeMode?: 'auto' | 'manual';
  manualInput?: number;
  manualOutput?: number;
  inputVolumeRef?: RefObject<number>;
  outputVolumeRef?: RefObject<number>;
  getInputVolume?: () => number;
  getOutputVolume?: () => number;
  className?: string;
}

function OrbMesh({
  colors,
  seed,
  agentState,
  getInputVolume,
  getOutputVolume,
}: {
  colors: [string, string];
  seed: number;
  agentState: AgentState;
  getInputVolume?: () => number;
  getOutputVolume?: () => number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  // Create geometry with more detail for smooth deformations
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1, 64), []);

  // Shader for flowing, fluid effect
  const vertexShader = `
    uniform float time;
    uniform float inputVolume;
    uniform float outputVolume;
    varying vec3 vNormal;
    varying vec3 vPosition;

    // Noise function
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);

      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);

      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;

      i = mod289(i);
      vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));

      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;

      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);

      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);

      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);

      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));

      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);

      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;

      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    void main() {
      vNormal = normal;
      vPosition = position;

      // Audio reactivity
      float volume = max(inputVolume, outputVolume);
      float displacement = snoise(position * 2.0 + time * 0.3) * 0.15 * (1.0 + volume * 0.5);

      // Apply displacement
      vec3 newPosition = position + normal * displacement;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `;

  const fragmentShader = `
    uniform vec3 color1;
    uniform vec3 color2;
    uniform float time;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      // Gradient based on position
      float mixValue = (vPosition.y + 1.0) * 0.5;
      vec3 color = mix(color1, color2, mixValue);

      // Add some glow
      float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
      color += fresnel * 0.3;

      gl_FragColor = vec4(color, 0.9);
    }
  `;

  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      inputVolume: { value: 0 },
      outputVolume: { value: 0 },
      color1: { value: new THREE.Color(colors[0]) },
      color2: { value: new THREE.Color(colors[1]) },
    }),
    [colors]
  );

  useFrame((state) => {
    if (!meshRef.current) return;

    // Update time
    uniforms.time.value = state.clock.elapsedTime;

    // Update volumes
    if (getInputVolume) {
      uniforms.inputVolume.value = getInputVolume();
    }
    if (getOutputVolume) {
      uniforms.outputVolume.value = getOutputVolume();
    }

    // Gentle rotation based on agent state
    const rotationSpeed = agentState === 'talking' ? 0.005 : 0.002;
    meshRef.current.rotation.y += rotationSpeed;
    meshRef.current.rotation.x += rotationSpeed * 0.5;
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export function Orb({
  colors = ['#CADCFC', '#A0B9D1'],
  colorsRef,
  resizeDebounce = 100,
  seed = Math.random() * 10000,
  agentState = null,
  volumeMode = 'auto',
  manualInput = 0,
  manualOutput = 0,
  inputVolumeRef,
  outputVolumeRef,
  getInputVolume,
  getOutputVolume,
  className = '',
}: OrbProps) {
  const currentColors = colorsRef?.current || colors;

  // Volume getters based on mode
  const inputVolumeFn = useMemo(() => {
    if (volumeMode === 'manual') return () => manualInput;
    if (inputVolumeRef) return () => inputVolumeRef.current || 0;
    return getInputVolume || (() => 0);
  }, [volumeMode, manualInput, inputVolumeRef, getInputVolume]);

  const outputVolumeFn = useMemo(() => {
    if (volumeMode === 'manual') return () => manualOutput;
    if (outputVolumeRef) return () => outputVolumeRef.current || 0;
    return getOutputVolume || (() => 0);
  }, [volumeMode, manualOutput, outputVolumeRef, getOutputVolume]);

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <OrbMesh
          colors={currentColors}
          seed={seed}
          agentState={agentState}
          getInputVolume={inputVolumeFn}
          getOutputVolume={outputVolumeFn}
        />
      </Canvas>
    </div>
  );
}

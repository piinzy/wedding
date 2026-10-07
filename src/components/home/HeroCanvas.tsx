'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    camera.position.set(0, 0, 30);

    // Particle system
    const PARTICLE_COUNT = 1800;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);

    const goldColor = new THREE.Color('#C9A96E');
    const goldLight = new THREE.Color('#E8D5B0');
    const blushColor = new THREE.Color('#C8796A');

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 36;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40 - 10;

      const r = Math.random();
      const c = r < 0.6 ? goldColor : r < 0.85 ? goldLight : blushColor;
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.18, vertexColors: true, transparent: true, opacity: 0.75,
      sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const particles = new THREE.Points(geo, mat);
    scene.add(particles);

    // Rings
    function addRing(r: number, tube: number, color: number, x: number, y: number, z: number, rx: number, ry: number) {
      const m = new THREE.Mesh(
        new THREE.TorusGeometry(r, tube, 16, 80),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.22 })
      );
      m.position.set(x, y, z); m.rotation.set(rx, ry, 0);
      scene.add(m); return m;
    }
    const ring1 = addRing(8, 0.04, 0xC9A96E, -12,  2, -5,  0.4,  0.3);
    const ring2 = addRing(5, 0.03, 0xE8D5B0,  10, -3, -8, -0.5,  0.7);
    const ring3 = addRing(3, 0.025, 0xC8796A,  5,  6, -3,  1.2,  0.5);
    const ring4 = addRing(12, 0.02, 0xC9A96E,  2, -1, -15, 0.2,  0.1);

    // Diamonds
    function addDiamond(size: number, color: number, x: number, y: number, z: number) {
      const m = new THREE.Mesh(
        new THREE.OctahedronGeometry(size, 0),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.15, wireframe: true })
      );
      m.position.set(x, y, z); scene.add(m); return m;
    }
    const diamonds = [
      addDiamond(1.2, 0xC9A96E, -18,  8, -5),
      addDiamond(0.7, 0xE8D5B0,  15, -5, -3),
      addDiamond(0.9, 0xC8796A,  -5, -10, -8),
      addDiamond(1.5, 0xC9A96E,  20,  4, -12),
    ];

    // Mouse parallax
    let mx = 0, my = 0;
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouse);

    const clock = new THREE.Clock();
    let raf: number;

    function animate() {
      raf = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      particles.rotation.y = elapsed * 0.015;
      particles.rotation.x = elapsed * 0.005;

      camera.position.x += (mx * 3 - camera.position.x) * 0.02;
      camera.position.y += (my * 1.5 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      ring1.rotation.z += 0.003; ring2.rotation.z -= 0.002;
      ring3.rotation.y += 0.004; ring4.rotation.x += 0.001;

      diamonds.forEach((d, i) => {
        d.rotation.y += 0.005 * (i % 2 === 0 ? 1 : -1);
        d.rotation.x += 0.003;
        d.position.y += Math.sin(elapsed * 0.5 + i) * 0.005;
      });

      mat.opacity = 0.6 + Math.sin(elapsed * 0.5) * 0.15;
      renderer.render(scene, camera);
    }
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

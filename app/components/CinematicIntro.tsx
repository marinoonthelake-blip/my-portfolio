"use client";
import React, { useEffect, useRef, useState, useCallback } from 'react';

interface Props {
  onComplete: () => void;
  context: any;
}

declare global {
    interface Window {
        THREE: any;
        SimplexNoise: any;
    }
}

export default function CinematicIntro({ onComplete, context }: Props) {
    const rootRef = useRef<HTMLDivElement>(null);
    const [isResolved, setIsResolved] = useState(false);
    const [canSkip, setCanSkip] = useState(false);

    useEffect(() => {
        const hasSeen = localStorage.getItem('jwm_intro_seen');
        if (hasSeen) {
            setCanSkip(true);
        }
    }, []);

    const runCleanup = useCallback(() => {
        if (!isResolved) {
            localStorage.setItem('jwm_intro_seen', 'true');
            setIsResolved(true);
            setTimeout(onComplete, 500); 
        }
    }, [onComplete, isResolved]);

    useEffect(() => {
        if (!rootRef.current || typeof window.THREE === 'undefined' || typeof window.SimplexNoise === 'undefined') {
             const fallback = setTimeout(runCleanup, 1000); 
             return () => clearTimeout(fallback);
        }

        const { THREE, SimplexNoise } = window;
        const runCleanupExternal = runCleanup;
        const simplex = new SimplexNoise(); 

        const createCircleTexture = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 32;
            canvas.height = 32;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.beginPath();
                ctx.arc(16, 16, 14, 0, 2 * Math.PI);
                ctx.fillStyle = '#ffffff';
                ctx.fill();
            }
            return new THREE.CanvasTexture(canvas);
        };

        const computeCurl = (x: number, y: number, z: number, target: any) => {
            const eps = 0.1;
            const n1 = simplex.noise3D(x, y + eps, z);
            const n2 = simplex.noise3D(x, y - eps, z);
            const n3 = simplex.noise3D(x, y, z + eps);
            const n4 = simplex.noise3D(x, y, z - eps);
            const n5 = simplex.noise3D(x + eps, y, z);
            const n6 = simplex.noise3D(x - eps, y, z);
            target.x = (n3 - n4) / (2 * eps);
            target.y = (n5 - n6) / (2 * eps);
            target.z = (n1 - n2) / (2 * eps);
        };

        const cinematicContainer = document.getElementById('cinematic-root');
        const canvasContainer = document.getElementById('canvas-container');
        
        // --- TIMING CONFIGURATION (60s Total) ---
        const START_DELAY = 1.0;
        const TIME_UNIVERSE = 0.0 + START_DELAY;
        const TIME_SPHERE   = 12.0 + START_DELAY; 
        const TIME_TORUS    = 28.0 + START_DELAY; 
        const TIME_BRAIN    = 47.0 + START_DELAY; 
        const TIME_BURST    = 58.0 + START_DELAY; 

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x000000, 0.002);
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 80; 
        const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        if (canvasContainer && canvasContainer.children.length === 0) {
            canvasContainer.appendChild(renderer.domElement);
        }

        // --- MOUSE PHYSICS ---
        const mouse = new THREE.Vector3(9999, 9999, 0); 
        const mouseScreen = new THREE.Vector2(0, 0);
        const raycaster = new THREE.Raycaster();
        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); 
        
        const onMouseMove = (event: MouseEvent) => {
            mouseScreen.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouseScreen.y = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouseScreen, camera);
            raycaster.ray.intersectPlane(plane, mouse);
        };
        window.addEventListener('mousemove', onMouseMove);
        
        // --- PARTICLE SYSTEM ---
        // MOBILE OPTIMIZATION: Reduce particles on small screens
        const isMobile = window.innerWidth < 768;
        const PARTICLE_COUNT = isMobile ? 3000 : 8000; 
        
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(PARTICLE_COUNT * 3);
        const colors = new Float32Array(PARTICLE_COUNT * 3);
        const burstDirections: Array<any> = []; 
        const tempVec = new THREE.Vector3(); 

        const targetSphere = new Float32Array(PARTICLE_COUNT * 3);
        const targetTorus  = new Float32Array(PARTICLE_COUNT * 3);
        const targetBrain  = new Float32Array(PARTICLE_COUNT * 3);

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3;

            // 1. INITIAL: GALAXY SPIRAL
            const spiralRadius = 10 + Math.random() * 60; 
            const spiralAngle = i * 0.1 + (spiralRadius * 0.05); 
            const armOffset = (i % 3) * (Math.PI * 2 / 3); 
            
            positions[i3]   = Math.cos(spiralAngle + armOffset) * spiralRadius;
            positions[i3+1] = Math.sin(spiralAngle + armOffset) * spiralRadius;
            positions[i3+2] = (Math.random() - 0.5) * 15; 

            // 2. SPHERE
            const u = Math.random();
            const v = Math.random();
            const theta = 2 * Math.PI * u;
            const phi = Math.acos(2 * v - 1);
            const rSphere = 30 + Math.random() * 2;
            targetSphere[i3]   = rSphere * Math.sin(phi) * Math.cos(theta);
            targetSphere[i3+1] = rSphere * Math.sin(phi) * Math.sin(theta);
            targetSphere[i3+2] = rSphere * Math.cos(phi);

            // 3. TORUS
            const tU = Math.random() * Math.PI * 2;
            const tV = Math.random() * Math.PI * 2;
            const tubeRadius = 8 + Math.random() * 3;
            const ringRadius = 25;
            targetTorus[i3]   = (ringRadius + tubeRadius * Math.cos(tV)) * Math.cos(tU);
            targetTorus[i3+1] = (ringRadius + tubeRadius * Math.cos(tV)) * Math.sin(tU);
            targetTorus[i3+2] = tubeRadius * Math.sin(tV);

            // 4. BRAIN
            let rBrain = 20 + Math.random() * 2; 
            let bX = rBrain * Math.sin(phi) * Math.cos(theta);
            let bY = rBrain * Math.sin(phi) * Math.sin(theta);
            let bZ = rBrain * Math.cos(phi);
            bY *= 0.8; bZ *= 1.2; 
            if (bX > 0) bX += 1.5; else bX -= 1.5;

            const noise = simplex.noise3D(bX * 0.15, bY * 0.15, bZ * 0.15);
            const extrusion = 1 + noise * 0.3; 
            targetBrain[i3]   = bX * extrusion;
            targetBrain[i3+1] = bY * extrusion;
            targetBrain[i3+2] = bZ * extrusion;

            burstDirections.push(new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize());
            colors[i3] = 0.1; colors[i3+1] = 0.6; colors[i3+2] = 0.9; 
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const circleMap = createCircleTexture();

        const material = new THREE.PointsMaterial({ 
            size: 0.5, 
            map: circleMap, 
            vertexColors: true, 
            blending: THREE.AdditiveBlending, 
            depthWrite: false, 
            transparent: true, 
            alphaTest: 0.05,
            opacity: 0.0 
        });
        const points = new THREE.Points(geometry, material);
        scene.add(points);

        // --- NARRATIVE SCRIPT EXECUTION ---
        const narrativeElement = document.getElementById('narrative-text');
        const flashOverlay = document.getElementById('flash-overlay');
        const cinematicUiLayer = document.getElementById('cinematic-ui-layer');
        
        function hslToRgb(h: number, s: number, l: number): number[] {
            let r, g, b;
            if (s === 0) { r = g = b = l; } else {
                const hue2rgb = (p: number, q: number, t: number): number => { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1 / 6) return p + (q - p) * 6 * t; if (t < 1 / 2) return q; if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6; return p; };
                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                r = hue2rgb(p, q, h + 1 / 3); g = hue2rgb(p, q, h); b = hue2rgb(p, q, h - 1 / 3);
            }
            return [r, g, b];
        }

        // UPDATED NARRATIVE SCRIPT
        const cinematicScript = [
            [1.5, "You have just set this page in motion."],
            [7.0, "We are initiating the swarm protocols."],
            [12.5, "I am defining the scope of the search."],
            [18.0, "They are scanning the web for live context."],
            [23.5, "They are filtering the noise to find meaning."],
            [29.0, "We are assembling the raw data into a structure."],
            [34.5, "I am designing this portfolio on the fly."],
            [40.0, "I am breathing life into the code."],
            [45.5, "You are seeing something that didn't exist seconds ago."],
            [51.0, "Welcome."]
        ];

        let lastNarrativeIndex = -1;

        function updateNarrative(time: number) {
            let currentMessage = "";
            let currentMessageIndex = -1;
            for (let i = cinematicScript.length - 1; i >= 0; i--) {
                if (time >= (cinematicScript[i][0] as number)) { 
                    currentMessage = cinematicScript[i][1] as string; 
                    currentMessageIndex = i; 
                    break; 
                }
            }
            
            if (currentMessageIndex !== lastNarrativeIndex) {
                lastNarrativeIndex = currentMessageIndex;
                
                // Check for final exit
                if (time >= (TIME_BURST - 1.0)) { 
                    if(cinematicUiLayer) cinematicUiLayer.style.opacity = '0'; 
                }
                
                if (narrativeElement) {
                    // 1. Fade Out
                    narrativeElement.style.opacity = '0';
                    
                    // 2. Wait for CSS transition (500ms) then Swap Text
                    setTimeout(() => {
                        narrativeElement.innerText = currentMessage;
                        
                        // 3. Fade In only if we are still within the sequence
                        if (currentMessage && time < (TIME_BURST - 1.0)) {
                            requestAnimationFrame(() => {
                                narrativeElement.style.opacity = '1';
                            });
                        }
                    }, 500); // Matches CSS transition time exactly
                }
            }
        }
        
        const clock = new THREE.Clock();
        let rafId: number | null = null; 

        setTimeout(() => {
            clock.start();
            updateNarrative(0);
            animate(); 
        }, START_DELAY * 1000);

        const animate = () => { 
            rafId = requestAnimationFrame(animate);
            const time = clock.getElapsedTime() + (clock.running ? START_DELAY : 0);
            if (clock.running) updateNarrative(time);
            
            const positionsArr = geometry.attributes.position.array;
            const colorsArr = geometry.attributes.color.array;

            let phase = 'UNIVERSE';
            if (time >= TIME_BURST) phase = 'BURST';
            else if (time >= TIME_BRAIN) phase = 'BRAIN';
            else if (time >= TIME_TORUS) phase = 'TORUS';
            else if (time >= TIME_SPHERE) phase = 'SPHERE';

            if (phase === 'BURST') {
                 if(flashOverlay && flashOverlay.style.opacity !== '1') {
                    if(cinematicUiLayer) cinematicUiLayer.style.opacity = '0'; 
                    flashOverlay.style.opacity = '1';
                    setTimeout(() => { if(flashOverlay) flashOverlay.style.opacity = '0'; }, 800); 
                    setTimeout(() => { runCleanupExternal(); }, 2500); 
                 }
            }

            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const i3 = i * 3;
                const pX = positionsArr[i3];
                const pY = positionsArr[i3+1];
                const pZ = positionsArr[i3+2];

                // --- MOUSE MAGNETISM ---
                if (phase !== 'BURST') {
                    const dx = mouse.x - pX;
                    const dy = mouse.y - pY;
                    const distSq = dx*dx + dy*dy;
                    if (distSq < 3600) { 
                        const force = (3600 - distSq) * 0.000005; 
                        positionsArr[i3] += dx * force;
                        positionsArr[i3+1] += dy * force;
                    }
                }
                
                if (phase === 'UNIVERSE') {
                    // SWARMING GALAXY 
                    const noiseScale = 0.01; 
                    computeCurl(pX * noiseScale, pY * noiseScale, pZ * noiseScale + time * 0.1, tempVec);
                    
                    positionsArr[i3] += tempVec.x * 0.2;
                    positionsArr[i3+1] += tempVec.y * 0.2;
                    positionsArr[i3+2] += tempVec.z * 0.2;

                    // Rotation
                    const rotSpeed = 0.001;
                    const x = positionsArr[i3];
                    const y = positionsArr[i3+1];
                    positionsArr[i3]   = x * Math.cos(rotSpeed) - y * Math.sin(rotSpeed);
                    positionsArr[i3+1] = x * Math.sin(rotSpeed) + y * Math.cos(rotSpeed);

                    colorsArr[i3] = 0.1; colorsArr[i3+1] = 0.2; colorsArr[i3+2] = 0.5;
                    material.opacity = Math.min(0.8, time * 0.2); 

                } else if (phase === 'BURST') {
                    const dir = burstDirections[i];
                    positionsArr[i3] += dir.x * 5.0;
                    positionsArr[i3+1] += dir.y * 5.0;
                    positionsArr[i3+2] += dir.z * 5.0;
                    
                    const hue = (i / PARTICLE_COUNT) + (time * 2.0); 
                    const [r, g, b] = hslToRgb(hue % 1, 1, 0.9); 
                    colorsArr[i3] = r; colorsArr[i3+1] = g; colorsArr[i3+2] = b;
                    material.opacity *= 0.90; 

                } else {
                    // --- MORPHING ---
                    let tX, tY, tZ;
                    let lerpFactor = 0.02; 
                    
                    if (phase === 'SPHERE') {
                        tX = targetSphere[i3]; tY = targetSphere[i3+1]; tZ = targetSphere[i3+2];
                        colorsArr[i3] = 0.1; colorsArr[i3+1] = 0.8; colorsArr[i3+2] = 0.9; 
                    } else if (phase === 'TORUS') {
                        tX = targetTorus[i3]; tY = targetTorus[i3+1]; tZ = targetTorus[i3+2];
                        colorsArr[i3] = 0.4; colorsArr[i3+1] = 0.2; colorsArr[i3+2] = 0.9; 
                        const cosR = Math.cos(time * 0.2); const sinR = Math.sin(time * 0.2);
                        const rotX = tX * cosR - tZ * sinR;
                        const rotZ = tX * sinR + tZ * cosR;
                        tX = rotX; tZ = rotZ;
                    } else { // BRAIN
                        tX = targetBrain[i3]; tY = targetBrain[i3+1]; tZ = targetBrain[i3+2];
                        colorsArr[i3] = 0.9; colorsArr[i3+1] = 0.2; colorsArr[i3+2] = 0.5; 
                        const morphScale = 1 + Math.sin(time * 3 + pY * 0.1) * 0.03;
                        tX *= morphScale; tY *= morphScale; tZ *= morphScale;
                        lerpFactor = 0.04;
                    }

                    positionsArr[i3] += (tX - pX) * lerpFactor;
                    positionsArr[i3+1] += (tY - pY) * lerpFactor;
                    positionsArr[i3+2] += (tZ - pZ) * lerpFactor;

                    const noiseScale = 0.015; 
                    computeCurl(pX * noiseScale, pY * noiseScale, pZ * noiseScale + time * 0.15, tempVec);
                    
                    const progress = Math.min(1, (time - TIME_SPHERE) / (TIME_BURST - TIME_SPHERE));
                    const curlInfluence = 0.5 * (1 - progress); 

                    positionsArr[i3] += tempVec.x * curlInfluence;
                    positionsArr[i3+1] += tempVec.y * curlInfluence;
                    positionsArr[i3+2] += tempVec.z * curlInfluence;
                    
                    material.opacity = 0.9;
                }
            }

            if (phase !== 'BURST') {
                // Camera Zoom
                let targetZ = 80;
                if (phase === 'SPHERE') targetZ = 60;
                if (phase === 'TORUS') targetZ = 50;
                if (phase === 'BRAIN') targetZ = 40; 
                camera.position.z += (targetZ - camera.position.z) * 0.01;
                
                if (phase === 'UNIVERSE') {
                     // Galaxy rotating internally
                } else {
                    points.rotation.y += 0.002; 
                }
            } else {
                points.rotation.y += 0.001;
            }

            geometry.attributes.position.needsUpdate = true;
            geometry.attributes.color.needsUpdate = true;
            renderer.render(scene, camera);
        };
        
        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        window.addEventListener('resize', onWindowResize);
        
        return () => {
            if(rafId) cancelAnimationFrame(rafId);
            window.removeEventListener('resize', onWindowResize);
            window.removeEventListener('mousemove', onMouseMove);
        };
    }, [runCleanup]);

    return (
        <div id="cinematic-root" className="fixed inset-0 bg-black z-[100]" style={{ opacity: isResolved ? 0 : 1, transition: 'opacity 1.5s ease-out' }}>
            <div id="canvas-container" ref={rootRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}></div>
            <div id="flash-overlay"></div>
            <div id="cinematic-ui-layer" style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2,
                pointerEvents: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center'
            }}>
                <div id="cinematic-narrative" style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 4, 
                    color: 'white', textAlign: 'center', pointerEvents: 'none',
                    backgroundColor: 'transparent', backdropFilter: 'blur(4px)', 
                    padding: '20px', width: '100%', maxWidth: '80%', boxSizing: 'border-box',
                    transition: 'opacity 1s ease-out'
                }}>
                    <div id="narrative-text" style={{
                        opacity: 0, transition: 'opacity 0.5s ease-in-out',
                        textTransform: 'uppercase', fontWeight: 200, fontSize: 'clamp(24px, 5vw, 56px)',
                        letterSpacing: '4px', padding: '10px', lineHeight: '1.4', color: '#ffffff', 
                        textShadow: '0 0 20px rgba(0, 0, 0, 0.9), 0 0 5px rgba(0,0,0,1)'
                    }}></div>
                </div>
            </div>

            {/* SKIP BUTTON - ONLY SHOW IF RETURNING VISITOR */}
            {canSkip && (
                <button 
                    onClick={runCleanup}
                    className="absolute bottom-8 right-8 z-[200] text-[10px] md:text-xs font-bold text-white/50 hover:text-white border border-white/20 hover:border-white/50 px-4 py-2 rounded uppercase tracking-widest transition-all backdrop-blur-sm cursor-pointer pointer-events-auto"
                >
                    Skip Sequence »
                </button>
            )}
        </div>
    );
}

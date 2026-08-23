import React, { useMemo } from 'react';
import * as THREE from 'three';

interface KeyModelProps {
    rotationY: number;
    scale: number;
}

export const KeyModel: React.FC<KeyModelProps> = ({ rotationY, scale }) => {
    const shaftPoints = useMemo(() => {
        const pts: THREE.Vector2[] = [];
        // Bottom tip
        pts.push(new THREE.Vector2(0, -1.45));
        pts.push(new THREE.Vector2(0.04, -1.43));
        pts.push(new THREE.Vector2(0.06, -1.40));
        pts.push(new THREE.Vector2(0.06, -1.35));
        // Lower collar (base of the bit)
        pts.push(new THREE.Vector2(0.12, -1.30));
        pts.push(new THREE.Vector2(0.12, -1.25));
        pts.push(new THREE.Vector2(0.07, -1.20));
        // Shaft where bit attaches
        pts.push(new THREE.Vector2(0.07, -0.55));
        // Middle collar
        pts.push(new THREE.Vector2(0.14, -0.50));
        pts.push(new THREE.Vector2(0.16, -0.45));
        pts.push(new THREE.Vector2(0.14, -0.40));
        pts.push(new THREE.Vector2(0.07, -0.35));
        
        // Ribbed/Fluted middle section
        for (let i = 0; i <= 40; i++) {
            const y = -0.35 + (i / 40) * 0.7;
            const bulge = Math.sin((i / 40) * Math.PI) * 0.02;
            const radius = 0.07 + bulge + 0.015 * Math.sin((i / 40) * Math.PI * 16);
            pts.push(new THREE.Vector2(radius, y));
        }
        
        // Upper collar
        pts.push(new THREE.Vector2(0.07, 0.35));
        pts.push(new THREE.Vector2(0.14, 0.40));
        pts.push(new THREE.Vector2(0.16, 0.45));
        pts.push(new THREE.Vector2(0.14, 0.50));
        pts.push(new THREE.Vector2(0.08, 0.55));
        // Base of the head
        pts.push(new THREE.Vector2(0.08, 0.60));
        pts.push(new THREE.Vector2(0.18, 0.65));
        pts.push(new THREE.Vector2(0.20, 0.70));
        pts.push(new THREE.Vector2(0.0, 0.70));
        return pts;
    }, []);

    const headShape = useMemo(() => {
        const shape = new THREE.Shape();
        // Outer gothic quatrefoil boundary (drawn counter-clockwise)
        shape.moveTo(0, 0.7);
        shape.bezierCurveTo(0.4, 0.7, 0.6, 0.85, 0.5, 1.05);
        shape.bezierCurveTo(0.8, 1.2, 0.5, 1.55, 0.2, 1.45);
        shape.bezierCurveTo(0.1, 1.6, -0.1, 1.6, -0.2, 1.45);
        shape.bezierCurveTo(-0.5, 1.55, -0.8, 1.2, -0.5, 1.05);
        shape.bezierCurveTo(-0.6, 0.85, -0.4, 0.7, 0, 0.7);

        // Inner cutout (drawn clockwise for holes)
        const hole = new THREE.Path();
        hole.moveTo(0, 0.78);
        hole.bezierCurveTo(-0.25, 0.78, -0.4, 0.9, -0.3, 1.05);
        hole.bezierCurveTo(-0.5, 1.2, -0.3, 1.38, -0.1, 1.33);
        hole.bezierCurveTo(0, 1.43, 0, 1.43, 0.1, 1.33);
        hole.bezierCurveTo(0.3, 1.38, 0.5, 1.2, 0.3, 1.05);
        hole.bezierCurveTo(0.4, 0.9, 0.25, 0.78, 0, 0.78);
        shape.holes.push(hole);

        return shape;
    }, []);

    const bitShape = useMemo(() => {
        const shape = new THREE.Shape();
        // Main tooth boundary (drawn counter-clockwise)
        shape.moveTo(0.07, -1.25);
        shape.lineTo(0.45, -1.25);
        shape.bezierCurveTo(0.5, -1.25, 0.55, -1.2, 0.55, -1.15);
        shape.lineTo(0.55, -1.05);
        
        // Lower ward cutout
        shape.lineTo(0.3, -1.05);
        shape.lineTo(0.3, -0.95);
        shape.lineTo(0.55, -0.95);
        
        // Deep middle ward cutout
        shape.lineTo(0.55, -0.85);
        shape.lineTo(0.2, -0.85);
        shape.lineTo(0.2, -0.75);
        shape.lineTo(0.55, -0.75);
        
        // Top edge returning to shaft
        shape.lineTo(0.55, -0.65);
        shape.bezierCurveTo(0.55, -0.6, 0.5, -0.55, 0.45, -0.55);
        shape.lineTo(0.07, -0.55);
        shape.lineTo(0.07, -1.25);

        // Intricate diamond hole inside the bit (drawn clockwise)
        const bitHole = new THREE.Path();
        bitHole.moveTo(0.35, -1.15);
        bitHole.lineTo(0.38, -1.12);
        bitHole.lineTo(0.41, -1.15);
        bitHole.lineTo(0.38, -1.18);
        bitHole.lineTo(0.35, -1.15);
        shape.holes.push(bitHole);

        return shape;
    }, []);

    const finialPoints = useMemo(() => {
        const pts: THREE.Vector2[] = [];
        pts.push(new THREE.Vector2(0, 1.55));
        pts.push(new THREE.Vector2(0.06, 1.55));
        pts.push(new THREE.Vector2(0.08, 1.58));
        pts.push(new THREE.Vector2(0.04, 1.62));
        pts.push(new THREE.Vector2(0.04, 1.66));
        pts.push(new THREE.Vector2(0.09, 1.70));
        pts.push(new THREE.Vector2(0.0, 1.75));
        return pts;
    }, []);

    return (
        <group rotation={[0, rotationY, 0.15]} scale={[scale, scale, scale]}>
            {/* Main turned shaft */}
            <mesh>
                <latheGeometry args={[shaftPoints, 64]} />
                <meshStandardMaterial color="#ffd700" metalness={1.0} roughness={0.15} />
            </mesh>

            {/* Extra ornate bands on the shaft */}
            <mesh position={[0, -0.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.13, 0.025, 16, 32]} />
                <meshStandardMaterial color="#ffe666" metalness={1.0} roughness={0.1} />
            </mesh>
            <mesh position={[0, 0.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.13, 0.025, 16, 32]} />
                <meshStandardMaterial color="#ffe666" metalness={1.0} roughness={0.1} />
            </mesh>

            {/* The Bit (Teeth) */}
            <group>
                <mesh position={[0, 0, -0.035]}>
                    <extrudeGeometry 
                        args={[bitShape, { 
                            depth: 0.07, 
                            bevelEnabled: true, 
                            bevelSize: 0.01, 
                            bevelThickness: 0.01, 
                            bevelSegments: 3 
                        }]} 
                    />
                    <meshStandardMaterial color="#e6b800" metalness={0.9} roughness={0.25} />
                </mesh>
            </group>

            {/* The Head (Bow) - 3D intersecting structure for perfect readability at any angle */}
            <group>
                {/* Primary face (XY plane) */}
                <mesh position={[0, 0, -0.04]}>
                    <extrudeGeometry 
                        args={[headShape, { 
                            depth: 0.08, 
                            bevelEnabled: true, 
                            bevelSize: 0.015, 
                            bevelThickness: 0.015, 
                            bevelSegments: 4, 
                            curveSegments: 32 
                        }]} 
                    />
                    <meshStandardMaterial color="#ffd700" metalness={1.0} roughness={0.15} />
                </mesh>
                
                {/* Secondary face (YZ plane, rotated) */}
                <group rotation={[0, Math.PI / 2, 0]}>
                    <mesh position={[0, 0, -0.04]}>
                        <extrudeGeometry 
                            args={[headShape, { 
                                depth: 0.08, 
                                bevelEnabled: true, 
                                bevelSize: 0.015, 
                                bevelThickness: 0.015, 
                                bevelSegments: 4, 
                                curveSegments: 32 
                            }]} 
                        />
                        <meshStandardMaterial color="#ffd700" metalness={1.0} roughness={0.15} />
                    </mesh>
                </group>

                {/* Central gem inside the hollow head */}
                <mesh position={[0, 1.05, 0]}>
                    <octahedronGeometry args={[0.16, 0]} />
                    <meshStandardMaterial color="#fff4cc" metalness={1.0} roughness={0.05} />
                </mesh>

                {/* Binding rings interlocking the cross structure */}
                <mesh position={[0, 1.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.48, 0.035, 16, 64]} />
                    <meshStandardMaterial color="#ffd700" metalness={1.0} roughness={0.15} />
                </mesh>
                <mesh position={[0, 1.05, 0]} rotation={[Math.PI / 2, 0, Math.PI / 4]}>
                    <torusGeometry args={[0.28, 0.025, 16, 64]} />
                    <meshStandardMaterial color="#ffcc00" metalness={0.9} roughness={0.2} />
                </mesh>

                {/* Top finial (crown of the head) */}
                <mesh>
                    <latheGeometry args={[finialPoints, 32]} />
                    <meshStandardMaterial color="#ffd700" metalness={1.0} roughness={0.15} />
                </mesh>
                <mesh position={[0, 1.68, 0]} rotation={[0, Math.PI / 4, 0]}>
                    <torusGeometry args={[0.06, 0.015, 16, 32]} />
                    <meshStandardMaterial color="#ffe666" metalness={1.0} roughness={0.1} />
                </mesh>
            </group>
        </group>
    );
};
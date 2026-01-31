// Configuration
const CONFIG = {
    colors: {
        redNeon: 0xff0000,
        bgDark: 0x050505
    }
};

class Experience {
    constructor() {
        this.container = document.getElementById('canvas-container');
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.clock = new THREE.Clock();

        this.init();
        this.addObjects();
        this.addPostProcessing();
        this.resize();
        this.animate();

        window.addEventListener('resize', () => this.resize());
    }

    init() {
        // Scene
        this.scene = new THREE.Scene();
        // Transparent background to show CSS background
        this.scene.background = null; 
        
        // Add some fog to blend bottom - meaningful only if there are objects to fog
        this.scene.fog = new THREE.Fog(0x000000, 5, 15);

        // Camera
        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 100);
        this.camera.position.set(0, 0, 8);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: false, 
            powerPreference: "high-performance",
            alpha: true // Enable transparency
        });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.NoToneMapping;
        // Make sure the canvas is transparent
        this.renderer.domElement.style.background = 'transparent'; 
        this.container.appendChild(this.renderer.domElement);

        // Lights
        this.createLights();
    }

    createLights() {
        // Top Light
        const spotTop = new THREE.SpotLight(0xffffff, 2);
        spotTop.position.set(0, 10, 5);
        spotTop.angle = 0.5;
        spotTop.penumbra = 1;
        this.scene.add(spotTop);

        // Back Red Neon Light (Rim)
        const spotBack = new THREE.SpotLight(CONFIG.colors.redNeon, 10);
        spotBack.position.set(0, 0, -5);
        spotBack.angle = 1;
        spotBack.penumbra = 1;
        spotBack.distance = 20;
        this.scene.add(spotBack);

        // Fill Light Bottom
        const pointFill = new THREE.PointLight(0x330000, 1);
        pointFill.position.set(0, -5, 2);
        this.scene.add(pointFill);

        // Ambient for base visibility
        const ambient = new THREE.AmbientLight(0xffffff, 0.1);
        this.scene.add(ambient);
    }

    addObjects() {
        // 1. Stars (Simple particles) - KEPT as they are not red dots
        this.createParticles(3000, 50, 0xffffff, 0.5);

        // Red Sparkles REMOVED as requested ("remover esses pontos vermelho")
        
        // Hero Image REMOVED as requested (replaced by CSS background)
    }

    createParticles(count, spread, color, size) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * spread;     // x
            positions[i * 3 + 1] = (Math.random() - 0.5) * spread; // y
            positions[i * 3 + 2] = (Math.random() - 0.5) * spread; // z
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const material = new THREE.PointsMaterial({
            color: color,
            size: size * 0.05, // Adjust size scale
            transparent: true,
            opacity: 0.6,
            sizeAttenuation: true
        });

        const points = new THREE.Points(geometry, material);
        this.scene.add(points);
    }

    addPostProcessing() {
        // Use global THREE.EffectComposer
        this.composer = new THREE.EffectComposer(this.renderer);

        const renderPass = new THREE.RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

        // Bloom Pass
        const bloomPass = new THREE.UnrealBloomPass(
            new THREE.Vector2(this.width, this.height),
            1.5, // intensity
            0.5, // radius
            0.1  // threshold
        );
        this.composer.addPass(bloomPass);
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(this.width, this.height);
        this.composer.setSize(this.width, this.height);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Removed Hero Image animation logic since Hero Image is gone

        this.composer.render();
    }
}

// Start Experience
new Experience();

document.addEventListener("DOMContentLoaded", () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 5);

    const renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById("3Dbg"),
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight, false);

    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    // Controles sin interacción manual
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableRotate = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.3;

    // Luces
    scene.add(new THREE.AmbientLight(0xffffff, 1));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    let model, mixer;
    let mouseX = 0, mouseY = 0;
    let clock = new THREE.Clock(); // Para manejar el tiempo de animación

    // Cargar modelo GLB
    const loader = new THREE.GLTFLoader();
    loader.load(
        "models/sphere_animation.glb",
        (gltf) => {
            model = gltf.scene;
            model.scale.set(1.2, 1.2, 1.2);
            scene.add(model);

            // Convertir TODAS las mallas a wireframe sin cambiar el material
            model.traverse((child) => {
                if (child.isMesh && child.material) {
                    child.material.wireframe = true;
                }
            });

            // Inicializar mixer y reproducir animaciones
            if (gltf.animations.length > 0) {
                mixer = new THREE.AnimationMixer(model);
                const action = mixer.clipAction(gltf.animations[0]); // Tomar la primera animación
                action.play();
            }

            // 🚀 ¡Aumentamos el contador y revisamos si todos los modelos están listos!
            window.modelsLoaded++;
            window.checkAllModelsLoaded();
        },
        (xhr) => console.log(`Cargando modelo 3: ${(xhr.loaded / xhr.total) * 100} %`),
        (error) => console.error("Error cargando modelo 3:", error)
    );

    // Ajustar la relación de aspecto al redimensionar
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight, false);
    });

    // Mousemove en todos los dispositivos
    window.addEventListener("mousemove", (event) => {
        const halfWidth = window.innerWidth / 2;
        const halfHeight = window.innerHeight / 2;
        mouseX = (event.clientX - halfWidth) / halfWidth;
        mouseY = (event.clientY - halfHeight) / halfHeight;
    });

    // Animación y render loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update();

        const deltaTime = clock.getDelta(); // Obtener el tiempo entre frames

        if (mixer) {
            mixer.update(deltaTime); // Actualizar animación del modelo
        }

        if (model) {



            if (!isMobile) {
                controls.autoRotateSpeed = 0.2;

                model.rotation.y = THREE.MathUtils.lerp(model.rotation.y, mouseX * Math.PI * 0.3, 0.03);
                model.rotation.x = THREE.MathUtils.clamp(
                    THREE.MathUtils.lerp(model.rotation.x, -mouseY * Math.PI * 0.1, 0.03),
                    -0.3, 0.3
                );

                model.rotation.y = THREE.MathUtils.clamp(model.rotation.y, -Math.PI / 2, Math.PI / 2);

            }
        }

        renderer.render(scene, camera);
    }
    animate();
});

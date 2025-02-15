document.addEventListener("DOMContentLoaded", () => {
    const scene2 = new THREE.Scene();
    const camera2 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const renderer2 = new THREE.WebGLRenderer({
        canvas: document.getElementById("Person3D"),
        antialias: true,
        alpha: true
    });
    renderer2.setSize(window.innerWidth, window.innerHeight, false);

    const controls2 = new THREE.OrbitControls(camera2, renderer2.domElement);
    controls2.enableZoom = false;
    controls2.enablePan = false;
    controls2.enableRotate = true;

      // Luces
//   scene2.add(new THREE.AmbientLight(0xffffff, 2));
//   const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
//   directionalLight2.position.set(5, 10, 7.5);
//   scene2.add(directionalLight2);

    let model2;
    let mixer2;

    function updateModelView() {
        if (!model2) return; // Evita errores si el modelo aún no cargó

        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            camera2.position.set(10, 4, 7);
            model2.scale.set(6.7, 7, 6.7);
            model2.position.y = -7.2; // Usamos asignación directa para evitar acumulaciones

            controls2.enableRotate = false;
            controls2.autoRotate = true;
            controls2.autoRotateSpeed = 2.2;
            controls2.enableZoom = false;

        } else {
            camera2.position.set(10, 5, 7);
            model2.scale.set(13.7, 7, 13.7);
            model2.position.y = -7.2;

            controls2.enableRotate = true;
            controls2.autoRotate = true;
            controls2.autoRotateSpeed = 2.2;
            controls2.enableZoom = false;
        }
    }


    function fitCameraToObject(camera, object, offset = 1.5) {
        const box = new THREE.Box3().setFromObject(object);
        const size = box.getSize(new THREE.Vector3()).length();
        const center = box.getCenter(new THREE.Vector3());

        object.position.sub(center);
        const newPosition = new THREE.Vector3(0, center.y, size * offset);
        camera.position.copy(newPosition);
        camera.lookAt(center);
    }

    const loader2 = new THREE.GLTFLoader();
    loader2.load(
        "models/person.glb",
        (gltf) => {
            model2 = gltf.scene;
            scene2.add(model2);

            // Bajamos el modelo en el eje Y para centrarlo mejor
            model2.position.y -= 5; // Ajusta este valor según sea necesario

            fitCameraToObject(camera2, model2);

            model2.traverse((child) => {
                if (child.isMesh && child.material) {
                    child.material.wireframe = true;
                }
            });

            if (gltf.animations && gltf.animations.length) {
                mixer2 = new THREE.AnimationMixer(model2);
                gltf.animations.forEach((clip) => {
                    const action = mixer2.clipAction(clip);
                    action.play();
                    action.setLoop(THREE.LoopRepeat, Infinity);
                    action.timeScale = 0.07;
                });
            }

            window.modelsLoaded++;
            window.checkAllModelsLoaded();

            updateModelView();
        },
        (xhr) => console.log(`Cargando modelo: ${(xhr.loaded / xhr.total) * 100} %`),
        (error) => console.error("Error cargando el modelo:", error)
    );


    window.addEventListener("resize", () => {
        if (!model2) return; // Evita modificar si el modelo aún no está listo
        const width = window.innerWidth;
        const height = window.innerHeight;
        camera2.aspect = width / height;
        camera2.updateProjectionMatrix();
        renderer2.setSize(width, height, false);

        updateModelView();
    });

    function animate() {
        requestAnimationFrame(animate);
        controls2.update();
        if (mixer2) {
            mixer2.update(0.1);
        }
        renderer2.render(scene2, camera2);
    }

    animate();
});

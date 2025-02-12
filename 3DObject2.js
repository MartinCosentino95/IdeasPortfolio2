document.addEventListener("DOMContentLoaded", () => {
  const scene2 = new THREE.Scene();
  const camera2 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  const renderer2 = new THREE.WebGLRenderer({
    canvas: document.getElementById("3DObject2"),
    antialias: true,
    alpha: true
  });
  renderer2.setSize(window.innerWidth, window.innerHeight, false);

  const controls2 = new THREE.OrbitControls(camera2, renderer2.domElement);
  controls2.enableZoom = false;
  controls2.enablePan = false;
  controls2.enableRotate = true;

  // Luces
  scene2.add(new THREE.AmbientLight(0xffffff, 2));
  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight2.position.set(5, 10, 7.5);
  scene2.add(directionalLight2);

  let model2;
  let mixer2;

  // Función para actualizar la vista según el tamaño de la pantalla
  function updateModelView() {
    const isMobile = window.innerWidth <= 768; // 📱 Detecta pantallas pequeñas

    if (isMobile) {
      camera2.position.set(-550, 250, 500); // Posición original
      model2.scale.set(1.2, 1.2, 1.2);

      controls2.enableRotate = false;
      controls2.autoRotate= true;
      controls2.autoRotateSpeed = 1.3;

    } else {
      camera2.position.set(-550, 250, 500); // Posición original
    }

    // camera2.lookAt(new THREE.Vector3(0, 1.5, 0));
  }

  // Cargar el modelo GLB
  const loader2 = new THREE.GLTFLoader();
  loader2.load(
    "models/phoenix.glb",
    (gltf) => {
      model2 = gltf.scene;
      model2.scale.set(1.8, 1.8, 1.8);
      model2.rotation.set(0, Math.PI, 0);
      model2.position.set(0, -240, 0);
      scene2.add(model2);

      // Activar wireframe sin cambiar el material
      model2.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.wireframe = true;
        }
      });

      // Verificar si existen animaciones
      if (gltf.animations && gltf.animations.length) {
        mixer2 = new THREE.AnimationMixer(model2);
        gltf.animations.forEach((clip) => {
          const action = mixer2.clipAction(clip);
          action.play();
          action.setLoop(THREE.LoopRepeat, Infinity);
          action.timeScale = 0.07;
        });
      }

      // 🚀 Aumentamos el contador y revisamos si todos los modelos están listos
      window.modelsLoaded++;
      window.checkAllModelsLoaded();

      // Aplicamos la vista correcta según el dispositivo
      updateModelView();
    },
    (xhr) => console.log(`Cargando modelo 2: ${(xhr.loaded / xhr.total) * 100} %`),
    (error) => console.error("Error cargando el modelo 2:", error)
  );

  // Ajustar la relación de aspecto al redimensionar
  window.addEventListener("resize", () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera2.aspect = width / height;
    camera2.updateProjectionMatrix();
    renderer2.setSize(width, height, false);

    // Reaplicar ajustes cuando cambia el tamaño de pantalla
    updateModelView();
  });

  // Animación y render loop
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

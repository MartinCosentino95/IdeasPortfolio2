document.addEventListener("DOMContentLoaded", () => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 2, 5);

  const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("3DObject"),
    antialias: true,
    alpha: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  // Controles sin interacción manual
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableRotate = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.2;

  let model;
  let mouseX = 0, mouseY = 0;

  // Cargar modelo GLB
  const loader = new THREE.GLTFLoader();
  loader.load(
    "models/compass.glb",
    (gltf) => {
      model = gltf.scene;
      model.scale.set(3.5, 3.5, 3.5);
      scene.add(model);

      // Convertir TODAS las mallas del modelo a wireframe
      model.traverse((child) => {
        if (child.isMesh) {
          child.material.wireframe = true;
          child.material.color.set(0x000000);
        }
      });

      window.modelsLoaded++;
      window.checkAllModelsLoaded();
    },
    (xhr) => console.log(`Cargando modelo: ${(xhr.loaded / xhr.total) * 100} %`),
    (error) => console.error("Error cargando el modelo:", error)
  );

  // Ajustar la relación de aspecto al redimensionar
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  window.addEventListener("mousemove", (event) => {
    const halfWidth = window.innerWidth / 2;
    const halfHeight = window.innerHeight / 2;
    mouseX = (event.clientX - halfWidth) / halfWidth;
    mouseY = (event.clientY - halfHeight) / halfHeight;
  });

  function animate() {
    requestAnimationFrame(animate);
    controls.update();

    if (model && !isMobile) {
      model.rotation.y = THREE.MathUtils.lerp(model.rotation.y, mouseX * Math.PI * 0.3, 0.03);
      model.rotation.x = THREE.MathUtils.clamp(
        THREE.MathUtils.lerp(model.rotation.x, -mouseY * Math.PI * 0.1, 0.03),
        -0.3, 0.3
      );
      model.rotation.y = THREE.MathUtils.clamp(model.rotation.y, -Math.PI / 2, Math.PI / 2);
    }

    renderer.render(scene, camera);
  }
  animate();
});

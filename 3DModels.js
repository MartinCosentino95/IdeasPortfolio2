document.addEventListener("DOMContentLoaded", () => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 2, 5);

  const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("3DObject"),
    antialias: true,
    alpha: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight, false);

  // Controles pero SIN interacción con clic
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableRotate = false;

  // Luces
  scene.add(new THREE.AmbientLight(0xffffff, 1));
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(5, 10, 7.5);
  scene.add(directionalLight);

  let model;
  let mouseX = 0, mouseY = 0;
  const clock = new THREE.Clock();

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
          child.material = new THREE.MeshBasicMaterial({
            color: 0x000000, // Negro
            wireframe: true  // Activar wireframe
          });
        }
      });
    },
    (xhr) => console.log(`Cargando: ${(xhr.loaded / xhr.total) * 100}%`),
    (error) => console.error("Error cargando el modelo:", error)
  );

  // Rotación automática con el mouse
  window.addEventListener("mousemove", (event) => {
    const halfWidth = window.innerWidth / 2;
    const halfHeight = window.innerHeight / 2;
    mouseX = (event.clientX - halfWidth) / halfWidth;
    mouseY = (event.clientY - halfHeight) / halfHeight;
  });

  // Ajustar la relación de aspecto al redimensionar
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight, false);
  });

  // Animación y render loop
  function animate() {
    requestAnimationFrame(animate);

    if (model) {
      model.rotation.y = THREE.MathUtils.lerp(model.rotation.y, mouseX * Math.PI * 0.3, 0.05);
      model.rotation.x = THREE.MathUtils.clamp(THREE.MathUtils.lerp(model.rotation.x, -mouseY * Math.PI * 0.1, 0.05), -0.3, 0.3);
    }

    renderer.render(scene, camera);
  }
  animate();
});

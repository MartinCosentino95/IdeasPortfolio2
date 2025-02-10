document.addEventListener("DOMContentLoaded", () => {
  // Segundo canvas (3DObject2)
  const scene2 = new THREE.Scene();
  const camera2 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera2.position.set(400, 450, -150); // Mueve la cámara más cerca del modelo y desde arriba
  camera2.lookAt(new THREE.Vector3(0, 1.5, 0)); // Asegura que la cámara mire al centro del modelo

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
  controls2.autoRotate = true;
  controls2.autoRotateSpeed = 0.05;


  // Luces
  scene2.add(new THREE.AmbientLight(0xffffff, 2)); // Aumenta la intensidad de la luz ambiental
  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight2.position.set(5, 10, 7.5);
  scene2.add(directionalLight2);

  let model2;
  let mixer2; // Variable para el AnimationMixer
  let mouseX = 0, mouseY = 0;

  // Cargar el segundo modelo GLB
  const loader2 = new THREE.GLTFLoader();
  loader2.load(
    "models/phoenix.glb", // Cambia la ruta al segundo modelo
    (gltf) => {
      model2 = gltf.scene;
      model2.scale.set(1, 1, 1);  // Ajusta la escala para que el modelo se vea mejor
      model2.rotation.x = Math.PI;  // Rota 180 grados alrededor del eje X
      model2.position.set(200, 0, 0); // Mueve el modelo a la izquierda (en el eje X)
      scene2.add(model2);

      // Aplicar el material de wireframe
      model2.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshBasicMaterial({
            color: 0x000000,
            wireframe: true
          });
        }
      });

      // Verificar si existen animaciones
      if (gltf.animations && gltf.animations.length) {
        console.log("Animaciones cargadas:", gltf.animations); // Depuración: Ver qué animaciones se han cargado
        mixer2 = new THREE.AnimationMixer(model2); // Crear el AnimationMixer después de cargar el modelo

        // Verificar el nombre y detalles de cada animación
        gltf.animations.forEach((clip, index) => {
          console.log(`Animación ${index}:`, clip.name); // Mostrar nombre de la animación en la consola
          const action = mixer2.clipAction(clip);
          action.play();  // Reproducir la animación
          action.setLoop(THREE.LoopRepeat, Infinity); // Asegura que la animación se repita
          action.timeScale = 1; // Velocidad normal de la animación
        });
      } else {
        console.log("No se encontraron animaciones en el modelo GLB"); // Depuración: Verifica si hay animaciones
      }
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
  });



  // Animación y render loop
  function animate() {
    requestAnimationFrame(animate);
    controls2.update();

    // Verificar si el mixer está disponible y actualizarlo
    if (mixer2) {
      mixer2.update(0.1); // Actualiza las animaciones con un deltaTime mayor para mayor velocidad
    }

    if (model2) {
      model2.rotation.x = THREE.MathUtils.clamp(
        THREE.MathUtils.lerp(model2.rotation.x, -mouseY * Math.PI * 0.1, 0.03),
        -0.3, 0.3
      );
    }

    renderer2.render(scene2, camera2);
  }

  animate();
});

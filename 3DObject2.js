document.addEventListener("DOMContentLoaded", () => {
  const scene2 = new THREE.Scene();
  const camera2 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  const renderer2 = new THREE.WebGLRenderer({
    canvas: document.getElementById("3DObject2"),
    antialias: true,
    alpha: true
  });

  renderer2.setPixelRatio(window.devicePixelRatio);
  renderer2.setSize(window.innerWidth, window.innerHeight, false);

  const controls2 = new THREE.OrbitControls(camera2, renderer2.domElement);
  controls2.enableZoom = false;
  controls2.enablePan = false;
  controls2.enableRotate = true;

  scene2.add(new THREE.AmbientLight(0xffffff, 2));
  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight2.position.set(5, 10, 7.5);
  scene2.add(directionalLight2);

  let model2, mixer2;

  const updateModelView = () => {
    const isMobile = window.innerWidth <= 768;
    if (model2) {
      model2.scale.set(isMobile ? 1.2 : 1.8, isMobile ? 1.2 : 1.8, isMobile ? 1.2 : 1.8);
      controls2.enableRotate = !isMobile;
      controls2.autoRotate = false;
      camera2.position.set(isMobile ? -570 : -450, 250, isMobile ? 250 : 500);
    }
  };

  const loader2 = new THREE.GLTFLoader();
  loader2.load(
    "models/phoenix.glb",
    (gltf) => {
      model2 = gltf.scene;
      model2.rotation.set(0, Math.PI, 0);
      model2.position.set(0, -240, 0);
      scene2.add(model2);

      model2.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.wireframe = true;
        }
      });

      if (gltf.animations.length) {
        mixer2 = new THREE.AnimationMixer(model2);
        gltf.animations.forEach((clip) => {
          const action = mixer2.clipAction(clip);
          action.play().setLoop(THREE.LoopRepeat, Infinity).setEffectiveTimeScale(0.07);
        });
      }

      window.modelsLoaded++;
      window.checkAllModelsLoaded();
      updateModelView();
    },
    (xhr) => console.log(`Cargando modelo 2: ${(xhr.loaded / xhr.total) * 100} %`),
    (error) => console.error("Error cargando el modelo 2:", error)
  );

  window.addEventListener("resize", () => {
    camera2.aspect = window.innerWidth / window.innerHeight;
    camera2.updateProjectionMatrix();
    renderer2.setSize(window.innerWidth, window.innerHeight, false);
    updateModelView();
  });

  const animate = () => {
    requestAnimationFrame(animate);
    controls2.update();
    if (mixer2) mixer2.update(0.1);
    renderer2.render(scene2, camera2);
  };

  animate();
});

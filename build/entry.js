var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
var controls = new THREE.OrbitControls(camera, renderer.domElement);
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var intersectedObject, mouseOn;

scene.background = new THREE.Color( 0x000000 );

const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
hemiLight.position.set( 0, 20, 0 );
scene.add( hemiLight );

// Dir light
const dirLight = new THREE.DirectionalLight( 0xffffff );
dirLight.position.set( 3, 10, 10 );
dirLight.castShadow = true;
dirLight.shadow.camera.top = 2;
dirLight.shadow.camera.bottom = - 2;
dirLight.shadow.camera.left = - 2;
dirLight.shadow.camera.right = 2;
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 40;
scene.add( dirLight );

// lights
let light = new THREE.PointLight(0xffffff, 1, 10);
light.position.set(3.3, 3.75, -1.55);
scene.add(light);

light = new THREE.PointLight(0xf48fb1, 1, 10);
light.position.set(-1.03, 1.87, -2.4);
scene.add(light);

light = new THREE.PointLight(0xffffff, 1, 10);
light.position.set(0.25, 5.05, -0.05);
scene.add(light);

light = new THREE.PointLight(0xff0000, 1, 10);
light.position.set(-4.85, 2.7, 0.25);
scene.add(light);

light = new THREE.PointLight(0x0000ff, 1, 10);
light.position.set(2, 1.22, 1.7);
scene.add(light);

light = new THREE.PointLight(0xffffff, 1, 10);
light.position.set(1.4, 3.69, -2.45);
//scene.add(light);

light = new THREE.PointLight(0xff0000, 1, 10);
light.position.set(-4.97, 0.43, 0.18);
scene.add(light);

camera.position.z = 20;
camera.position.y = 10
camera.lookAt(new THREE.Vector3());

renderer.setSize(window.innerWidth, window.innerHeight);

const loader = new GLTFLoader();
  loader.load( 'models/Axolotl_Source (3).glb', function ( gltf ) {

    model = gltf.scene;
    scene.add( model );

    model.traverse( function ( object ) {

      if ( object.isMesh ) object.castShadow = true;

    } );

    skeleton = new THREE.SkeletonHelper( model );
    skeleton.visible = false;
    scene.add( skeleton );

    const animations = gltf.animations;
    mixer = new THREE.AnimationMixer( model );

    numAnimations = animations.length;

    for ( let i = 0; i !== numAnimations; ++ i ) {

      let clip = animations[ i ];
      const name = clip.name;

      if ( baseActions[ name ] ) {

        const action = mixer.clipAction( clip );
        activateAction( action );
        baseActions[ name ].action = action;
        allActions.push( action );

      } else if ( additiveActions[ name ] ) {

        // Make the clip additive and remove the reference frame

        THREE.AnimationUtils.makeClipAdditive( clip );

        if ( clip.name.endsWith( '_pose' ) ) {

          clip = THREE.AnimationUtils.subclip( clip, clip.name, 2, 3, 30 );

        }

        const action = mixer.clipAction( clip );
        activateAction( action );
        additiveActions[ name ].action = action;
        allActions.push( action );

      }

    }

    //createPanel();

    //animate();

  } );

var onMouseMove = function (e) {
  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObjects(scene.children);
  if (!intersects[0]) {
    intersectedObject = null
  }
  if (intersects[0] && intersects[0].object !== intersectedObject) { 
      intersectedObject = intersects[0].object
  }
  mouse.x = event.clientX / window.innerWidth * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
};

var onMouseDown = function (e) {
  console.log(intersectedObject)
};

var onKeyUp = function (e) {
  console.log(e.keyCode)
};

var animate = function () {
  controls.update;
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};
animate();

var windowResizeHandler = function () {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
};
windowResizeHandler();

window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('mousedown', onMouseDown, false);
window.addEventListener('keyup', onKeyUp, false);
window.addEventListener('resize', windowResizeHandler);

document.body.style.margin = 0;
document.body.appendChild(renderer.domElement);
import * as THREE from './node_modules/three/build/three.module.js';

import {OrbitControls} from './OrbitControls.js';

    // Start Button
    const startButton = document.getElementById( 'startButton' );
    startButton.addEventListener( 'click', init );

    // After Start
    function init() {

        const fftSize = 64;

        const overlay = document.getElementById( 'overlay' );
        overlay.remove();

        const container = document.getElementById( 'container' );

        // Renderer 
        const renderer = new THREE.WebGLRenderer(
        {antialias: true});

        renderer.setSize(window.innerWidth, window.innerHeight); //Full screen

        renderer.setClearColor(0x000000);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement)

        // Scene
        const scene = new THREE.Scene();

        //Camera
        const aspect = window.innerWidth / window.innerHeight;
        const camera = new THREE.PerspectiveCamera(45, aspect,1,5000);
        camera.position.setZ(8);

    
        // OrbitControls
        const control = new OrbitControls(camera, renderer.domElement);
        
            
        // Loop
        function animate() {

            requestAnimationFrame( animate );

            control.update();

            control.autoRotate = true;
        
            renderer.render( scene, camera );
        }
        requestAnimationFrame(animate);

        // Cubes
        function getRandomInt(max) {
            return Math.floor(Math.random() * max);          
        }
        
        const meshs = [];
        function generateObjects(geometry, material){
            for(let i=0; i<32; i++){
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set((i % 8 - 3.5) * 2.5, (Math.floor(i / 8) - 1.5) * 2.5, 0);
            mesh.rotation.set(Math.random(), Math.random(), 0);
            scene.add(mesh);
            meshs.push({
                mesh: mesh,
                rx: Math.random() * 0.1,
                ry: Math.random() * 0.1
            });
            }
        }

        // Texture
        const loader = new THREE.TextureLoader();
        const texture = loader.load('./asset/imgs/motif_8.jpg', (texture)=>{
        const m = new THREE.MeshBasicMaterial({
            color: 0xffffff, 
            map: texture
        });

        generateObjects(new THREE.BoxGeometry(), m);
        requestAnimationFrame(render);
        }); 
        
        // Add Backgound image
        const loaderBg = new THREE.TextureLoader();
        scene.background = loaderBg.load ('./asset/imgs/bg.jpg');
        
        // Audio
        const listener = new THREE.AudioListener();

        const audio = new THREE.Audio( listener );

        const file = './asset/audio/lol.mp3';

        {const loader = new THREE.AudioLoader();
            loader.load( file, function ( buffer ) {

                audio.setBuffer( buffer );
                audio.play();

            } );}

        let analyser = new THREE.AudioAnalyser( audio, fftSize );
 
    
        // Render
        function render(){
            // update
            meshs.forEach((m)=>{
              m.mesh.rotation.x += m.rx;
              m.mesh.rotation.y += m.ry;
            });

            // for resize objects
            let freq = analyser.getFrequencyData();

            for (let i = 0; i < meshs.length; i++)
            {
                var scale = 0.1 + freq[i]/800;
                meshs[i].mesh.scale.x = scale;
                meshs[i].mesh.scale.y = scale;
                meshs[i].mesh.scale.z = scale;
            }
        
            // rendu
            renderer.render(scene, camera);
            requestAnimationFrame(render);

            console.log(analyser.getFrequencyData()); //test
          }  

    }


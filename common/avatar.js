import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { VRMLoaderPlugin, VRMUtils, VRMSchema, VRM } from '@pixiv/three-vrm';
import * as QQ from '@pixiv/three-vrm';
//import { VRM, VRMUtils, VRMSchema } from "@pixiv/three-vrm"
import { loadMixamoAnimation } from './loadMixamoAnimation.js';
//import GUI from 'three/addons/libs/lil-gui.module.min.js';
import { mixamoVRMRigMap, blenderVRMRigMap } from './mixamoVRMRigMap.js';

//const model_sample 		= "https://trade3space.sgp1.cdn.digitaloceanspaces.com/sample.vrm"  //"sample.vrm";
const model_tpos 		= "hemo-2.vrm"; //"demo-6.vrm"; //"bochi-1.vrm"; //"demo-5.vrm"; //"demo-4.vrm"; //"himen1.vrm";	//"demo-2.vrm";	//"lady.vrm"; //"rokoko.vrm";
const model_sample 		= "sample.vrm";
const model_darkness 	= "darkness.vrm";
const model_creator		= "cc4new.vrm";
// renderer
var renderer = null;	//new THREE.WebGLRenderer();
var scene 	= null;
var camera	= null;
const helperRoot = new THREE.Group();
const clock = new THREE.Clock();
const params = {timeScale: 1.0};
let currentVrm 	= undefined;
let curGLTF 	= null;
let curAction	= null;
let currentAnimationUrl = "./greeting.fbx";
let currentMixer = undefined;

//	main: To Kill
/*
export function main (parent) {	
	//parent = document.body;
	const width 	= parent.clientWidth;	//window.innerWidth * 0.6;
	const height	= window.innerHeight * 0.8;
	renderer = new THREE.WebGLRenderer({ alpha: true } );
	renderer.setSize( width, height);
	//renderer.setSize( parent.clientWidth, parent.clientHeight );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.domElement.style.background = "transparent"
	parent.appendChild( renderer.domElement );
	//document.body.appendChild( renderer.domElement );

	// camera
	camera = new THREE.PerspectiveCamera( 30.0, width / height, 0.1, 20.0 );
	//camera = new THREE.PerspectiveCamera( 30.0, parent.clientWidth / parent.clientHeight, 0.1, 20.0 );
	camera.position.set( 0.0, 1.0, 5.0 );

	// camera controls

	const controls = new OrbitControls( camera, renderer.domElement );
	controls.screenSpacePanning = true;
	controls.target.set( 0.0, 1.0, 0.0 );
	controls.update();


	// scene
	scene = new THREE.Scene();

	// light
	const light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 1.0, 1.0, 1.0 ).normalize();
	scene.add( light );

	//const defaultModelUrl = './VRM1_Constraint_Twist_Sample.vrm';
	const defaultModelUrl = "./" + model_tpos;	//model_sample; //'./darkness.vrm';
	//const defaultModelUrl = model_sample;

	// gltf and vrm

	helperRoot.renderOrder = 10000;
	//scene.add( helperRoot );

	loadVRM( defaultModelUrl );

	// helpers
	const gridHelper = new THREE.GridHelper( 10, 10 );
	//scene.add( gridHelper );

	const axesHelper = new THREE.AxesHelper( 5 );
	//scene.add( axesHelper );

	// animate
	animate();

	// gui

	const gui = new GUI();

	gui.add( params, 'timeScale', 0.0, 2.0, 0.001 ).onChange( ( value ) => {
		currentMixer.timeScale = value;
	} );

	if (window) {
		// dnd handler
		window.addEventListener( 'dragover', function ( event ) {
			event.preventDefault();
		} );

		window.addEventListener( 'drop', function ( event ) {
			event.preventDefault();
			// read given file then convert it to blob url
			const files = event.dataTransfer.files;
			if ( ! files ) return;

			const file = files[ 0 ];
			if ( ! file ) return;

			const fileType = file.name.split( '.' ).pop();
			const blob = new Blob( [ file ], { type: 'application/octet-stream' } );
			const url = URL.createObjectURL( blob );

			if ( fileType === 'fbx' ) {
				loadFBX( url );
			} else {
				loadGLTF( url );
			}
		} );
	}

	return renderer;
}
*/
export function createScene (parent, pose=0, addlight=false) {	
	//parent = document.body;
	//const width 	= parent.clientWidth;			//window.innerWidth * 0.6;
	//const height	= window.innerHeight * 0.8;
	const width 	= parent.clientWidth;			//window.innerWidth * 0.6;
	const height	= parent.clientHeight;
	renderer = new THREE.WebGLRenderer({ alpha: true } );
	renderer.setSize( width, height);
	renderer.domElement.style.width		= "100%"
	renderer.domElement.style.height	= "100%"
	//renderer.setSize( parent.clientWidth, parent.clientHeight );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.domElement.style.background = "transparent"
	parent.appendChild( renderer.domElement );
	//document.body.appendChild( renderer.domElement );

	addEventListener("resize", (event) => {
		const width 	= renderer.domElement.clientWidth;
		const height	= renderer.domElement.clientHeight;
		//renderer.setSize(width, height);
		camera.aspect 	= 1.0 * width / height;
		camera.updateProjectionMatrix();
	});

	// camera
	camera = new THREE.PerspectiveCamera( 30.0, width / height, 0.1, 20.0 );
	//camera = new THREE.PerspectiveCamera( 30.0, parent.clientWidth / parent.clientHeight, 0.1, 20.0 );
	//camera.position.set( 0.0, 1.0, 5.0 );
	if (pose == 0)
		camera.position.set( 0.0, 1.0, 3.0 );
	else {
		//camera.position.set( 0.0, 1.3, 1.5 );  // 0.0, 1.3, 1.5
		camera.position.set( 0.0, 1.5, 2.0 );  // 0.0, 1.3, 1.5
		//camera.position.set( 0.0, 1.3, 5 );  // 0.0, 1.3, 1.5
		camera.lookAt(0.0, 1.5, 0.0);
	}
		
	
	//camera.lookAt(0.0, 1.0, 0.0);
	// camera controls
	/*
	const controls = new OrbitControls( camera, renderer.domElement );
	controls.screenSpacePanning = true;
	controls.target.set( 0.0, 1.0, 0.0 );
	controls.update();
	*/

	// scene
	scene = new THREE.Scene();

	// light
	const light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 0.0, 1.0, 7.0 ).normalize();
	scene.add( light );

	if (addlight) {
		const light2 = new THREE.DirectionalLight( 0xffffff );
		light2.position.set(-5.0, 0.0, 5.0 ).normalize();
		scene.add( light2 );

		const light3 = new THREE.DirectionalLight( 0xffffff );
		light3.position.set(5.0, 0.0, 5.0 ).normalize();
		scene.add( light3 );
	}
	
	//const defaultModelUrl = './VRM1_Constraint_Twist_Sample.vrm';
	const defaultModelUrl = "./" + model_tpos;	//model_sample; //'./darkness.vrm';
	//const defaultModelUrl = model_sample;

	// gltf and vrm

	helperRoot.renderOrder = 10000;
	//scene.add( helperRoot );

	//loadVRM( defaultModelUrl );

	// helpers
	const gridHelper = new THREE.GridHelper( 10, 10 );
	//scene.add( gridHelper );

	const axesHelper = new THREE.AxesHelper( 5 );
	//scene.add( axesHelper );

	// animate
	animate();

	if (window) {
		// dnd handler
		window.addEventListener( 'dragover', function ( event ) {
			event.preventDefault();
		} );

		window.addEventListener( 'drop', function ( event ) {
			event.preventDefault();
			// read given file then convert it to blob url
			const files = event.dataTransfer.files;
			if ( ! files ) return;

			const file = files[ 0 ];
			if ( ! file ) return;

			const fileType = file.name.split( '.' ).pop();
			const blob = new Blob( [ file ], { type: 'application/octet-stream' } );
			const url = URL.createObjectURL( blob );

			if ( fileType === 'fbx' ) {
				loadFBX( url );
			} else {
				loadGLTF( url );
			}
		} );
	}

	return {render: renderer, scene: scene};
}

function loadGLTF( animationUrl ) {
	console.log("load FBX")
	currentAnimationUrl = animationUrl;
	// create AnimationMixer for VRM
	currentMixer = new THREE.AnimationMixer( currentVrm.scene );
	// Load animation
	const loader = new GLTFLoader();
	//*
	loader.load(
		// URL of the VRM you want to load
		animationUrl,
		// called when the resource is loaded
		( gltf ) => {
			console.log("gltf",gltf)
			//const clip = THREE.AnimationClip.findByName( gltf.animations, 'kick' ); // extract the AnimationClip
			const clip = gltf.animations[0];
			const action = currentMixer.clipAction( clip )
			action.clampWhenFinished = true;
			//action.setLoop(THREE.LoopOnce, 1);
			action.play();
			currentMixer.timeScale = params.timeScale;
		}
	);
	/*/
	/*
	loadAction2VRM( animationUrl, currentVrm ).then( ( clip ) => {
		// Apply the loaded animation to mixer and play
		const action = currentMixer.clipAction( clip )
		action.clampWhenFinished = true;
		action.setLoop(THREE.LoopOnce, 1);
		action.play();
		currentMixer.timeScale = params.timeScale;
	} );
	*/
}

function vrmConvertAnimation(vrm, clip, asset) {
	const tracks = []; // KeyframeTracks compatible with VRM will be added here
	const restRotationInverse 		= new THREE.Quaternion();
	const parentRestWorldRotation 	= new THREE.Quaternion();
	const _quatA 	= new THREE.Quaternion();
	const _vec3 	= new THREE.Vector3();

	// Adjust with reference to hips height.
	///*
	//const motionHipsHeight = asset.getObjectByName( 'mixamorigHips' ).position.y;
	//const motionHipsHeight = asset.scene.getObjectByName( 'Hips' ).position.y;
	//const vrmHipsY 		= vrm.humanoid?.getNormalizedBoneNode( 'hips' ).getWorldPosition( _vec3 ).y;
	//const vrmRootY 		= vrm.scene.getWorldPosition( _vec3 ).y;
	//const vrmHipsHeight = Math.abs( vrmHipsY - vrmRootY );
	//const hipsPositionScale = vrmHipsHeight / motionHipsHeight;
	const hipsPositionScale = 1;

	clip.tracks.forEach( ( track ) => {
		// Convert each tracks for VRM use, and push to `tracks`
		const trackSplitted = track.name.split( '.' );
		const mixamoRigName = trackSplitted[ 0 ];
		//const vrmBoneName 	= mixamoVRMRigMap[ mixamoRigName ];
		const vrmBoneName 	= blenderVRMRigMap[mixamoRigName];  
		//const vrmBoneName 	= mixamoRigName.toLowerCase();
		const vrmNodeName 	= vrm.humanoid?.getNormalizedBoneNode( vrmBoneName )?.name;
		//console.log(QQ)
		//console.log(VRMSchema);
		//const vrmNodeName = vrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName[vrmBoneName])?.name;
		//const vrmNodeName = vrm.humanoid.getBoneNode(vrmBoneName)?.name;
		const mixamoRigNode = asset.scene.getObjectByName( mixamoRigName );
		const newvalues = [];

		if ( vrmNodeName != null ) {
			const propertyName = trackSplitted[ 1 ];
			// Store rotations of rest-pose.
			mixamoRigNode.getWorldQuaternion( restRotationInverse ).invert();
			mixamoRigNode.parent.getWorldQuaternion( parentRestWorldRotation );
			if ( track instanceof THREE.QuaternionKeyframeTrack ) {
				// Retarget rotation of mixamoRig to NormalizedBone.
				for ( let i = 0; i < track.values.length; i += 4 ) {
					const flatQuaternion = track.values.slice( i, i + 4 );
					
					_quatA.fromArray( flatQuaternion );
					// 親のレスト時ワールド回転 * トラックの回転 * レスト時ワールド回転の逆
					_quatA.premultiply( parentRestWorldRotation )
							.multiply( restRotationInverse );
					_quatA.toArray( flatQuaternion );

					flatQuaternion.forEach( ( v, index ) => {
						//track.values[ index + i ] = v;
						newvalues[index + i] = v;
					} );
				}
				tracks.push(
					new THREE.QuaternionKeyframeTrack(
						`${vrmNodeName}.${propertyName}`,
						track.times,
						//track.values.map( ( v, i ) => ( vrm.meta?.metaVersion === '0' && i % 2 === 0 ? - v : v ) ),
						newvalues.map( ( v, i ) => ( vrm.meta?.metaVersion === '0' && i % 2 === 0 ? - v : v ) ),
					),
				);
			} else if ( track instanceof THREE.VectorKeyframeTrack ) {
				//const value = track.values.map( ( v, i ) => ( vrm.meta?.metaVersion === '0' && i % 3 !== 1 ? - v : v ) * hipsPositionScale );
				//tracks.push( new THREE.VectorKeyframeTrack( `${vrmNodeName}.${propertyName}`, track.times, value ) );
			}
		} else {
			//console.log("lack norm bone", mixamoRigName)
		}
	})

	//console.log("glb","org",clip.tracks,"new",tracks);
	return new THREE.AnimationClip( 'vrmAnimation', clip.duration, tracks );
}

export function loadAction2VRM( url, vrm ) {
	const loader = new GLTFLoader(); // A loader which loads FBX
	return loader.loadAsync( url ).then( ( asset ) => {
		//const clip = THREE.AnimationClip.findByName( asset.animations, 'mixamo.com' ); // extract the AnimationClip
		const clip = asset.animations[0];
		const tracks = []; // KeyframeTracks compatible with VRM will be added here
		const restRotationInverse = new THREE.Quaternion();
		const parentRestWorldRotation = new THREE.Quaternion();
		const _quatA = new THREE.Quaternion();
		const _vec3 = new THREE.Vector3();

		// Adjust with reference to hips height.
		///*
		const motionHipsHeight = asset.scene.getObjectByName( 'mixamorigHips' ).position.y;
		const vrmHipsY 		= vrm.humanoid?.getNormalizedBoneNode( 'hips' ).getWorldPosition( _vec3 ).y;
		const vrmRootY 		= vrm.scene.getWorldPosition( _vec3 ).y;
		const vrmHipsHeight = Math.abs( vrmHipsY - vrmRootY );
		const hipsPositionScale = vrmHipsHeight / motionHipsHeight;
		//*/
		//const hipsPositionScale = 1;
		clip.tracks.forEach( ( track ) => {
			// Convert each tracks for VRM use, and push to `tracks`
			const trackSplitted = track.name.split( '.' );
			const mixamoRigName = trackSplitted[ 0 ];
			const vrmBoneName 	= mixamoVRMRigMap[ mixamoRigName ];
			const vrmNodeName 	= vrm.humanoid?.getNormalizedBoneNode( vrmBoneName )?.name;
			//console.log(QQ)
			//console.log(VRMSchema);
			//const vrmNodeName = vrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName[vrmBoneName])?.name;
			//const vrmNodeName = vrm.humanoid.getBoneNode(vrmBoneName)?.name;
			const mixamoRigNode = asset.scene.getObjectByName( mixamoRigName );

			if ( vrmNodeName != null ) {
				const propertyName = trackSplitted[ 1 ];
				// Store rotations of rest-pose.
				mixamoRigNode.getWorldQuaternion( restRotationInverse ).invert();
				mixamoRigNode.parent.getWorldQuaternion( parentRestWorldRotation );
				if ( track instanceof THREE.QuaternionKeyframeTrack ) {
					// Retarget rotation of mixamoRig to NormalizedBone.
					for ( let i = 0; i < track.values.length; i += 4 ) {
						const flatQuaternion = track.values.slice( i, i + 4 );
						_quatA.fromArray( flatQuaternion );
						// 親のレスト時ワールド回転 * トラックの回転 * レスト時ワールド回転の逆
						_quatA.premultiply( parentRestWorldRotation )
								.multiply( restRotationInverse );
						_quatA.toArray( flatQuaternion );

						flatQuaternion.forEach( ( v, index ) => {
							track.values[ index + i ] = v;
						} );
					}
					tracks.push(
						new THREE.QuaternionKeyframeTrack(
							`${vrmNodeName}.${propertyName}`,
							track.times,
							track.values.map( ( v, i ) => ( vrm.meta?.metaVersion === '0' && i % 2 === 0 ? - v : v ) ),
						),
					);
				} else if ( track instanceof THREE.VectorKeyframeTrack ) {
					const value = track.values.map( ( v, i ) => ( vrm.meta?.metaVersion === '0' && i % 3 !== 1 ? - v : v ) * hipsPositionScale );
					tracks.push( new THREE.VectorKeyframeTrack( `${vrmNodeName}.${propertyName}`, track.times, value ) );
				}
			}
		} );

		console.log("glb","org",clip.tracks,"new",tracks);
		return new THREE.AnimationClip( 'vrmAnimation', clip.duration, tracks );
	} );
}

const actionList = [];
function mapAction(name) {
	const clip0 	= THREE.AnimationClip.findByName( curGLTF.animations, name); // extract the AnimationClip
	const clipC 	= (currentVrm && clip0)? vrmConvertAnimation(currentVrm, clip0, curGLTF): null;
	const action	= (clipC) ? currentMixer.clipAction(clipC):null;

	if (action) action.clampWhenFinished = true;

	return action;
}

export function playThreeAction(name, times=0, rest=null) {
	const action = actionList[name];

	if (! currentMixer) return;
	if (! curGLTF) return;
	if (! action) return;

	if (curAction) curAction.stop();
	
	if (times == 0) {
		action.setLoop(THREE.LoopRepeat);
	} else {
		action.setLoop(THREE.LoopOnce);
	}
	if (rest) {
		action.getMixer().addEventListener('finished',(e)=>{
			const restAct = actionList[rest];
			if (restAct) {
				restAct.play();
				curAction = restAct;
			}
		});
	}
	action.play();
	curAction = action;

	currentMixer.timeScale = params.timeScale;
}

export function playThreeAction0(name) {
	if (! currentMixer) return;
	if (! curGLTF) return;

	if (curAction) curAction.stop();
	//currentMixer	= new THREE.AnimationMixer(currentVrm.scene);
	const clip0 	= THREE.AnimationClip.findByName( curGLTF.animations, name); // extract the AnimationClip
	const clipC 	= (currentVrm)? vrmConvertAnimation(currentVrm, clip0, curGLTF): null;
	const action	= (clipC) ? currentMixer.clipAction(clipC):null;
	if (action) action.clampWhenFinished = true;
	action.play();
	curAction = action;

	currentMixer.timeScale = params.timeScale;

	/*
	const clip 		= THREE.AnimationClip.findByName( gltf.animations, 'tpos' ); // extract the AnimationClip
	const clipC 	= (vrm)? vrmConvertAnimation(vrm, clip, gltf): null;
	const actionC 	= (clipC) ? currentMixer.clipAction( clipC ): null
	if (actionC) actionC.clampWhenFinished	= true;
	if (actionC) actionC.play();
	curAction = actionC;
	currentMixer.timeScale = params.timeScale;
	*/
}

export function loadVRM( modelUrl ) {
	console.log("load VRM")
	const loader = new GLTFLoader();
	loader.crossOrigin = 'anonymous';
	helperRoot.clear();
	///*
	loader.register( ( parser ) => {
		return new VRMLoaderPlugin( parser, { helperRoot: helperRoot, autoUpdateHumanBones: true } );
		//return new VRMLoaderPlugin( parser );
	} );
	//*/
	loader.load(
		// URL of the VRM you want to load
		modelUrl,
		// called when the resource is loaded
		( gltf ) => {
			///*
			curGLTF = gltf;
			const vrm = gltf.userData.vrm;
			//const vrm = gltf;
			if ( currentVrm ) {
				scene.remove( currentVrm.scene );
				VRMUtils.deepDispose( currentVrm.scene );
			}

			// put the model to the scene
			currentVrm = vrm;
			if (vrm) {
				scene.add( vrm.scene );
				// Disable frustum culling
				vrm.scene.traverse( ( obj ) => {
					obj.frustumCulled = false;
				} );
			} else {
				scene.add( gltf.scene );
				// Disable frustum culling
				gltf.scene.traverse( ( obj ) => {
					obj.frustumCulled = false;
				} );
			}
			currentMixer	= new THREE.AnimationMixer(currentVrm.scene);	//gltf.scene );	//currentVrm.scene );
			/*
			const clip 		= THREE.AnimationClip.findByName( gltf.animations, 'tpos' ); // extract the AnimationClip
			const clipC 	= (vrm)? vrmConvertAnimation(vrm, clip, gltf): null;
			const actionC 	= (clipC) ? currentMixer.clipAction( clipC ): null
			if (actionC) actionC.clampWhenFinished	= true;
			if (actionC) actionC.play();
			curAction = actionC;
			currentMixer.timeScale = params.timeScale;
			*/
			//playThreeAction("tpos");
			actionList["still"] = mapAction("still");
			//actionList["idle"] 	= mapAction("idle");
			//actionList["tpos"] 	= mapAction("tpos");
			actionList["wave"]	= mapAction("wave");
			actionList["bow"]	= mapAction("bow");
			actionList["run"]	= mapAction("run");
			actionList["dance"]	= mapAction("dance");
			actionList["walk"]	= mapAction("walk");
			//actionList["dance"] = mapAction("dance");

			// if ( currentAnimationUrl ) loadFBX( currentAnimationUrl );
			// rotate if the VRM is VRM0.0
			if(vrm) VRMUtils.rotateVRM0( vrm );
			console.log( vrm );

			playThreeAction("still");
		},
		// called while loading is progressing
		( progress ) => {
			console.log( 'Loading model...', 100.0 * ( progress.loaded / progress.total ), '%' )
		},
		// called when loading has errors
		( error ) => console.error( error ),
	);
}

// mixamo animation
function loadFBX( animationUrl ) {
	console.log("load FBX")
	currentAnimationUrl = animationUrl;
	// create AnimationMixer for VRM
	currentMixer = new THREE.AnimationMixer( currentVrm.scene );
	// Load animation
	loadMixamoAnimation( animationUrl, currentVrm ).then( ( clip ) => {
		// Apply the loaded animation to mixer and play
		const action = currentMixer.clipAction( clip )
		action.clampWhenFinished = true;
		//action.setLoop(THREE.LoopOnce, 1);
		if( curAction) curAction.stop();
		action.play();
		curAction = action;
	
		currentMixer.timeScale = params.timeScale;
	} );
}

var express 	= false;
var curIndex 	= -1;
export function setSpeak(doit) {
	express = doit;
	curIndex = -1;
	if (express.vowel) express.vowel.push("")
	if (express.play) {
		clock.stop();
		clock.start();
	} else {
		//clock.stop();
	}
}
function animate() {
	requestAnimationFrame( animate );
	const deltaTime = clock.getDelta();
	const elapsedTime = clock.elapsedTime;
	//const unit = express.duration / express.vowel.length;
	//const index = Math.floor(clock.elapsedTime / unit);

	if ( currentVrm && express) {
		// tweak expressions
		if (express.play) {	
			const unit = express.duration / express.vowel.length;
			const index = Math.floor(elapsedTime / unit);
			const vowel = express.vowel[index % express.vowel.length];
			const delta = (elapsedTime - index * unit) / unit;

			//const s = 1 + Math.sin( Math.PI *  delta);
			const s = Math.sin( Math.PI *  delta);
			//console.log("month", index+"/"+express.vowel.length, vowel, unit, elapsedTime, delta, s);
			if (curIndex != index && curIndex >= 0) {
			//	Must reset previous vowel first
				const vowel = express.vowel[curIndex % express.vowel.length];
				currentVrm.expressionManager.setValue( vowel, 0 );
				console.log("reset", vowel);
			}
			curIndex = index;
			if (vowel != "" && index < express.vowel.length) 
				currentVrm.expressionManager.setValue( vowel, 0.8 * s );
				//currentVrm.expressionManager.setValue( 'aa', 0);
			else
				currentVrm.expressionManager.setValue( 'aa', 0 );
		} else {
			//console.log("month", 'close');
			//currentVrm.expressionManager.setValue( 'aa', 0 );
		}
		/*
		const s = (express)? (1+ Math.sin( Math.PI * clock.elapsedTime )): 0;
		
		currentVrm.expressionManager.setValue( 'aa', 0.5 * s );
		currentVrm.expressionManager.setValue( 'blinkLeft',  0.2 * s );
		currentVrm.expressionManager.setValue( 'blinkRight', 0.2 * s );
		*/
	} else {
		//console.log("month", '?????');
	}

	// if animation is loaded
	if (currentMixer) currentMixer.update( deltaTime );
	if ( currentVrm ) currentVrm.update( deltaTime );

	renderer.render( scene, camera );
}
// file input

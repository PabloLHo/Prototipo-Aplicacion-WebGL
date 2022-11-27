<?php
////////////////// CONEXION A LA BASE DE DATOS ////////////////////////////////////
include("Recursos/php/conectar.php");
error_reporting(0);
session_start();

$clave = $_SESSION['usuario'];

if( $clave != null &&  time() - $_SESSION['tiempo'] < 43200){
	header("location:Home.php");
};
?>

<html lang="es">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
	<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">

	<link rel="stylesheet" type="text/css" href="Recursos/css/login.css" media="all">
	
	    <script src="https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.6.2/dat.gui.min.js"></script>
        <script src="https://assets.babylonjs.com/generated/Assets.js"></script>
        <script src="https://preview.babylonjs.com/ammo.js"></script>
        <script src="https://preview.babylonjs.com/cannon.js"></script>
        <script src="https://preview.babylonjs.com/Oimo.js"></script>
        <script src="https://preview.babylonjs.com/earcut.min.js"></script>
        <script src="https://preview.babylonjs.com/babylon.js"></script>
        <script src="https://preview.babylonjs.com/materialsLibrary/babylonjs.materials.min.js"></script>
        <script src="https://preview.babylonjs.com/proceduralTexturesLibrary/babylonjs.proceduralTextures.min.js"></script>
        <script src="https://preview.babylonjs.com/postProcessesLibrary/babylonjs.postProcess.min.js"></script>
        <script src="https://preview.babylonjs.com/loaders/babylonjs.loaders.js"></script>
        <script src="https://preview.babylonjs.com/serializers/babylonjs.serializers.min.js"></script>
        <script src="https://preview.babylonjs.com/gui/babylon.gui.min.js"></script>
        <script src="https://preview.babylonjs.com/inspector/babylon.inspector.bundle.js"></script>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
		<script src='https://cdnjs.cloudflare.com/ajax/libs/vue/2.3.4/vue.min.js'></script>
		
		<script src="Recursos/js/modeladoLogin.js"></script>


    <title>Gemelo Digital</title>
</head>

	<style>
		html,body{

			 display: block;
			 width: 100%;
			 height: 100%;

		}

		canvas{

			 display: block;
			 position: absolute;

		}
	</style>
	
	<script>
		function cambioTamano(){

			const canvas = document.getElementById("renderCanvas");
			requestAnimationFrame(()=>{

				 const cWidth = window.innerWidth;
				 const cHeight = window.innerHeight;
				 canvas.width = cWidth;
				 canvas.height = cHeight;

			});
		}
		setInterval(cambioTamano, 1);
	</script>
  
  <body>	
	<!-- Cabecera -->
	<section>
		<div class="container" id="login">
			<center>
				<h2>
				  <a>Login</a>
				</h2>
			</center>
			<form action="Recursos/php/inicioSesion.php" method="post">
				<center>
					<div> 
						<input type="text" name="usuario" placeholder="Username" value="">
						<input type="password" name="contraseña" placeholder="Password">
					</div>
					<p class="a-link"><a href="#forget-password">Forget password?</a></p>
					<button class="custom-btn" style="width: 50%; text-align:center">Login</button>
				</center>
			</form>
		</div>
	</section>
	
	<section id="modelado" >
		<div>
			<canvas id="renderCanvas"></canvas>	
			<canvas> </canvas>
			<script src="Recursos/js/cargaBabylon.js"></script>
			
		</div>
	</section>

  </body>
</html>
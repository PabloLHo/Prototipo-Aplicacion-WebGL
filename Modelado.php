<?php
////////////////// CONEXION A LA BASE DE DATOS ////////////////////////////////////
include("Recursos/php/conectar.php");
session_start();

$clave = $_SESSION['usuario'];

if( $clave == null ){
	header("location:index.php");
};

if(time() - $_SESSION['tiempo'] > 43200){
	header("location:index.php");
}
?>

<html lang="es">
  <head>
    <!-- Required meta tags -->
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">

		<!-- Bootstrap CSS -->
		<link rel="stylesheet" type="text/css" href="Recursos/css/bootstrap.min.css" media="all">
		
		<!-- CSS propio -->
		<link rel="stylesheet" href="Recursos/css/renderCanvas.css">

	
	    <!-- Javascript librerias externas -->
		<script src="Recursos/js/Externo/jquery-6.0.0-min.js"></script>
		<script src="Recursos/js/Externo/Bootstrap/bootstrap.bundle.js"></script>
		<script src="Recursos/js/Externo/Bootstrap/bootstrap.js"></script>
		
		<!-- Babylonjs Javascript -->
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
		
		<!--Gui-->
		<script src='https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.7.7/dat.gui.min.js'></script>

		<!-- Javascript propio -->
		
		<script src="Recursos/js/Modelo/escena.js"></script>
		<script src="Recursos/js/Modelo/Control/recorte.js"></script>
		<script type="text/javascript" src="Recursos/js/openCV/oliveTreeDetection.js"></script>
		<script src="Recursos/js/OpenCV/OpenCV-4.7.0.js" type="text/javascript"></script>
		

		<title>Gemelo Digital</title>
	
	</head>
  
	<body>
	
		<!-- Sección con toda la interfaz -->		
			<script src="Recursos/js/Modelo/Control/gui.js"></script>
			
			<!-- Modelado -->
			<section id="modelado" >
				<div class="canvasZone">
					<canvas class="renderCanvas" id="renderCanvas"></canvas>	
					<script src="Recursos/js/Modelo/cargaBabylon.js"></script>
				</div>
			</section>

			<div class="inputoutput">
				<img id="imageSrc" src="Recursos/ortofotos/Marmolejo_O_1477851258.jpg" style="display: none">
				<canvas id="canvasOutput" style="display: none" ></canvas>
			</div>

			
		
	</body>
</html>
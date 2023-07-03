<?php
////////////////// CONEXION A LA BASE DE DATOS ////////////////////////////////////
include("Recursos/php/conectar.php");
session_start();

$clave = $_SESSION['usuario'];

if( $clave == null || (time() - $_SESSION['tiempo']) > 43200){
	header("location:index.php");
};
?>


<html lang="es">
  <head>
    <!-- Required meta tags -->
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">

		<!-- Bootstrap CSS -->
		<link rel="stylesheet" type="text/css" href="Recursos/css/bootstrap.min.css" media="all">
		<link rel="icon" type="image/x-icon" href="Recursos/imagenes/logo.png">
		<!-- CSS propio -->
		<link rel="stylesheet" href="Recursos/css/renderCanvas.css">
		<link rel="stylesheet" href="Recursos/css/mensajes.css">

	
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
		<script src="Recursos/js/Modelo/Control/algoritmos.js"></script>
		

		<title>Escena 3D</title>
	
	</head>
  
	<body>
	
		<!-- Sección con toda la interfaz -->		
		<script src="Recursos/js/Modelo/Control/gui.js"></script>
			
		<div id="mensaje" class="info-msg" style="width: 100%; position: absolute">
			<a>
				Cargando nube de puntos. Espere a la finalización.
			</a>                   
	    </div>

		<div id="recorte" class="info-msg" style="width: 100%; position: absolute; display: none">
			<a>
				Establecer un vertice clic, finalizar el recorte doble clic en el vertice previo al cierre del poligono.
			</a>                   
	    </div>

		<div id="seleccion" class="info-msg" style="width: 100%; position: absolute; display: none">
			<a onclick="document.getElementById('seleccion').style.display = 'none'"><i class="fa fa-times "></i>
				Para recortar usar visión cenital.
			</a>                   
	    </div>

		<div id="procesamientoVisual" class="info-msg" style="width: 100%; position: absolute; display: none">
			<a>
				Se esta realizando la deteccion de entidades, espere a la finalización para continuar.
			</a>                   
	    </div>

		<div id="deteccion" class="info-msg" style="width: 100%; position: absolute; display: none">
			<a onclick="document.getElementById('deteccion').style.display = 'none'"><i class="fa fa-times "></i>
				Para la detección usar una capa de información con la textura disponible.
			</a>                   
	    </div>

		<div id="mueveOlivo" class="info-msg" style="width: 100%; position: absolute; display: none">
			<a onclick="cancelarMovimiento()"><i class="fa fa-times "></i>
				Clicar en la nueva posición del olivo, pulsa la x para cancelar la operacion.
			</a>                   
	    </div>

		<!-- Modelado -->
		<section id="modelado" >
			<div class="canvasZone">
				<canvas class="renderCanvas" id="renderCanvas"></canvas>	
				<script src="Recursos/js/Modelo/cargaBabylon.js"></script>
			</div>
		</section>		
		
	</body>
</html>
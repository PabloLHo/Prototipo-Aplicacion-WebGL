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
		<link rel="stylesheet" href="Recursos/css/botones.css">
		<link rel="stylesheet" href="Recursos/css/styleOpciones.css">
		<link rel="stylesheet" href="Recursos/css/styleTabla.css">
		<link rel="stylesheet" href="Recursos/css/renderCanvas.css">

	
	    <!-- Javascript librerias externas -->
		<script src="Recursos/js/Externo/jquery-6.0.0-min.js"></script>
		<script src="Recursos/js/Externo/bootstrap.bundle.js"></script>
		<script src="Recursos/js/Externo/bootstrap.js"></script>
		
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


		<!-- Javascript propio -->
		<script src="Recursos/js/funcionesModelado.js"></script>
		<script src="Recursos/js/escena.js"></script>

		

		<title>Gemelo Digital</title>
	
	</head>
  
	<body>
	
		<!-- Sección con toda la interfaz -->		
			<script src="Recursos/js/cargaModelo.js"></script>
			
			<!-- Opciones modelo -->
			<section class="container-fluid">
				<dialog id="ModalConfiguraciones" style="width: 30%;">
					<div class="modal-content">
						<div class="modal-header">
							<a class="button cross" onclick="document.getElementById('ModalConfiguraciones').close()"></a>
							<h4 class="modal-title" style="width: auto">Configuración</h4>
						</div>
						<div class="modal-body">
							<div class="row" style="justify-content: center; align-items: center">
								<div class="col">
									<div class="row">
										<div class="slideThree"> 
											<input type="checkbox" value="None" id="slideThree" name="check"/>
											<label for="slideThree"></label>
										</div>
									</div>
									<div class="row" style="text-align: center"><p>Seleccion</p></div>
								</div>
								<button id="show" class='custom-btn btn-5' onclick="document.getElementById('ms').showModal()">Controles</button>
								<button id="show" class='custom-btn btn-5' onclick="location.href='InformacionSeleccion.php?modelo=parcela_1'">Ir informacion</button>
							</div>
							<br/>
							<div class="row" style="justify-content: center">
								<button id="show" class='custom-btn btn-5' onclick="document.getElementById('zonas').showModal()">Zonas</button>
								<button id="vueltaModelo" class='custom-btn btn-5' style="display: none" onclick="volverModelo();">Volver modelo</button>
							</div>
							<br/>
							<h4 class="modal-title">Camara</h4>
							<div class="row" style="justify-content: center">
								<div class="col">
									<div class="row">
										<div class="roundedOne">
											<input type="checkbox" value="None" id="roundedOne" name="check"/>
											<label for="roundedOne"></label>
										</div>
									</div>
									<div class="row" style="text-align: center"><p>Camara cenital</p></div>
								</div>
								<div class="col">
									<div class="row">
										<div class="roundedOne">
											<input type="checkbox" value="None" id="roundedOne2" name="check" checked />
											<label for="roundedOne2"></label>
										</div>
									</div>
									<div class="row" style="text-align: center"><p>Camara Perspectiva</p></div>
								</div>
								<div class="col">
									<div class="row">
										<div class="roundedOne">
											<input type="checkbox" value="None" id="roundedOne3" name="check"/>
											<label for="roundedOne3"></label>
										</div>
									</div>
									<div class="row" style="text-align: center"><p>Primera Persona</p></div>
								</div>
							</div>
						</div>
						<button id="close" class='custom-btn btn-5' onclick="actualizarEscena(); document.getElementById('ModalConfiguraciones').close()" style="width: auto">Aplicar</button>
					</div>
				</dialog>
			</section>
			
			
			<!-- Controles e información de zonas para el modelo -->
			<section>
				<dialog id="ms">
					<h2>Controles</h2>
					<p>Presiona <b>sobre el modelo</b> para empezar a interactuar</p>
					<p>Presiona <b>q</b> para quitar los olivos</p>
					<p>Presiona <b>c</b> para quitar la casas</p>
					<p>Presiona <b>l</b> para quitar la altitud</p>
					<p>Presiona <b>v</b> para cambiar el modo de visión</p>
					<p>......</p>
					<button id="close" class='custom-btn btn-5' onclick="document.getElementById('ms').close()">Volver</button>
				</dialog>			
			
				<dialog id="zonas" style="width: 50%">
					<table  class="container">
						<thead>
							<tr><th colspan="5" style="background-color: #ffffff;"><h4 style="text-align: center; color: #00AAE4;">Información Zonas</h4></th></tr>
							<tr>
								<th><h1>Zona</h1></th>
								<th><h1>Uso</h1></th>
								<th><h1>Superficie &nbsp(ha)</h1></th>
								<th><h1>Pendiente (%)</h1></th>
								<th><h1>Incidencias</h1></th>
								<th><h1>&nbsp </h1></th>
							</tr>
						</thead>
						<tbody id="miTabla2">
						</tbody>
					</table>
					<h5> &nbsp </h5>
					<table class="container">
						<thead>
							<tr>
								<th><h1>Código incidencia</h1></th>
								<th><h1>Descripción</h1></th>
							</tr>
						</thead>
						<tbody id="miTablaIncidencias">
						</tbody>
					</table>
					<h5> &nbsp </h5>
					<button id="close" class='custom-btn btn-5' onclick="document.getElementById('zonas').close()">Volver</button>
				</dialog>
			</section>
			
			
			<!-- Modelado -->
			<section id="modelado" >
				<div class="canvasZone">
					<canvas class="renderCanvas" id="renderCanvas"></canvas>	
					<script src="Recursos/js/cargaBabylon.js"></script>
				</div>
			</section>

			
		
	</body>
</html>
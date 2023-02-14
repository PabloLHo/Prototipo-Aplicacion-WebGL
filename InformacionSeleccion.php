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
		<link rel="stylesheet" type="text/css" href="Recursos/css/dashboard.css" media="all">
		<link rel="stylesheet" href="Recursos/fonts/fontawesome-all.min.css">
		
		<!-- CSS Propio -->
		<link rel="stylesheet" href="Recursos/css/styleTabla.css">
		<link rel="stylesheet" href="Recursos/css/botones.css">
		<link rel="stylesheet" href="Recursos/css/acordeon.css">
		<link rel="stylesheet" href="Recursos/css/responsive.css">
		
		<!-- Javascript librerias externas -->
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
		<script src="Recursos/js/Informacion/funcionesInformacion.js"></script>
		<script src="Recursos/js/Modelo/funcionesModelado.js"></script>
		<script src="Recursos/js/Modelo/escena.js"></script>
		<script src="Recursos/js/Modelo/recorte.js"></script>

		<!-- Javascript propio -->
		
		<title>Gemelo Digital</title>
	
	</head>
  
	<body>	
	<!-- Seccion contenedora de toda la interfaz --> 
		<!-- dashboard -->
		<div id="wrapper">
			<!-- Barra lateral -->
			<nav class="navbar align-items-start sidebar sidebar-dark accordion p-0" style="background-color: rgb(0,187,45);">
				<div class="container-fluid d-flex flex-column p-0">
					<!-- Cabecera dashboardggg -->
					<a class="d-flex justify-content-center align-items-center sidebar-brand m-0" href="Home.php">
						<img src="Recursos/imagenes/logo_inves.png" width="100%" height="auto" style="z-index: 2000">
						<!-- <div class="sidebar-brand-icon rotate-n-15"><i class="fas fa-laugh-wink"></i></div> -->
					</a>
					<hr class="featurette-divider">
					<ul class="navbar-nav text-light" id="accordionSidebar">
						<li class="nav-item">
							<a class="nav-link active" id="link_principal" href="#" onclick="muestraPrincipal()">
								<i class="fas fa-tachometer-alt"></i><span>Principal</span>
							</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" id="link_zonas"  href="#" onclick="muestraZonas()">
								<i class="fas fa-user"></i><span>División Zonas</span>
							</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" id="link_historico" href="#" onclick="muestraHistorico()">
								<i class="fas fa-user"></i><span>Historico Datos</span>
							</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" id="link_prediccion" href="#" onclick="muestraPrediccion()">
								<i class="fas fa-table"></i><span>Predicción Datos</span>
							</a>
						</li>
					</ul>
					<div class="text-center d-none d-md-inline"><button class="btn rounded-circle border-0" id="sidebarToggle" type="button"></button></div>
				</div>
			</nav>
			
			<div class="d-flex flex-column" id="content-wrapper">
		
				<!-- Contenido previo al footer -->
				<div id="content">
			
					<!-- Cabecera -->
					<nav class="navbar navbar-light navbar-expand shadow mb-4 topbar static-top">
						<div class="container-fluid" >
							<button class="btn btn-link d-md-none rounded-circle me-3" id="sidebarToggleTop" type="button">
								<i class="fas fa-bars"></i>
							</button>
							<a href="Home.php" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
								<span class="fs-4 text-dark">Gestión de la Parcela</span>
							</a>
							<ul class="navbar-nav flex-nowrap ms-auto">
								<div class="d-none d-sm-block topbar-divider"></div>
								<li class="nav-item dropdown no-arrow">
									<div class="nav-item dropdown no-arrow">
										<a class="dropdown-toggle nav-link" aria-expanded="false" data-bs-toggle="dropdown" href="#">
											<span class="d-none d-lg-inline me-2 text-gray-600 small"><b> <?php echo $clave;?> </b></span>
											<img class="border rounded-circle img-profile" src="Recursos/imagenes/dron.png">
										</a>
										<div class="dropdown-menu shadow dropdown-menu-end animated--grow-in">
											<a class="dropdown-item" href="#"><i class="fas fa-user fa-sm fa-fw me-2 text-gray-400"></i>&nbsp;Profile</a>
											<a class="dropdown-item" href="#"><i class="fas fa-cogs fa-sm fa-fw me-2 text-gray-400"></i>&nbsp;Settings</a>
											<a class="dropdown-item" href="#"><i class="fas fa-list fa-sm fa-fw me-2 text-gray-400"></i>&nbsp;Activity log</a>
											<div class="dropdown-divider"></div>
											<form action="Recursos/php/cierreSesion.php" method="post">
												<button class="dropdown-item" href="#"><i class="fas fa-sign-out-alt fa-sm fa-fw me-2 text-gray-400"></i> &nbsp;Cerrar Sesión</button>
											</form>
										</div>
									</div>
								</li>
							</ul>
						</div>
					</nav>
					
					
					<div class="container-fluid">
					
						<section class="container-fluid">
							<div class="row align-items-center justify-content-center" id="Modelo">
									<canvas id="renderCanvas" style="height: 500"></canvas>
									<script src="Recursos/js/cargaBabylon.js"></script>										
							</div>
							<hr class="featurette-divider">
							<h5> &nbsp </h5>
						</section>
					
						<section id="Principal" class="container-fluid">
							<!-- Modelado e información principal -->
							<div class="row align-items-center justify-content-center" id="Modelo">
							
								<!-- Información Izquierda Modelo (reloj y tabla) -->
								<div class="col-3" id="Informacion" style="margin-right: 2%">
									<div class="row justify-content-center">		
										<div>
											<h4 id="Titulo1" style="text-align: center">Información General</h4>	
											<table id="general" style="width:100%">
												<tbody id="miTabla">
												</tbody>
											</table>
										</div>
									</div>
									<hr class="featurette-divider">
									<div class="row align-items-center justify-content-center" id="fotoFecha">
										<div class="col">
											<table style="margin: auto; width: 100%">
												<tr style="text-align: center">
													<td style="background-color: #3b83bd;border:1px solid #000; color: #ffffff">Fecha de vuelo:</td>
													<td style="border:1px solid #000;" id="fecha_vuelo"></td>
												</tr>
											</table>
										</div>
										<div class="col" id="contenedor_imagen_altitud" style="text-align: center">
											<h5>Esquema de altitud </h5>
											<img id="imagen_altura" src= "/" height="auto" width="100%" style="border: 3px solid; color: grey;">
										</div>
									</div>
								</div>					
								<!-- Información Derecha Modelo (fotos y widget tiempo) -->
								<div class="col-8" id="OrtoImagen">
									<div class="row justify-content-center">
										<img id="ortoParcela" src="Recursos/imagenes/ortofoto_1.png">
										<h5> &nbsp </h5>
									</div>
									<div class="row justify-content-center">
										<button id="cargaModelo" class='custom-btn btn-5'> Cargar Modelado </button>
									</div>
								</div>
							</div>
							<hr class="featurette-divider">
							<h5> &nbsp </h5>
						</section>			
						
						
						<!-- Información especifica de la parcela (zonas, incidencias...) -->
						<section class="container-fluid" id="Zonas" style="display:none">
							<div class="row align-items-center justify-content-center" style="width:100%">
								<div class="d-sm-flex justify-content-between align-items-center mb-4">
									<h3 class="text-dark mb-0">Información Zonal</h3>
								</div>
								<div>
									<div id="tablaEspecifica">
										<div >
											<table class="container">
												<thead>
													<!-- <tr> -->
														<th colspan="6" style="background-color: #f8f9fc;"><h4 style="text-align: center; color: #00AAE4;">Información Particular</h4></th>
													<!-- </tr> -->
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
										</div>
										<h5> &nbsp </h5>
										<div>
											<div class="row">
												<div class="col-6" id="tabla_1">
													<table class="container">
														<thead>
															<tr>
																<th colspan="2" style="background-color: #f8f9fc;"><h5 style="text-align: center; color: #00AAE4;">Incidencias</h5></th>
															</tr>
															<tr>
																<th><h1>Código incidencia</h1></th>
																<th><h1>Descripción</h1></th>
															</tr>
														</thead>
														<tbody id="miTablaIncidencias">
														</tbody>
													</table>
												</div>
												<div class="col-6" id="tabla_2">
													<table class="container" >
														<thead>
															<tr>
																<th colspan="2" style="background-color: #f8f9fc;"><h5 style="text-align: center; color: #00AAE4;">Resumen de datos</h5></th>
															</tr>
															<tr>
																<th><h1>Uso</h1></th>
																<th><h1>Superficie Total &nbsp(ha)</h1></th>
															</tr>
														</thead>
														<tbody id="miTablaResumen">
														</tbody>
													</table>
												</div>
											</div>
										</div>
										<h5> &nbsp </h5>
										<button id="btnCrearPdf" onclick="imprimir()" class='custom-btn btn-5'>Imprimir Tabla</button>
										<h5> &nbsp </h5>
									</div>
								</div>
							</div>
						</section>
						
						
						<section class="container-fluid" id="Historico" style="display:none">
							<div class="row align-items-center justify-content-center">
								<div class="d-sm-flex justify-content-between align-items-center mb-4">
									<h3 class="text-dark mb-0">Información Historica</h3>
								</div>
								<div id="graficas">
									<div class="row">
										<div class="col card shadow" style="margin-right: 3%">
											<div class="card-header d-flex justify-content-between align-items-center">
												<h6 class="text-primary fw-bold m-0">Producción Anual</h6>
											</div>
												<!-- <button onclick="actualizarGrafica('line');">Gráfica Lineas</button> -->
												<!-- <button onclick="actualizarGrafica('bar')">Gráfica Barras</button> -->
											<div class="card-body" id="despliegueGrafica">
												<canvas id="Produccion_Anual" ></canvas>
											</div>
										</div>
										<div class="col card shadow">
											<div class="card-header d-flex justify-content-between align-items-center">
												<h6 class="text-primary fw-bold m-0">Temperatura Media</h6>
											</div>
												<!-- <button onclick="actualizarGrafica('line');">Gráfica Lineas</button> -->
												<!-- <button onclick="actualizarGrafica('bar')">Gráfica Barras</button> -->
											<div class="card-body" id="despliegueGrafica">
												<canvas id="Temperatura_Media" ></canvas>
											</div>
										</div>
									</div>
									<div class="row" style="margin-top: 5%">
										<div class="col card shadow" style="margin-right: 3%">
											<div class="card-header d-flex justify-content-between align-items-center">
												<h6 class="text-primary fw-bold m-0">Precipitaciones</h6>
											</div>
												<!-- <button onclick="actualizarGrafica('line');">Gráfica Lineas</button> -->
												<!-- <button onclick="actualizarGrafica('bar')">Gráfica Barras</button> -->
											<div class="card-body" id="despliegueGrafica">
												<canvas id="Precipitaciones" ></canvas>
											</div>
										</div>
										<div class="col card shadow">
											<div class="card-header d-flex justify-content-between align-items-center">
												<h6 class="text-primary fw-bold m-0">Humedad</h6>
											</div>
												<!-- <button onclick="actualizarGrafica('line');">Gráfica Lineas</button> -->
												<!-- <button onclick="actualizarGrafica('bar')">Gráfica Barras</button> -->
											<div class="card-body" id="despliegueGrafica">
												<canvas id="Humedad" ></canvas>
											</div>
										</div>
									</div>
								</div>
							</div>
						<hr class="featurette-divider">
						</section>
						
						<!-- Información Historica de la parcela -->
						<section class="container-fluid" id="Prediccion" style="display:none">
							<div class="tab" style="box-shadow: 0 4px 4px -2px rgba(26, 37, 99, 1);">
								<input class="input-acordeon" type="checkbox" id="chck3" onclick="calculoGrafica('line','grafica');">
								<label class="tab-label" for="chck3">Información Historica Parcela</label>
								<div class="tab-content" >
									<div id="tablaHistorica">
										<button onclick="actualizarGrafica('line');">Gráfica Lineas</button>
										<button onclick="actualizarGrafica('bar')">Gráfica Barras</button>
										<div id="despliegueGrafica" style="margin: 0px auto;">
											<canvas id="grafica5" style=""></canvas>
										</div>
										<button onclick="actualizarFormatoGrafica('week');">Semanas</button>
										<button onclick="actualizarFormatoGrafica('day')">Dias</button>
										<button onclick="actualizarFormatoGrafica('month')">Meses</button>
										<button onclick="actualizarFormatoGrafica('year')">Años</button>
									</div>
								</div>
							</div>	
						<hr class="featurette-divider">
						</section>
					</div>
				</div>
			</div>
		</div>
		
	</body>
	
	<script src="Recursos/js/Externo/theme.js"></script>
</html>
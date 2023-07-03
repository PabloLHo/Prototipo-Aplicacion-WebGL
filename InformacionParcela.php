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
		<link rel="icon" type="image/x-icon" href="Recursos/imagenes/logo.png">
		<!-- Bootstrap CSS -->
		<link rel="stylesheet" type="text/css" href="Recursos/css/dashboard.css" media="all">
		<link rel="stylesheet" href="Recursos/fonts/fontawesome-all.min.css">
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
		<link rel="stylesheet" href="Recursos/fonts/fontawesome-all.min.css">
		
		<!-- CSS Propio -->
		<link rel="stylesheet" href="Recursos/css/styleTabla.css">
		<link rel="stylesheet" href="Recursos/css/botones.css">
		<link rel="stylesheet" href="Recursos/css/acordeon.css">
		<link rel="stylesheet" href="Recursos/css/responsive.css">
		
		<!-- Javascript librerias externas -->
		<script src="Recursos/js/Externo/jquery-6.0.0-min.js"></script>
		<script src="Recursos/js/Externo/Bootstrap/bootstrap.bundle.js"></script>
		<script src="Recursos/js/Externo/Bootstrap/bootstrap.js"></script>
		<script src="Recursos/js/Externo/html2pdf.js"></script>
		<script src="Recursos/js/Externo/Bootstrap/bootstrap.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.js"></script>
		<script src="https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns/dist/chartjs-adapter-date-fns.bundle.min.js"></script>
		<script src="Recursos/js/Externo/theme.js"></script>	

		<!-- Javascript propio -->
		<script src="Recursos/js/Informacion/funcionesInformacion.js"></script>

		
		<title>Información</title>
	
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
								<i class="fas fa-regular fa-layer-group"></i><span>División Zonas</span>
							</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" id="link_historico" href="#" onclick="muestraHistorico()">
								<i class="fa fa-area-chart"></i></i><span>Historico Datos</span>
							</a>
						</li>
					</ul>
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
								<span class="fs-4 text-dark">Gestión Parcela</span>
							</a>
							<ul class="navbar-nav flex-nowrap ms-auto">
								<div class="d-none d-sm-block topbar-divider">
								</div>
								<li class="nav-item dropdown no-arrow">
									<div class="nav-item dropdown no-arrow">
										<a class="dropdown-toggle nav-link" aria-expanded="false" data-bs-toggle="dropdown" href="#">
											<span class="d-none d-lg-inline me-2 text-dark-600 small"><b id="onload"><?php echo $clave?></b></span>
							   				<img class="border rounded-circle img-profile" id="fotoPerfilNav">
										</a>
										<div class="dropdown-menu shadow dropdown-menu-end animated--grow-in">
											<a class="dropdown-item" href="#" onclick="location.href = 'Perfil.php'"><i class="fas fa-user fa-sm fa-fw me-2 text-gray-400"></i> &nbsp;Usuario </a>
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
						<section id="Principal" class="container-fluid">
							<!-- Modelado e información principal -->
							<div class="row align-items-center justify-content-center" id="Modelo">	
								<div class="col-2" id="Informacion" style="margin-right: 2%">
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
										<div>
											<table style="margin: auto; width: 100%">
												<tr style="text-align: center">
													<td style="background-color: #3b83bd;border:1px solid #000; color: #ffffff">Fecha de vuelo:</td>
													<td style="border:1px solid #000;" id="fecha_vuelo"></td>
												</tr>
											</table>
										</div>
									</div>
								</div>					
								<!-- Información Izq Modelo -->
								<div class="col-9" id="OrtoImagen">
									<div class="row justify-content-center">
										<img id="ortoParcela" src="/" alt="Ortofoto de la parcela">
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
										<div class="table-responsive table mt-2" id="dataTable" role="grid" aria-describedby="dataTable_info">
											<table class="table my-0" id="data">
												<thead>
													<!-- <tr> -->
														<th colspan="6" style="background-color: #f8f9fc;"><h4 style="text-align: center; color: #00AAE4;">Información Particular</h4></th>
													<!-- </tr> -->
													<tr>
														<th><p>Recinto</p></th>
														<th><p>Uso</p></th>
														<th style="text-align: center"><p>Superficie &nbsp(ha)</p></th>
														<th style="text-align: center"><p>Pendiente (%)</p></th>
														<th style="text-align: center"><p>Incidencias</p></th>
														<th><p>&nbsp </p></th>
													</tr>
												</thead>
												<tbody id="miTabla2">
												</tbody>
											</table>
										</div>
										<h5> &nbsp </h5>
										<div>
											<div class="row" id="tablas">
												<div class="col-6 table-responsive" role="grid" aria-describedby="dataTable_info" id="tabla_1">
													<table class="table my-0" id="data">
														<thead>
															<tr>
																<th colspan="2" style="background-color: #f8f9fc;"><h5 style="text-align: center; color: #00AAE4;">Incidencias</h5></th>
															</tr>
															<tr>
																<th><p>Código incidencia</p></th>
																<th><p>Descripción</p></th>
															</tr>
														</thead>
														<tbody id="miTablaIncidencias">
														</tbody>
													</table>
												</div>
												<div class="col-6 table-responsive" role="grid" aria-describedby="dataTable_info" id="tabla_2">
													<table class="table my-0" id="data">
														<thead>
															<tr>
																<th colspan="2" style="background-color: #f8f9fc;"><h5 style="text-align: center; color: #00AAE4;">Resumen de datos</h5></th>
															</tr>
															<tr>
																<th><p>Uso</p></th>
																<th><p>Superficie Total &nbsp(ha)</p></th>
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
								<dialog id="Grafica" style="width: 75%; margin-left: 20%; margin-bottom: 10%">
									<a class="button cross" style="align:right" onclick="document.getElementById('Grafica').close();"></a>
									<!--<button onclick="document.getElementById('Grafica').close()">Cerrar</button> -->
									<div class="card-body" id="despliegueGrafica">
										<canvas id="SobrePuesta" ></canvas>
									</div>
									<input type="range" id="slider_SobrePuesta">
								</dialog>
								<div class="d-sm-flex justify-content-between align-items-center mb-4">
									<h3 class="text-dark mb-0">Información Historica</h3>
								</div>
								<div id="graficas">
									<div class="row">
										<div class="col card shadow" style="margin-right: 3%">
											<div class="card-header d-flex justify-content-between align-items-center">
												<a onclick="sobresaltar('Produccion')">
													<h6 class="text-primary fw-bold m-0">Producción Anual</h6>
												</a>
											</div>
											<div class="card-body" id="despliegueGrafica">
												<canvas id="Produccion" ></canvas>
												<input type="range" id="slider_produccion">
											</div>
										</div>
										<div class="col card shadow">
											<div class="card-header d-flex justify-content-between align-items-center">
												<a onclick="sobresaltar('Temperatura')">
													<h6 class="text-primary fw-bold m-0">Temperatura Media</h6>
												</a>
											</div>
											<div class="card-body" id="despliegueGrafica">
												<canvas id="Temperatura" ></canvas>
												<input type="range" id="slider_temperatura">
											</div>
										</div>
									</div>
									<div class="row" style="margin-top: 5%">
										<div class="col card shadow" style="margin-right: 3%">
											<div class="card-header d-flex justify-content-between align-items-center">
												<a onclick="sobresaltar('Precipitaciones')">
													<h6 class="text-primary fw-bold m-0">Precipitaciones</h6>
												</a>
											</div>
											<div class="card-body" id="despliegueGrafica">
												<canvas id="Precipitaciones" ></canvas>
												<input type="range" id="slider_precipitaciones">
											</div>
										</div>
										<div class="col card shadow">
											<div class="card-header d-flex justify-content-between align-items-center">
												<a onclick="sobresaltar('Humedad')">
													<h6 class="text-primary fw-bold m-0">Humedad</h6>
												</a>
											</div>
											<div class="card-body" id="despliegueGrafica">
												<canvas id="Humedad" ></canvas>
												<input type="range" id="slider_humedad">
											</div>
										</div>
									</div>
								</div>
							</div>
						<hr class="featurette-divider">
						</section>
					</div>
				</div>
				<footer class="bg-white sticky-footer">
					<div class="container my-auto">
						<div class="text-center my-auto copyright"><span>Copyright © Pablo Latorre Hortelano 2023</span></div>
					</div>
				</footer>
			</div>
		</div>

	</body>
	

</html>
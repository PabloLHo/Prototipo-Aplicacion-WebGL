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
	<link rel="stylesheet" href="Recursos/css/ol-layerswitcher.css" type="text/css">
	<link rel="stylesheet" type="text/css" href="Recursos/css/bootstrap.min.css" media="all">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
	<link rel="stylesheet" type="text/css" href="Recursos/css/mapa.css" media="all">
	<link rel="stylesheet" href="https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.3.0/css/ol.css" type="text/css">
	<link rel="stylesheet" type="text/css" href="Recursos/js/Mapa/ol-ext/ol-ext.css" media="all">
	
	
	
    <script src="https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.3.0/build/ol.js"></script>
	<script src="Recursos/js/Mapa/ol-ext/ol-ext.js"></script>
	<script src="Recursos/js/Externo/jquery-6.0.0-min.js"></script>
	<script src="Recursos/js/Externo/Bootstrap/bootstrap.bundle.js"></script>
	<script src="Recursos/js/Externo/Bootstrap/bootstrap.js"></script>
	<script src="Recursos/js/Externo/Bootstrap/bootstrap.min.js"></script>
	<script src="Recursos/js/Mapa/ol-layerswitcher.js"></script>
	
	
    <title>Gemelo Digital</title>
</head>
  
  <body>

	<!-- Cabecera -->
	<section class="container-fluid">
		<section>
			<nav class="navbar navbar-expand shadow topbar static-top bg-success" style="height: 10%">
				<div class="container-fluid" >
					<a href="Home.php" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
						<img src="Recursos/imagenes/logo.png"  alt=".logo" width="auto" height="75px" hspace="40" align="left">
						<span class="fs-4 text-dark"><b>El olivar en Jaén</b></span>
					</a>
					<ul class="navbar-nav flex-nowrap ms-auto">
						<div class="d-none d-sm-block topbar-divider"></div>
						<li class="nav-item dropdown no-arrow">
							<div class="nav-item dropdown no-arrow">
								<a class="dropdown-toggle nav-link" aria-expanded="false" data-bs-toggle="dropdown" href="#">
									<span class="d-none d-lg-inline me-2 text-dark-600 small"><b> <?php echo $clave;?> </b></span>
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
		</section>
		<!--Mapa --> 
		<section id="mapa">
			<div id="map" class="map"></div>
			<script type="text/javascript" src="Recursos/js/Mapa/mapa.js"></script>
		</section>		
  
		
		<section id="Informacion" class="text-center bg-light features-icons container-fluid">
			<div>
				<div class="row">
					<div class="col-lg-3">
						<div class="mx-auto features-icons-item mb-5 mb-lg-0 mb-lg-3">
							<div class="d-flex features-icons-icon"><i class="fa fa-area-chart m-auto text-primary" data-bss-hover-animate="pulse"></i></div>
							<h3>Análisis Historico de Datos Multisensoriales</h3>
							<p class="lead mb-0">This theme will look great on any device, no matter the size!</p>
						</div>
					</div>
					<div class="col-lg-3">
						<div class="mx-auto features-icons-item mb-5 mb-lg-0 mb-lg-3">
							<div class="d-flex features-icons-icon"><i class="fa fa-cube m-auto text-primary" data-bss-hover-animate="pulse"></i></div>
							<h3>Modelado 3D</h3>
							<p class="lead mb-0">Featuring the latest build of the new Bootstrap 5 framework!</p>
						</div>
					</div>
					<div class="col-lg-3">
						<div class="mx-auto features-icons-item mb-5 mb-lg-0 mb-lg-3">
							<div class="d-flex features-icons-icon"><i class="fa fa-desktop m-auto text-primary" data-bss-hover-animate="pulse"></i></div>
							<h3>Monitorización de los datos</h3>
							<p class="lead mb-0">Ready to use with your own content, or customize the source files!</p>
						</div>
					</div>
					<div class="col-lg-3">
						<div class="mx-auto features-icons-item mb-5 mb-lg-0 mb-lg-3">
							<div class="d-flex features-icons-icon"><i class="fa fa-line-chart m-auto text-primary" data-bss-hover-animate="pulse"></i></div>
							<h3>Predicción evolución de los datos</h3>
							<p class="lead mb-0">Ready to use with your own content, or customize the source files!</p>
						</div>
					</div>
				</div>
			</div>
		</section>
		
		<section id="Informacion_2" class="showcase container-fluid">
			<div class="p-0">
				<div class="row g-0">
					<div class="col-lg-6 text-white order-lg-2 showcase-img" style="background-image:url(Recursos/imagenes/Planta_portada.png);background-repeat: no-repeat; background-position: center; background-size:contain;"><span></span></div>
					<div class="col-lg-6 my-auto order-lg-1 showcase-text">
						<h2>Informacion</h2>
						<p class="lead mb-0">Lorem ipsum dolor sit amet consectetur adipiscing elit mollis pulvinar ad, habitant penatibus dui porta egestas cubilia pellentesque congue cum parturient, nisi vitae sem vivamus leo est nisl conubia per.</p>
					</div>
				</div>
				<hr class="featurette-divider" style="display: none">
				<div class="row g-0">
					<div class="col-lg-6 text-white showcase-img" style="background-image:url(Recursos/imagenes/foto.png); background-repeat: no-repeat; background-position: center; background-size:contain;"><span></span></div>
					<div class="col-lg-6 my-auto order-lg-1 showcase-text">
						<h2>Informacion</h2>
						<p class="lead mb-0">Lorem ipsum dolor sit amet consectetur adipiscing elit sapien mattis, sed diam primis penatibus dictumst ligula nullam pharetra sociosqu, placerat augue inceptos magnis orci aptent duis turpis. Venenatis luctus auctor aliquam fames vitae habitasse maecenas, quisque integer nam ac phasellus.</p>
					</div>
				</div>
				<hr class="featurette-divider" style="display: none">
				<div class="row g-0">
					<div class="col-lg-6 text-white order-lg-2 showcase-img" style="background-image:url(Recursos/imagenes/dron.png); background-repeat: no-repeat; background-position: center; background-size:contain;"><span></span></div>
					<div class="col-lg-6 my-auto order-lg-1 showcase-text">
						<h2>Informacion</h2>
						<p class="lead mb-0">Lorem ipsum dolor sit amet consectetur adipiscing elit urna curabitur senectus, cubilia luctus libero mi quis felis per a primis.</p>
					</div>
				</div>
			</div>
		</section>
	
			
		<!-- <section id="Informacion_4" class="text-center bg-light testimonials container-fluid"> -->
			<!-- <div> -->
				<!-- <h2 class="mb-5">What people are saying...</h2> -->
				<!-- <div class="row"> -->
					<!-- <div class="col-lg-4"> -->
						<!-- <div class="mx-auto testimonial-item mb-5 mb-lg-0"><img class="rounded-circle img-fluid mb-3" src="Recursos/imagenes/logo.png"> -->
							<!-- <h5>Dato</h5> -->
							<!-- <p class="font-weight-light mb-0">"Lorem ipsum dolor sit amet consectetur, adipiscing elit aenean tincidunt."</p> -->
						<!-- </div> -->
					<!-- </div> -->
					<!-- <div class="col-lg-4"> -->
						<!-- <div class="mx-auto testimonial-item mb-5 mb-lg-0"><img class="rounded-circle img-fluid mb-3" src="Recursos/imagenes/logo.png"> -->
							<!-- <h5>Dato</h5> -->
							<!-- <p class="font-weight-light mb-0">"Lorem ipsum dolor sit amet consectetur, adipiscing elit interdum aliquam montes, eget mi ullamcorper penatibus."</p> -->
						<!-- </div> -->
					<!-- </div> -->
					<!-- <div class="col-lg-4"> -->
						<!-- <div class="mx-auto testimonial-item mb-5 mb-lg-0"> -->
							<!-- <img class="rounded-circle img-fluid mb-3" src="Recursos/imagenes/logo.png"> -->
							<!-- <h5>Dato</h5> -->
							<!-- <p class="font-weight-light mb-0">"Lorem ipsum dolor sit, amet consectetur."</p> -->
						<!-- </div> -->
					<!-- </div> -->
				<!-- </div> -->
			<!-- </div> -->
		<!-- </section> -->
		
	</section>
  </body>
</html>
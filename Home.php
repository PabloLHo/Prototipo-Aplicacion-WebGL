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
	<link rel="stylesheet" href="Recursos/css/ol-layerswitcher.css" type="text/css">
	<link rel="stylesheet" type="text/css" href="Recursos/css/bootstrap.min.css" media="all">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
	<link rel="stylesheet" type="text/css" href="Recursos/css/mapa.css" media="all">
	<link rel="stylesheet" href="https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.3.0/css/ol.css" type="text/css">
	
	
    <script src="https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.3.0/build/ol.js"></script>
	<script src="Recursos/js/Externo/jquery-6.0.0-min.js"></script>
	<script src="Recursos/js/Externo/bootstrap.bundle.js"></script>
	<script src="Recursos/js/Externo/bootstrap.js"></script>
	<script src="Recursos/js/Externo/bootstrap.min.js"></script>


	<!-- Babylon JavaScript -->
		
	<script src="Recursos/js/Externo/ol-layerswitcher.js"></script>
	
	
    <title>Gemelo Digital</title>
</head>
  
  <body>

	
	
	<!-- Cabecera -->
	<section class="container-fluid">
		<section class="container-fluid">
			<div>
				<header class="d-flex flex-wrap justify-content-center " style="height: 120px;background-color: rgb(0,187,45);">
					<a href="Home.php" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
						<img src="Recursos/imagenes/logo.png"  alt=".logo" height="75" width="120" hspace="40" align="left">
						<span class="fs-4 text-white">Olivar de Jaén</span>
					</a>
					<form action="Recursos/php/cierreSesion.php" method="post">
						<button>Cerrar Sesión</button>
					</form>
				</header>
			</div>
		</section>
		<!--Mapa --> 
		<section id="mapa" class="container-fluid">
			<div id="map" class="map"></div>
			<script type="text/javascript" src="Recursos/js/mapa.js"></script>	
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
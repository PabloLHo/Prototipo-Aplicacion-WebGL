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
		<link rel="stylesheet" type="text/css" href="Recursos/css/mensajes.css" media="all">
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
		
		<!-- Script para poner los datos de usuario -->
		<script>
			window.onload = function() {
				var datos = $.ajax({
					url: 'Recursos/php/gestionPerfiles.php',
					data: { nombre: "<?php echo $clave;?>", funcion: "permisos" },
					dataType: 'text',
					async: false
				}).responseText;

			datos = datos.split("&");
			document.getElementById("fotoPerfilNav").src = "Recursos/imagenes/usuarios/" + datos[1];
		}
		</script>
		
		<title>Bienvenida</title>
	</head>
  
	<body class="host">

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
										<img class="border rounded-circle img-profile" id="fotoPerfilNav">
									</a>
									<div class="dropdown-menu shadow dropdown-menu-end animated--grow-in">
										<a class="dropdown-item" href="Perfil.php"><i class="fas fa-user fa-sm fa-fw me-2 text-gray-400"></i>&nbsp;Usuario</a>
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
			<section id="principal">
				<br><br>
				<h1 class="tituloMapa"><center> Mapa Agricola Español </center></h1>
				<br>
				<div id="mensaje" class="info-msg" style="width: 100%; display: none">
					 <a onclick="mensaje.style.display = 'none'"><i class="fa fa-times "></i>
						La selección no se encuentra activa
					</a>                   
				</div>
				<div style="width: 95%; margin: auto; text-align: right">
				Leyenda: &nbsp &nbsp Activar seleccion parcela: 🫳 &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp Pantalla completa: ⤢   &nbsp &nbsp &nbsp &nbsp    Control capas: 
				<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAACE1BMVEX///8A//8AgICA//8AVVVAQID///8rVVVJtttgv98nTmJ2xNgkW1ttyNsmWWZmzNZYxM4gWGgeU2JmzNNr0N1Rwc0eU2VXxdEhV2JqytQeVmMhVmNoydUfVGUgVGQfVGQfVmVqy9hqy9dWw9AfVWRpydVry9YhVmMgVGNUw9BrytchVWRexdGw294gVWQgVmUhVWPd4N6HoaZsy9cfVmQgVGRrytZsy9cgVWQgVWMgVWRsy9YfVWNsy9YgVWVty9YgVWVry9UgVWRsy9Zsy9UfVWRsy9YgVWVty9YgVWRty9Vsy9aM09sgVWRTws/AzM0gVWRtzNYgVWRuy9Zsy9cgVWRGcHxty9bb5ORbxdEgVWRty9bn6OZTws9mydRfxtLX3Nva5eRix9NFcXxOd4JPeINQeIMiVmVUws9Vws9Vw9BXw9BYxNBaxNBbxNBcxdJexdElWWgmWmhjyNRlx9IqXGtoipNpytVqytVryNNrytZsjZUuX210k5t1y9R2zNR3y9V4lp57zth9zdaAnKOGoaeK0NiNpquV09mesrag1tuitbmj1tuj19uktrqr2d2svcCu2d2xwMO63N+7x8nA3uDC3uDFz9DK4eHL4eLN4eIyYnDX5OM5Z3Tb397e4uDf4uHf5uXi5ePi5+Xj5+Xk5+Xm5+Xm6OY6aHXQ19fT4+NfhI1Ww89gx9Nhx9Nsy9ZWw9Dpj2abAAAAWnRSTlMAAQICAwQEBgcIDQ0ODhQZGiAiIyYpKywvNTs+QklPUlNUWWJjaGt0dnd+hIWFh4mNjZCSm6CpsbW2t7nDzNDT1dje5efr7PHy9PT29/j4+Pn5+vr8/f39/f6DPtKwAAABTklEQVR4Xr3QVWPbMBSAUTVFZmZmhhSXMjNvkhwqMzMzMzPDeD+xASvObKePPa+ffHVl8PlsnE0+qPpBuQjVJjno6pZpSKXYl7/bZyFaQxhf98hHDKEppwdWIW1frFnrxSOWHFfWesSEWC6R/P4zOFrix3TzDFLlXRTR8c0fEEJ1/itpo7SVO9Jdr1DVxZ0USyjZsEY5vZfiiAC0UoTGOrm9PZLuRl8X+Dq1HQtoFbJZbv61i+Poblh/97TC7n0neCcK0ETNUrz1/xPHf+DNAW9Ac6t8O8WH3Vp98f5lCaYKAOFZMLyHL4Y0fe319idMNgMMp+zWVSybUed/+/h7I4wRAG1W6XDy4XmjR9HnzvDRZXUAYDFOhC1S/Hh+fIXxen+eO+AKqbs+wAo30zDTDvDxKoJN88sjUzDFAvBzEUGFsnADoIvAJzoh2BZ8sner+Ke/vwECuQAAAABJRU5ErkJggg=="></img>
				</div>
				<div id="map" class="map"></div>
				<script type="text/javascript" src="Recursos/js/Mapa/mapa.js"></script>

			</section>		
				
			<!-- Información adicional de la aplicación -->
			<section class="text-center bg-light features-icons container-fluid" style="margin-top:10%">
				<div>
					<h2 class="mb-5 tituloMapa">Características del sistema</h2>
					<div class="row">
						<div class="col-lg-3">
							<div class="mx-auto features-icons-item mb-5 mb-lg-0 mb-lg-3">
								<div class="d-flex features-icons-icon"><i class="fa fa-area-chart m-auto text-primary" data-bss-hover-animate="pulse"></i></div>
								<h3>Análisis Historico de Datos Multisensoriales</h3>
								<p class="lead mb-0">Analiza la situación historica de tu parcela mediante la extracción de conocmiento por gráficas</p>
							</div>
						</div>
						<div class="col-lg-3">
							<div class="mx-auto features-icons-item mb-5 mb-lg-0 mb-lg-3">
								<div class="d-flex features-icons-icon"><i class="fa fa-cube m-auto text-primary" data-bss-hover-animate="pulse"></i></div>
								<h3>Modelado 3D</h3>
								<p class="lead mb-0">Representación tridimensional de cualquiera parcela, interactua con ella desde cualquier lugar</p>
							</div>
						</div>
						<div class="col-lg-3">
							<div class="mx-auto features-icons-item mb-5 mb-lg-0 mb-lg-3">
								<div class="d-flex features-icons-icon"><i class="fa fa-object-group m-auto text-primary" data-bss-hover-animate="pulse"></i></div>
								<h3>Detección de olivos</h3>
								<p class="lead mb-0">Consigue información costosa y tediosa en un momento con la detección automatica de olivos en nuestra parcela</p>
							</div>
						</div>
						<div class="col-lg-3">
							<div class="mx-auto features-icons-item mb-5 mb-lg-0 mb-lg-3">
								<div class="d-flex features-icons-icon"><i class="fa fa-line-chart m-auto text-primary" data-bss-hover-animate="pulse"></i></div>
								<h3>Prototipo expandible</h3>
								<p class="lead mb-0">Aplicación limitada a su uso en parcelas concretas pero con grandes posibilidades de expansión</p>
							</div>
						</div>
					</div>
					<div class="col">
							<div class="mx-auto features-icons-item mb-5 mb-lg-0 mb-lg-3">
								<div class="d-flex features-icons-icon"><i class="fa fa-book m-auto text-primary" data-bss-hover-animate="pulse"></i></div>
								<h3>Manual de usuario</h3>
								<p class="lead mb-0">Es posible disponer del <a href="#">Manual de usuario</a> para el control del sistema</p>
							</div>
					</div>
				</div>
			</section>	
				
			<section id="Informacion_2" class="showcase container-fluid">
			<br>
			</section>

			<section id="informacion_4" class="text-center bg-light testimonials container-fluid">
				<div>
					<h2 class="mb-5 tituloMapa">Participantes</h2>
					<div class="row">
						<div class="col-lg-4">
							<div class="mx-auto testimonial-item mb-5 mb-lg-0"><img class="rounded-circle img-fluid mb-3" src="recursos/imagenes/usuarios/Sin_Usuario.jpg">
								<h5>Miembro 1</h5>
							</div>
						</div>
						<div class="col-lg-4">
							<div class="mx-auto testimonial-item mb-5 mb-lg-0"><img class="rounded-circle img-fluid mb-3" src="recursos/imagenes/usuarios/Sin_Usuario.jpg">
								<h5>Miembro 2</h5>
							</div>
						</div>
						<div class="col-lg-4">
							<div class="mx-auto testimonial-item mb-5 mb-lg-0">
								<img class="rounded-circle img-fluid mb-3" src="recursos/imagenes/usuarios/Sin_Usuario.jpg">
								<h5>Miembro 3</h5>
							</div>
						</div>
					</div>
				</div>
			</section>
			
			<footer class="bg-white sticky-footer">
				<div class="container my-auto">
					<div class="text-center my-auto copyright"><span>Copyright © Pablo Latorre Hortelano 2023</span></div>
				</div>
			</footer>
		</section>


		<style>
			.ol-zoomslider button{
				height: 10%;
				width: 100%;
			}
		</style>
	</body>
</html>
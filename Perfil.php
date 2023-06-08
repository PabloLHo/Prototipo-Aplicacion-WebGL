<?php
////////////////// CONEXION A LA BASE DE DATOS ////////////////////////////////////
include("Recursos/php/conectar.php");
session_start();

$clave = $_SESSION['usuario'];

if( $clave == null || (time() - $_SESSION['tiempo']) > 43200){
	header("location:index.php");
};
?>

<html>

	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
		<link rel="icon" type="image/x-icon" href="Recursos/imagenes/logo.png">
		<title>Profile</title>
		<link rel="stylesheet" href="Recursos/css/bootstrap.min.css">
		 <link rel="stylesheet" href="Recursos/css/userCard.css">
		<link rel="stylesheet" href="Recursos/css/botones.css">
		<link rel="stylesheet" href="Recursos/css/files.css">
		<link rel="stylesheet" type="text/css" href="Recursos/css/dashboard.css" media="all">
		<link rel="stylesheet" href="Recursos/fonts/fontawesome-all.min.css">
		<link rel="stylesheet" href="Recursos/css/mensajes.css">

		<script src="Recursos/js/Externo/jquery-6.0.0-min.js"></script>
		<script src="Recursos/js/Externo/Bootstrap/bootstrap.bundle.js"></script>
		<script src="Recursos/js/Externo/Bootstrap/bootstrap.js"></script>
		<script src="Recursos/js/Externo/Bootstrap/bootstrap.min.js"></script>
		<script src="Recursos/js/Externo/theme.js"></script>
		<script src="Recursos/js/Informacion/gestionPerfil.js"></script>
	</head>

	<body id="page-top">
		<div id="wrapper">
			<nav class="navbar align-items-start sidebar sidebar-dark accordion p-0" style="background-color: rgb(0,187,45);">
				<div class="container-fluid d-flex flex-column p-0">
							<!-- Cabecera dashboard -->
					<a class="d-flex justify-content-center align-items-center sidebar-brand m-0" href="Home.php">
						<img src="Recursos/imagenes/logo_inves.png" width="100%" height="auto" style="z-index: 2000">
					</a>
					<hr class="featurette-divider">
					<ul class="navbar-nav text-light" id="accordionSidebar">
						<li class="nav-item" >
							<a class="nav-link active" id="perfil" href="" onclick="muestraPrincipal()">
								<i class="fas fa-user"></i><span>Perfil</span>
							</a>
						</li>
						<li class="nav-item" >
							<a class="nav-link" href="Modelos.php" id="modelo" onclick="muestraModelos()">
								<i class="fas fa-regular fa-layer-group"></i><span>Modelos</span>
							</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" id="usuario" href="Usuarios.php" onclick="muestraUsuarios()">
								<i class="fas fa-users"></i><span>Usuarios</span>
							</a>
						</li>
					</ul>
				</div>
			</nav>
			<div class="d-flex flex-column" id="content-wrapper">
				<div>
					<nav class="navbar navbar-light navbar-expand shadow mb-4 topbar static-top">
						<div class="container-fluid" >
							<button class="btn btn-link d-md-none rounded-circle me-3" id="sidebarToggleTop" type="button">
								<i class="fas fa-bars"></i>
							</button>
							<a href="Home.php" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
								<span class="fs-4 text-dark">Perfil</span>
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
											<form action="Recursos/php/cierreSesion.php" method="post">
												<button class="dropdown-item" href="#"><i class="fas fa-sign-out-alt fa-sm fa-fw me-2 text-gray-400"></i> &nbsp;Cerrar Sesión</button>
											</form>
										</div>
									</div>
								</li>
							</ul>
						</div>
					</nav>

					<dialog id="cambioFoto">
						<form method="post" id="cambio_foto_form" enctype="multipart/form-data">
							<input type="file" name="foto" id="foto_comprobar" onChange="comprobarFoto()" accept="image/*"><br>
							<button type="submit" class="btn btn-primary btn-sm" onclick="document.getElementById('cambioFoto').close()">Enviar</button>
							<br>
						</form>
						<button type="submit" class="btn btn-primary btn-sm" onclick="document.getElementById('cambioFoto').close()">Cerrar</button>
					</dialog>

					<div class="container-fluid" id="content">
						<div class="row mb-3">
							<div id="mensajeBien" class="info-msg" style="Display: none; width: 100%">
								<a onclick="mensajeBien.style.display = 'none'; location.reload()" href="#"><i class="fa fa-times "></i></a>
								Cambios realizados con exito, cierre este mensaje para recargar la página
							</div>
							<div id="mensajeMal" class="info-msg" style="Display: none; width: 100%">
								<a onclick="mensajeMal.style.display = 'none'" href="#"><i class="fa fa-times "></i></a>
								No se han podido realizar los cambios
							</div>
							<h4 id="Titulo1" style="text-align: center"></h4>
							<div class="col-lg-4">
								<div class="card mb-3">
									<div class="card-body text-center shadow"><img class="rounded-circle mb-3 mt-4" id="fotoPerfil" width="160" height="160">
										<div class="mb-3"><button class="btn btn-primary btn-sm" onclick="document.getElementById('cambioFoto').showModal()">Cambiar Foto</button></div>
									</div>
								</div>
							</div>
							<div class="col-lg-8">
								<div class="row">
									<div class="col">
										<div class="card shadow mb-3">
											<div class="card-header py-3">
												<p class="text-primary m-0 fw-bold">Datos cuenta</p>
											</div>
											<div class="card-body">
												<div class="row">
													<div class="col">
														<div id="muestraUsuario" class="mb-3"><label class="form-label" for="username"><strong>Nombre usuario</strong></label><p id="nombreUsuario"></p></div>
														<div id="edicion_usuario" class="mb-3" style="display:none"><label class="form-label" for="username"><strong>Nombre usuario</strong></label><input class="form-control" type="text" id="username" name="username"></div>
													</div>
													<div class="col">
														<div id="muestraCorreo" class="mb-3"><label class="form-label" for="email"><strong>Correo electrónico</strong></label><p id="correo"></p></div>
														<div id="edicion_correo" class="mb-3" style="display:none"><label class="form-label" for="username"><strong>Correo electrónico</strong></label><input class="form-control" type="text" id="email" name="username"></div>
													</div>
												</div>
												<div class="row">
													<div class="col">
														<div id="muestraNombre" class="mb-3"><label class="form-label" for="first_name"><strong>Nombre</strong></label><p id="nombre"></p></div>
														<div id="edicion_nombre" class="mb-3" style="display:none"><label class="form-label" for="username"><strong>Nombre</strong></label><input class="form-control" type="text" id="name" name="username"></div>
													</div>
													<div class="col">
														<div id="muestraApellidos" class="mb-3"><label class="form-label" for="last_name"><strong>Apellidos</strong></label><p id="apellidos"></p></div>
														<div id="edicion_apellidos" class="mb-3" style="display:none"><label class="form-label" for="username"><strong>Apellidos</strong></label><input class="form-control" type="text" id="last_name"  name="username"></div>
													</div>
												</div>
											</div>
										</div>
										<div class="card shadow">
											<div class="card-header py-3">
												<p class="text-primary m-0 fw-bold">Datos personales</p>
											</div>
											<div class="card-body">
												<div id="muestraDireccion" class="mb-3"><label class="form-label" for="address"><strong>Dirección</strong></label><p id="direccion"></p></div>
												<div id="edicion_direccion" class="mb-3" style="display:none"><label class="form-label" for="username"><strong>Direccion</strong></label><input class="form-control" type="text" id="direction" name="username"></div>
												<div class="row">
													<div class="col">
														<div id="muestraCiudad" class="mb-3"><label class="form-label" for="city"><strong>Ciudad</strong></label><p id="ciudad"></p></div>
														<div id="edicion_ciudad" class="mb-3" style="display:none"><label class="form-label" for="username"><strong>Ciudad</strong></label><input class="form-control" type="text" id="city" name="username"></div>
													</div>
													<div class="col">
														<div id="muestraPais" class="mb-3"><label class="form-label" for="country"><strong>Pais</strong></label><p id="pais"></p></div>
														<div id="edicion_pais" class="mb-3" style="display:none"><label class="form-label" for="username"><strong>Pais</strong></label><input class="form-control" type="text" id="country" name="username"></div>
													</div>
												</div>
												<div class="mb-3">
													<button id="edicionCuenta" class="btn btn-primary btn-sm" onclick="edicionCuenta();">Editar</button>
												</div>
											<div class="mb-3" style="display: none" id="cancelarEdicionCuenta"><button  class="btn btn-primary btn-sm" onclick="cancelarEdicion();">Cancelar</button></div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
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
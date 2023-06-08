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
    <script src="Recursos/js/Informacion/gestionUsuarios.js"></script>
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
							<a class="nav-link" id="perfil" href="Perfil.php" onclick="muestraPrincipal()">
								<i class="fas fa-user"></i><span>Perfil</span>
							</a>
						</li>
						<li class="nav-item" >
							<a class="nav-link" href="Modelos.php" id="modelo" onclick="muestraModelos()">
								<i class="fas fa-regular fa-layer-group"></i><span>Modelos</span>
							</a>
						</li>
						<li class="nav-item">
							<a class="nav-link active" id="usuario" href="" onclick="muestraUsuarios()">
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
										<span class="d-none d-lg-inline me-2 text-dark-600 small"><b id="onload"><?php echo $clave;?></b></span>
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

                <div class="container-fluid" id="usuarios">
                    <h4 id="Titulo1" style="text-align: center"> Listados Usuarios</h4>
                    <div><button id="edicionCuenta" class="btn btn-primary btn-sm" onclick="anadirUsuario();">+ Add usuario</button></div>
                    <div class="card-body" id="contenido_usuarios">
                        
                    </div>
                </div>

            </div>

            <dialog id="card-usuarios" style="width: 50%">
                <div class="modal-header">
				    <a class="button cross" onclick="document.getElementById('card-usuarios').close()"></a>
					<h4 class="modal-title" style="width: auto">Usuario</h4>
				</div>
            	<div class="user">
		            <div class="user-header" id="cabecera">
			            <div class="user-avatar">
				            <img src="" id="imagen_card">
			            </div>
			            <div class="user-basic-info">
				            <div class="user-nick" id="usuario_card"></div>
				            <div class="user-fullname" id="nombre_card"></div>
							<div class="user-fullname" id="apellido_card"></div>
			            </div>
		            </div>
		            <div class="user-info">
			            <span class="user-title">Correo</span>
			            <span class="user-info" id="correo_card"></span>
                     </div>
		            <div class="user-info">
			            <span class="user-title">Pais</span>
			            <span class="user-info" id="pais_card"></span>
                    </div>
		            <div class="user-info">
			            <span class="user-title">Ciudad</span>
			            <span class="user-info" id="ciudad_card"></span>
                     </div>
		            <div class="user-info">
			            <span class="user-title">Dirección</span>
			            <span class="user-info" id="direccion_card"></span>
                     </div>
		            <button class="user-remove" id="borrar" onclick="eliminarUsuario(document.getElementById('usuario_card').innerHTML)">Eliminar usuario</button>
		            <button class="user-edit" id="editar" onclick="editarUsuario(document.getElementById('usuario_card').innerHTML)">Editar usuario</button>
	            </div>
            </dialog>

			<dialog id="edicion-card-usuarios" style="width: 50%">
                <div class="modal-header">
				    <a class="button cross" onclick="document.getElementById('edicion-card-usuarios').close(); document.getElementById('mensajeContrasena').style.display = 'none'; document.getElementById('mensajeUsuario').style.display = 'none';"></a>
					<h4 class="modal-title" style="width: auto">Usuario</h4>
				</div>
            	<div class="user">
                    <div class="user-info">
			            <span class="user-title" >Usuario*</span>
						<span class="user-info" id="edit_usuario_card"><input class="form-control" type="text" id="user_user" name="username"></span>
						<span class="user-info" id="mensajeUsuario" style="display:none; color: #ff0000">Este nombre de usuario no esta disponible</span>
					</div>
                    <div class="user-info" >
			            <span class="user-title">Nombre*</span>
                        <span class="user-info" id="edit_nombre_card" ><input class="form-control" type="text" id="name_user" name="username"></span>
		            </div>
                    <div class="user-info" >
			            <span class="user-title">Apellidos*</span>
                        <span class="user-info" id="edit_apellidos_card" ><input class="form-control" type="text" id="lastname_user" name="username"></span>
		            </div>
					<div class="user-info" id="bloque_psswd">
			            <span class="user-title">Contraseña*</span>
                        <span class="user-info" id="edit_contrasena_card" ><input class="form-control" type="password" id="psswd_user" name="username"></span>
						<span class="user-info" id="edit_nueva_contrasena_card" ><input class="form-control" type="password" id="npsswd_user" name="username"></span>
						<span class="user-info" id="mensajeContrasena" style="display:none; color: #ff0000">Las contraseñas deben ser iguales</span>
					</div>
		            <div class="user-info">
			            <span class="user-title">Correo</span>
                        <span class="user-info" id="edit_correo_card" ><input class="form-control" type="text" id="email_user" name="username"></span>
		            </div>
					<div id="roll" class="user-info" >
			            <span class="user-title">Nivel usuario</span>
						<select name="roll" id="status" style="margin-right: 5%">
							<option value="ADMIN">Admin</option>
							<option value="TECNICO" selected>Técnico</option>
							<option value="PROPIETARIO">Propietario</option>
						</select>
		            </div>
		            <div class="user-info">
			            <span class="user-title">Pais</span>
                        <span class="user-info" id="edit_pais_card"><input class="form-control" type="text" id="country_user" name="username"></span>
		            </div>
		            <div class="user-info">
			            <span class="user-title">Ciudad</span>
                        <span class="user-info" id="edit_ciudad_card"><input class="form-control" type="text" id="city_user" name="username"></span>
		            </div>
		            <div class="user-info">
			            <span class="user-title">Dirección</span>
                        <span class="user-info" id="edit_direccion_card"><input class="form-control" type="text" id="direction_user" name="username"></span>
		            </div>
                    <button class="btn btn-primary btn-sm" id="guardar" style="display:none" onclick="guardarDatos()">Guardar</button>
                    <button class="btn btn-primary btn-sm" id="guardar2" style="display:none" onclick="anadirDatos()">Guardar</button>
	            </div>
            </dialog>

            <footer class="bg-white sticky-footer">
                <div class="container my-auto">
                    <div class="text-center my-auto copyright"><span>Copyright © Pablo Latorre Hortelano 2023</span></div>
                </div>
            </footer>
        </div>
    </div>
</body>

</html>
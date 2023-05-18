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

<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
    <title>Profile - Brand</title>

    <link rel="stylesheet" href="Recursos/css/bootstrap.min.css">
     <link rel="stylesheet" href="Recursos/css/userCard.css">
    <link rel="stylesheet" href="Recursos/css/botones.css">
    <link rel="stylesheet" href="Recursos/css/files.css">
    <link rel="stylesheet" type="text/css" href="Recursos/css/dashboard.css" media="all">
    <link rel="stylesheet" href="Recursos/fonts/fontawesome-all.min.css">
    <link rel="stylesheet" href="Recursos/css/mensajes.css">
	<link rel="stylesheet" href="Recursos/css/responsive.css">

	<script src="Recursos/js/Externo/jquery-6.0.0-min.js"></script>
	<script src="Recursos/js/Externo/Bootstrap/bootstrap.bundle.js"></script>
	<script src="Recursos/js/Externo/Bootstrap/bootstrap.js"></script>
    <script src="Recursos/js/Externo/Bootstrap/bootstrap.min.js"></script>
    <script src="Recursos/js/Externo/theme.js"></script>
    <script src="Recursos/js/Informacion/gestionModelos.js"></script>
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
							<a class="nav-link active" href="" id="modelo" onclick="muestraModelos()">
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
										<span class="d-none d-lg-inline me-2 text-dark-600 small" ><b id="onload"><?php echo $clave?></b></span>
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

                <div class="container-fluid" id="modelos">
                    <h4 id="Titulo1" style="text-align: center"> Listados Parcelas con modelos</h4>
					<br>
                    <div id="contenido_modelos">
                    </div>
                </div>
				<div><button id="anadirModelo" class="btn btn-primary btn-sm" onclick="anadirModelo();" style="margin-left:1%">+ Add modelo</button></div>
            </div>

            <footer class="bg-white sticky-footer">
                <div class="container my-auto">
                    <div class="text-center my-auto copyright"><span>Copyright © Pablo Latorre Hortelano 2023</span></div>
                </div>
            </footer>
        </div>
    </div>
			<dialog id="card-parcelas" style="width: 75%">
                <div class="modal-header">
				    <a class="button cross" onclick="document.getElementById('card-parcelas').close(); document.getElementById('aux1').value = '';document.getElementById('aux2').value = '';document.getElementById('aux3').value = ''"></a>
					<h4 class="modal-title" style="width: auto">Parcela</h4>
				</div>
            	<div class="user">
		            <div class="user-header" id="cabecera">
			            <div class="user-basic-info">
				            <div class="user-nick" id="provincia_card"></div>
				            <div class="user-fullname" id="municipio_card"></div>
			            </div>
		            </div>
		            <div class="user-info">
			            <span class="user-title">Fecha Vuelo (YYYY-MM-DD)</span>
                        <span class="user-info" id="fecha_card"><input class="form-control" type="text" id="fecha_vuelo" name="username"></span>
		            </div>
		            <div class="user-info">
			            <span class="user-title">Referencia Catastral</span>
                        <span class="user-info" id="catastral_card"><input class="form-control" type="text" id="ref_cat" name="username"></span>
		            </div>
					<form method="post" id="comboTriple" action="Recursos/php/subirModelos.php" enctype="multipart/form-data">
						<div class="user-info">
							<span class="user-title">Nube puntos</span>
								<input type="file" id="aux1" name="src-file1" aria-label="Archivo" accept=".txt" onChange="ajustarNube()"><br>
							<button class="btn btn-primary btn-sm" id="nube" type="button">Descargar</button>
						</div>
						<div class="user-info">
							<span class="user-title">Ortofoto</span>
								<input type="file" id="aux2" name="src-file2" aria-label="Archivo" accept=".png" onChange="ajustarOrto()"><br>
							<button class="btn btn-primary btn-sm" id="orto" type="button">Descargar</button>
						</div>
						<div class="user-info">
							<span class="user-title">Mapa altura</span>
								<input type="file" id="aux3" name="src-file3" aria-label="Archivo" accept="image/*" onChange="ajustarAltura()"><br>
							<button class="btn btn-primary btn-sm" id="altura" type="button">Descargar</button>
						</div>
					</form>
                    <button class="btn btn-primary btn-sm" id="guardar" onclick="guardarParcela()">Guardar</button>
	            </div>
            </dialog>

			<dialog id="anadir_modelo" style="width: 75%">
                <div class="modal-header">
				    <a class="button cross" onclick="document.getElementById('anadir_modelo').close();document.getElementById('aux4').value = '';document.getElementById('aux5').value = '';document.getElementById('aux6').value = ''"></a>
					<h4 class="modal-title">Modelo</h4>
				</div>
            	<div class="user">
			        <div class="user-info">
						<span class="user-title">Formato introducir</span>
						<select name="tipoModelo" id="tipoModelo">
							<option value="NubePuntos">Nube Puntos</option>
							<option value="Ortofoto" >Ortofoto</option>
							<option value="Combo">Ortofoto + Mapa altura</option>
							<option value="Triple" selected>Textura + Nube puntos</option>
						</select>
			        </div>
		            <div class="user-info">
			            <span class="user-title">ID_RECINTO*</span>
                        <span class="user-info" id="recinto">
						<input class="form-control" type="text" id="parcela_indicada" name="username">
						</span>
		            </div>
		            <div class="user-info">
			            <span class="user-title">Referencia Catastral</span>
                        <span class="user-info" id="referencia_parcela">
						<input class="form-control" type="text" id="parcela_ref_indicada" placeholder="Ejemplo: 000F000000FF" name="username">
						</span>
		            </div>
					<div class="user-info" id="form_fecha_vuelo">
			            <span class="user-title">Fecha vuelo (YYYY-MM-DD)</span>
                        <span class="user-info" id="referencia_parcela">
						<input class="form-control" type="text"  id="fecha_indicada" placeholder="Ejemplo: 2023-05-22" name="username">
						</span>
		            </div>
					<form method="post" id="comboTriple" action="Recursos/php/subirModelos.php" enctype="multipart/form-data">
		            <div id="form_nube" class="user-info">
			            <span class="user-title">Nube puntos</span>
						<input type="file" id="aux4" name="src-file1" aria-label="Archivo" accept=".txt" onChange="ajustarNube2()"><br>
		            </div>
		            <div id="form_ortofoto" class="user-info">
			            <span class="user-title">Ortofoto</span>
				        <input type="file" id="aux5" name="src-file2" aria-label="Archivo" accept=".png" onChange="ajustarOrto2()"><br>
		            </div>
		            <div id="form_altura" class="user-info">
			            <span class="user-title">Mapa altura</span>
				        <input type="file" id="aux6" name="src-file3" aria-label="Archivo" accept="image/*" onChange="ajustarAltura2()"><br>
                    </div>
					</form>
                    <button class="btn btn-primary btn-sm" id="guardar" onclick="incluirModelos()">Guardar</button>

	            </div>
            </dialog>
</body>

</html>
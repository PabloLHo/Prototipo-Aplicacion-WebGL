<?php
////////////////// CONEXION A LA BASE DE DATOS ////////////////////////////////////

include("conectar.php");


$modelo = $_REQUEST['modelo'];
$olivo = $_REQUEST['olivo'];
$tipo = $_REQUEST['tipo'];
$todas = $_REQUEST['todas'];
if($tipo != "cenital"){
	imagenesOlivo($conexion,$modelo, $olivo,$tipo);
}else{
	if($todas == "si"){
		todasCenital($conexion, $modelo, $olivo, $tipo);
	}else{
		imagenCenital($conexion, $modelo, $olivo, $tipo);
	}
}
	
function imagenesOlivo($conexion, $modelo, $olivo, $tipo){
	$resConsulta=$conexion->query("SELECT nombre FROM imagen where id_Olivo = '$olivo' AND id_Parcela = (SELECT id_Parcela FROM parcela where nombre = '$modelo') AND tipo = '$tipo'");
	$nombres = array();
	///TABLA DONDE SE DESPLIEGAN LOS REGISTROS //////////////////////////////
	while($filaConsulta = $resConsulta->fetch_array(MYSQLI_BOTH)){

		array_push($nombres,$filaConsulta["nombre"]);
	}
	$imagen1 = array_pop($nombres);
	$imagen2 = array_pop($nombres);
	$imagen3 = array_pop($nombres);
	echo '	<div style="padding-bottom: 1em; padding-top: 1em;">
				<input type="radio" name="slider-radio" id="image1" />
				<input type="radio" name="slider-radio" id="image2" checked="checked" />
				<input type="radio" name="slider-radio" id="image3" />
				<div id="slider">
					<ul class="inner">
						<li>
							<div class="img_container sim-anim-1">
								<img src="Recursos/textures/'.$imagen1.'" />
							</div>
						</li>
						<li>
							<div class="img_container sim-anim-2">
								<img src="Recursos/textures/'.$imagen2.'" />
							</div>
						</li>
						<li>
							<div class="img_container sim-anim-3">
								<img src="Recursos/textures/'.$imagen3.'" />
							</div>
						</li>
					</ul>
				</div>
				<menu id="slider-controler">
					<li><label for="image1"></label></li>
					<li class="active"><label for="image2"></label></li>
					<li><label for="image3"></label></li>
				</menu>
			</div>';
}


function imagenCenital($conexion, $modelo, $olivo, $tipo){
	$resConsulta=$conexion->query("SELECT nombre FROM imagen where id_Olivo = '$olivo' AND id_Parcela = (SELECT id_Parcela FROM parcela where nombre = '$modelo') AND tipo = '$tipo'");
	$nombres = array();
	///TABLA DONDE SE DESPLIEGAN LOS REGISTROS //////////////////////////////
	while($filaConsulta = $resConsulta->fetch_array(MYSQLI_BOTH)){

		array_push($nombres,$filaConsulta["nombre"]);
	}
	$imagen1 = array_pop($nombres);
	echo "	<div class='row'>
				<div class='col'>
					<h5> Información </h5>
				</div>
				<div class='col'>
					<img id='imagen_grande' src='Recursos/textures/".$imagen1."'/ >
				</div>
				<div class='col'>
					<h5> Información </h5>
					<button class='custom-btn btn-5' onClick=muestraTodasImagenes('$tipo')>Cambiar Imagen</button>
				</div>
			</div>";
}

function todasCenital($conexion, $modelo, $olivo, $tipo){
	$resConsulta=$conexion->query("SELECT nombre FROM imagen where id_Olivo = '$olivo' AND id_Parcela = (SELECT id_Parcela FROM parcela where nombre = '$modelo') AND tipo = '$tipo'");
	$nombres = array();

	///TABLA DONDE SE DESPLIEGAN LOS REGISTROS //////////////////////////////
	echo '	<div class="row" id="filaFotos">';
	
	while($filaConsulta = $resConsulta->fetch_array(MYSQLI_BOTH)){
		$variable = $filaConsulta['nombre'];
		echo "	<div class='col'>
					<img id='".$variable."' src='Recursos/textures/".$variable."' width='60%' height='70%' onclick=seleccionarFoto('$variable') / >
					<h5> &nbsp </h5>
				</div>";
	}

	echo '	</div>';
}
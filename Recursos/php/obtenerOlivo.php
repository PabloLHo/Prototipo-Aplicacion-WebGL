<?php
////////////////// CONEXION A LA BASE DE DATOS ////////////////////////////////////
include("conectar.php");

$funcion = $_REQUEST['funcion'];
$modelo = $_REQUEST['modelo'];
    switch($funcion) {
		case 'DatosOlivo':
			datosOlivo($conexion,$modelo);
			break;
		case 'ImagenOlivo':
			imagenOlivo($conexion,$modelo);
			break;
		case 'max_Olivos':
			calculoMax($conexion, $modelo);
			break;
		case 'calculoCoordenadasOlivo':
			coordenadas($conexion, $modelo);
			break;
    }



function datosOlivo($conexion, $modelo){
$olivo = $_REQUEST['olivo'];
$resConsulta=$conexion->query("SELECT * FROM olivo where id_Olivo = '$olivo' AND id_Parcela = (SELECT id_Parcela FROM parcela where nombre = '$modelo')");

///TABLA DONDE SE DESPLIEGAN LOS REGISTROS //////////////////////////////
$filaConsulta = $resConsulta->fetch_array(MYSQLI_BOTH);
$originalDate = $filaConsulta['F_plantacion'];
//original date is in format YYYY-mm-dd
$timestamp = strtotime($originalDate); 
$newDate = date("d - M - Y", $timestamp );
	echo '<tbody  class="table-hover">
		<tr>
			<td class="text-left"><b>Olivo</b></td>
			<td class="text-left">'.$filaConsulta['id_Olivo'].'</td>
		</tr>
		<tr>
			<td class="text-left"><b>Altura</b></td>
			<td class="text-left">'.$filaConsulta['altura'].' metros</td>
		</tr>
		<tr>
			<td class="text-left"><b>Coordenadas</b></td>
			<td class="text-left">'.$filaConsulta['Coordenada_X'].' / '.$filaConsulta['Coordenada_Y'].' / '.$filaConsulta['Coordenada_Z'].'</td>
		</tr>
		<tr>
			<td class="text-left"><b>Fecha</b></td>
			<td class="text-left">'.$newDate.'</td>
		</tr>';
	echo '</tbody>';
				
}


function imagenOlivo($conexion, $modelo){
$olivo = $_REQUEST['olivo'];
$resConsulta=$conexion->query("SELECT * FROM olivo where id_Olivo = '$olivo' AND id_Parcela = (SELECT id_Parcela FROM parcela where nombre = '$modelo')");

///TABLA DONDE SE DESPLIEGAN LOS REGISTROS //////////////////////////////
$filaConsulta = $resConsulta->fetch_array(MYSQLI_BOTH);
echo $filaConsulta['imagen'];

				
}

function calculoMax($conexion, $modelo){
$resConsulta=$conexion->query("SELECT COUNT(*) FROM olivo where id_Parcela = (SELECT id_Parcela FROM parcela where nombre = '$modelo')");

///TABLA DONDE SE DESPLIEGAN LOS REGISTROS //////////////////////////////
$filaConsulta = $resConsulta->fetch_array(MYSQLI_BOTH);
echo $filaConsulta['COUNT(*)'];

				
}

function coordenadas($conexion, $modelo){
	$olivo = $_REQUEST['olivo'];
	$resConsulta=$conexion->query("SELECT * FROM olivo where id_Olivo = '$olivo' AND id_Parcela = (SELECT id_Parcela FROM parcela where nombre = '$modelo')");

	///TABLA DONDE SE DESPLIEGAN LOS REGISTROS //////////////////////////////
	$filaConsulta = $resConsulta->fetch_array(MYSQLI_BOTH);
	echo ''.$filaConsulta['Coordenada_X'].'/'.$filaConsulta['Coordenada_Y'].'/'.$filaConsulta['Coordenada_Z'];
}
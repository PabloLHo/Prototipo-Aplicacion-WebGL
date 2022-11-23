<?php
////////////////// CONEXION A LA BASE DE DATOS ////////////////////////////////////
include("conectar.php");

$funcion = $_REQUEST['funcion'];
$modelo = $_REQUEST['modelo'];
    switch($funcion) {
        case 'DatosParcelaGen': 
            datosParcelaGeneral($conexion,$modelo);
            break;
        case 'DatosParcelaSecun': 
            datosParcelaSecundario($conexion,$modelo);
            break;
		case 'imagenParcela':
			imagenParcela($conexion,$modelo);
			break;
		case 'DatosIncidencias':
			datosIncidencias($conexion,$modelo);
			break;
		case 'DatosResumen':
			datosResumen($conexion,$modelo);
			break;
		case 'zona':
			coordenadasZona($conexion);
			break;
		case 'fechas':
			obtenerFechas($conexion, $modelo);
			break;
    }


function datosParcelaGeneral($conexion, $modelo){
/////////////////////// CONSULTA A LA BASE DE DATOS ////////////////////////
$resConsulta=$conexion->query("SELECT * FROM parcela where nombre = '$modelo'");

$superficie = obtenerSuperficie($conexion, $modelo);

///TABLA DONDE SE DESPLIEGAN LOS REGISTROS //////////////////////////////
$filaConsulta = $resConsulta->fetch_array(MYSQLI_BOTH);
echo '<tbody  class="table-hover">

				<tr>
					<td class="text-left"><b>Provincia</b></td>
					<td class="text-left">'.$filaConsulta['Provincia'].'</td>
				</tr>
				<tr>
					<td class="text-left"><b>Municipio</b></td>
					<td class="text-left">'.$filaConsulta['Municipio'].'</td>
				</tr>
				<tr>
					<td class="text-left"><b>Parcela</b></td>
					<td class="text-left">'.$filaConsulta['id_Parcela'].'</td>
				</tr>
				<tr>
					<td class="text-left"><b>Superficie</b></td>
					<td class="text-left">'.$superficie.' ha</td>
				</tr>
				<tr>
					<td class="text-left"><b>Referencia Catastral</b></td>
					<td class="text-left">'.$filaConsulta['ReferenciaCatastral'].'</td>
				</tr>';
				echo '</tbody>';
}

function obtenerSuperficie($conexion, $modelo){
	$resConsulta=$conexion->query("SELECT * FROM zona_parcela where id_parcela =(Select id_parcela from parcela where nombre = '$modelo')");
	///TABLA DONDE SE DESPLIEGAN LOS REGISTROS //////////////////////////////
	$cadena = "";
	$zonas = array();
	while($filaConsulta = $resConsulta->fetch_array(MYSQLI_BOTH)){
		$esta = true;
		for($i = 0; $i < count($zonas); ++$i){
			if($zonas[$i] == $filaConsulta["id_zona"]){
				$esta = false;
				break;
			}
		}
		if($esta){
			array_push($zonas,$filaConsulta["id_zona"]);
		}
	}
	$final = "";
	$totalSumado = 0;
	for($i = 0; $i < count($zonas); ++$i){
		$total = 0;
		$res=$conexion->query("SELECT superficie FROM zona_parcela where id_zona =".$zonas[$i]." && id_parcela =(Select id_parcela from parcela where nombre = '$modelo')");
		while($fila3 = $res->fetch_array(MYSQLI_BOTH)){
			$total = $total + $fila3["superficie"];
		}
		$totalSumado = $totalSumado + $total;
	}
	return $totalSumado;
}

function imagenParcela($conexion, $modelo){
	/////////////////////// CONSULTA A LA BASE DE DATOS ////////////////////////
	$resConsulta=$conexion->query("SELECT * FROM parcela where nombre = '$modelo'");


	///TABLA DONDE SE DESPLIEGAN LOS REGISTROS //////////////////////////////
	$filaConsulta = $resConsulta->fetch_array(MYSQLI_BOTH);
	$imagen = $filaConsulta['imagen'];
	echo $imagen;
}

function datosParcelaSecundario($conexion, $modelo){
	$resConsulta=$conexion->query("SELECT * FROM zona_parcela where id_parcela =(Select id_parcela from parcela where nombre = '$modelo')");
	///TABLA DONDE SE DESPLIEGAN LOS REGISTROS //////////////////////////////
	$cadena = "";
	while($filaConsulta = $resConsulta->fetch_array(MYSQLI_BOTH)){
		$res=$conexion->query("SELECT COUNT(*) FROM zona_incidencia where id_zona =".$filaConsulta["id"]."");
		$fila = $res->fetch_array(MYSQLI_BOTH);
		$incidencias = "";
		if($fila["COUNT(*)"] > 0){
			$res2=$conexion->query("SELECT id_incidencia FROM zona_incidencia where id_zona =".$filaConsulta["id"]."");		
			while($fila2 = $res2->fetch_array(MYSQLI_BOTH)){
				$incidencias = $incidencias . ' ' .$fila2["id_incidencia"];
			}
		}
		$res3=$conexion->query("SELECT nombre,codigo FROM zona where id_zona =".$filaConsulta["id_zona"]."");
		$fila3 = $res3->fetch_array(MYSQLI_BOTH);
		$cadena = $cadena . '<tr>
							<td>'.$filaConsulta["id"].'</td>
							<td>'.$fila3['codigo'].' - '.$fila3["nombre"].'</td>
							<td style="text-align: center">'.$filaConsulta['superficie'].'</td>
							<td style="text-align: center">'.$filaConsulta['pendiente'].'</td>
							<td style="text-align: center">'.$incidencias.'</td>
							<td style="text-align: center"> <button class="custom-btn btn-5" onclick=irZona("'.$filaConsulta["id"].'")>Ir Zona</button></td>
						</tr>';
		
	}
		echo '<tbody>'.$cadena.'</tbody>';	
	
}

function datosIncidencias($conexion, $modelo){
	$resConsulta=$conexion->query("SELECT * FROM zona_parcela where id_parcela =(Select id_parcela from parcela where nombre = '$modelo')");
	///TABLA DONDE SE DESPLIEGAN LOS REGISTROS //////////////////////////////
	$cadena = "";
	$incidencias = array();
	while($filaConsulta = $resConsulta->fetch_array(MYSQLI_BOTH)){
		$res=$conexion->query("SELECT COUNT(*) FROM zona_incidencia where id_zona =".$filaConsulta["id"]."");
		$fila = $res->fetch_array(MYSQLI_BOTH);
		if($fila["COUNT(*)"] > 0){
			$res2=$conexion->query("SELECT id_incidencia FROM zona_incidencia where id_zona =".$filaConsulta["id"]."");	
			while($fila2 = $res2->fetch_array(MYSQLI_BOTH)){
				$esta = true;
				for($i = 0; $i < count($incidencias); ++$i){
					if($incidencias[$i] == $fila2["id_incidencia"]){
						$esta = false;
						break;
					}
				}
				if($esta){
					array_push($incidencias,$fila2["id_incidencia"]);
				}
			}
		}
	}
	$final = "";
	for($i = 0; $i < count($incidencias); ++$i){
		$res2=$conexion->query("SELECT descripcion FROM incidencia where id =".$incidencias[$i]."");
		$fila2 = $res2->fetch_array(MYSQLI_BOTH);
		$final = $final . '<tr>
							<td>'.$incidencias[$i].'</td>
							<td>'.$fila2['descripcion'].'</td>
						</tr>';
	}
	echo '<tbody>'. $final .'</tbody>';
	
}

function datosResumen($conexion, $modelo){
	$resConsulta=$conexion->query("SELECT * FROM zona_parcela where id_parcela =(Select id_parcela from parcela where nombre = '$modelo')");
	///TABLA DONDE SE DESPLIEGAN LOS REGISTROS //////////////////////////////
	$cadena = "";
	$zonas = array();
	while($filaConsulta = $resConsulta->fetch_array(MYSQLI_BOTH)){
		$esta = true;
		for($i = 0; $i < count($zonas); ++$i){
			if($zonas[$i] == $filaConsulta["id_zona"]){
				$esta = false;
				break;
			}
		}
		if($esta){
			array_push($zonas,$filaConsulta["id_zona"]);
		}
	}
	$final = "";
	$totalSumado = 0;
	for($i = 0; $i < count($zonas); ++$i){
		$total = 0;
		$res=$conexion->query("SELECT superficie FROM zona_parcela where id_zona =".$zonas[$i]." && id_parcela =(Select id_parcela from parcela where nombre = '$modelo')");
		while($fila3 = $res->fetch_array(MYSQLI_BOTH)){
			$total = $total + $fila3["superficie"];
		}
		$res2=$conexion->query("SELECT nombre, Codigo FROM zona where id_zona =".$zonas[$i]."");
		$fila2 = $res2->fetch_array(MYSQLI_BOTH);
		$final = $final . '<tr>
							<td> '.$fila2['Codigo'].' - '.$fila2["nombre"].'</td>
							<td>'.$total.'</td>
						</tr>';
		$totalSumado = $totalSumado + $total;
	}
	$final = $final . '<tr>
							<td style="color: FF0000">Superficie Total</td>
							<td>'.$totalSumado.'</td>
						</tr>';
	echo '<tbody>'. $final .'</tbody>';
	
}


function coordenadasZona($conexion){
	$zona = $_REQUEST["zona"];
	$resConsulta=$conexion->query("SELECT X,Y,Z FROM zona_parcela where id = $zona");
	///TABLA DONDE SE DESPLIEGAN LOS REGISTROS //////////////////////////////
	$filaConsulta = $resConsulta->fetch_array(MYSQLI_BOTH);
	echo $filaConsulta["X"] . "/" . $filaConsulta["Y"] . "/" . $filaConsulta["Z"];
	
}

function obtenerFechas($conexion, $modelo){
	$resConsulta=$conexion->query("SELECT fecha_vuelo, fecha_actualizacion FROM parcela where nombre = '$modelo'");
	///TABLA DONDE SE DESPLIEGAN LOS REGISTROS //////////////////////////////
	$filaConsulta = $resConsulta->fetch_array(MYSQLI_BOTH);
	$timestamp = strtotime($filaConsulta["fecha_vuelo"]); 
	$newDate = date("d-m-Y", $timestamp );
	$timestamp2 = strtotime($filaConsulta["fecha_actualizacion"]); 
	$newDate2 = date("d-m-Y", $timestamp2 );
	echo $newDate . "/" . $newDate2;	
	
}
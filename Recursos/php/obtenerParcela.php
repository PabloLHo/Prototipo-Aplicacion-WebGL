<?php
////////////////// CONEXION A LA BASE DE DATOS ////////////////////////////////////
include("conectar.php");

$funcion = $_REQUEST['funcion'];
$parcela = $_REQUEST['modelo'];
    switch($funcion) {
        case 'DatosParcelaGen': 
            datosParcelaGeneral($conexion,$parcela);
            break;
        case 'DatosParcelaSecun': 
            datosParcelaSecundario($conexion,$parcela);
            break;
		case 'imagenesParcela':
			imagenParcela($conexion,$parcela);
			break;
		case 'DatosIncidencias':
			datosIncidencias($conexion,$parcela);
			break;
		case 'DatosResumen':
			datosResumen($conexion,$parcela);
			break;
		case 'zona':
			coordenadasZona($conexion, $parcela);
			break;
		case 'fechas':
			obtenerFechas($conexion, $parcela);
			break;
    }


function datosParcelaGeneral($conexion, $parcela){
/////////////////////// CONSULTA A LA BASE DE DATOS ////////////////////////
$resConsulta=$conexion->query("SELECT * FROM datos_parcela where id_Parcela = '$parcela'");
$resConsulta_2=$conexion->query("SELECT * FROM parcela where id_recinto = '$parcela'");


//$superficie = obtenerSuperficie($conexion, $parcela);

///TABLA DONDE SE DESPLIEGAN LOS REGISTROS //////////////////////////////
$datosConsulta = $resConsulta->fetch_array(MYSQLI_BOTH);
$datosConsulta_2 = $resConsulta_2->fetch_array(MYSQLI_BOTH);

$resConsulta_3=$conexion->query("SELECT * FROM municipios_andalucia where cod_mun =".$datosConsulta_2["cd_mun"]." AND cod_prov =".$datosConsulta_2["cd_prov"]."");
$datosConsulta_3 = $resConsulta_3->fetch_array(MYSQLI_BOTH);
$total = mysqli_num_rows($resConsulta);
	echo '<tbody  class="table-hover">

				<tr>
					<td class="text-left"></td>
					<td class="text-left"><b>Valor</b></td>
					<td class="text-left"><b>Codigo</b></td>
				</tr>
				<tr>
					<td class="text-left"><b>Provincia</b></td>
					<td class="text-left">'.$datosConsulta_3['provincia'].'</td>
					<td class="text-left">'.$datosConsulta_2['cd_prov'].'</td>
				</tr>
				<tr>
					<td class="text-left"><b>Municipio</b></td>
					<td class="text-left">'.$datosConsulta_3['nombre'].'</td>
					<td class="text-left">'.$datosConsulta_2['cd_mun'].'</td>
				</tr>
				<tr>
					<td class="text-left"><b>Parcela</b></td>
					<td class="text-left">'.$parcela.'</td>
					<td class="text-left">'.$datosConsulta_2['cd_parcela'].'</td>
				</tr>
				<tr>
					<td class="text-left"><b>Superficie</b></td>
					<td class="text-left"> 1.05</td>
					<td class="text-left">Hectareas</td>
				</tr>';
				if($total > 0){
					echo '<tr>
						<td class="text-left"><b>Referencia Catastral</b></td>
						<td class="text-left">'.$datosConsulta['ReferenciaCatastral'].'</td>
						<td class="text-left"></td>
					</tr>';
				}
				echo '</tbody>';


}

function obtenerSuperficie($conexion, $parcela){
	$resConsulta=$conexion->query("SELECT * FROM zona_parcela where id_parcela =(Select id_parcela from parcela where nombre = '$parcela')");
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
		$res=$conexion->query("SELECT superficie FROM zona_parcela where id_zona =".$zonas[$i]." && id_parcela =(Select id_parcela from parcela where nombre = '$parcela')");
		while($fila3 = $res->fetch_array(MYSQLI_BOTH)){
			$total = $total + $fila3["superficie"];
		}
		$totalSumado = $totalSumado + $total;
	}
	return $totalSumado;
}

function imagenParcela($conexion, $parcela){
	/////////////////////// CONSULTA A LA BASE DE DATOS ////////////////////////
	$resConsulta=$conexion->query("SELECT * FROM datos_parcela where id_parcela = '$parcela'");


	///TABLA DONDE SE DESPLIEGAN LOS REGISTROS //////////////////////////////
	$filaConsulta = $resConsulta->fetch_array(MYSQLI_BOTH);
	$imagen = $filaConsulta['imagen'];
	echo $imagen;
}

function datosParcelaSecundario($conexion, $parcela){
	$resConsulta=$conexion->query("SELECT * FROM zona_parcela where id_parcela =(Select id_parcela from parcela where nombre = '$parcela')");
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

function datosIncidencias($conexion, $parcela){
	$resConsulta=$conexion->query("SELECT * FROM zona_parcela where id_parcela =(Select id_parcela from parcela where nombre = '$parcela')");
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

function datosResumen($conexion, $parcela){
	$resConsulta=$conexion->query("SELECT * FROM zona_parcela where id_parcela =(Select id_parcela from parcela where nombre = '$parcela')");
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
		$res=$conexion->query("SELECT superficie FROM zona_parcela where id_zona =".$zonas[$i]." && id_parcela =(Select id_parcela from parcela where nombre = '$parcela')");
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


function coordenadasZona($conexion, $parcela){
	$resConsulta=$conexion->query("SELECT AsText(SHAPE) FROM parcela where id_recinto = '$parcela'");
	///TABLA DONDE SE DESPLIEGAN LOS REGISTROS //////////////////////////////
	$filaConsulta = $resConsulta->fetch_array(MYSQLI_BOTH);
	echo $filaConsulta["AsText(SHAPE)"];
	
}

function obtenerFechas($conexion, $parcela){
	$resConsulta=$conexion->query("SELECT fecha_vuelo, fecha_actualizacion FROM datos_parcela where id_parcela = '$parcela'");
	///TABLA DONDE SE DESPLIEGAN LOS REGISTROS //////////////////////////////
	$filaConsulta = $resConsulta->fetch_array(MYSQLI_BOTH);
	$timestamp = strtotime($filaConsulta["fecha_vuelo"]); 
	$newDate = date("d-m-Y", $timestamp );
	$timestamp2 = strtotime($filaConsulta["fecha_actualizacion"]); 
	$newDate2 = date("d-m-Y", $timestamp2 );
	echo $newDate . "/" . $newDate2;	
	
}
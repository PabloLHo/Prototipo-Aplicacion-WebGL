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

	$superficie = calculoSuperficie($parcela, $conexion);

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
				<td class="text-left">'.$superficie.'</td>
				<td class="text-left">m<sup>2</sup></td>
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

function calculoSuperficie($parcela, $conexion){
	$resConsulta=$conexion->query("SELECT * FROM parcela where id_recinto = '$parcela'");
	$filaConsulta = $resConsulta->fetch_array(MYSQLI_BOTH);
	$resConsulta_2=$conexion->query("SELECT * FROM parcela where cd_pol =".$filaConsulta['cd_pol']." AND cd_parcela = ".$filaConsulta['cd_parcela']."");
	$superficie = 0;
	///TABLA DONDE SE DESPLIEGAN LOS REGISTROS //////////////////////////////
	while($filaConsulta_2 = $resConsulta_2->fetch_array(MYSQLI_BOTH)){
		$superficie = $superficie + $filaConsulta_2["nu_area"];
	}
	return $superficie;
}

function datosParcelaSecundario($conexion, $parcela){
	$resConsulta=$conexion->query("SELECT * FROM parcela where id_recinto = '$parcela'");
	$filaConsulta_2 = $resConsulta->fetch_array(MYSQLI_BOTH);
	$resConsulta_2=$conexion->query("SELECT * FROM parcela where cd_pol =".$filaConsulta_2['cd_pol']." AND cd_parcela = ".$filaConsulta_2['cd_parcela']." ORDER BY cd_recinto ASC");
	$cadena = "";
	///TABLA DONDE SE DESPLIEGAN LOS REGISTROS //////////////////////////////
	while($filaConsulta = $resConsulta_2->fetch_array(MYSQLI_BOTH)){
		$res3=$conexion->query("SELECT * FROM zona where Codigo = '".$filaConsulta['cd_uso']."'");
		$fila3 = $res3->fetch_array(MYSQLI_BOTH);
		$cadena = $cadena . '<tr>
							<td>'.$filaConsulta["cd_recinto"].'</td>
							<td>'.$filaConsulta['cd_uso'].' - '.$fila3["nombre"].'</td>
							<td style="text-align: center">'.$filaConsulta["nu_area"].'</td>
							<td style="text-align: center">'.$filaConsulta["pdte_media"].'</td>
							<td style="text-align: center">'.$filaConsulta["incidencia"].'</td>
							<td> <button class="custom-btn btn-5" onclick=irZona("'.$filaConsulta['cd_recinto'].'")>Ir Zona</button></td>
							
						</tr>';
		
	}
		echo '<tbody>'.$cadena.'</tbody>';	
		//<td style="text-align: center"> <button class="custom-btn btn-5" onclick=irZona("'.$filaConsulta["id"].'")>Ir Zona</button></td>
	
}

function datosIncidencias($conexion, $parcela){
	$resConsulta=$conexion->query("SELECT * FROM parcela where id_recinto = '$parcela'");
	$filaConsulta = $resConsulta->fetch_array(MYSQLI_BOTH);
	$resConsulta_2=$conexion->query("SELECT incidencia FROM parcela where cd_pol =".$filaConsulta['cd_pol']." AND cd_parcela = ".$filaConsulta['cd_parcela']."");
	$cadena = "";
	$incidencias = array();
	while($filaConsulta_2 = $resConsulta_2->fetch_array(MYSQLI_BOTH)){
		if($filaConsulta_2["incidencia"] != NULL){
			$incidencias_parcela = explode(",", $filaConsulta_2["incidencia"]);
			for($x = 0; $x < count($incidencias_parcela); ++$x){
				$esta = true;
				for($i = 0; $i < count($incidencias); ++$i){
					if($incidencias[$i] == $incidencias_parcela[$x]){
						$esta = false;
						break;
					}
				}
				if($esta){
					array_push($incidencias,$incidencias_parcela[$x]);
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
	$resConsulta=$conexion->query("SELECT * FROM parcela where id_recinto = '$parcela'");
	$filaConsulta = $resConsulta->fetch_array(MYSQLI_BOTH);
	$resConsulta_2=$conexion->query("SELECT * FROM parcela where cd_pol =".$filaConsulta['cd_pol']." AND cd_parcela = ".$filaConsulta['cd_parcela']."");
	$cadena = "";
	$zonas = array();
	while($filaConsulta_2 = $resConsulta_2->fetch_array(MYSQLI_BOTH)){
		$esta = true;
		for($i = 0; $i < count($zonas); ++$i){
			if($zonas[$i] == $filaConsulta_2["cd_uso"]){
				$esta = false;
				break;
			}
		}
		if($esta){
			array_push($zonas,$filaConsulta_2["cd_uso"]);
		}
	}
	$final = "";
	$totalSumado = 0;
	for($i = 0; $i < count($zonas); ++$i){
		$total = 0;
		$res=$conexion->query("SELECT nu_area FROM parcela where cd_pol =".$filaConsulta['cd_pol']." AND cd_parcela = ".$filaConsulta['cd_parcela']." AND cd_uso = '".$zonas[$i]."'");
		while($fila3 = $res->fetch_array(MYSQLI_BOTH)){
			$total = $total + $fila3["nu_area"];
		}
		$res2=$conexion->query("SELECT nombre FROM zona where Codigo ='".$zonas[$i]."'");
		$fila2 = $res2->fetch_array(MYSQLI_BOTH);
		$final = $final . '<tr>
							<td> '.$zonas[$i].' - '.$fila2["nombre"].'</td>
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
	$zona = $_REQUEST['zona'];
	if($zona != ""){
		$resConsulta_2=$conexion->query("SELECT * FROM geometria_parcela where id_Parcela = '$parcela'");
		$filaConsulta_2 = $resConsulta_2->fetch_array(MYSQLI_BOTH);
		$resConsulta=$conexion->query("SELECT AsText(SHAPE) FROM geometria_parcela where cd_pol =".$filaConsulta_2['cd_pol']." AND cd_parcela = ".$filaConsulta_2['cd_parcela']." AND cd_recinto=".$zona."");
	}else{
		$resConsulta=$conexion->query("SELECT AsText(SHAPE) FROM geometria_parcela where id_Parcela = '$parcela'");
	}
	
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
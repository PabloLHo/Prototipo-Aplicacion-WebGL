<?php
////////////////// CONEXION A LA BASE DE DATOS ////////////////////////////////////
include("conectar.php");

$funcion = $_REQUEST['funcion'];
switch($funcion) {
    case 'Datos': 
        datosHistorico($conexion);
        break;
	case 'obtenerTabla':
		tablaHistorico($conexion);
		break;
	case 'editarValor':
		editar($conexion);
		break;
	case 'fecha':
		obtenerFecha($conexion);
		break;
	case 'insertarDato':
		insertar($conexion);
		break;
	case 'obtenerAspectos':
		obtenerAspectos($conexion);
		break;
}


function datosHistorico($conexion){
	$parcela = $_REQUEST['parcela'];
	$aspecto = $_REQUEST['aspecto'];
	$numero = $_REQUEST["numero"];
	$final = $_REQUEST["final"];
	$datos = ["Fechas" => array(), "Datos" => array()];
	/////////////////////// CONSULTA A LA BASE DE DATOS ////////////////////////
	$resConsulta=$conexion->query("SELECT * FROM ".$aspecto." where id_parcela = '".$parcela."' ORDER BY fecha DESC ");
	$inicio = 1;
	while($filaConsulta = $resConsulta->fetch_array(MYSQLI_BOTH)){
		if($inicio >= $numero && $inicio <= $final){
			array_push($datos["Fechas"],$filaConsulta["fecha"]);
			array_push($datos["Datos"],$filaConsulta[$aspecto]);
		}
		$inicio = $inicio + 1;
	}
	
	echo json_encode($datos);
}

function tablaHistorico($conexion){
	$aspecto = $_REQUEST["nombre"];
	$parcela = $_REQUEST['parcela'];
	$nivel = $_REQUEST["nivel"];
	$tipo = $_REQUEST["tipo"];
	$mostrado = $nivel;
	$resConsulta=$conexion->query("SELECT * FROM ".$aspecto." where id_parcela = '".$parcela."' ORDER BY fecha DESC");

	$cadena = '<div class="table-responsive table mt-2" id="dataTable" role="grid" aria-describedby="dataTable_info">
                <table class="table my-0" id="data">
					<button id="boton_adicion" class="btn btn-primary btn-sm" onclick="nuevoDato()"> + Dato </button>
					<button id="boton_adicion_masiva" style="margin-left: 1%" class="btn btn-primary btn-sm" onclick=subidaMasiva("'.$aspecto.'")> Subir CSV </button>
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Valor</th>
                            <th></th>
                         </tr>
                     </thead>
                     <tbody id="tabla">
						<tr id="nuevoDato">
							
						</tr>';
	
	$cadena2 =       '</tbody>
                </table>
               </div>';
	$numHistorico = 0;
	while($filaConsulta = $resConsulta->fetch_array(MYSQLI_BOTH)){
		$numHistorico = $numHistorico + 1;
		if($tipo == "anterior"){
            if($numHistorico < $nivel and $numHistorico >= ($nivel - 10)){
				$cadena = $cadena . '<tr>
										<td id="'.$filaConsulta["fecha"].'">'.$filaConsulta["fecha"].'</td>
										<td id="'.$filaConsulta["fecha"].'_valor">'.$filaConsulta[$aspecto].'</td>
										<td><button  id="boton_'.$filaConsulta["fecha"].'" onclick=editarCampo(true,"'.$filaConsulta["fecha"].'")>Editar Campos</button></td>
									</tr>';
			}
		}else{
            if($numHistorico < ($nivel + 10) and $numHistorico >= $nivel){
				$cadena = $cadena . '<tr>
										<td id="'.$filaConsulta["fecha"].'">'.$filaConsulta["fecha"].'</td>
										<td id="'.$filaConsulta["fecha"].'_valor">'.$filaConsulta[$aspecto].'</td>
										<td><button  id="boton_'.$filaConsulta["fecha"].'" onclick=editarCampo(true,"'.$filaConsulta["fecha"].'")>Editar Campos</button></td>
									</tr>';
				$mostrado = $mostrado + 1;
			}
		}
	}
	$mostradoAnterior = 0;
	$cadena3 = "";
	if($numHistorico <= 10)
        $cadena3 = $cadena3 . '<p id="dataTable_info" class="dataTables_info" role="status" aria-live="polite">Mostrando datos del 1 al '.$numHistorico.'</p>';
    else {
        switch($tipo) {
            case 'inicial': 
                $cadena3 = $cadena3 . '<p id="dataTable_info" class="dataTables_info" role="status" aria-live="polite">Mostrando datos del 1 al 10 de '.$numHistorico.'</p>';	
				break;
            case 'siguiente':
                if(($numHistorico - $nivel) >= 10){
					$mostradoAnterior = $mostrado - 10;
                    $aux = $nivel + 9;
                }else{
					$mostradoAnterior = $mostrado - $mostrado % 10 + 1;
                    $aux = $numHistorico;
                }
                $cadena3 = $cadena3 . '<p id="dataTable_info" class="dataTables_info" role="status" aria-live="polite">Mostrando datos del '.$nivel.' al '.$aux.' de '.$numHistorico.'</p>';	
                break;
            case 'anterior':
				$mostradoAnterior = $mostrado - 10;
                $aux = $nivel - 10;
                $cadena3 = $cadena3 . '<p id="dataTable_info" class="dataTables_info" role="status" aria-live="polite">Mostrando datos del '.$aux.' al '.($nivel - 1).' de '.$numHistorico.'</p>';	
                break;
        }
    }
    $cadena3 = $cadena3 . '</div>
                             <div class="col-md-6">
                                <nav class="d-lg-flex justify-content-lg-end dataTables_paginate paging_simple_numbers">
                                     <ul class="pagination">
                                         <li class="page-item disabled" id="disabled-historico"><button class="page-link" aria-label="Previous" id="anterior" onclick ="anterioresDatos('.$mostradoAnterior.')"><span aria-hidden="true">Anterior</span></li>
                                         <li class="page-item" id="post-historico"><button class="page-link" aria-label="Next" id="siguiente" onclick ="siguientesDatos('.$mostrado.', '.$numHistorico.')"><span aria-hidden="true">Siguiente</span></li>
                                      </ul>
                                 </nav>
                              </div>
                        </div>&' . $numHistorico;

	echo $cadena . $cadena2 . $cadena3;
}

function editar($conexion){
	$aspecto = $_REQUEST["nombre"];
	$parcela = $_REQUEST['parcela'];
	$fecha = $_REQUEST["fecha"];
	$valor = $_REQUEST["valor"];
	$resConsulta=$conexion->query("UPDATE ".$aspecto." SET ".$aspecto." = ".$valor."  where id_parcela = '".$parcela."' AND fecha = '".$fecha."'");
}

function insertar($conexion){
	$aspecto = $_REQUEST["nombre"];
	$parcela = $_REQUEST['parcela'];
	$fecha = $_REQUEST["fecha"];
	$valor = $_REQUEST["valor"];
	$resConsulta=$conexion->query("INSERT INTO ".$aspecto." (`id_parcela`, `fecha`, `".$aspecto."`) VALUES(".$parcela.",'".$fecha."','".$valor."')");
    
}

function obtenerFecha($conexion){
	$aspecto = $_REQUEST["nombre"];
	$parcela = $_REQUEST['parcela'];
	$fecha = $_REQUEST["fecha"];

	$resConsulta=$conexion->query("SELECT * FROM ".$aspecto." where id_parcela = '".$parcela."' AND fecha = '".$fecha."'");

	$totalDevuelto = mysqli_num_rows($resConsulta);

	if($totalDevuelto == 0)
		echo true;
	else
		echo false;

}

function obtenerAspectos($conexion){
	$parcela = $_REQUEST['parcela'];

	$resConsulta=$conexion->query("SELECT * FROM temperatura where id_parcela = '".$parcela."'");

	if(mysqli_num_rows($resConsulta) > 0){
		echo "temperatura-";
	}

	$resConsulta=$conexion->query("SELECT * FROM humedad where id_parcela = '".$parcela."'");

	if(mysqli_num_rows($resConsulta) > 0){
		echo "humedad-";
	}

	$resConsulta=$conexion->query("SELECT * FROM produccion where id_parcela = '".$parcela."'");

	if(mysqli_num_rows($resConsulta) > 0){
		echo "produccion-";
	}

	$resConsulta=$conexion->query("SELECT * FROM precipitaciones where id_parcela = '".$parcela."'");

	if(mysqli_num_rows($resConsulta) > 0){
		echo "precipitaciones-";
	}
}
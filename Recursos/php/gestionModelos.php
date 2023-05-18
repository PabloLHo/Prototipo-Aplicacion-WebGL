<?php
////////////////// CONEXION A LA BASE DE DATOS ////////////////////////////////////
include("conectar.php");

$funcion = $_REQUEST['funcion'];

    switch($funcion) {
        case 'mostrarParcelas':
            mostrarParcelas($conexion);
            break;
        case 'parcela':
            mostrarParcela($conexion);
            break;
        case 'actualizarFecha':
            actualizarFecha($conexion);
            break;
        case 'actualizarNube':
            actualizarNube($conexion);
            break;
        case 'actualizarOrto':
            actualizarOrtofoto($conexion);
            break;
        case 'actualizarAltura':
            actualizarMapaAltura($conexion);
            break;
        case 'insertarParcela':
            nuevaParcela($conexion);
    }


function mostrarParcelas($conexion){
    $permisos = $_REQUEST["permisos"];
    $usuario = $_REQUEST["usuario"];
    $resConsulta;
    if($permisos == "ADMIN"){
        $resConsulta=$conexion->query("Select * FROM geometria_parcela WHERE ortofoto = 1 OR nubePuntos = 1");
    }else{
        $resConsulta=$conexion->query("Select * FROM geometria_parcela WHERE id_recinto in (SELECT id_Parcela from parcelas_usuario WHERE id_usuario = ".$usuario.")");
    }
    $numParcelas = 0;
    $nivel = $_REQUEST["nivel"];
    $mostrado = $nivel;
    $tipo = $_REQUEST["tipo"];
    $cadena = '<div class="table-responsive table mt-2" id="dataTable" role="grid" aria-describedby="dataTable_info">
                <table class="table my-0" id="data">
                    <thead>
                        <tr>
                            <th>ID_PARCELA</th>
                            <th>Provincia</th>
                            <th>Municipio</th>
                            <th>Area (m<sup>2</sup>)</th>
                            <th>Pendiente media (%)</th>
                            <th> Nube puntos </th>
                            <th> Ortofoto </th>
                            <th> Mapa altura </th>
                            <th> Fecha actualizacion </th>
                            <th> Fecha vuelo </th>
                            <th></th>
                         </tr>
                     </thead>
                     <tbody id="tabla">';

    while($filaConsulta = $resConsulta->fetch_array(MYSQLI_BOTH)){
        $numParcelas = $numParcelas + 1;
        $area = calculoSuperficie($filaConsulta["id_recinto"],$conexion);
        $pdteMedia = calculoPendiente($filaConsulta["id_recinto"],$conexion);
        $resConsulta3=$conexion->query("Select * FROM parcela WHERE id_recinto = ".$filaConsulta['id_recinto']."");
        $filaConsulta3 = $resConsulta3->fetch_array(MYSQLI_BOTH);
        $resConsulta2=$conexion->query("SELECT nombre,provincia FROM municipios_andalucia WHERE cod_mun = ".$filaConsulta3['cd_mun']." AND cod_prov = ".$filaConsulta3['cd_prov']."");
        $filaConsulta2 = $resConsulta2->fetch_array(MYSQLI_BOTH);
        $resConsulta4=$conexion->query("Select * FROM datos_parcela WHERE id_Parcela = ".$filaConsulta['id_recinto']."");
        $filaConsulta4 = $resConsulta4->fetch_array(MYSQLI_BOTH);
        $ortofoto = "NO";
        if($filaConsulta["ortofoto"])
            $ortofoto = "SI";
        $nube = "NO";
        if($filaConsulta["nubePuntos"])
            $nube = "SI";
        $altura = "NO";
        if($filaConsulta["MapaAltura"])
            $altura = "SI";

        if($tipo == "anterior"){
            if($numParcelas < $nivel and $numParcelas >= ($nivel - 10)){
                $cadena = $cadena . '<tr>
                                <td><a href="#" onclick=mostrarParcela("'.$filaConsulta['id_recinto'].'") >'.$filaConsulta["id_recinto"].'</a></td>
                                <td>'.$filaConsulta2["provincia"].'</td>
                                <td>'.$filaConsulta2["nombre"].'</td>
                                <td>'.$area.'</td>
                                <td>'.$pdteMedia.'</td>
                                <td>'.$nube.'</td>
                                <td>'.$ortofoto.'</td>
                                <td>'.$altura.'</td>
                                <td>'.$filaConsulta4["fecha_actualizacion"].'</td>
                                <td>'.$filaConsulta4["fecha_vuelo"].'</td>
                                <td><button class="custom-btn btn-5" onclick=location.href="InformacionParcela.php?modelo='.$filaConsulta["id_recinto"].'"> Ir a la parcela</button></td>
                               </tr>';
            }    
        }else{
            if($numParcelas <= ($nivel + 10) and $numParcelas >= $nivel){
                $cadena = $cadena . '<tr>
                                <td><a href="#" onclick=mostrarParcela("'.$filaConsulta['id_recinto'].'") >'.$filaConsulta["id_recinto"].'</a></td>
                                <td>'.$filaConsulta2["provincia"].'</td>
                                <td>'.$filaConsulta2["nombre"].'</td>
                                <td>'.$area.'</td>
                                <td>'.$pdteMedia.'</td>
                                <td>'.$nube.'</td>
                                <td>'.$ortofoto.'</td>
                                <td>'.$altura.'</td>
                                <td>'.$filaConsulta4["fecha_actualizacion"].'</td>
                                <td>'.$filaConsulta4["fecha_vuelo"].'</td>
                                <td><button class="custom-btn btn-5" onclick=location.href="InformacionParcela.php?modelo='.$filaConsulta["id_recinto"].'"> Ir a la parcela</button></td>
                               </tr>';
                $mostrado = $mostrado + 1;
            }
            
        }
    }


    $cadena = $cadena . '</tbody>
                            </table>
                        </div>
                        <br>
                        <div class="row">
                            <div class="col-md-6 align-self-center">';
    if($numParcelas <= 10)
        $cadena = $cadena . '<p id="dataTable_info" class="dataTables_info" role="status" aria-live="polite">Mostrando parcelas del 1 al '.$numParcelas.'</p>';
    else {
        switch($tipo) {
            case 'inicial': 
                $cadena = $cadena . '<p id="dataTable_info" class="dataTables_info" role="status" aria-live="polite">Mostrando parcelas del 1 al 10 de '.$numParcelas.'</p>';	
                break;
            case 'siguiente':
                if(($numParcelas - $nivel) > 10){
                    $aux = $nivel + 10;
                }else{
                    $aux = $numParcelas;
                }
                $cadena = $cadena . '<p id="dataTable_info" class="dataTables_info" role="status" aria-live="polite">Mostrando parcelas del '.$nivel.' al '.$aux.' de '.$numParcelas.'</p>';	
                break;
            case 'anterior':
                $aux = $nivel - 9;
                $cadena = $cadena . '<p id="dataTable_info" class="dataTables_info" role="status" aria-live="polite">Mostrando parcelas del '.$aux.' al '.$nivel.' de '.$numParcelas.'</p>';	
                break;
        }
    }
    if($nivel != 0)
        $mostrado = $mostrado - $mostrado % $nivel;
    $cadena = $cadena . '</div>
                             <div class="col-md-6">
                                <nav class="d-lg-flex justify-content-lg-end dataTables_paginate paging_simple_numbers">
                                     <ul class="pagination">
                                         <li class="page-item disabled" id="disabled"><button class="page-link" aria-label="Previous" id="anterior" onclick ="anterioresUsuarios('.$mostrado.')"><span aria-hidden="true">Anterior</span></li>
                                         <li class="page-item" id="post"><button class="page-link" aria-label="Next" id="siguiente" onclick ="siguientesUsuarios('.$mostrado.', '.$numParcelas.')"><span aria-hidden="true">Siguiente</span></li>
                                      </ul>
                                 </nav>
                              </div>
                        </div>&' . $numParcelas;

    echo $cadena;
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

function calculoPendiente($parcela, $conexion){
	$resConsulta=$conexion->query("SELECT * FROM parcela where id_recinto = '$parcela'");
	$filaConsulta = $resConsulta->fetch_array(MYSQLI_BOTH);
	$resConsulta_2=$conexion->query("SELECT * FROM parcela where cd_pol =".$filaConsulta['cd_pol']." AND cd_parcela = ".$filaConsulta['cd_parcela']."");
	$pdt = 0;
    $zonas = 0;
	///TABLA DONDE SE DESPLIEGAN LOS REGISTROS //////////////////////////////
	while($filaConsulta_2 = $resConsulta_2->fetch_array(MYSQLI_BOTH)){
		$pdt = $pdt + $filaConsulta_2["pdte_media"];
        $zonas = $zonas + 1;
	}
	return $pdt / $zonas;
}

function mostrarParcela($conexion){
    $parcela = $_REQUEST["nombre"];

    $resConsulta=$conexion->query("Select * FROM datos_parcela WHERE id_Parcela = ".$parcela."");
    $filaConsulta = $resConsulta->fetch_array(MYSQLI_BOTH);
    $devuelto = mysqli_num_rows($resConsulta);
    $resConsulta3=$conexion->query("Select * FROM parcela WHERE id_recinto = ".$parcela."");
    $filaConsulta3 = $resConsulta3->fetch_array(MYSQLI_BOTH);
        
    $resConsulta4=$conexion->query("Select * FROM geometria_parcela WHERE id_recinto = ".$parcela."");
    $filaConsulta4 = $resConsulta4->fetch_array(MYSQLI_BOTH);

    $resConsulta2=$conexion->query("SELECT nombre,provincia FROM municipios_andalucia WHERE cod_mun = ".$filaConsulta3['cd_mun']." AND cod_prov = ".$filaConsulta3['cd_prov']."");
    $filaConsulta2 = $resConsulta2->fetch_array(MYSQLI_BOTH);

    if($devuelto > 0)
        echo $filaConsulta2['provincia'] . "&" . $filaConsulta2['nombre'] . "&" . $filaConsulta['fecha_vuelo'] . "&" . $filaConsulta["ReferenciaCatastral"] . "&" . $filaConsulta4["nubePuntos"] . "&" . $filaConsulta4["ortofoto"] . "&" . $filaConsulta4["MapaAltura"];
    else
        echo $filaConsulta2['provincia'] . "&" . $filaConsulta2['nombre'] . "& N/A & N/A & N/A & N/A & N/A";
}

function actualizarFecha($conexion){
    $fecha = $_REQUEST["valor"];
    $parcela = $_REQUEST["parcela"];
    $fecha_actual = date("Y-m-d");
    $ref = $_REQUEST["ref"];

    $resConsulta=$conexion->query("Select * FROM datos_parcela WHERE id_Parcela = ".$parcela."");
    $devuelto = mysqli_num_rows($resConsulta);
    $filaConsulta = $resConsulta->fetch_array(MYSQLI_BOTH);
    if($devuelto > 0){
        if($ref == ""){
            $ref = $filaConsulta["ReferenciaCatastral"];
        }
        if($fecha == ""){
            if($filaConsulta["fecha_vuelo"] == NULL)
                $resConsulta=$conexion->query("UPDATE datos_parcela SET fecha_actualizacion = '".$fecha_actual."', ReferenciaCatastral= '".$ref."' WHERE id_Parcela = '".$parcela."'");
            else
                $resConsulta=$conexion->query("UPDATE datos_parcela SET fecha_vuelo = '".$filaConsulta["fecha_vuelo"]."', fecha_actualizacion = '".$fecha_actual."', ReferenciaCatastral= '".$ref."' WHERE id_Parcela = '".$parcela."'");
        }else{
            $resConsulta=$conexion->query("UPDATE datos_parcela SET fecha_vuelo = '".$fecha."', fecha_actualizacion = '".$fecha_actual."', ReferenciaCatastral= '".$ref."' WHERE id_Parcela = '".$parcela."'");
        }
        
    }else{
        $resConsulta=$conexion->query("INSERT INTO datos_parcela (`id_Parcela`, `ReferenciaCatastral`, `fecha_vuelo`, `fecha_actualizacion`) VALUES (".$parcela.",'".$ref."','".$fecha."','".$fecha_actual."')");
    }

}

function actualizarNube($conexion){

    $parcela = $_REQUEST["parcela"];

    $resConsulta=$conexion->query("UPDATE geometria_parcela SET nubePuntos = 1 WHERE id_recinto = '".$parcela."'");

}

function actualizarOrtofoto($conexion){

    $parcela = $_REQUEST["parcela"];

    $resConsulta=$conexion->query("UPDATE geometria_parcela SET ortofoto = 1 WHERE id_recinto = '".$parcela."'");

}

function actualizarMapaAltura($conexion){

    $parcela = $_REQUEST["parcela"];

    $resConsulta=$conexion->query("UPDATE geometria_parcela SET MapaAltura = 1 WHERE id_recinto = '".$parcela."'");

}


function nuevaParcela($conexion){
    $parcela = $_REQUEST["parcela"];
    $ref = $_REQUEST["ref"];
    $fecha = $_REQUEST["fecha"];
    $fecha_actual = date("Y-m-d");
    if($fecha == ""){
        $resConsulta=$conexion->query("INSERT INTO datos_parcela (`id_Parcela`, `ReferenciaCatastral`, `fecha_vuelo`, `fecha_actualizacion`) VALUES (".$parcela.",'".$ref."',,'".$fecha_actual."')");
    }else{
        $resConsulta=$conexion->query("INSERT INTO datos_parcela (`id_Parcela`, `ReferenciaCatastral`, `fecha_vuelo`, `fecha_actualizacion`) VALUES (".$parcela.",'".$ref."','".$fecha."','".$fecha_actual."')");
    }
}
<?php
////////////////// CONEXION A LA BASE DE DATOS ////////////////////////////////////
include("conectar.php");

$texto = $_REQUEST["busqueda"];

$resConsulta=$conexion->query("SELECT nombre FROM municipios_andalucia where nombre LIKE '%".$texto."%' ORDER BY nombre ASC");

$response = array();

while($datosConsulta = $resConsulta->fetch_array(MYSQLI_BOTH)){
	$value = $datosConsulta["nombre"];

	$response[] = array("nombre" => $value);
}

echo json_encode($response);
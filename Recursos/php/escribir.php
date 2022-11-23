<?php
////////////////// CONEXION A LA BASE DE DATOS ////////////////////////////////////

$datos = $_REQUEST['modelo'];
$ar=fopen("../Modelos/archivo.txt","a") or die ("Error al crear");

fwrite($ar,$datos);
fclose($ar);


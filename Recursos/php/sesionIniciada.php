<?php
////////////////// CONEXION A LA BASE DE DATOS ////////////////////////////////////
include("conectar.php");

session_start();

$usuario = $_SESSION['usuario'];

$estado = false;

if(isset($usuario)){
	header("location:../../Home.html");
}


?>

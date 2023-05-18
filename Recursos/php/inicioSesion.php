<?php
////////////////// CONEXION A LA BASE DE DATOS ////////////////////////////////////
include("conectar.php");

$usuario=$_POST['usuario'];
$psswd=$_POST['contraseña'];

session_start();
$_SESSION['tiempo'] = time();
$_SESSION['usuario']= $usuario;
$_SESSION['contraseña'] = $psswd;

$resConsulta=$conexion->query("SELECT contraseña FROM usuario where usuario='$usuario'");
$datosConsulta = $resConsulta->fetch_array(MYSQLI_BOTH);


if(password_verify($psswd, $datosConsulta['contraseña'])){ 

    header("location:../../Home.php");

}else{
    $_SESSION['usuario'] = null;
    header("location:../../index.php");

}

mysqli_free_result($resultado);
mysqli_close($conexion);

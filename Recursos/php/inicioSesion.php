<?php
////////////////// CONEXION A LA BASE DE DATOS ////////////////////////////////////
include("conectar.php");

$usuario=$_POST['usuario'];
$contraseña=$_POST['contraseña'];

session_start();
$_SESSION['tiempo'] = time();
$_SESSION['usuario']=$usuario;
$_SESSION['contraseña'] = $contraseña;


$consulta="SELECT*FROM usuario where usuario='$usuario' and contraseña='$contraseña'";
$resultado=mysqli_query($conexion,$consulta);

$filas=mysqli_num_rows($resultado);

if($filas){ 
 
    header("location:../../Home.php");

}else{
	
    header("location:../../index.php");
}

mysqli_free_result($resultado);
mysqli_close($conexion);

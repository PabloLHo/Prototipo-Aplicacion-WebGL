<?php
////////////////// CONEXION A LA BASE DE DATOS ////////////////////////////////////
include("conectar.php");

if (isset($_GET["w1"])) {
    // asignar w1 y w2 a dos variables
    $phpVar1 = $_GET["w1"];

    $resConsulta=$conexion->query("Select fotoPerfil FROM usuario where id_usuario = ".$phpVar1."");
    $datosConsulta = $resConsulta->fetch_array(MYSQLI_BOTH);

    $fotoAntigua = $datosConsulta["fotoPerfil"];

    $resConsulta=$conexion->query("UPDATE usuario SET fotoPerfil = '". $_FILES['foto']['name']."' where id_usuario = ".$phpVar1."");

    if($fotoAntigua != "Sin_Usuario.jpg")
	    unlink("../imagenes/usuarios/" .$fotoAntigua);
    move_uploaded_file($_FILES['foto']['tmp_name'], "../imagenes/usuarios/" . $_FILES['foto']["name"]);
    header("location:../../Perfil.php");
}
?>
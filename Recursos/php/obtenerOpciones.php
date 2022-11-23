<?php
////////////////// CONEXION A LA BASE DE DATOS ////////////////////////////////////


include("conectar.php");
/////////////////////// CONSULTA A LA BASE DE DATOS ////////////////////////
$opcion = $_REQUEST['opcion'];
$lugar = $_REQUEST['lugar'];
switch($opcion){
	case '':
		$resLugares=$conexion->query("SELECT DISTINCT(Municipio) FROM parcela");
		break;
	case 'Parcela':
		$resLugares=$conexion->query("SELECT nombre FROM parcela WHERE Municipio = '$lugar'");
	break;
	
}


///TABLA DONDE SE DESPLIEGAN LOS REGISTROS //////////////////////////////

echo "<div class= 'row'>";
while($filaLugar = $resLugares->fetch_array(MYSQLI_BOTH)){
	switch($opcion){
		case '':
			$variable = $filaLugar['Municipio'];
			$button = " <div class='col'><button class='btn btn-primary btn-lg' onClick=opcionesParcelas('$variable')>".$filaLugar['Municipio']."</button><h5> &nbsp </h5></div>";
		break;
		case 'Parcela':
			$variable = $filaLugar['nombre'];
			$button = " <div class='col'><a href='InformacionParcela.php?modelo=".$variable."'><button class='btn btn-primary btn-lg' >".$filaLugar['nombre']."</button></a><h5> &nbsp </h5></div>";
		break;	
	}
	echo $button;
}
echo "</div>";

<?php
////////////////// CONEXION A LA BASE DE DATOS ////////////////////////////////////
include("conectar.php");

$funcion = $_REQUEST['funcion'];

    switch($funcion) {
        case 'permisos': 
            obtenerPermisos($conexion);
            break;
        case 'nuevoUsuario':
            anadirUsuario($conexion);
            break;
        case 'borraUsuario':
            eliminarUsuario($conexion);
            break;
        case 'actualizarUsuario':
            actualizarUsuario($conexion);
            break;
        case 'mostrarUsuarios':
            mostrarUsuarios($conexion);
            break;
        case 'existeUsuario':
            existeUsuario($conexion);
            break;
    }


function obtenerPermisos($conexion){
	
    $usuario = $_REQUEST['nombre'];

	$resConsulta=$conexion->query("SELECT * FROM usuario where usuario='".$usuario."'");

	$datosConsulta = $resConsulta->fetch_array(MYSQLI_BOTH);

	echo $datosConsulta["permisos"] . "&" . $datosConsulta["fotoPerfil"] . "&" . $datosConsulta["usuario"] . "&"  . $datosConsulta["nombre"] . "&" . $datosConsulta["apellidos"] . "&" . $datosConsulta["correo"] . "&" . $datosConsulta["direccion"] . "&" . $datosConsulta["ciudad"] . "&" . $datosConsulta["pais"] . "&" . $datosConsulta["id_usuario"];
}

function anadirUsuario($conexion){

    $psswd = password_hash($_REQUEST['contrasena'], PASSWORD_DEFAULT);

    $usuario = $_REQUEST['usuario'];
    $nombre = $_REQUEST['aux'];
    $apellidos = $_REQUEST['apellidos'];
    $correo = $_REQUEST['correo'];
    $direccion = $_REQUEST['direccion'];
    $ciudad = $_REQUEST['ciudad'];
    $pais = $_REQUEST['pais'];
    $permisos = $_REQUEST['permisos'];

    $resConsulta=$conexion->query("INSERT INTO usuario (`id_usuario`, `usuario`, `password`, `permisos`, `fotoPerfil`, `nombre`, `apellidos`, `correo`, `direccion`, `pais`, `ciudad`) VALUES(NULL,'".$usuario."','".$psswd."', '".$permisos."','Sin_Usuario.jpg', '".$nombre."', '".$apellidos."', '".$correo."', '".$direccion."', '".$pais."', '".$ciudad."')");
    echo $resConsulta;
}

function eliminarUsuario($conexion){

    $usuario = $_REQUEST['usuario'];

    $resConsulta=$conexion->query("DELETE FROM usuario WHERE usuario = '".$usuario."'");

}

function actualizarUsuario($conexion){
    
    $aux = $_REQUEST['usuarioAnterior'];
    $usuario = $_REQUEST['usuario'];
    $nombre = $_REQUEST['nombre'];
    $apellidos = $_REQUEST['apellidos'];
    $correo = $_REQUEST['correo'];
    $direccion = $_REQUEST['direccion'];
    $ciudad = $_REQUEST['ciudad'];
    $pais = $_REQUEST['pais'];
    

    $resConsulta=$conexion->query("UPDATE usuario SET usuario = '".$usuario."' ,nombre = '".$nombre."', correo = '".$correo."', apellidos = '".$apellidos."', direccion = '".$direccion."', ciudad = '".$ciudad."', pais='".$pais."' WHERE usuario = '".$aux."'");

    echo $resConsulta;
}

function mostrarUsuarios($conexion){

    $resConsulta=$conexion->query("SELECT * FROM usuario WHERE permisos !='ADMIN'");
    $numUsuarios = 0;
    $nivel = $_REQUEST["nivel"];
    $mostrado = $nivel;
    $tipo = $_REQUEST["tipo"];

    $cadena = '<div class="table-responsive table mt-2" id="dataTable" role="grid" aria-describedby="dataTable_info">
                <table class="table my-0" id="data">
                    <thead>
                        <tr>
                            <th>Foto</th>
                            <th>Nombre</th>
                            <th>Apellidos</th>
                            <th>Nombre Usuario</th>
                            <th>Nivel</th>
                         </tr>
                     </thead>
                     <tbody id="tabla">';

    while($filaConsulta = $resConsulta->fetch_array(MYSQLI_BOTH)){
        $numUsuarios = $numUsuarios + 1;
        if($tipo == "anterior"){
            if($numUsuarios < $nivel and $numUsuarios >= ($nivel - 10)){
                $cadena = $cadena . '<tr>
                                <td class="col-1"><img style="width: 50%" class="border rounded-circle img-profile"  src="Recursos/imagenes/usuarios/'.$filaConsulta["fotoPerfil"].'"></td>
                                <td>'.$filaConsulta["nombre"].'</td>
                                <td>'.$filaConsulta["apellidos"].'</td>
                                <td>'.$filaConsulta["usuario"].'</td>
                                <td>'.$filaConsulta["permisos"].'</td>
                               </tr>';
            }    
        }else{
            if($numUsuarios < ($nivel + 10) and $numUsuarios >= $nivel){
                $cadena = $cadena . '<tr>
                                <td class="col-1"><img style="width: 50%" class="border rounded-circle img-profile"  src="Recursos/imagenes/usuarios/'.$filaConsulta["fotoPerfil"].'"></td>
                                <td><a href="#" onclick=mostrarUsuario("'.$filaConsulta['usuario'].'") /> '.$filaConsulta["nombre"].'</td>
                                <td>'.$filaConsulta["apellidos"].'</td>
                                <td>'.$filaConsulta["usuario"].'</td>
                                <td>'.$filaConsulta["permisos"].'</td>
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
    $mostradoAnterior = 0;
    if($numUsuarios <= 10)
        $cadena = $cadena . '<p id="dataTable_info" class="dataTables_info" role="status" aria-live="polite">Mostrando usuarios del 1 al '.$numUsuarios.'</p>';
    else {
        switch($tipo) {
            case 'inicial': 
                $cadena = $cadena . '<p id="dataTable_info" class="dataTables_info" role="status" aria-live="polite">Mostrando usuarios del 1 al 10 de '.$numUsuarios.'</p>';	
                break;
            case 'siguiente':
                if(($numUsuarios - $nivel) >= 10){
                    $mostradoAnterior = $mostrado - 10;
                    $aux = $nivel + 10;
                }else{
                    $mostradoAnterior = $mostrado - $mostrado % 10 + 1;
                    $aux = $numUsuarios;
                }
                $cadena = $cadena . '<p id="dataTable_info" class="dataTables_info" role="status" aria-live="polite">Mostrando usuarios del '.$nivel.' al '.$aux.' de '.$numUsuarios.'</p>';	
                break;
            case 'anterior':
                $mostradoAnterior = $mostrado - 10;
                $aux = $nivel - 10;
                $cadena = $cadena . '<p id="dataTable_info" class="dataTables_info" role="status" aria-live="polite">Mostrando usuarios del '.$aux.' al '.($nivel - 1).' de '.$numUsuarios.'</p>';	
                break;
        }
    }

    $cadena = $cadena . '</div>
                             <div class="col-md-6">
                                <nav class="d-lg-flex justify-content-lg-end dataTables_paginate paging_simple_numbers">
                                     <ul class="pagination">
                                         <li class="page-item disabled" id="disabled"><button class="page-link" aria-label="Previous" id="anterior" onclick ="anterioresUsuarios('.$mostradoAnterior.')"><span aria-hidden="true">Anterior</span></li>
                                         <li class="page-item" id="post"><button class="page-link" aria-label="Next" id="siguiente" onclick ="siguientesUsuarios('.$mostrado.', '.$numUsuarios.')"><span aria-hidden="true">Siguiente</span></li>
                                      </ul>
                                 </nav>
                              </div>
                        </div>&' . $numUsuarios;

    echo $cadena;
}

function existeUsuario($conexion){
    $nombre = $_REQUEST["nombre"];
    $resConsulta=$conexion->query("SELECT * FROM usuario WHERE usuario = '".$nombre."'");
    $totalFilas = mysqli_num_rows($resConsulta);
    if($totalFilas == 0){
        echo true;
    }else 
        echo false;

}
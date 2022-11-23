<?php
////////////////// CONEXION A LA BASE DE DATOS ////////////////////////////////////
include("conectar.php");

session_start();
session_destroy();

header("location:../../index.php");

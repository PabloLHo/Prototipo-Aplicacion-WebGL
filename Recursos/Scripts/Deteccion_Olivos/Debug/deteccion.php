<?php

$parcela = $_REQUEST['parcela'];
$valores = system("OliveTrees_Detection.exe " .$parcela);
echo $valores;

?>

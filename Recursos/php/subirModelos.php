<?php

if (isset($_GET["w1"])) {
    // asignar w1 y w2 a dos variables
    $phpVar1 = $_GET["w1"];

    $ortofoto = "../ortofotos/Marmolejo_O_" . $phpVar1 . ".png";
    $nube = "../Modelos/Marmolejo_" . $phpVar1 . ".txt";
    $mapaAltura = "../mapasAltura/Marmolejo_A_" . $phpVar1 . ".jpg";

    move_uploaded_file($_FILES['src-file1']['tmp_name'] ,    $nube);
    move_uploaded_file($_FILES['src-file2']['tmp_name'] ,    $ortofoto);
    move_uploaded_file($_FILES['src-file3']['tmp_name'] ,    $mapaAltura);
    header("location:../../Modelos.php");
}
?>
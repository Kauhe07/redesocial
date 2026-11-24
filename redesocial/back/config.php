
<?php

$host = "localhost";
$banco = "redsocial";
$usuario = "root";
$senha = "";

try {

    $con = new PDO(
        "mysql:host=$host;dbname=$banco;charset=utf8mb4",
        $usuario,
        $senha
    );

    $con->setAttribute(
        PDO::ATTR_ERRMODE,
        PDO::ERRMODE_EXCEPTION
    );

} catch (PDOException $e) {

    echo json_encode([
        "erro" => "Erro na conexão com o banco de dados"
    ]);

    exit;
}

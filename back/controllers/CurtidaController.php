
<?php

require_once __DIR__ . "/../models/CurtidaModel.php";

// CADASTRAR CURTIDA
function createCurtida($con) {
    $dados = json_decode(file_get_contents("php://input"), true);

    $id = inserirCurtida($con, $dados);

    echo json_encode([
        "mensagem" => "Curtida realizada!",
        "id" => $id
    ]);
}

// LISTAR CURTIDAS
function readCurtidas($con) {
    $dados = listarCurtidas($con);

    echo json_encode($dados);
}

// EXCLUIR CURTIDA
function deleteCurtida($con) {
    $id = $_GET["id"];

    removerCurtida($con, $id);

    echo json_encode([
        "mensagem" => "Curtida removida!"
    ]);
}

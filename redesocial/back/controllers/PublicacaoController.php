
<?php

require_once __DIR__ . "/../models/PublicacaoModel.php";

// CADASTRAR
function createPublicacao($con) {
    $dados = json_decode(file_get_contents("php://input"), true);

    $id = inserirPublicacao($con, $dados);

    echo json_encode([
        "mensagem" => "Publicação cadastrada!",
        "id" => $id
    ]);
}

// LISTAR
function readPublicacoes($con) {
    $dados = listarPublicacoes($con);

    echo json_encode($dados);
}

// ATUALIZAR
function updatePublicacao($con) {
    $id = $_GET["id"];
    $dados = json_decode(file_get_contents("php://input"), true);

    atualizarPublicacao($con, $id, $dados);

    echo json_encode([
        "mensagem" => "Publicação atualizada!"
    ]);
}

// EXCLUIR
function deletePublicacao($con) {
    $id = $_GET["id"];

    removerPublicacao($con, $id);

    echo json_encode([
        "mensagem" => "Publicação excluída!"
    ]);
}

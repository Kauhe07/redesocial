<?php

$rota = $_GET["rota"] ?? "";
$metodo = $_SERVER["REQUEST_METHOD"];

if ($rota === "usuario"){
    switch($metodo){
        case "POST":
            createUsuario($con);
            break;
        case "GET":
            readUsuario($con);
            break;
        case "PUT":
            updateUsuario($con);
            break;
        case "DELETE":
            deleteUsuario($con);
            break;
        default:
            teste();        
    }
}


<?php

require_once __DIR__ . "/../controllers/UsuarioController.php";
require_once __DIR__ . "/../controllers/PublicacaoController.php";
require_once __DIR__ . "/../controllers/CurtidaController.php";

$rota = $_GET["rota"] ?? "";
$metodo = $_SERVER["REQUEST_METHOD"];

switch ($rota) {

    // ROTAS DE USUÁRIO
    case "usuario":
        switch ($metodo) {
            case "POST":
                createUsuario($con);
                break;

            case "GET":
                readUsuario($con);
                break;

            case "PUT":
                updateUsuario($con);
                break;

            case "DELETE":
                deleteUsuario($con);
                break;
        }
        break;

    // ROTAS DE PUBLICAÇÃO
    case "publicacao":
        switch ($metodo) {
            case "POST":
                createPublicacao($con);
                break;

            case "GET":
                readPublicacoes($con);
                break;

            case "PUT":
                updatePublicacao($con);
                break;

            case "DELETE":
                deletePublicacao($con);
                break;
        }
        break;

    // ROTAS DE CURTIDA
    case "curtida":
        switch ($metodo) {
            case "POST":
                createCurtida($con);
                break;

            case "GET":
                readCurtidas($con);
                break;

            case "DELETE":
                deleteCurtida($con);
                break;
        }
        break;

    default:
        echo json_encode([
            "mensagem" => "Rota não encontrada!"
        ]);
}

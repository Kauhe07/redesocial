
<?php

// CADASTRAR CURTIDA
function inserirCurtida($con, $dados) {
    $stmt = $con->prepare(
        "INSERT INTO curtida (id_usuario, id_publicacao)
         VALUES (?, ?)"
    );

    $stmt->execute([
        $dados["id_usuario"],
        $dados["id_publicacao"]
    ]);

    return $con->lastInsertId();
}

// LISTAR CURTIDAS
function listarCurtidas($con) {
    $stmt = $con->query(
        "SELECT * FROM curtida"
    );

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// EXCLUIR CURTIDA
function removerCurtida($con, $id) {
    $stmt = $con->prepare(
        "DELETE FROM curtida
         WHERE id_curtida = ?"
    );

    $stmt->execute([$id]);
}

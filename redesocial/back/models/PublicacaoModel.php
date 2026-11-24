
<?php

// CADASTRAR PUBLICAÇÃO
function inserirPublicacao($con, $dados) {
    $stmt = $con->prepare(
        "INSERT INTO publicacao (id_usuario, conteudo)
         VALUES (?, ?)"
    );

    $stmt->execute([
        $dados["id_usuario"],
        $dados["conteudo"]
    ]);

    return $con->lastInsertId();
}

// LISTAR PUBLICAÇÕES
function listarPublicacoes($con) {
    $stmt = $con->query(
        "SELECT * FROM publicacao"
    );

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// ATUALIZAR PUBLICAÇÃO
function atualizarPublicacao($con, $id, $dados) {
    $stmt = $con->prepare(
        "UPDATE publicacao
         SET conteudo = ?
         WHERE id_publicacao = ?"
    );

    $stmt->execute([
        $dados["conteudo"],
        $id
    ]);
}

// EXCLUIR PUBLICAÇÃO
function removerPublicacao($con, $id) {
    $stmt = $con->prepare(
        "DELETE FROM publicacao
         WHERE id_publicacao = ?"
    );

    $stmt->execute([$id]);
}

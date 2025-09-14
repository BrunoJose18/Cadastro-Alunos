<?php
error_reporting(0);
ini_set('display_errors', 0);

header('Content-Type: application/json');
require_once 'conexao.php';

$action = 'listar';
if (isset($_POST['action'])) {
    $action = $_POST['action'];
} elseif (isset($_GET['action'])) {
    $action = $_GET['action'];
}


try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'cadastrar') {
        $nome = $_POST['nome'] ?? '';
        $cpf = $_POST['cpf'] ?? '';
        $foto = $_FILES['foto-estudante'] ?? null;

        if (empty($nome) || empty($cpf) || $foto === null || $foto['error'] !== UPLOAD_ERR_OK) {
            http_response_code(400);
            echo json_encode(['sucesso' => false, 'mensagem' => 'Todos os campos, incluindo a foto, são obrigatórios.']);
            exit;
        }

        $upload_dir = 'uploads/';
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0755, true);
        }
        $extensao = pathinfo($foto['name'], PATHINFO_EXTENSION);
        $nome_arquivo = uniqid() . '.' . $extensao;
        $caminho_completo = $upload_dir . $nome_arquivo;

        if (!move_uploaded_file($foto['tmp_name'], $caminho_completo)) {
            http_response_code(500);
            echo json_encode(['sucesso' => false, 'mensagem' => 'Erro ao salvar a imagem.']);
            exit;
        }
        
        try {
            $query = 'INSERT INTO estudante (nome, cpf, foto_perfil) VALUES (?, ?, ?)';
            $stmt = $dbconn->prepare($query);
            $stmt->execute([$nome, $cpf, $caminho_completo]);

        } catch (PDOException $e) {
            if ($e->getCode() == '23505') {
                http_response_code(409); // 409 Conflict é um bom código para isso
                echo json_encode(['sucesso' => false, 'mensagem' => 'Este CPF já está cadastrado.']);
            } else {
                http_response_code(500);
                echo json_encode(['sucesso' => false, 'mensagem' => 'Erro ao cadastrar estudante no banco de dados.']);
            }
            if (file_exists($caminho_completo)) {
                unlink($caminho_completo);
            }
            exit;
        }
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'deletar') {
        $id = $_POST['id'] ?? 0;

        if (empty($id)) {
            http_response_code(400);
            echo json_encode(['sucesso' => false, 'mensagem' => 'ID do estudante não fornecido.']);
            exit;
        }

        $query = 'UPDATE estudante SET deletado = TRUE WHERE id = ?';
        $stmt = $dbconn->prepare($query);

        if ($stmt->execute([$id])) {
            echo json_encode(['sucesso' => true, 'mensagem' => 'Estudante deletado com sucesso.']);
        } else {
            http_response_code(500);
            echo json_encode(['sucesso' => false, 'mensagem' => 'Erro ao deletar estudante.']);
        }
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'editar') {
        $id = $_POST['id'] ?? 0;
        $nome = $_POST['nome'] ?? '';
        $cpf = $_POST['cpf'] ?? '';
        $nova_foto = $_FILES['foto-estudante-edit'] ?? null;

        if (empty($id) || empty($nome) || empty($cpf)) {
            http_response_code(400);
            echo json_encode(['sucesso' => false, 'mensagem' => 'ID, nome e CPF são obrigatórios.']);
            exit;
        }
    
        $stmt_busca_foto = $dbconn->prepare('SELECT foto_perfil FROM estudante WHERE id = ?');
        $stmt_busca_foto->execute([$id]);
        $caminho_foto_antiga = $stmt_busca_foto->fetchColumn();
    
        $parametros = [$nome, $cpf];
        $query_update = 'UPDATE estudante SET nome = ?, cpf = ?';
        $caminho_foto_atual = $caminho_foto_antiga;
    
        if ($nova_foto && $nova_foto['error'] === UPLOAD_ERR_OK) {
            $upload_dir = 'uploads/';
            $extensao = pathinfo($nova_foto['name'], PATHINFO_EXTENSION);
            $nome_arquivo = uniqid() . '.' . $extensao;
            $caminho_completo = $upload_dir . $nome_arquivo;
    
            if (move_uploaded_file($nova_foto['tmp_name'], $caminho_completo)) {
                if ($caminho_foto_antiga && file_exists($caminho_foto_antiga)) {
                    unlink($caminho_foto_antiga);
                }
                $query_update .= ', foto_perfil = ?';
                $parametros[] = $caminho_completo;
                $caminho_foto_atual = $caminho_completo;
            }
        }
    
        $query_update .= ' WHERE id = ?';
        $parametros[] = $id;
    
        try {
            $stmt = $dbconn->prepare($query_update);
            $stmt->execute($parametros);

            $estudante_atualizado = [
                'id' => $id, 'nome' => $nome, 'cpf' => $cpf, 'foto_perfil' => $caminho_foto_atual
            ];
            echo json_encode(['sucesso' => true, 'mensagem' => 'Estudante atualizado com sucesso.', 'dados' => $estudante_atualizado]);

        } catch (PDOException $e) {
            if ($e->getCode() == '23505') {
                http_response_code(409);
                echo json_encode(['sucesso' => false, 'mensagem' => 'Este CPF já pertence a outro estudante.']);
            } else {
                http_response_code(500);
                echo json_encode(['sucesso' => false, 'mensagem' => 'Erro ao atualizar estudante no banco.']);
            }
        }
        exit;
    }

    $query_select = 'SELECT id, nome, cpf, foto_perfil FROM estudante WHERE deletado = FALSE ORDER BY id DESC';
    $stmt_select = $dbconn->query($query_select);
    $estudantes = $stmt_select->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['sucesso' => true, 'dados' => $estudantes ?: []]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['sucesso' => false, 'mensagem' => 'Erro fatal no servidor de banco de dados.', 'detalhe' => $e->getMessage()]);
} finally {
    $dbconn = null;
}
?>
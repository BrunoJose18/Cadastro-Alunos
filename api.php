<?php
header('Content-Type: application/json');
require_once 'conexao.php'; // Usa PDO

// --- ROTEAMENTO DE AÇÕES ---
// Verificamos qual ação o frontend quer executar.
// Se nenhuma ação for especificada, o padrão é 'listar'.
$action = $_POST['action'] ?? $_GET['action'] ?? 'listar';

try {
    // --- AÇÃO: CADASTRAR UM NOVO ESTUDANTE ---
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

        $query = 'INSERT INTO estudante (nome, cpf, foto_perfil) VALUES (?, ?, ?)';
        $stmt = $dbconn->prepare($query);

        if (!$stmt->execute([$nome, $cpf, $caminho_completo])) {
            http_response_code(500);
            echo json_encode(['sucesso' => false, 'mensagem' => 'Erro ao cadastrar estudante.']);
            exit;
        }
        // Após o cadastro, o script continuará para a parte de listagem para retornar a lista atualizada.
    }

    // --- AÇÃO: "DELETAR" (ATUALIZAR) UM ESTUDANTE ---
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'deletar') {
        $id = $_POST['id'] ?? 0;

        if (empty($id)) {
            http_response_code(400);
            echo json_encode(['sucesso' => false, 'mensagem' => 'ID do estudante não fornecido.']);
            exit;
        }

        // Query para marcar como deletado de forma segura
        $query = 'UPDATE estudante SET deletado = TRUE WHERE id = ?';
        $stmt = $dbconn->prepare($query);

        if ($stmt->execute([$id])) {
            echo json_encode(['sucesso' => true, 'mensagem' => 'Estudante deletado com sucesso.']);
        } else {
            http_response_code(500);
            echo json_encode(['sucesso' => false, 'mensagem' => 'Erro ao deletar estudante.']);
        }
        exit; // Termina o script aqui, pois não precisamos retornar a lista inteira.
    }

    // --- AÇÃO PADRÃO: LISTAR OS ESTUDANTES NÃO DELETADOS ---
    // IMPORTANTE: Adicionamos "WHERE deletado = FALSE" para não mostrar os deletados
    $query_select = 'SELECT id, nome, cpf, foto_perfil FROM estudante WHERE deletado = FALSE ORDER BY id DESC';
    $stmt_select = $dbconn->query($query_select);

    $estudantes = $stmt_select->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['sucesso' => true, 'dados' => $estudantes ?: []]);

} catch (PDOException $e) {
    http_response_code(500);
    // Em produção, logar o erro em vez de exibi-lo
    // error_log("Erro no banco de dados: " . $e->getMessage());
    echo json_encode(['sucesso' => false, 'mensagem' => 'Erro no servidor de banco de dados.', 'detalhe' => $e->getMessage()]);
} finally {
    // Fecha a conexão
    $dbconn = null;
}
?>
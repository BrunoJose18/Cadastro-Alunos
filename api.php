<?php

// Estas linhas são para ambientes de desenvolvimento, ocultando erros e avisos do PHP
// para garantir que a saída seja SEMPRE um JSON válido, sem "lixo" de HTML de erro.
error_reporting(0);
ini_set('display_errors', 0);

header('Content-Type: application/json');
require_once 'conexao.php';

// ROUTES

// Define 'listar' como a ação padrão para segurança e previsibilidade.
$action = 'listar';
if (isset($_POST['action'])) {
    $action = $_POST['action'];
} elseif (isset($_GET['action'])) {
    $action = $_GET['action'];
}

// BLOCO PRINCIPAL DE EXECUÇÃO
try {
    // AÇÃO: CADASTRAR
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'cadastrar') {
        // Pega os dados enviados pelo formulário. O '??' é um atalho para evitar erros se a variável não existir.
        $nome = $_POST['nome'] ?? '';
        $cpf = $_POST['cpf'] ?? '';
        $foto = $_FILES['foto-estudante'] ?? null; // Informações do arquivo de imagem enviado.

        // Validação: Verifica se todos os dados necessários foram recebidos e se o upload da foto ocorreu bem.
        if (empty($nome) || empty($cpf) || $foto === null || $foto['error'] !== UPLOAD_ERR_OK) {
            http_response_code(400); // Bad Request
            echo json_encode(['sucesso' => false, 'mensagem' => 'Todos os campos, incluindo a foto, são obrigatórios.']);
            exit;
        }

        // LÓGICA DE UPLOAD DA IMAGEM 
        $upload_dir = 'uploads/'; // Nome da pasta para salvar as imagens.
        if (!is_dir($upload_dir)) {
            // Cria a pasta 'uploads' se ela não existir.
            mkdir($upload_dir, 0755, true);
        }
        $extensao = pathinfo($foto['name'], PATHINFO_EXTENSION); // Pega a extensão do arquivo (jpg, png, etc).
        $nome_arquivo = uniqid() . '.' . $extensao; // Cria um nome de arquivo ÚNICO para evitar sobreposições.
        $caminho_completo = $upload_dir . $nome_arquivo; // Monta o caminho final (ex: 'uploads/5f8a1b2c3d4e5.jpg').

        // Move o arquivo temporário enviado pelo PHP para a nossa pasta definitiva.
        if (!move_uploaded_file($foto['tmp_name'], $caminho_completo)) {
            http_response_code(500);
            echo json_encode(['sucesso' => false, 'mensagem' => 'Erro ao salvar a imagem.']);
            exit;
        }
        
        // LÓGICA DE INSERÇÃO
        try {
            // Prepara a query SQL com placeholders (?) para segurança (evita SQL Injection).
            $query = 'INSERT INTO estudante (nome, cpf, foto_perfil) VALUES (?, ?, ?)';
            $stmt = $dbconn->prepare($query);
            // Executa a query, substituindo os '?' pelos valores das variáveis de forma segura.
            $stmt->execute([$nome, $cpf, $caminho_completo]);

        } catch (PDOException $e) {
            // O código '23505' é o padrão do PostgreSQL para violação de chave única (ex: CPF duplicado).
            if ($e->getCode() == '23505') {
                http_response_code(409); // 409 Conflict: o recurso já existe.
                echo json_encode(['sucesso' => false, 'mensagem' => 'Este CPF já está cadastrado.']);
            } else {
                http_response_code(500);
                echo json_encode(['sucesso' => false, 'mensagem' => 'Erro ao cadastrar estudante no banco de dados.']);
            }
            // Se deu erro no banco, apaga a foto que acabamos de salvar.
            if (file_exists($caminho_completo)) {
                unlink($caminho_completo);
            }
            exit;
        }
    }

    // AÇÃO: DELETAR
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'deletar') {
        $id = $_POST['id'] ?? 0;

        if (empty($id)) {
            http_response_code(400);
            echo json_encode(['sucesso' => false, 'mensagem' => 'ID do estudante não fornecido.']);
            exit;
        }

        // Lógica do soft delete.
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

    // AÇÃO: EDITAR
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
    
        // Busca o caminho da foto antiga no banco para podermos apagá-la se uma nova for enviada.
        $stmt_busca_foto = $dbconn->prepare('SELECT foto_perfil FROM estudante WHERE id = ?');
        $stmt_busca_foto->execute([$id]);
        $caminho_foto_antiga = $stmt_busca_foto->fetchColumn();
    
        // LÓGICA DE CONSTRUÇÃO DINÂMICA DA QUERY DE UPDATE
        $parametros = [$nome, $cpf]; // Array para guardar os valores que irão para a query.
        $query_update = 'UPDATE estudante SET nome = ?, cpf = ?'; // Query base.
        $caminho_foto_atual = $caminho_foto_antiga; // Assume que a foto não vai mudar.
    
        // Se uma nova foto foi enviada E o upload não teve erros
        if ($nova_foto && $nova_foto['error'] === UPLOAD_ERR_OK) {
            $upload_dir = 'uploads/';
            $extensao = pathinfo($nova_foto['name'], PATHINFO_EXTENSION);
            $nome_arquivo = uniqid() . '.' . $extensao;
            $caminho_completo = $upload_dir . $nome_arquivo;
    
            if (move_uploaded_file($nova_foto['tmp_name'], $caminho_completo)) {
                // Se o upload da nova foto deu certo, apaga a foto antiga do servidor.
                if ($caminho_foto_antiga && file_exists($caminho_foto_antiga)) {
                    unlink($caminho_foto_antiga);
                }
                // Adiciona a atualização da foto na query e no array de parâmetros.
                $query_update .= ', foto_perfil = ?';
                $parametros[] = $caminho_completo;
                $caminho_foto_atual = $caminho_completo; // Atualiza o caminho da foto para o retorno.
            }
        }
    
        $query_update .= ' WHERE id = ?'; // Adiciona a condição WHERE, essencial para não atualizar todos os registros.
        $parametros[] = $id; // Adiciona o ID ao final do array de parâmetros.
    
        try {
            $stmt = $dbconn->prepare($query_update);
            $stmt->execute($parametros);

            // Prepara uma resposta com os dados atualizados para o frontend atualizar a tela.
            $estudante_atualizado = [
                'id' => $id, 'nome' => $nome, 'cpf' => $cpf, 'foto_perfil' => $caminho_foto_atual
            ];
            echo json_encode(['sucesso' => true, 'mensagem' => 'Estudante atualizado com sucesso.', 'dados' => $estudante_atualizado]);

        } catch (PDOException $e) {
            // Trata o erro de CPF duplicado também na edição.
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

    // AÇÃO PADRÃO: LISTAR 
    // Se nenhuma das ações acima foi executada, esta será a ação padrão.
    $query_select = 'SELECT id, nome, cpf, foto_perfil FROM estudante WHERE deletado = FALSE ORDER BY id DESC';
    $stmt_select = $dbconn->query($query_select);
    // Pega todos os resultados e os coloca em um array associativo (chave => valor).
    $estudantes = $stmt_select->fetchAll(PDO::FETCH_ASSOC);

    // Envia a resposta de sucesso com os dados dos estudantes para o frontend.
    // O '?: []' garante que, se não houver estudantes, um array vazio seja enviado, em vez de nulo.
    echo json_encode(['sucesso' => true, 'dados' => $estudantes ?: []]);

} catch (PDOException $e) {
    // Bloco 'catch' geral: captura qualquer outro erro de PDO que não tenha sido tratado internamente.
    http_response_code(500);
    echo json_encode(['sucesso' => false, 'mensagem' => 'Erro fatal no servidor de banco de dados.', 'detalhe' => $e->getMessage()]);
} finally {
    // Fechando a conexão com o banco de dados.
    $dbconn = null;
}
?>
<?php
$user = 'postgres.eeznlkithhbjgllecgdx'; // Usuário do banco de dados
$password = '9018dataconectlogo'; // Senha do banco de dados
$host = 'aws-1-sa-east-1.pooler.supabase.com'; // Endereço do servidor do banco (host)
$port = '6543'; // Porta de comunicação com o banco
$dbname = 'postgres'; // Nome do banco de dados ao qual queremos nos conectar

// (DATA SOURCE NAME)
$dsn = "pgsql:host={$host};port={$port};dbname={$dbname};sslmode=require";

// TENTATIVA DE CONEXÃO
try {
    
    // Cria uma nova instância do objeto PDO (PHP Data Objects).
    // Esta linha é a que efetivamente tenta realizar a conexão.
    // Se for bem-sucedida, a variável $dbconn conterá o objeto da conexão.
    $dbconn = new PDO($dsn, $user, $password, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

} catch (PDOException $e) {
    // Define o cabeçalho da resposta para indicar que o conteúdo é do tipo JSON.
    header('Content-Type: application/json');
    // Define o código de status HTTP como 500 (Erro Interno do Servidor).
    http_response_code(500);

    // Cria um array com a mensagem de erro e o converte para o formato JSON.
    echo json_encode(['sucesso' => false, 'mensagem' => 'Erro de conexão com o banco de dados via PDO.']);
    
    exit;
}
?>
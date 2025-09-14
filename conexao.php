<?php
// ARQUIVO DE CONEXÃO COM O BANCO DE DADOS POSTGRESQL USANDO PDO

// --- PARÂMETROS DE CONEXÃO ---
$user = 'postgres.eeznlkithhbjgllecgdx'; // Usuário do banco de dados
$password = '9018dataconectlogo'; // Senha do banco de dados
$host = 'aws-1-sa-east-1.pooler.supabase.com'; // Endereço do servidor do banco (host)
$port = '6543'; // Porta de comunicação com o banco
$dbname = 'postgres'; // Nome do banco de dados ao qual queremos nos conectar

// --- DSN (DATA SOURCE NAME) ---
// O DSN é uma string formatada que o PDO usa para saber como se conectar.
$dsn = "pgsql:host={$host};port={$port};dbname={$dbname};sslmode=require";
// pgsql:       -> Informa que estamos conectando a um banco PostgreSQL.
// host=...     -> Define o endereço do servidor.
// port=...     -> Define a porta.
// dbname=...   -> Define o nome do banco.
// sslmode=require -> Uma configuração de segurança que exige que a conexão seja criptografada (SSL).
//                    É muito comum e necessário para bancos de dados na nuvem (AWS, Supabase, etc.).

// --- TENTATIVA DE CONEXÃO ---
try {
    
    // Cria uma nova instância do objeto PDO (PHP Data Objects).
    // Esta linha é a que efetivamente tenta realizar a conexão.
    // Se for bem-sucedida, a variável $dbconn conterá o objeto da conexão.
    $dbconn = new PDO($dsn, $user, $password, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    // Parâmetros:
    // 1. $dsn: A string de conexão que montamos acima.
    // 2. $user: O nome de usuário.
    // 3. $password: A senha.
    // 4. [array de opções]:
    //    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION: Esta é uma configuração MUITO importante.
    //    Ela diz ao PDO: "Se qualquer erro de banco de dados ocorrer, lance uma Exceção".
    //    Isso permite que nosso bloco 'catch' capture o erro de forma limpa.

} catch (PDOException $e) {
    // Define o cabeçalho da resposta para indicar que o conteúdo é do tipo JSON.
    header('Content-Type: application/json');
    // Define o código de status HTTP como 500 (Erro Interno do Servidor).
    http_response_code(500);

    // Cria um array com a mensagem de erro e o converte para o formato JSON.
    echo json_encode(['sucesso' => false, 'mensagem' => 'Erro de conexão com o banco de dados via PDO.']);
    
    // Interrompe a execução do script.
    exit;
}
?>
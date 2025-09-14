<?php
// TENTATIVA 1: MUDANDO A SINTAXE DA DSN

$user='postgres.eeznlkithhbjgllecgdx';
$password='9018dataconectlogo';
$host='aws-1-sa-east-1.pooler.supabase.com';
$port='6543';
$dbname='postgres';

// O "DSN" (Data Source Name) tem um formato um pouco diferente
$dsn = "pgsql:host={$host};port={$port};dbname={$dbname};sslmode=require";

try {
    // Tenta criar uma nova instância de PDO para a conexão
    // A variável $dbconn agora será um objeto PDO
    $dbconn = new PDO($dsn, $user, $password, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

    // Se chegou até aqui, a conexão foi um sucesso!

} catch (PDOException $e) {
    // Se a conexão falhar, o PDO lança uma exceção que podemos capturar
    header('Content-Type: application/json');
    http_response_code(500);

    // Para depuração, é muito útil registrar o erro real em um log
    // error_log("Erro de conexão PDO: " . $e->getMessage());

    echo json_encode(['sucesso' => false, 'mensagem' => 'Erro de conexão com o banco de dados via PDO.']);
    exit;
}
?>
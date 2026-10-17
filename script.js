<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Loja Farmasi</title>
  <link rel="stylesheet" href="estilo.css">
</head>
<body>

  <header class="header">
    <h1>🛍️ Loja Farmasi</h1>
  </header>

  <!-- Menu de Abas -->
  <nav class="nav-bar">
    <button id="btn-catalogo" class="nav-btn active" onclick="mudarAba('catalogo')">🛒 Catálogo</button>
    <button id="btn-clientes" class="nav-btn" onclick="mudarAba('clientes')">👥 Clientes</button>
    <button id="btn-admin" class="nav-btn" onclick="mudarAba('admin')">⚙️ Admin</button>
  </nav>

  <!-- ABA 1: CATÁLOGO -->
  <div id="aba-catalogo" class="pagina-tab ativa">
    <div class="panel">
      <h2>Catálogo de Produtos</h2>
      <p>O catálogo aparecerá aqui em breve.</p>
    </div>
  </div>

  <!-- ABA 2: CLIENTES -->
  <div id="aba-clientes" class="pagina-tab">
    <div class="panel">
      <h2>Painel de Clientes</h2>
      <p>O cadastro de clientes aparecerá aqui.</p>
    </div>
  </div>

  <!-- ABA 3: ADMIN -->
  <div id="aba-admin" class="pagina-tab">
    <div class="panel">
      <h2>Painel Administrativo</h2>
      <p>As configurações de produtos aparecerão aqui.</p>
    </div>
  </div>

  <script src="script.js"></script>
</body>
</html>

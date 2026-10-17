function mudarAba(aba) {
  // Esconde todas as abas
  document.querySelectorAll('.pagina-tab').forEach(el => {
    el.classList.remove('ativa');
  });

  // Remove o destaque de todos os botões
  document.querySelectorAll('.nav-btn').forEach(el => {
    el.classList.remove('active');
  });

  // Ativa a aba e o botão correspondente
  const abaAlvo = document.getElementById(`aba-${aba}`);
  const botaoAlvo = document.getElementById(`btn-${aba}`);

  if (abaAlvo) abaAlvo.classList.add('ativa');
  if (botaoAlvo) botaoAlvo.classList.add('active');
}

// Inicializa na aba catálogo
mudarAba('catalogo');

// Estado inicial com dados salvos no navegador (LocalStorage)
let categorias = JSON.parse(localStorage.getItem('farmasi_cats')) || ['Maquiagem', 'Cuidados com a Pele', 'Perfume'];
let produtos = JSON.parse(localStorage.getItem('farmasi_prods')) || [
  { nome: 'Base VFX Pro', categoria: 'Maquiagem', preco: 120.00 },
  { nome: 'Batom Líquido Matte', categoria: 'Maquiagem', preco: 65.00 },
  { nome: 'Sérum Facial Dr. C. Tuna', categoria: 'Cuidados com a Pele', preco: 145.00 },
  { nome: 'Perfume Feminino Sensual', categoria: 'Perfume', preco: 180.00 }
];
let clientes = JSON.parse(localStorage.getItem('farmasi_cli')) || [];

let categoriaAtiva = 'Todos';

// Alternar Abas do Menu
function mudarAba(aba) {
  document.querySelectorAll('.container').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));

  if (aba === 'catalogo') {
    document.getElementById('aba-catalogo').classList.remove('hidden');
    event.currentTarget.classList.add('active');
    renderizarCatalogo();
  } else if (aba === 'clientes') {
    document.getElementById('aba-clientes').classList.remove('hidden');
    event.currentTarget.classList.add('active');
    renderizarClientes();
  } else if (aba === 'admin') {
    document.getElementById('aba-admin').classList.remove('hidden');
    event.currentTarget.classList.add('active');
    atualizarSelectCategorias();
  }
}

// --- CATÁLOGO & CATEGORIAS ---
function renderizarCatalogo() {
  const containerCat = document.getElementById('lista-categorias');
  let htmlCat = `<div class="cat-chip ${categoriaAtiva === 'Todos' ? 'selected' : ''}" onclick="filtrarCategoria('Todos')">Todos</div>`;
  
  categorias.forEach(cat => {
    htmlCat += `<div class="cat-chip ${categoriaAtiva === cat ? 'selected' : ''}" onclick="filtrarCategoria('${cat}')">${cat}</div>`;
  });
  containerCat.innerHTML = htmlCat;

  const containerProd = document.getElementById('produtos');
  document.getElementById('titulo-categoria').innerText = categoriaAtiva === 'Todos' ? 'Todos os Produtos' : categoriaAtiva;
  
  let produtosFiltrados = categoriaAtiva === 'Todos' ? produtos : produtos.filter(p => p.categoria === categoriaAtiva);

  if (produtosFiltrados.length === 0) {
    containerProd.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color:#777;">Nenhum produto nesta categoria.</p>';
    return;
  }

  let htmlProd = '';
  produtosFiltrados.forEach((p, index) => {
    htmlProd += `
      <div class="card-produto">
        <div>
          <span class="categoria-tag">${p.categoria}</span>
          <h3>${p.nome}</h3>
          <div class="preco">R$ ${Number(p.preco).toFixed(2)}</div>
        </div>
        <button class="btn-comprar" onclick="comprarProduto('${p.nome}', ${p.preco})">💬 Pedir</button>
      </div>
    `;
  });
  containerProd.innerHTML = htmlProd;
}

function filtrarCategoria(cat) {
  categoriaAtiva = cat;
  renderizarCatalogo();
}

function adicionarCategoria() {
  const nomeCat = document.getElementById('nova-cat-nome').value.trim();
  if (!nomeCat) return alert('Digite o nome da categoria!');
  if (categorias.includes(nomeCat)) return alert('Essa categoria já existe!');

  categorias.push(nomeCat);
  localStorage.setItem('farmasi_cats', JSON.stringify(categorias));
  document.getElementById('nova-cat-nome').value = '';
  alert('Categoria adicionada com sucesso!');
  atualizarSelectCategorias();
}

function atualizarSelectCategorias() {
  const select = document.getElementById('prod-cat');
  let html = '';
  categorias.forEach(cat => {
    html += `<option value="${cat}">${cat}</option>`;
  });
  select.innerHTML = html;
}

function adicionarProduto() {
  const nome = document.getElementById('prod-nome').value.trim();
  const categoria = document.getElementById('prod-cat').value;
  const preco = parseFloat(document.getElementById('prod-preco').value);

  if (!nome || isNaN(preco)) return alert('Preencha todos os campos do produto corretamente!');

  produtos.push({ nome, categoria, preco });
  localStorage.setItem('farmasi_prods', JSON.stringify(produtos));
  document.getElementById('prod-nome').value = '';
  document.getElementById('prod-preco').value = '';
  alert('Produto adicionado ao catálogo!');
  mudarAba('catalogo');
}

function comprarProduto(nome, preco) {
  let mensagem = `Olá! Gostaria de encomendar o produto: *${nome}* por R$ ${preco.toFixed(2)}.`;
  window.open(`https://wa.me/?text=${encodeURIComponent(mensagem)}`, '_blank');
}

// --- CLIENTES & HISTÓRICO VITALÍCIO & PARCELAMENTO ---
function salvarCliente() {
  const nome = document.getElementById('cli-nome').value.trim();
  const telefone = document.getElementById('cli-tel').value.trim();
  const endereco = document.getElementById('cli-end').value.trim();

  if (!nome || !telefone) return alert('Nome e Telefone são obrigatórios!');

  clientes.push({
    id: Date.now(),
    nome,
    telefone,
    endereco,
    historicoCompras: []
  });

  localStorage.setItem('farmasi_cli', JSON.stringify(clientes));
  document.getElementById('cli-nome').value = '';
  document.getElementById('cli-tel').value = '';
  document.getElementById('cli-end').value = '';
  alert('Cliente cadastrado com sucesso!');
  renderizarClientes();
}

function renderizarClientes() {
  const container = document.getElementById('lista-clientes-container');
  if (clientes.length === 0) {
    container.innerHTML = '<p style="color:#777; text-align:center;">Nenhum cliente cadastrado ainda.</p>';
    return;
  }

  let html = '';
  clientes.forEach(cli => {
    let totalGasto = cli.historicoCompras.reduce((acc, c) => acc + c.total, 0);
    
    html += `
      <div class="list-item" style="flex-direction: column; align-items: flex-start; gap: 8px;">
        <div style="width: 100%; display: flex; justify-content: space-between;">
          <strong>${cli.nome}</strong>
          <span style="font-size: 0.85rem; color: #555;">📞 ${cli.telefone}</span>
        </div>
        <div style="font-size: 0.85rem; color: #666;">📍 ${cli.endereco || 'Endereço não informado'}</div>
        <div style="font-size: 0.85rem; font-weight: bold; color: var(--primary);">Total Vitalício Gasto: R$ ${totalGasto.toFixed(2)}</div>
        
        <div style="width: 100%; margin-top: 5px; border-top: 1px dashed var(--gray); pt: 5px;">
          <p style="font-size: 0.8rem; font-weight: bold; margin-top: 5px;">Histórico de Compras & Parcelamentos:</p>
    `;

    if (cli.historicoCompras.length === 0) {
      html += `<p style="font-size: 0.75rem; color: #888;">Nenhuma compra registrada.</p>`;
    } else {
      cli.historicoCompras.forEach(compra => {
        html += `
          <div style="background: white; padding: 6px; border-radius: 6px; margin-top: 4px; font-size: 0.75rem;">
            <div>📦 <b>${compra.descricao}</b> - R$ ${compra.total.toFixed(2)} (${compra.tipo})</div>
            ${compra.tipo === 'A Prazo' ? `<div>💳 ${compra.parcelasPagas}/${compra.totalParcelas} pagas \vert{} Vencimento:${compra.vencimento}</div>` : ''}
          </div>
        `;
      });
    }

    html += `
        </div>
        <button class="btn-primary" style="font-size: 0.75rem; padding: 6px; margin-top: 8px;" onclick="adicionarCompra(${cli.id})">+ Registar Compra / Venda a Prazo</button>
      </div>
    `;
  });
  container.innerHTML = html;
}

function adicionarCompra(cliId) {
  const cli = clientes.find(c => c.id === cliId);
  if (!cli) return;

  const descricao = prompt('Descrição do produto ou pedido:');
  if (!descricao) return;
  const total = parseFloat(prompt('Valor total da compra (R$):'));
  if (isNaN(total)) return;

  const tipo = prompt('Tipo de pagamento: digite "À Vista" ou "A Prazo"');
  if (!tipo) return;

  let compra = { descricao, total, tipo: tipo.toLowerCase().includes('prazo') ? 'A Prazo' : 'À Vista', parcelasPagas: 0, totalParcelas: 1, vencimento: '-' };

  if (compra.tipo === 'A Prazo') {
    compra.totalParcelas = parseInt(prompt('Quantidade total de parcelas:')) || 1;
    compra.parcelasPagas = parseInt(prompt('Quantas parcelas já foram pagas?:')) || 0;
    compra.vencimento = prompt('Data de vencimento da próxima parcela (Ex: 10/05):') || 'Indefinido';
  }

  cli.historicoCompras.push(compra);
  localStorage.setItem('farmasi_cli', JSON.stringify(clientes));
  alert('Compra registada com sucesso!');
  renderizarClientes();
}

// Inicializar carregamento padrão
renderizarCatalogo();

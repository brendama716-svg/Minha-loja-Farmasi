// Estado inicial com localStorage
let categorias = JSON.parse(localStorage.getItem('farmasi_cats')) || ['Maquiagem', 'Cuidados com a Pele', 'Perfume'];
let produtos = JSON.parse(localStorage.getItem('farmasi_prods')) || [
  { id: 1, nome: 'Base VFX Pro', categoria: 'Maquiagem', desc: 'Cobertura perfeita e acabamento matte.', precoCompra: 70.00, precoVenda: 120.00, foto: 'https://images.unsplash.com/photo-1590156206604-9844c2759e51?w=300' },
  { id: 2, nome: 'Batom Líquido Matte', categoria: 'Maquiagem', desc: 'Longa duração sem ressecar os lábios.', precoCompra: 35.00, precoVenda: 65.00, foto: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300' },
  { id: 3, nome: 'Sérum Facial Dr. C. Tuna', categoria: 'Cuidados com a Pele', desc: 'Hidratação profunda e efeito rejuvenescedor.', precoCompra: 85.00, precoVenda: 145.00, foto: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300' },
  { id: 4, nome: 'Perfume Feminino Sensual', categoria: 'Perfume', desc: 'Fragrância marcante e sofisticada.', precoCompra: 100.00, precoVenda: 180.00, foto: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=300' }
];
let clientes = JSON.parse(localStorage.getItem('farmasi_cli')) || [];

let categoriaAtiva = 'Todos';

// Sistema de Abas Independentes
function mudarAba(aba) {
  document.querySelectorAll('.pagina-conteudo').forEach(el => el.classList.remove('ativa'));
  document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));

  if (aba === 'catalogo') {
    document.getElementById('aba-catalogo').classList.add('ativa');
    event.currentTarget.classList.add('active');
    renderizarCatalogo();
  } else if (aba === 'clientes') {
    document.getElementById('aba-clientes').classList.add('ativa');
    event.currentTarget.classList.add('active');
    renderizarClientes();
  } else if (aba === 'admin') {
    document.getElementById('aba-admin').classList.add('ativa');
    event.currentTarget.classList.add('active');
    atualizarSelectCategorias();
  }
}

// --- CATÁLOGO & EDIÇÃO DE PREÇOS (COM SÍMBOLO DE LÁPIS ✏️) ---
function renderizarCatalogo() {
  const containerCat = document.getElementById('lista-categorias');
  let htmlCat = `<div class="cat-chip ${categoriaAtiva === 'Todos' ? 'selected' : ''}" onclick="filtrarCategoria('Todos')">🌐 Todos</div>`;
  
  categorias.forEach(cat => {
    htmlCat += `<div class="cat-chip ${categoriaAtiva === cat ? 'selected' : ''}" onclick="filtrarCategoria('${cat}')">${cat}</div>`;
  });
  containerCat.innerHTML = htmlCat;

  const containerProd = document.getElementById('produtos');
  document.getElementById('titulo-categoria찧' in window ? '' : 'titulo-categoria').innerText = categoriaAtiva === 'Todos' ? 'Todos os Produtos' : categoriaAtiva;
  
  let produtosFiltrados = categoriaAtiva === 'Todos' ? produtos : produtos.filter(p => p.categoria === categoriaAtiva);

  if (produtosFiltrados.length === 0) {
    containerProd.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color:#777;">Nenhum produto nesta categoria.</p>';
    return;
  }

  let htmlProd = '';
  produtosFiltrados.forEach((p) => {
    let fotoUrl = p.foto || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=300';
    htmlProd += `
      <div class="card-produto">
        <img src="${fotoUrl}" alt="${p.nome}">
        <div class="card-body">
          <span class="categoria-tag">${p.categoria}</span>
          <h3>${p.nome}</h3>
          <p class="desc">${p.desc || 'Sem descrição.'}</p>
          
          <div class="preco-box">
            <span>Compra: R$ ${Number(p.precoCompra).toFixed(2)}</span>
            <button class="btn-editar-preco" onclick="editarPreco(${p.id}, 'compra')" title="Editar Valor de Compra">✏️</button>
          </div>
          <div class="preco-box">
            <span>Venda:</span>
            <span class="preco-valor">R$ ${Number(p.precoVenda).toFixed(2)}</span>
            <button class="btn-editar-preco" onclick="editarPreco(${p.id}, 'venda')" title="Editar Valor de Venda">✏️</button>
          </div>
        </div>
        <button class="btn-comprar" onclick="comprarProduto('${p.nome}', ${p.precoVenda})">💬 Pedir via WhatsApp</button>
      </div>
    `;
  });
  containerProd.innerHTML = htmlProd;
}

function filtrarCategoria(cat) {
  categoriaAtiva = cat;
  renderizarCatalogo();
}

// Função para editar valores com o ícone de lápis
function editarPreco(id, tipo) {
  const produto = produtos.find(p => p.id === id);
  if (!produto) return;

  const titulo = tipo === 'compra' ? 'Novo Valor de Compra (R$):' : 'Novo Valor de Venda (R$):';
  const valorAtual = tipo === 'compra' ? produto.precoCompra : produto.precoVenda;

  const novoValor = prompt(titulo, valorAtual);
  if (novoValor === null || novoValor.trim() === '') return;

  const num = parseFloat(novoValor);
  if (isNaN(num)) return alert('Valor inválido!');

  if (tipo === 'compra') {
    produto.precoCompra = num;
  } else {
    produto.precoVenda = num;
  }

  localStorage.setItem('farmasi_prods', JSON.stringify(produtos));
  renderizarCatalogo();
  alert('Preço atualizado com sucesso!');
}

function adicionarCategoria() {
  const nomeCat = document.getElementById('nova-cat-nome').value.trim();
  if (!nomeCat) return alert('Digite o nome da categoria!');
  if (categorias.includes(nomeCat)) return alert('Essa categoria já existe!');

  categorias.push(nomeCat);
  localStorage.setItem('farmasi_cats', JSON.stringify(categorias));
  document.getElementById('nova-cat-nome').value = '';
  alert('Categoria adicionada!');
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
  const foto = document.getElementById('prod-foto').value.trim();
  const desc = document.getElementById('prod-desc').value.trim();
  const precoCompra = parseFloat(document.getElementById('prod-compra').value);
  const precoVenda = parseFloat(document.getElementById('prod-venda').value);

  if (!nome || isNaN(precoCompra) || isNaN(precoVenda)) {
    return alert('Preencha o nome e os valores de compra e venda corretamente!');
  }

  produtos.push({
    id: Date.now(),
    nome,
    categoria,
    foto,
    desc,
    precoCompra,
    precoVenda
  });

  localStorage.setItem('farmasi_prods', JSON.stringify(produtos));
  
  // Limpar formulário
  document.getElementById('prod-nome').value = '';
  document.getElementById('prod-foto').value = '';
  document.getElementById('prod-desc').value = '';
  document.getElementById('prod-compra').value = '';
  document.getElementById('prod-venda').value = '';

  alert('Produto cadastrado com sucesso!');
  mudarAba('catalogo');
}

function comprarProduto(nome, preco) {
  let mensagem = `Olá! Gostaria de encomendar: *${nome}* por R$ ${preco.toFixed(2)}.`;
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
      <div class="list-item" style="margin-bottom: 15px;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--gray); padding-bottom: 6px; margin-bottom: 6px;">
          <strong>👤 ${cli.nome}</strong>
          <span style="font-size: 0.85rem; color: #555;">📞 ${cli.telefone}</span>
        </div>
        <div style="font-size: 0.85rem; color: #666; margin-bottom: 4px;">📍 ${cli.endereco || 'Endereço não informado'}</div>
        <div style="font-size: 0.85rem; font-weight: bold; color: var(--primary); margin-bottom: 8px;">Total Vitalício Gasto: R$ ${totalGasto.toFixed(2)}</div>
        
        <div style="background: white; padding: 8px; border-radius: 6px;">
          <p style="font-size: 0.8rem; font-weight: bold; margin-bottom: 4px;">📦 Histórico de Compras & Parcelamento:</p>
    `;

    if (cli.historicoCompras.length === 0) {
      html += `<p style="font-size: 0.75rem; color: #888;">Nenhuma compra registada.</p>`;
    } else {
      cli.historicoCompras.forEach(compra => {
        html += `
          <div style="background: var(--bg); padding: 6px; border-radius: 4px; margin-top: 4px; font-size: 0.75rem;">
            <div><b>${compra.descricao}</b> - R$ ${compra.total.toFixed(2)} (${compra.tipo})</div>
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

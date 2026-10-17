const produtos = [
  { id: 1, nome: "Base VFX Pro Farmasi", preco: "R$ 120,00" },
  { id: 2, nome: "Batom Líquido Matte", preco: "R$ 65,00" },
  { id: 3, nome: "Máscara de Cílios Double Lash", preco: "R$ 89,00" },
  { id: 4, nome: "Sérum Facial Dr. C. Tuna", preco: "R$ 145,00" }
];

function carregarProdutos() {
  const container = document.getElementById("produtos");
  container.innerHTML = "";
  produtos.forEach(produto => {
    const card = document.createElement("div");
    card.classList.add("card-produto");
    card.innerHTML = `<h3>${produto.nome}</h3><p class="preco">${produto.preco}</p>`;
    container.appendChild(card);
  });
}

function enviarWhatsapp() {
  const telefone = "5511999999999";
  const mensagem = encodeURIComponent("Olá! Vim pelo aplicativo e gostaria de fazer um pedido na Farmasi.");
  window.open(`https://wa.me/${telefone}?text=${mensagem}`, "_blank");
}

document.addEventListener("DOMContentLoaded", carregarProdutos);

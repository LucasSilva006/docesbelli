function adicionarAoCarrinho(id, nome, descricao, preco, imagem) {
  console.log("[debug] adicionarAoCarrinho chamado:", { id: id, nome: nome, preco: preco, imagem: imagem });

  var carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  var produtoExiste = false;
  for (var i = 0; i < carrinho.length; i++) {
    if (carrinho[i].id === id) {
      carrinho[i].quantity++;
      produtoExiste = true;
      break;
    }
  }

  if (!produtoExiste) {
    carrinho.push({
      id: id,
      name: nome,
      desc: descricao,
      price: preco,
      image: imagem,
      quantity: 1,
    });
  }

  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  console.log("[debug] carrinho salvo no localStorage:", carrinho);
  // Atualiza badge do carrinho na página (se existir)
  try {
    updateCartCount();
  } catch (e) {
    // Não é crítico — apenas ignora se a função não estiver disponível
  }
}

function getCartTotalQuantity() {
  var carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  var total = 0;
  for (var i = 0; i < carrinho.length; i++) {
    total += Number(carrinho[i].quantity) || 0;
  }
  return total;
}

function updateCartCount() {
  var el = document.getElementById('cart-count');
  if (!el) return;
  var total = getCartTotalQuantity();
  el.textContent = total;
}

// Atualiza o contador ao carregar a página
if (typeof window !== 'undefined') {
  window.addEventListener('load', function () {
    updateCartCount();
  });
}

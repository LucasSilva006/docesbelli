var cart = [];

// Helpers de UI para mensagens de erro amigáveis
function getHeaderHeight() {
  var header = document.querySelector('header');
  return header ? header.offsetHeight : 0;
}

function clearErrors() {
  var existing = document.querySelectorAll('.error-message');
  existing.forEach(function (el) {
    el.remove();
  });
  var formAlert = document.getElementById('form-alert');
  if (formAlert) formAlert.remove();
}

function showErrorFor(fieldId, message) {
  console.log('[debug] showErrorFor', fieldId, message);
  var field = document.getElementById(fieldId);
  if (!field) {
    console.warn('[debug] campo não encontrado para showErrorFor:', fieldId);
    return;
  }
  // Remover erro anterior
  var next = field.nextElementSibling;
  if (next && next.classList && next.classList.contains('error-message')) {
    next.textContent = message;
    return;
  }
  var div = document.createElement('div');
  div.className = 'error-message';
  div.textContent = message;
  // reforço visual temporário
  div.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)';
  div.style.border = '1px solid #fca5a5';
  field.parentNode.insertBefore(div, field.nextSibling);
  // Scroll para o campo com erro levando em conta header sticky
  var headerH = getHeaderHeight();
  var top = field.getBoundingClientRect().top + window.scrollY - headerH - 20;
  window.scrollTo({ top: top, behavior: 'smooth' });
}

function showFormAlert(message) {
  clearErrors();
  var container = document.querySelector('.container');
  var div = document.createElement('div');
  div.id = 'form-alert';
  div.className = 'form-alert';
  div.textContent = message;
  console.log('[debug] showFormAlert inserindo mensagem:', message);
  // reforço visual temporário
  div.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)';
  div.style.border = '1px solid #f3cc79';

  if (container) {
    container.insertBefore(div, container.firstChild);
    var headerH = getHeaderHeight();
    window.scrollTo({ top: container.offsetTop - headerH - 10, behavior: 'smooth' });
  } else {
    // fallback: posiciona fixo no topo se não houver container
    div.style.position = 'fixed';
    div.style.top = '16px';
    div.style.left = '50%';
    div.style.transform = 'translateX(-50%)';
    div.style.zIndex = '9999';
    document.body.appendChild(div);
  }
}

// Limpa erro ao digitar nos campos
function attachClearOnInput(id) {
  var el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('input', function () {
    var next = el.nextElementSibling;
    if (next && next.classList && next.classList.contains('error-message')) next.remove();
    var formAlert = document.getElementById('form-alert');
    if (formAlert) formAlert.remove();
  });
}

['nome','telefone','endereco','bairro'].forEach(attachClearOnInput);

function inicializar() {
  carregarCarrinho();

  if (cart.length === 0) {
    document.getElementById("empty-cart").classList.remove("hidden");
    document.getElementById("cart-with-items").classList.add("hidden");
  } else {
    document.getElementById("empty-cart").classList.add("hidden");
    document.getElementById("cart-with-items").classList.remove("hidden");
    renderCart();
    toggleDeliveryFields();
  }
}

function carregarCarrinho() {
  var carrinhoSalvo = localStorage.getItem("carrinho");
  if (carrinhoSalvo) {
    cart = JSON.parse(carrinhoSalvo);
  }
}

function salvarCarrinho() {
  localStorage.setItem("carrinho", JSON.stringify(cart));
}

function renderCart() {
  var cartContainer = document.getElementById("cart-items");
  cartContainer.innerHTML = "";

  for (var i = 0; i < cart.length; i++) {
    var item = cart[i];
    var itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.innerHTML =
      '<div class="item-image"><img src="' +
      item.image +
      '" alt="' +
      item.name +
      '"></div>' +
      '<div class="item-details">' +
      '<div class="item-name">' +
      item.name +
      "</div>" +
      '<div class="item-desc">' +
      item.desc +
      "</div>" +
      '<div class="item-price">R$ ' +
      item.price.toFixed(2) +
      "</div>" +
      '<div class="quantity-controls">' +
      '<button class="quantity-btn" onclick="updateQuantity(' +
      item.id +
      ', -1)">-</button>' +
      '<span class="quantity-display">' +
      item.quantity +
      "</span>" +
      '<button class="quantity-btn" onclick="updateQuantity(' +
      item.id +
      ', 1)">+</button>' +
      '<button class="delete-btn" onclick="removeItem(' +
      item.id +
      ')">🗑️</button>' +
      "</div>" +
      "</div>";
    cartContainer.appendChild(itemDiv);
  }

  updateSummary();
}

function updateQuantity(id, delta) {
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id === id) {
      cart[i].quantity = Math.max(1, cart[i].quantity + delta);
      break;
    }
  }
  salvarCarrinho();
  renderCart();
}

function removeItem(id) {
  var newCart = [];
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id !== id) {
      newCart.push(cart[i]);
    }
  }
  cart = newCart;
  salvarCarrinho();

  if (cart.length === 0) {
    document.getElementById("empty-cart").classList.remove("hidden");
    document.getElementById("cart-with-items").classList.add("hidden");
  } else {
    renderCart();
  }
}

function updateSummary() {
  var subtotal = 0;
  for (var i = 0; i < cart.length; i++) {
    subtotal += cart[i].price * cart[i].quantity;
  }

  var deliveryType = document.querySelector(
    'input[name="delivery"]:checked'
  ).value;
  var taxa = deliveryType === "entrega" ? 8.0 : 0;
  var total = subtotal + taxa;

  document.getElementById("subtotal").textContent =
    "R$ " + subtotal.toFixed(2);
  document.getElementById("taxa").textContent = "R$ " + taxa.toFixed(2);
  document.getElementById("total").textContent = "R$ " + total.toFixed(2);
}

function toggleDeliveryFields() {
  var deliveryType = document.querySelector(
    'input[name="delivery"]:checked'
  ).value;
  var deliveryFields = document.getElementById("delivery-fields");
  var alert = document.getElementById("alert-retirada");

  if (deliveryType === "entrega") {
    deliveryFields.classList.remove("hidden");
    alert.classList.add("hidden");
  } else {
    deliveryFields.classList.add("hidden");
    alert.classList.remove("hidden");
  }

  updateSummary();
}

function finalizarPedido() {
  console.log('[debug] finalizarPedido chamado');
  var nome = document.getElementById("nome").value;
  var telefone = document.getElementById("telefone").value;
  var email = document.getElementById("email").value;
  var deliveryType = document.querySelector(
    'input[name="delivery"]:checked'
  ).value;
  var endereco = document.getElementById("endereco").value;
  var bairro = document.getElementById("bairro").value;
  var observacoes = document.getElementById("observacoes").value;

  console.log('[debug] valores:', {nome:nome, telefone:telefone, deliveryType: deliveryType, endereco:endereco, bairro:bairro});
  // Validação amigável (mensagens inline)
  clearErrors();

  if (!nome || !telefone) {
    if (!nome) showErrorFor('nome', 'Por favor, informe seu nome.');
    if (!telefone) showErrorFor('telefone', 'Por favor, informe seu telefone com DDD.');
    // Mensagem geral opcional
    showFormAlert('Preencha os campos obrigatórios para continuar.');
    return;
  }

  if (deliveryType === "entrega" && (!endereco || !bairro)) {
    if (!endereco) showErrorFor('endereco', 'Por favor, informe o endereço para entrega.');
    if (!bairro) showErrorFor('bairro', 'Por favor, informe o bairro para entrega.');
    showFormAlert('Complete as informações de entrega para prosseguir.');
    return;
  }

  var subtotal = 0;
  for (var i = 0; i < cart.length; i++) {
    subtotal += cart[i].price * cart[i].quantity;
  }
  var taxa = deliveryType === "entrega" ? 8.0 : 0;
  var total = subtotal + taxa;

  var mensagem = "*Novo Pedido - Doces Belli*\n\n";
  mensagem += "*PRODUTOS:*\n";
  for (var i = 0; i < cart.length; i++) {
    var item = cart[i];
    mensagem +=
      item.quantity +
      "x " +
      item.name +
      " - R$ " +
      (item.price * item.quantity).toFixed(2) +
      "\n";
  }

  mensagem += "\n*DADOS DO CLIENTE:*\n";
  mensagem += "Nome: " + nome + "\n";
  mensagem += "Telefone: " + telefone + "\n";
  mensagem += "Email: " + email + "\n";

  mensagem += "\n*ENTREGA:*\n";
  mensagem +=
    "Tipo: " +
    (deliveryType === "entrega" ? "Entrega" : "Retirada") +
    "\n";
  if (deliveryType === "entrega") {
    mensagem += "Endereço: " + endereco + "\n";
    mensagem += "Bairro: " + bairro + "\n";
  }

  mensagem += "\n*OBSERVAÇÕES:*\n";
  mensagem += (observacoes || "Nenhuma") + "\n";

  mensagem += "\n*VALORES:*\n";
  mensagem += "Subtotal: R$ " + subtotal.toFixed(2) + "\n";
  mensagem += "Taxa de entrega: R$ " + taxa.toFixed(2) + "\n";
  mensagem += "*TOTAL: R$ " + total.toFixed(2) + "*";

  var whatsappUrl =
    "https://wa.me/5581999647354?text=" + encodeURIComponent(mensagem);
  window.open(whatsappUrl, "_blank");

  // Opcional: Limpar carrinho após enviar
  // localStorage.removeItem('carrinho');
  // location.reload();
}

// Event listeners
var radios = document.querySelectorAll('input[name="delivery"]');
for (var i = 0; i < radios.length; i++) {
  radios[i].addEventListener("change", toggleDeliveryFields);
}

// Inicializar ao carregar a página
inicializar();

if (document.readyState == 'loading') {
  document.addEventListener('DOMContentLoaded', ready);
} else {
  ready();
}

function ready() {
  var removeCartItemButtons = document.getElementsByClassName('btn-danger');
  for (var i = 0; i < removeCartItemButtons.length; i++) {
    var button = removeCartItemButtons[i];
    button.addEventListener('click', removeCartItem);
  }

  var quantityInputs = document.getElementsByClassName('cart-quantity-input');
  for (var i = 0; i < quantityInputs.length; i++) {
    var input = quantityInputs[i];
    input.addEventListener('change', quantityChanged);
  }

  var addToCartButtons = document.getElementsByClassName('shop-item-button');
  for (var i = 0; i < addToCartButtons.length; i++) {
    var button = addToCartButtons[i];
    button.addEventListener('click', addToCartClicked);
  }

  document
    .getElementsByClassName('btn-purchase')[0]
    .addEventListener('click', purchaseClicked);
}

var stripeHandler = StripeCheckout.configure({
  key:
    'pk_test_51HPwLZEzVvIK1Sbl1ZGjkj3EivHd6ML9pTJNchZHXV3irew4cz2PWP6hyOgJstWGkfgzDIhNTRfr9iD6mxTzf2yB00kYXOXzyb',
  locale: 'auto',
  token: function (token) {
    var items = [];
    var cartItemContainer = document.getElementsByClassName('cart-items')[0];
    var cartRows = cartItemContainer.getElementsByClassName('cart-row');
    for (var i = 0; i < cartRows.length; i++) {
      var cartRow = cartRows[i];
      var quantityElement = cartRow.getElementsByClassName(
        'cart-quantity-input'
      )[0];
      var quantity = quantityElement.value;

      items.push({
        id: i + 1,
        quantity: quantity,
      });
    }

    fetch('/purchase', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        stripeTokenId: token.id,
        items: items,
      }),
    })
      .then(function (res) {
        console.log(res);
      })
      .then(function (data) {
        alert('Items successfully purchased');
      })
      .catch(function (err) {
        console.log(err);
      });
  },
});

function purchaseClicked() {
  // alert('Thank you for your purchase')
  // var cartItems = document.getElementsByClassName('cart-items')[0]
  // while (cartItems.hasChildNodes()) {
  //     cartItems.removeChild(cartItems.firstChild)
  // }
  // updateCartTotal()
  var priceElement = document.getElementsByClassName('cart-total-price')[0];
  var price = parseFloat(priceElement.innerText.replace('$', '')) * 100;

  stripeHandler.open({
    amount: price,
  });
}

function removeCartItem(event) {
  var buttonClicked = event.target;
  buttonClicked.parentElement.parentElement.remove();
  updateCartTotal();
}

function quantityChanged(event) {
  var input = event.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }
  updateCartTotal();
}

function addToCartClicked(event) {
  var button = event.target;
  var shopItem = button.parentElement.parentElement;
  var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText;
  var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText;
  var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src;
  var id = shopItem.dataset.itemId;
  addItemToCart(title, price, imageSrc);
  updateCartTotal();
}

function addItemToCart(title, price, imageSrc, id) {
  var cartRow = document.createElement('div');
  cartRow.classList.add('cart-row');
  cartRow.dataset.itemId = id;
  var cartItems = document.getElementsByClassName('cart-items')[0];
  var cartItemNames = cartItems.getElementsByClassName('cart-item-title');
  for (var i = 0; i < cartItemNames.length; i++) {
    if (cartItemNames[i].innerText == title) {
      alert('This item is already added to the cart');
      return;
    }
  }
  var cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div>`;
  cartRow.innerHTML = cartRowContents;
  cartItems.append(cartRow);
  cartRow
    .getElementsByClassName('btn-danger')[0]
    .addEventListener('click', removeCartItem);
  cartRow
    .getElementsByClassName('cart-quantity-input')[0]
    .addEventListener('change', quantityChanged);
}

function updateCartTotal() {
  var cartItemContainer = document.getElementsByClassName('cart-items')[0];
  var cartRows = cartItemContainer.getElementsByClassName('cart-row');
  var total = 0;
  for (var i = 0; i < cartRows.length; i++) {
    var cartRow = cartRows[i];
    var priceElement = cartRow.getElementsByClassName('cart-price')[0];
    var quantityElement = cartRow.getElementsByClassName(
      'cart-quantity-input'
    )[0];
    var price = parseFloat(priceElement.innerText.replace('$', ''));
    var quantity = quantityElement.value;
    total = total + price * quantity;
  }
  total = Math.round(total * 100) / 100;
  document.getElementsByClassName('cart-total-price')[0].innerText =
    '$' + total;
}

var cartButton = document.querySelector('.navbar i');
var cartPage = document.querySelector('.cart-page');
var contentSection = document.querySelector('.content-section');
cartButton.addEventListener('click', function () {
  cartPage.classList.toggle('hidden');
  contentSection.classList.toggle('hidden');
});

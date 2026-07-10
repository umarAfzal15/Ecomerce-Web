import { products } from "./product.js";
const cartCount = Number(localStorage.getItem("cartCount")) || 0;

const cartValue = document.getElementById("cart-count");

if (cartValue) {
    cartValue.textContent = cartCount;
}

const productInCart =
JSON.parse(localStorage.getItem("productInCart")) || [];

//console.log(productInCart);

const checkoutProduct = document.getElementById('checkout-products');
//console.log(checkoutProductHtml)

productInCart.forEach(element => {

    let product;
    let price;
    let total;

    products.forEach(item => {
        if (item.id === Number(element.productId)) {
            product = item;
            price = parseFloat(String(product.price).replace(/[^0-9.]/g, ""));
            total = price * Number(element.quantity);
        }
    });

    const checkoutProductHtml = `
    <div class="checkout-card">
        <img src="${product.image}" alt="${product.name}">
        <div class="checkout-product-details">
            <h3 class="checkout-product-name">${product.name}</h3>
            <span> <h4>Quantity: ${element.quantity}</h4></span>
            <p class="checkout-product-price">${total.toFixed(2)}</p>
            <div class="checkout-button-container">
                <button class="checkout-delete">Delete</button>
                <button class="checkout-minus">-</button>
                <button class = "checkout-add">+</button>
            </div>
        </div>
        <div class="checkout-delivery-section">

            <h3 class="checkout-delivery-heading">Delivery Options</h3>
            <div class="checkout-delivery-tabs">
                <button type="button" class="checkout-delivery-tab active" data-delivery="standard" data-price="0">
                    <span>
                        <span class="checkout-delivery-tab-title">Standard</span>
                        <span class="checkout-delivery-tab-time">3-5 days</span>
                    </span>
                    <span class="checkout-delivery-tab-price">Free</span>
                </button>

                <button type="button" class="checkout-delivery-tab" data-delivery="express" data-price="4.99">
                    <span>
                        <span class="checkout-delivery-tab-title">Express</span>
                        <span class="checkout-delivery-tab-time">1-2 days</span>
                    </span>
                    <span class="checkout-delivery-tab-price">$4.99</span>
                </button>

                <button type="button" class="checkout-delivery-tab" data-delivery="emergency" data-price="12.99">
                    <span>
                        <span class="checkout-delivery-tab-title">Emergency</span>
                        <span class="checkout-delivery-tab-time">Today</span>
                    </span>
                    <span class="checkout-delivery-tab-price">$12.99</span>
                </button>
            </div>
        </div>
    </div>
    `
    checkoutProduct.innerHTML += checkoutProductHtml;
});
import { products } from "./product.js";
function CartCountRender () {
    const cartCount = Number(localStorage.getItem("cartCount")) || 0;

    const cartValue = document.getElementById("cart-count");

    if (cartValue) {
    cartValue.textContent = cartCount;
    }
}

CartCountRender();
//console.log(productInCart);

const checkoutProduct = document.getElementById('checkout-products');
//console.log(checkoutProductHtml)

function checkOutRender() {

    checkoutProduct.innerHTML = "";

    const productInCart = JSON.parse(localStorage.getItem("productInCart")) || [];
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
                    <button class="checkout-delete" data-delete-id = "${product.id}">Delete</button>
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

    if (productInCart.length === 0) {
        checkoutProduct.innerHTML = `
            <div class="empty-cart">
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added anything yet.</p>
            <a href="index.html" class="continue-shopping-btn">Continue Shopping</a>
            </div>
        `;
    }
}

checkOutRender();

checkoutProduct.addEventListener('click', (event) => {
    if(event.target.classList.contains('checkout-delete')){
        const idToDelete = Number(event.target.dataset.deleteId);
        //console.log(idToDelete);
        let updateProduct = JSON.parse(localStorage.getItem('productInCart'));
        const itemToDelete = updateProduct.find(item => Number(item.productId) === idToDelete);
        updateProduct = updateProduct.filter(item => Number(item.productId) !== idToDelete);
        localStorage.setItem("productInCart", JSON.stringify(updateProduct))

        let updateCartCount = localStorage.getItem("cartCount");
        if (itemToDelete) {
            updateCartCount -= itemToDelete.quantity;
        }
        //console.log("update", updateCartCount);
        localStorage.setItem("cartCount", updateCartCount);

        //console.log(localStorage.getItem("cartCount"))

        const updateCartIcon = document.getElementById("cart-count");
        
        //console.log(updateProduct);
        checkOutRender();
        CartCountRender();
    }
})
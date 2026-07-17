import { products } from "./product.js";
function CartCountRender () {
    const cartCount = Number(localStorage.getItem("cartCount")) || 0;

    const cartValue = document.getElementById("cart-count");

    if (cartValue) {
    cartValue.textContent = cartCount;
    }
}

CartCountRender();

const checkoutProduct = document.getElementById('checkout-products');

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
                <p class="checkout-product-price">$${total.toFixed(2)}</p>
                <div class="checkout-button-container">
                    <button class="checkout-delete" data-delete-id = "${product.id}">Delete</button>
                    <button class="checkout-minus" data-minus-id = "${product.id}">-</button>
                    <button class = "checkout-add" data-add-id = "${product.id}">+</button>
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

let deliveryPrice = 0;
let deliverySelections = {};
checkoutProduct.addEventListener('click', (event) => {
    if(event.target.classList.contains('checkout-delete')){
        if(event.target.classList.contains('checkout-delete')){
            const idToDelete = Number(event.target.dataset.deleteId);
            let updateProduct = JSON.parse(localStorage.getItem('productInCart'));
            const itemToDelete = updateProduct.find(item => Number(item.productId) === idToDelete);
            updateProduct = updateProduct.filter(item => Number(item.productId) !== idToDelete);
            localStorage.setItem("productInCart", JSON.stringify(updateProduct))

            let updateCartCount = Number(localStorage.getItem("cartCount")) || 0;
            if (itemToDelete) {
                updateCartCount -= itemToDelete.quantity;
            }
            localStorage.setItem("cartCount", updateCartCount);

            delete deliverySelections[idToDelete];
            const remainingPrices = Object.values(deliverySelections);
            deliveryPrice = remainingPrices.length > 0 ? Math.max(...remainingPrices) : 0;

            checkOutRender();
            CartCountRender();
            renderOrderSummary();
        }
        
        checkOutRender();
        CartCountRender();
    }

    if(event.target.classList.contains('checkout-minus')){
        const idToMinus = Number(event.target.dataset.minusId);
        let minusProduct = JSON.parse(localStorage.getItem("productInCart"));

        minusProduct.forEach(item => {
            if(idToMinus === Number(item.productId)){
                item.quantity -= 1;
            }
        });

        const itemToDelete = minusProduct.find(item => Number(item.productId) === idToMinus);
        minusProduct = minusProduct.filter(item => item.quantity > 0);

        localStorage.setItem("productInCart", JSON.stringify(minusProduct));

        let updateCartCount = Number(localStorage.getItem("cartCount"));
        if (itemToDelete) {
            updateCartCount -= 1;
        }
        localStorage.setItem("cartCount", updateCartCount);

        checkOutRender();
        CartCountRender();
    }

    if(event.target.classList.contains('checkout-add')){
        const idToAdd = Number(event.target.dataset.addId);
        let addProduct = JSON.parse(localStorage.getItem("productInCart"));

        addProduct.forEach(item => {
            if(idToAdd === Number(item.productId)){
                item.quantity += 1;
            }
        });

        const quantityToAdd = addProduct.find(item => Number(item.productId) === idToAdd);
        //addProduct = addProduct.filter(item => item.quantity > 0);

        localStorage.setItem("productInCart", JSON.stringify(addProduct));

        let updateCartCount = Number(localStorage.getItem("cartCount"));
        if (quantityToAdd) {
            updateCartCount += 1;
        }
        localStorage.setItem("cartCount", updateCartCount);

        checkOutRender();
        CartCountRender();
    }

    const selectOption = event.target.closest('.checkout-delivery-tabs');
    const clickedTab = event.target.closest('.checkout-delivery-tab');
    if (clickedTab) {
        selectOption.querySelectorAll('.checkout-delivery-tab').forEach(tab => {
            tab.classList.remove('active');
        });

        clickedTab.classList.add('active');

        const productCard = clickedTab.closest('.checkout-card');
        const productId = productCard.querySelector('.checkout-delete').dataset.deleteId;

        deliverySelections[productId] = Number(clickedTab.dataset.price);
        deliveryPrice = Math.max(...Object.values(deliverySelections));
    }
    renderOrderSummary();
})

function renderOrderSummary() {
    const OrderSection = document.getElementById('place-order-sidebar');
    const items = JSON.parse(localStorage.getItem("productInCart")) || [];

    let quantity = 0;
    let subTotalAmount = 0;

    items.forEach(element => {
        quantity += Number(element.quantity);
        products.forEach(item => {
            if (item.id === Number(element.productId)) {
                const price = parseFloat(String(item.price).replace(/[^0-9.]/g, ""));
                subTotalAmount += price * Number(element.quantity);
            }
        });
    });

    const taxMoney = ((10 / 100) * subTotalAmount).toFixed(2);
    const numericDeliveryPrice = Number(deliveryPrice) || 0;
    const totalAmount =  (subTotalAmount + numericDeliveryPrice + Number(taxMoney)).toFixed(2);
    const deliveryPriceDisplay = numericDeliveryPrice === 0 ? "Free" : `$${numericDeliveryPrice.toFixed(2)}`;
    
    OrderSection.innerHTML = `
    <h3 class="checkout-order-summary">Order Summary</h3>

        <div class="checkout-price-details">
        <h3 class="checkout-price-heading">Price Details</h3>

        <div class="checkout-price-row">
            <span class="checkout-price-label">Price (${quantity} item${quantity !== 1 ? 's' : ''})</span>
            <span class="checkout-price-value">$${subTotalAmount.toFixed(2)}</span>
        </div>

        <div class="checkout-price-row">
            <span class="checkout-price-label">Tax (10%)</span>
            <span class="checkout-price-value">$${taxMoney}</span>
        </div>

        <div class="checkout-price-row">
            <span class="checkout-price-label">Delivery Charges</span>
            <span class="checkout-price-value checkout-price-free" id = "js-free">${deliveryPriceDisplay}</span>
        </div>

        <div class="checkout-price-divider"></div>

        <div class="checkout-price-row checkout-total-row">
            <span class="checkout-total-label">Total Amount</span>
            <span class="checkout-total-value" id = "js-total">$${totalAmount}</span>
        </div>
        </div>  

        <button class= "checkout-place-order">Place Order</button>
    `;

    if(localStorage.getItem("productInCart") === "[]"){
        document.getElementById('js-free').innerHTML = "Free";
        document.getElementById('js-total').innerHTML = "$0.00";
    }
}

renderOrderSummary();
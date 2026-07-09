import { products } from "./product.js";

const productsGrid = document.getElementById("products-grid");

let cartCount = 0;

products.forEach(product => {
    const productHTML = `
    <div class="product-card">
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <h3 class="product-name" >${product.name}</h3>
        <p class="product-price">${product.price}</p>
        <button class="add-to-cart-button" data-product-id="${product.id}">Add to Cart</button>
        <select name="quantity" data-drop-down-id="quantity-select-${crypto.randomUUID()}" class="product-quantity">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
        </select>
    </div>
    `;
    console.log(productHTML);
    productsGrid.innerHTML += productHTML;
})

const productGrid = document.getElementById("products-grid")

productGrid.addEventListener('click', function(event) {
    
    if(event.target.classList.contains('add-to-cart-button')){
        const button = event.target;
        const productId = button.dataset.productId;
        const cartValue = document.getElementById('cart-count');

        const prdouctCard = button.closest('.product-card');
        const getSelect = prdouctCard.querySelector('.product-quantity')
        const selectValue = getSelect.value;

        cartCount += Number(selectValue);
        cartValue.innerHTML = cartCount;
    }
    
})
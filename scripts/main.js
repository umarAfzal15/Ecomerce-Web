import { products } from "./product.js";

const productsGrid = document.getElementById("products-grid");

products.forEach(product => {
    const productHTML = `
    <div class="product-card">
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <h3 class="product-name" >${product.name}</h3>
        <p class="product-price">$${product.price}</p>
    </div>
    `;

    productsGrid.innerHTML += productHTML;
})
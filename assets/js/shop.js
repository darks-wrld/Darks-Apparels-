document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.querySelector('.product-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');

    let products = [];

    // Fetch products from the API
    fetch('http://localhost:5000/api/products')
        .then(response => response.json())
        .then(data => {
            products = data;
            renderProducts(products);
        })
        .catch(error => console.error('Error fetching products:', error));

    // Render products
    function renderProducts(productsToRender) {
        productGrid.innerHTML = '';
        productsToRender.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.dataset.category = product.category;
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>₵${product.price.toFixed(2)}</p>
                <button class="add-to-cart" data-name="${product.name}" data-price="${product.price}">Add to Cart</button>
            `;
            productGrid.appendChild(productCard);
        });

        // Add event listeners to the new buttons
        addEventListenersToCartButtons();
    }

    // Add to Cart functionality
    function addEventListenersToCartButtons() {
        const cartButtons = document.querySelectorAll(".add-to-cart");
        cartButtons.forEach(button => {
            button.addEventListener("click", () => {
                const name = button.dataset.name;
                const price = parseFloat(button.dataset.price);
                let cart = JSON.parse(localStorage.getItem("cart")) || [];
                const existingItem = cart.find(item => item.name === name);
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({ name, price, quantity: 1 });
                }
                localStorage.setItem("cart", JSON.stringify(cart));
                alert(`${name} added to cart! 🛒`);
            });
        });
    }

    // Filter Products
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            const category = button.dataset.filter;
            const filteredProducts = category === 'all'
                ? products
                : products.filter(product => product.category === category);

            renderProducts(filteredProducts);
        });
    });
});

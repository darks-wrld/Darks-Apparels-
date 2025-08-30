// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

// Display cart items
function renderCart() {
    if (!cartItemsContainer) return;
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.innerHTML = `
            <img src="assets/images/${item.name.toLowerCase().replace(/\s+/g, '')}.jpg" alt="${item.name}">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">₵${item.price.toFixed(2)}</div>
            </div>
            <div class="cart-quantity">
                <button onclick="updateQuantity(${index}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${index}, 1)">+</button>
                <span class="remove-item" onclick="removeItem(${index})">✕</span>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    if (cartTotal) {
        cartTotal.textContent = `₵${total.toFixed(2)}`;
    }
}

// Update quantity
function updateQuantity(index, change) {
    if (cart[index].quantity + change <= 0) {
        removeItem(index);
    } else {
        cart[index].quantity += change;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

// Remove item
function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

// Initial render
renderCart();

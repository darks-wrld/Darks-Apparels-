// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

// Render cart
function renderCart() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>Your cart is empty 🛒</p>";
        cartTotal.textContent = "₵0.00";
        return;
    }

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.innerHTML = `
            <div class="cart-item-details">
                <span class="cart-item-name">${item.name}</span>
                <span class="cart-item-price">₵${item.price.toFixed(2)}</span>
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

    cartTotal.textContent = `₵${total.toFixed(2)}`;
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

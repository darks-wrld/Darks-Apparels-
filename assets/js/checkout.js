// Load cart total from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const checkoutTotal = document.getElementById("checkout-total");

function calculateTotal() {
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
    });
    checkoutTotal.textContent = `₵${total.toFixed(2)}`;
}
calculateTotal();

// Handle order form submission
document.getElementById("checkout-form").addEventListener("submit", function(e) {
    e.preventDefault();

    if (cart.length === 0) {
        alert("Your cart is empty. Add items before checking out.");
        return;
    }

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const payment = document.getElementById("payment").value;

    // Simulate order confirmation
    alert(`Thank you ${name}! Your order has been placed.\nWe will contact you at ${phone}.`);

    // Clear cart after order
    localStorage.removeItem("cart");

    // Redirect back to home
    window.location.href = "index.html";
});

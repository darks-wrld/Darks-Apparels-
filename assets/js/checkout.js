document.addEventListener('DOMContentLoaded', () => {
    const checkoutForm = document.getElementById('checkout-form');
    const checkoutTotal = document.getElementById('checkout-total');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Calculate and display total
    function updateTotal() {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        if (checkoutTotal) {
            checkoutTotal.textContent = `₵${total.toFixed(2)}`;
        }
        return total;
    }

    updateTotal();

    // Handle form submission
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (cart.length === 0) {
                alert('Your cart is empty. Add items before checking out.');
                return;
            }

            const formData = new FormData(checkoutForm);
            const orderData = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                address: formData.get('address'),
                payment: formData.get('payment'),
                cart: cart,
                total: updateTotal(),
            };

            fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            })
            .then(response => response.json())
            .then(data => {
                alert(`Thank you ${data.name}! Your order has been placed.`);
                localStorage.removeItem('cart');
                window.location.href = 'index.html';
            })
            .catch(error => {
                console.error('Error placing order:', error);
                alert('There was an error placing your order. Please try again.');
            });
        });
    }
});

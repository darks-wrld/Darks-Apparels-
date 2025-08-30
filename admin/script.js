document.addEventListener('DOMContentLoaded', () => {
    const addProductForm = document.getElementById('add-product-form');
    const ordersList = document.getElementById('orders-list');

    // Add a new product
    addProductForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const productData = {
            name: document.getElementById('product-name').value,
            price: document.getElementById('product-price').value,
            image: document.getElementById('product-image').value,
            category: document.getElementById('product-category').value,
        };

        fetch('http://localhost:5000/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
        })
        .then(response => response.json())
        .then(data => {
            alert('Product added successfully!');
            addProductForm.reset();
        })
        .catch(error => console.error('Error adding product:', error));
    });

    // Fetch and display orders
    function fetchOrders() {
        fetch('http://localhost:5000/api/orders')
            .then(response => response.json())
            .then(orders => {
                ordersList.innerHTML = '';
                orders.forEach(order => {
                    const orderDiv = document.createElement('div');
                    orderDiv.className = 'order';
                    orderDiv.innerHTML = `
                        <h3>Order for ${order.name}</h3>
                        <div class="order-details">
                            <p><strong>Phone:</strong> ${order.phone}</p>
                            <p><strong>Address:</strong> ${order.address}</p>
                            <p><strong>Payment:</strong> ${order.payment}</p>
                            <p><strong>Total:</strong> ₵${order.total.toFixed(2)}</p>
                        </div>
                        <div class="order-cart">
                            <h4>Cart Items:</h4>
                            ${order.cart.map(item => `
                                <div class="order-cart-item">
                                    <span>${item.name} (x${item.quantity})</span>
                                    <span>₵${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            `).join('')}
                        </div>
                    `;
                    ordersList.appendChild(orderDiv);
                });
            })
            .catch(error => console.error('Error fetching orders:', error));
    }

    fetchOrders();
});

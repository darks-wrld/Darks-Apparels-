// --- Auth Check ---
fetch('/api/orders') // A protected route
    .then(response => {
        if (!response.ok) window.location.href = 'login.html';
    })
    .catch(() => (window.location.href = 'login.html'));

document.addEventListener('DOMContentLoaded', () => {
    // --- General Elements ---
    const logoutBtn = document.getElementById('logout-btn');
    const tabs = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    // --- Tab Switching Logic ---
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(item => item.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });

    // --- Logout ---
    logoutBtn.addEventListener('click', async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    });

    // --- Settings: Change Password ---
    const changePasswordForm = document.getElementById('change-password-form');
    changePasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const oldPassword = document.getElementById('old-password').value;
        const newPassword = document.getElementById('new-password').value;
        const responseEl = document.getElementById('password-change-response');

        try {
            const response = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ oldPassword, newPassword }),
            });
            const data = await response.json();
            if (response.ok) {
                responseEl.textContent = 'Password changed successfully!';
                responseEl.style.color = 'green';
                changePasswordForm.reset();
            } else {
                responseEl.textContent = data.message || 'Failed to change password.';
                responseEl.style.color = 'red';
            }
        } catch (error) {
            responseEl.textContent = 'An error occurred.';
            responseEl.style.color = 'red';
        }
    });

    // --- Products ---
    const addProductForm = document.getElementById('add-product-form');
    addProductForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const productData = {
            name: document.getElementById('product-name').value,
            price: document.getElementById('product-price').value,
            image: document.getElementById('product-image').value,
            category: document.getElementById('product-category').value,
        };

        fetch('/api/products', {
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
            // Optionally refresh products list if we display it somewhere
        })
        .catch(error => console.error('Error adding product:', error));
    });

    // --- Orders ---
    const ordersList = document.getElementById('orders-list');
    function renderOrders(orders) {
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
                <button class="btn delete-order-btn" data-id="${order._id}">Delete Order</button>
            `;
            ordersList.appendChild(orderDiv);
        });
    }
    ordersList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-order-btn')) {
            const orderId = e.target.dataset.id;
            if (confirm('Are you sure you want to delete this order?')) {
                fetch(`/api/orders/${orderId}`, { method: 'DELETE' })
                    .then(response => {
                        if (response.ok) {
                            init(); // Re-fetch all data and re-render
                        } else {
                            alert('Failed to delete order.');
                        }
                    })
                    .catch(error => console.error('Error deleting order:', error));
            }
        }
    });

    // --- Messages ---
    const messagesList = document.getElementById('messages-list');
    function renderMessages(messages) {
        messagesList.innerHTML = '';
        messages.forEach(message => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${message.viewed ? 'viewed' : ''}`;
            messageDiv.innerHTML = `
                <div class="message-header">
                    <h3>From: ${message.name} (${message.email})</h3>
                    <small>${new Date(message.createdAt).toLocaleString()}</small>
                </div>
                <p>${message.message}</p>
                ${!message.viewed ? `<button class="btn mark-viewed-btn" data-id="${message._id}">Mark as Viewed</button>` : ''}
            `;
            messagesList.appendChild(messageDiv);
        });
    }
    messagesList.addEventListener('click', (e) => {
        if (e.target.classList.contains('mark-viewed-btn')) {
            const messageId = e.target.dataset.id;
            fetch(`/api/messages/${messageId}/viewed`, { method: 'PUT' })
                .then(response => {
                    if (response.ok) {
                        init(); // Re-fetch all data and re-render
                    }
                })
                .catch(error => console.error('Error marking message as viewed:', error));
        }
    });

    // --- Dashboard Charts ---
    function renderCharts(orders, products) {
        // Orders Chart (e.g., by day)
        const ordersCtx = document.getElementById('orders-chart').getContext('2d');
        const ordersByDay = orders.reduce((acc, order) => {
            const date = new Date(order.createdAt).toLocaleDateString();
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});
        new Chart(ordersCtx, {
            type: 'line',
            data: {
                labels: Object.keys(ordersByDay),
                datasets: [{
                    label: 'Orders per Day',
                    data: Object.values(ordersByDay),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    tension: 0.1,
                }]
            },
        });

        // Products Chart (by category)
        const productsCtx = document.getElementById('products-chart').getContext('2d');
        const productsByCategory = products.reduce((acc, product) => {
            acc[product.category] = (acc[product.category] || 0) + 1;
            return acc;
        }, {});
        new Chart(productsCtx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(productsByCategory),
                datasets: [{
                    label: 'Products by Category',
                    data: Object.values(productsByCategory),
                    backgroundColor: ['rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)'],
                }]
            },
        });
    }

    // --- Initial Data Fetch ---
    async function init() {
        const [ordersResponse, productsResponse, messagesResponse] = await Promise.all([
            fetch('/api/orders'),
            fetch('/api/products'),
            fetch('/api/messages')
        ]);

        const orders = await ordersResponse.json();
        const products = await productsResponse.json();
        const messages = await messagesResponse.json();

        // Populate all sections
        renderOrders(orders);
        renderMessages(messages);
        renderCharts(orders, products);
    }

    init();
});

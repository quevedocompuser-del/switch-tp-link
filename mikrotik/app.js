// Definición del Array global para el carrito
let cart = [];

// Elementos del DOM
const productListSection = document.getElementById('product-list');
const cartViewSection = document.getElementById('cart-view');
const cartCountElement = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const cartIcon = document.querySelector('.cart-icon');
const closeCartBtn = document.getElementById('close-cart-btn');
const checkoutBtn = document.getElementById('checkout-btn');

// --- Funciones del Carrito ---

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCountElement.textContent = totalItems;
}

function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    cartTotalElement.textContent = `$${total.toFixed(2)}`;
}

function renderCart() {
    cartItemsContainer.innerHTML = ''; // Limpiar el contenedor
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>El carrito está vacío. ¡Añade algunos routers!</p>';
    } else {
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <div class="item-details">
                    <p><strong>${item.name}</strong></p>
                    <p>Precio: $${item.price.toFixed(2)} c/u</p>
                    <p>Subtotal: $${(item.price * item.qty).toFixed(2)}</p>
                </div>
                <div class="item-actions">
                    <div class="quantity-control">
                        <button class="qty-btn" data-action="decrease" data-id="${item.id}">-</button>
                        <span class="qty-display">${item.qty}</span>
                        <button class="qty-btn" data-action="increase" data-id="${item.id}">+</button>
                    </div>
                    <button class="remove-btn" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
    }

    updateCartTotal();
}

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    updateCartCount();
    renderCart();
}

function handleQuantityChange(id, action) {
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex > -1) {
        if (action === 'increase') {
            cart[itemIndex].qty += 1;
        } else if (action === 'decrease') {
            cart[itemIndex].qty -= 1;
            if (cart[itemIndex].qty <= 0) {
                // Eliminar si la cantidad llega a cero
                cart.splice(itemIndex, 1);
            }
        }
    }
    updateCartCount();
    renderCart();
}

// --- Manejadores de Eventos ---

// 1. Añadir al carrito
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
        const productCard = e.target.closest('.product-card');
        const product = {
            id: productCard.dataset.id,
            name: productCard.dataset.name,
            price: parseFloat(productCard.dataset.price)
        };
        addToCart(product);
    });
});

// 2. Control del Carrito (cantidad y eliminar)
cartItemsContainer.addEventListener('click', (e) => {
    const target = e.target;
    const id = target.dataset.id;
    
    if (target.classList.contains('qty-btn')) {
        handleQuantityChange(id, target.dataset.action);
    } else if (target.classList.contains('remove-btn')) {
        // Eliminar producto
        cart = cart.filter(item => item.id !== id);
        updateCartCount();
        renderCart();
    }
});

// 3. Navegación de Vistas
cartIcon.addEventListener('click', () => {
    productListSection.classList.add('hidden');
    cartViewSection.classList.remove('hidden');
    renderCart(); // Asegurar que el carrito se actualice al abrir
});

closeCartBtn.addEventListener('click', () => {
    cartViewSection.classList.add('hidden');
    productListSection.classList.remove('hidden');
});

checkoutBtn.addEventListener('click', () => {
    if (cart.length > 0) {
        // En una aplicación real, aquí se redirigiría a la pasarela de pago real
        alert('Procesando pago... (Simulación: Total ' + cartTotalElement.textContent + ')');
        // Opcional: limpiar el carrito después de la "compra" simulada
        // cart = [];
        // updateCartCount();
        // renderCart();
        // productListSection.classList.remove('hidden');
        // cartViewSection.classList.add('hidden');
    } else {
        alert('Tu carrito está vacío.');
    }
});

// Inicialización
updateCartCount();
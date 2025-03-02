document.addEventListener('DOMContentLoaded', function() {
    const decreaseBtn = document.getElementById('decreaseQuantity');
    const increaseBtn = document.getElementById('increaseQuantity');
    const quantityInput = document.getElementById('quantity');
    const addToCartBtn = document.getElementById('addToCart');
    const maxStock = parseInt(document.getElementById('maxStock').value);
    const productId = document.getElementById('productId').value;
    
    // Manejar botones de cantidad
    decreaseBtn.addEventListener('click', function() {
        let currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });
    
    increaseBtn.addEventListener('click', function() {
        let currentValue = parseInt(quantityInput.value);
        if (currentValue < maxStock) {
            quantityInput.value = currentValue + 1;
        }
    });
    
    // Validar entrada manual
    quantityInput.addEventListener('change', function() {
        let currentValue = parseInt(this.value);
        if (isNaN(currentValue) || currentValue < 1) {
            this.value = 1;
        } else if (currentValue > maxStock) {
            this.value = maxStock;
        }
    });
    
    // Agregar al carrito
    addToCartBtn.addEventListener('click', function() {
        const quantity = parseInt(quantityInput.value);
        const cartId = localStorage.getItem('cartId');
        
        if (!cartId) {
            // Si no hay carrito, crear uno
            fetch('/api/carts', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    localStorage.setItem('cartId', data.payload._id);
                    addProductToCart(data.payload._id, productId, quantity);
                }
            })
            .catch(error => console.error('Error:', error));
        } else {
            // Si ya hay carrito, agregar producto
            addProductToCart(cartId, productId, quantity);
        }
    });
    
    function addProductToCart(cartId, productId, quantity) {
        fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Producto agregado al carrito');
            } else {
                alert('Error al agregar el producto');
            }
        })
        .catch(error => console.error('Error:', error));
    }
});
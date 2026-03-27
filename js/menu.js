async function fetchMenuData() {
    try {
        const response = await fetch('js/foods.json');

        if (!response.ok) {
            throw new Error(`Failed to load menu data: ${response.status}`);
        }

        const foodsData = await response.json();
        const { categories } = foodsData;
        const firstCategory = Object.keys(categories)[0];

        renderCategories(categories);
        renderMenuItems(categories[firstCategory], firstCategory);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

function renderCategories(categories) {
    const categoriesContainer = document.querySelector('.menu-categories');

    if (!categoriesContainer) {
        return;
    }

    categoriesContainer.innerHTML = '';

    Object.keys(categories).forEach((categoryName, index) => {
        const categoryElement = document.createElement('div');
        categoryElement.classList.add('menu-category');

        if (index === 0) {
            categoryElement.classList.add('active');
        }

        categoryElement.innerHTML = `<img src="img/pasta.svg" width="200px" alt="${categoryName}">
<div class="menu-category-info">
    <h3 class="menu-category-title">${categoryName}</h3>
    <p class="text-gray">${categories[categoryName].length} items in stock</p>
</div>`;

        categoryElement.addEventListener('click', () => {
            document.querySelectorAll('.menu-category').forEach((element) => {
                element.classList.remove('active');
            });

            categoryElement.classList.add('active');
            renderMenuItems(categories[categoryName], categoryName);
        });

        categoriesContainer.appendChild(categoryElement);
    });
}

function renderMenuItems(items, categoryName) {
    const menuItemsContainer = document.querySelector('.lunch-menu-items');
    const categoryTitle = document.querySelector('.lunch-menu-title');
    const categoryDescription = document.querySelector('.lunch-menu-description');

    if (!menuItemsContainer || !categoryTitle) {
        return;
    }

    categoryTitle.textContent = `${categoryName} Menu`;

    if (categoryDescription) {
        categoryDescription.textContent = `Fresh ${categoryName.toLowerCase()} items prepared with the best ingredients.`;
    }

    menuItemsContainer.innerHTML = '';

    items.forEach((item) => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('lunch-menu-item');
        itemElement.innerHTML = `<img src="${item.image}" alt="${item.name}">
                    <h4>${item.name}</h4>
                    <p class="pizza-description">Preparation time: ${item.preparationTime}</p>
                    <p class="price">$${item.price.toFixed(2)}</p>
                    <button class="add-btn" data-name="${item.name}" data-price="${item.price}" data-image="${item.image}">Add to cart</button>`;

        menuItemsContainer.appendChild(itemElement);
    });
    document.querySelectorAll('.add-btn').forEach((button) => {
        button.addEventListener('click', () => {
            const name = button.getAttribute('data-name');
            const price = button.getAttribute('data-price');
            const image = button.getAttribute('data-image');
            // Add your logic to handle adding the item to the cart
            addToCart({ name, price, image });
        });
    });
}

function addToCart(selectFoodItem) {
    if (!selectFoodItem) {
        return;
    }


    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItemIndex = cart.findIndex((item) => item.name === selectFoodItem.name);


    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push({
            name: selectFoodItem.name,
            price: selectFoodItem.price,
            image: selectFoodItem.image,
            quantity: 1
        });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    renderInvoice();
    updateCartBadge(cart);

    Toastify({
        text: `${selectFoodItem.name} added to cart!`,
        duration: 3000,
        close: true,
        gravity: "bottom",
        position: "center",
        backgroundColor: "#f38600",
    }).showToast();
}

function updateCartBadge(cart = JSON.parse(localStorage.getItem("cart")) || []) {
    const cartBadge = document.getElementById("cart-badge");

    if (!cartBadge) {
        return;
    }

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
}

function renderInvoice() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const invoiceContainer = document.getElementById('invoiceItems');
    const paymentSummary = document.querySelector('.invoice-summary');

    updateCartBadge(cart);

    if (!invoiceContainer || !paymentSummary) {
        return;
    }
   
    let subtotal = 0;

    invoiceContainer.innerHTML = '';

    cart.forEach((item, index) => {
        const itemTotalPrice = item.price * item.quantity;
        subtotal += itemTotalPrice;
        const itemElement = document.createElement('div');
        itemElement.classList.add('invoice-item');
        itemElement.innerHTML = `
    <div class="invoice-item-content">
        <img src="${item.image}" alt="${item.name}">
        <div>
            <h4>${item.name}</h4>
            <div class="invoice-item-quantity">
                <button class="qty-btn" data-index="${index}" data-action="decrease">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" data-index="${index}" data-action="increase">+</button>
            </div>
        </div>
    </div>`;

        invoiceContainer.appendChild(itemElement);
    });
 
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    paymentSummary.innerHTML = `<div class="summary-row">
    <span>Sub Total</span>
    <span class="amount">$${subtotal.toFixed(2)}</span>
</div>
<div class="summary-row">
    <span>Tax</span>
    <span class="amount">$${tax.toFixed(2)}</span>
</div>
<div class="summary-row total-row">
    <span>Total Payment</span>
    <span class="amount">$${total.toFixed(2)}</span>
</div>`;

    document.querySelectorAll('.qty-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const index = parseInt(event.target.dataset.index);
            const action = event.target.dataset.action;

            if (action === 'increase') {
                cart[index].quantity += 1;
            } else if (action === 'decrease') {
                if (cart[index].quantity > 1) {
                    cart[index].quantity -= 1;
                } else {
                    cart.splice(index, 1);
                }
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            renderInvoice();
        });
    });

}

// Call Modal Function

document.querySelector('.invoice-checkout-btn').addEventListener('click', () => {
    document.getElementById('payment-modal').style.display = 'flex';
});

document.addEventListener('DOMContentLoaded', () => {
    fetchMenuData();
    renderInvoice();
    updateCartBadge();
});

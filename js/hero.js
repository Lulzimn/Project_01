let currentindex = 0;
const visibleIteamsCount = 3;
let currentFoodprice = 0;
let currentQuantity = 1;
let currentSelectedFood = null;
const initialCategory = "Lunch";









async function fetchData() {
    try {
        const response = await fetch ("js/foods.json");
        const foodData = await response.json();
        const foods = foodData?.categories?.[initialCategory];
        renderFoodCarousel(foods);
        setupArrowButtons(foods);

        
        
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function renderFoodCarousel(foods) {
        const fooditemsContainer = document.querySelector(".food-items");
        if (!fooditemsContainer || !Array.isArray(foods)) {
            return;
        }
        currentindex = 0;
        fooditemsContainer.innerHTML = "";
        
        foods.forEach((food, index) => {
            const foodItem = document.createElement("div");
            foodItem.classList.add("food-item");
            if (index === 0) {
                foodItem.classList.add("selected");
                currentFoodprice = food.price;
                updateHeroImage(food);
                
            }
                foodItem.innerHTML = `
                <img src="${food.image}" width="100px" alt="${food.name}">
                   <p>${food.name} <br> 
                        <span class="item-price">${food.price}</span>
                            <span class="valute">CHF</span>
                               </p>
                `;

                foodItem.addEventListener("click", () => {
                    currentindex = index;
                    syncCarouselState(foods);
                });
                fooditemsContainer.appendChild(foodItem);
            });

        syncCarouselState(foods);
}

function updateTotalPrice() {
    const totalPriceElement = document.getElementById("order-total");
    if (!totalPriceElement) {
        return;
    }

    const totalPrice = (currentFoodprice * currentQuantity).toFixed(2);
    totalPriceElement.textContent = `CHF${totalPrice}`;
}




function updateQuantity(quantity) {
    currentQuantity = quantity;
    const quantityElement = document.getElementById("quantity");
    if (!quantityElement) {
        return;
    }
    quantityElement.textContent = quantity;
    updateTotalPrice();
}

const increaseBtn = document.getElementById("increase-quantity");
if (increaseBtn) {
    increaseBtn.addEventListener("click", () => {
        updateQuantity(currentQuantity + 1);
    });
}

const decreaseBtn = document.getElementById("decrease-quantity");
if (decreaseBtn) {
    decreaseBtn.addEventListener("click", () => {
        if (currentQuantity > 1) 
        updateQuantity(currentQuantity - 1);
    });
}

function selectFoodItem(selectedFood, selectedElement) {
    updateHeroImage(selectedElement);
    currentSelectedFood = selectedElement;
    currentFoodprice = selectedElement.price;
    currentQuantity = 1;

    updateQuantity(currentQuantity);

    const foodItems = document.querySelectorAll(".food-item");
    foodItems.forEach((item) => {
        item.classList.remove("selected");
    });
    selectedFood.classList.add("selected");
}

function updateHeroImage(food) {
    const heroImage = document.querySelector(".hero-main-image");
    const foodTitle = document.querySelector(".food-name");
    const foodRating = document.getElementById("food-rating");
    const foodPreparationTime = document.getElementById("prepare-time");

    if (!heroImage || !foodTitle || !foodRating || !foodPreparationTime || !food) {
        return;
    }

    heroImage.src = food.image;
    heroImage.alt = food.name;
    foodRating.textContent = food.rating;
    foodPreparationTime.textContent = food.preparationTime;
    foodTitle.textContent = food.name;

}

function updateVisibleIteams(startIndex) {
    const foodItems = document.querySelectorAll(".food-item");

    foodItems.forEach((item, index) => {
        if (index >= startIndex && index < startIndex + visibleIteamsCount) {
            item.style.display = "flex";
        } else {
            item.style.display = "none";
        }
    });
}

function syncCarouselState(foods) {
    if (!Array.isArray(foods) || foods.length === 0) {
        return;
    }

    const maxStartIndex = Math.max(foods.length - visibleIteamsCount, 0);
    const startIndex = Math.min(currentindex, maxStartIndex);
    const foodItems = document.querySelectorAll(".food-item");
    const activeFood = foods[currentindex];
    const activeFoodItem = foodItems[currentindex];

    updateVisibleIteams(startIndex);

    if (activeFood && activeFoodItem) {
        selectFoodItem(activeFoodItem, activeFood);
    }
}

function setupArrowButtons(foods) {
    const leftArrow = document.querySelector(".left-arrow");
    const rightArrow = document.querySelector(".right-arrow");

    if (!leftArrow || !rightArrow || !Array.isArray(foods)) {
        return;
    }

    leftArrow.onclick = () => {
        if (currentindex > 0) {
            currentindex--;
        } else {
            currentindex = foods.length - 1;
        }

        syncCarouselState(foods);
    };

    rightArrow.onclick = () => {
        if (currentindex < foods.length - 1) {
            currentindex++;
        } else {
            currentindex = 0;
        }

        syncCarouselState(foods);
    };
}

function addToCard(selectFoodItem) {
    if (!selectFoodItem) {
        return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItemIndex = cart.findIndex((item) => item.name === selectFoodItem.name);

    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += currentQuantity;
    } else {
        cart.push({
            name: selectFoodItem.name,
            price: selectFoodItem.price,
            image: selectFoodItem.image,
            quantity: currentQuantity
        });
    }
    localStorage.setItem("cart", JSON.stringify(cart));

    const cartBadge = document.getElementById("cart-badge");
    if (cartBadge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.textContent = totalItems;
    }
}

const addToCartBtn = document.getElementById("add-to-cart");
if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
        addToCard(currentSelectedFood);
        Toastify({
            text: `${currentSelectedFood.name} added to cart!`,
            duration: 3000,
            close: true,
            gravity: "bottom",
            position: "center",
            backgroundColor: "#f38600",
        }).showToast();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    fetchData();
    
});

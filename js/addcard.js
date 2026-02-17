
// Read cart from localStorage
let cart = JSON.parse(localStorage.getItem("cartItems")) || [];

// Elements
const cartCount = document.getElementById("cartCount");
const navCount = document.getElementById("count-Items"); // nav count
const cartContainer = document.querySelector("main section"); // cart page container

// total price
const subTotalEl = document.getElementById("subTotal");
const totalPriceEl = document.getElementById("totalPrice");

// Update count
function updateCount() {
  let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCount) cartCount.textContent = totalItems;
  if (navCount) navCount.textContent = totalItems;
}

// Add to Cart
const addButtons = document.querySelectorAll(".add-to-cart-btn");

addButtons.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    const productCard = event.target.closest(".product-card");
    if (!productCard) return;

    const title = productCard.querySelector("h2").textContent;
    const price = productCard.querySelectorAll("h2")[1].textContent;

    // Check if product already exists in cart
    const existingProduct = cart.find((p) => p.title === title);

    if (existingProduct) {
      // Increase quantity
      existingProduct.quantity++;
    } else {
      // Add new product with quantity 1
      cart.push({ title, price, quantity: 1 });
    }

    // Save to localStorage
    localStorage.setItem("cartItems", JSON.stringify(cart));

    // Update count in nav & cart
    updateCount();
    if (window.location.pathname.includes("card.html")) renderCart();
  });
});

//Render Items and Remove
function renderCart() {
  if (!cartContainer) return;

  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML =
      '<p class="text-center text-gray-500">Your cart is empty</p>';
    updateCount();
    calculateTotal();
    return;
  }

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "flex justify-between items-center border-b-2 py-4 mb-3";

    div.innerHTML = `
      <h2 class="font-medium">${item.title}</h2>
      <div class="flex items-center text-xl gap-5">
        <span>Total Items ${item.quantity} = ${item.price}</span>
        <button class="remove-btn" data-index="${index}"><i class="ri-close-large-line"></i></button>
      </div>
    `;

    cartContainer.appendChild(div);
  });

  updateCount();
  calculateTotal();

  // remove button
  const removeButtons = document.querySelectorAll(".remove-btn");
  removeButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idx = e.target.closest("button").dataset.index;
      cart.splice(idx, 1);
      localStorage.setItem("cartItems", JSON.stringify(cart));
      renderCart();
    });
  });
}

// Calculate Total
function calculateTotal() {
  let total = 0
  let subtotal = 0;

  cart.forEach((item) => {
    const priceNumber = parseFloat(item.price.replace(/[^\d.]/g, ""));
    total = 
    subtotal += priceNumber * item.quantity; // multiply by quantity
  });

  if (subTotalEl) subTotalEl.textContent = subtotal.toFixed(2);
  if (totalPriceEl) totalPriceEl.textContent = subtotal.toFixed(2);
}

// Initial render cart page
if (window.location.pathname.includes("card.html")) {
  renderCart();
}

// Initial count update
updateCount();
calculateTotal();

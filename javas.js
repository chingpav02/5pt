let products = [];
let cart = [];

const showProduct = document.getElementById('show-product');
const cartItemList = document.getElementById('cart-item-list');
const cartFooter = document.getElementById('cart-footer');
const cartCount = document.getElementById('cart-count');
const searchInput = document.getElementById('input-search');

// ១. ទាញទិន្នន័យពី API
fetch('https://api.escuelajs.co/api/v1/products')
    .then(res => res.json())
    .then(data => {
        products = data;
        displayProducts(products);
    })
    .catch(err => console.error("Error:", err));

// ================= បង្ហាញផលិតផល =================
function displayProducts(data) {
    showProduct.innerHTML = "";
    data.forEach(p => {
        showProduct.innerHTML += `
            <div class="col-12 col-sm-6 col-lg-3">
                <div class="card h-100 product-card shadow-sm">
                    <div class="card-img-container p-3">
                        <img src="${p.image}" alt="${p.title}">
                    </div>
                    <div class="card-body d-flex flex-column">
                        <p class="text-muted small mb-1">${p.category.toUpperCase()}</p>
                        <h6 class="fw-bold mb-2 text-truncate-2" style="height: 40px;">${p.title}</h6>
                        <div class="mt-auto">
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="fs-5 fw-bold text-primary">$${p.price}</span>
                                <button onclick="addToCart(${p.id})" class="btn btn-outline-primary btn-sm rounded-circle">
                                    <i class="bi bi-plus-lg"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

// ================= ស្វែងរក =================
searchInput.addEventListener("keyup", () => {
    const keyword = searchInput.value.toLowerCase();
    const filtered = products.filter(p => p.title.toLowerCase().includes(keyword));
    displayProducts(filtered);
});

// ================= បញ្ចូលក្នុងកន្ត្រក =================
function addToCart(id) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty++;
    } else {
        const p = products.find(i => i.id === id);
        cart.push({ ...p, qty: 1 });
    }
    updateCartUI();
    
    // លោតស្អាតៗ
    Swal.fire({
        toast: true, position: 'top-end', icon: 'success',
        title: 'បានបញ្ចូលទៅក្នុងកន្ត្រក!', showConfirmButton: false, timer: 1500
    });
}

// ================= UPDATE UI កន្ត្រក =================
function updateCartUI() {
    cartItemList.innerHTML = "";
    let total = 0;
    let totalQty = 0;

    if (cart.length === 0) {
        cartItemList.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-cart-x fs-1 text-muted"></i>
                <p class="mt-2 text-muted">មិនមានទំនិញក្នុងកន្ត្រកទេ</p>
            </div>`;
        cartFooter.innerHTML = "";
        cartCount.textContent = 0;
        return;
    }

    cart.forEach((item, index) => {
        total += item.price * item.qty;
        totalQty += item.qty;
        cartItemList.innerHTML += `
            <div class="d-flex align-items-center mb-3 p-2 bg-light rounded shadow-sm">
                <img src="${item.image}" class="cart-item-img">
                <div class="ms-3 flex-grow-1">
                    <h6 class="mb-0 small fw-bold">${item.title.substring(0, 20)}...</h6>
                    <small class="text-primary fw-bold">$${item.price}</small>
                    <div class="d-flex align-items-center gap-2 mt-1">
                        <button onclick="changeQty(${index}, -1)" class="btn btn-sm btn-white border px-2 py-0">-</button>
                        <span class="small fw-bold">${item.qty}</span>
                        <button onclick="changeQty(${index}, 1)" class="btn btn-sm btn-white border px-2 py-0">+</button>
                    </div>
                </div>
                <i onclick="removeItem(${index})" class="bi bi-trash text-danger ms-2 pointer"></i>
            </div>
        `;
    });

    cartFooter.innerHTML = `
        <div class="d-flex justify-content-between mb-3">
            <span class="fw-bold">Total:</span>
            <span class="fw-bold text-danger fs-5">$${total.toFixed(2)}</span>
        </div>
        <button class="btn btn-primary w-100 py-2 fw-bold rounded-pill shadow">CHECKOUT NOW</button>
    `;
    cartCount.textContent = totalQty;
}

function changeQty(idx, val) {
    cart[idx].qty += val;
    if (cart[idx].qty < 1) cart.splice(idx, 1);
    updateCartUI();
}

function removeItem(idx) {
    cart.splice(idx, 1);
    updateCartUI();
}
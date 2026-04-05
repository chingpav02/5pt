let products = [];
let cart = [];

const showProduct = document.getElementById('show-product');
const cartItemList = document.getElementById('cart-item-list');
const cartFooter = document.getElementById('cart-footer');
const cartCount = document.getElementById('cart-count');
const searchInput = document.getElementById('input-search');


// const limitedProducts = data.slice(0,20);
// displayProducts(limitedProducts);
// ✅ FIX 1: remove space before https
fetch('https://api.escuelajs.co/api/v1/products')
    .then(res => res.json())
    .then(data => {
        products = data.slice(0,20);
        displayProducts(products);
    })
    .catch(err => console.error("Error:", err));


// ================= DISPLAY PRODUCTS =================
function displayProducts(data) {
    showProduct.innerHTML = "";

    data.forEach(p => {
        showProduct.innerHTML += `
            <div class="col-12 col-sm-6 col-lg-3">
                <div class="card h-100 shadow-sm">
                    <div class="p-3 text-center">
                        <!-- ✅ FIX image -->
                        <img src="${p.images[0]}" 
                             style="height:180px;object-fit:contain;">
                    </div>

                    <div class="card-body d-flex flex-column">
                        <!-- ✅ FIX category -->
                        <p class="text-muted small mb-1">
                            ${p.category.name.toUpperCase()}
                        </p>

                        <h6 class="fw-bold mb-2">
                            ${p.title}
                        </h6>

                        <div class="mt-auto d-flex justify-content-between align-items-center">
                            <span class="fs-5 fw-bold text-primary">$${p.price}</span>

                            <button onclick="addToCart(${p.id})"
                                class="btn btn-outline-primary btn-sm rounded-circle">
                                add
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}


// ================= SEARCH =================
searchInput.addEventListener("keyup", () => {
    const keyword = searchInput.value.toLowerCase();

    const filtered = products.filter(p =>
        p.title.toLowerCase().includes(keyword)
    );

    displayProducts(filtered);
});


// ================= ADD TO CART =================
function addToCart(id) {
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.qty++;
    } else {
        const p = products.find(i => i.id === id);
        cart.push({ ...p, qty: 1 });
    }

    updateCartUI();

    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Added to cart!',
        showConfirmButton: false,
        timer: 1500
    });
}


// ================= UPDATE CART =================
function updateCartUI() {

    cartItemList.innerHTML = "";

    let total = 0;
    let totalQty = 0;

    if (cart.length === 0) {
        cartItemList.innerHTML = `
            <div class="text-center py-5">
                <p class="text-muted">Cart is empty</p>
            </div>
        `;
        cartFooter.innerHTML = "";
        cartCount.textContent = 0;
        return;
    }

    cart.forEach((item, index) => {

        total += item.price * item.qty;
        totalQty += item.qty;

        cartItemList.innerHTML += `
            <div class="d-flex align-items-center mb-3 p-2 bg-light rounded">
                
                <!-- ✅ FIX image -->
                <img src="${item.images[0]}" 
                     width="60" height="60"
                     style="object-fit:contain">

                <div class="ms-3 flex-grow-1">
                    <h6 class="small fw-bold">
                        ${item.title.substring(0,20)}...
                    </h6>

                    <small class="text-primary">$${item.price}</small>

                    <div class="d-flex gap-2 mt-1">
                        <button onclick="changeQty(${index},-1)" class="btn btn-sm border">-</button>
                        <span>${item.qty}</span>
                        <button onclick="changeQty(${index},1)" class="btn btn-sm border">+</button>
                    </div>
                </div>

                <button onclick="removeItem(${index})" 
                        class="btn btn-sm text-danger">
                        🗑
                </button>

            </div>
        `;
    });

    cartFooter.innerHTML = `
        <div class="d-flex justify-content-between mb-3">
            <span class="fw-bold">Total:</span>
            <span class="fw-bold text-danger fs-5">
                $${total.toFixed(2)}
            </span>
        </div>

        <button class="btn btn-primary w-100">
            CHECKOUT NOW
        </button>
    `;

    cartCount.textContent = totalQty;
}


// ================= CHANGE QTY =================
function changeQty(idx, val) {
    cart[idx].qty += val;

    if (cart[idx].qty < 1) {
        cart.splice(idx, 1);
    }

    updateCartUI();
}


// ================= REMOVE ITEM =================
function removeItem(idx) {
    cart.splice(idx, 1);
    updateCartUI();
}
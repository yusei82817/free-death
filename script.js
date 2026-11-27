const cart = [];
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartSummary = document.getElementById("cartSummary");

function renderCart() {
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartSummary.textContent = cart.reduce((sum, item) => sum + item.quantity, 0) + "点の商品";
  if (!cart.length) {
    cartItems.textContent = "カートに商品はありません。";
    return;
  }
  cartItems.innerHTML = "";
  cart.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "cart-row";
    const label = document.createElement("span");
    label.textContent = item.name + " × " + item.quantity;
    const remove = document.createElement("button");
    remove.textContent = "削除";
    remove.addEventListener("click", () => {
      cart.splice(index, 1);
      renderCart();
    });
    row.append(label, remove);
    cartItems.append(row);
  });
}

document.querySelectorAll(".add-cart").forEach(button => {
  button.addEventListener("click", () => {
    const card = button.closest(".product-card");
    const name = card.dataset.name || card.querySelector(".product-name").textContent;
    const existing = cart.find(item => item.name === name);
    if (existing) existing.quantity += 1;
    else cart.push({ name, quantity: 1 });
    renderCart();
    button.textContent = "追加しました";
    setTimeout(() => button.textContent = "カートに入れる", 900);
  });
});

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
searchForm.addEventListener("submit", event => {
  event.preventDefault();
  const query = searchInput.value.trim().toLowerCase();
  const cards = [...document.querySelectorAll(".product-card")];
  let visible = 0;
  cards.forEach(card => {
    const match = !query || card.textContent.toLowerCase().includes(query) || (card.dataset.name || "").toLowerCase().includes(query);
    card.hidden = !match;
    if (match) visible++;
  });
  document.getElementById("resultCount").textContent = query ? "検索結果：" + visible + "件" : "全商品を表示中";
  document.getElementById("all-products").scrollIntoView({ behavior: "smooth" });
});
searchInput.addEventListener("input", () => {
  if (!searchInput.value) {
    document.querySelectorAll(".product-card").forEach(card => card.hidden = false);
    document.getElementById("resultCount").textContent = "全商品を表示中";
  }
});

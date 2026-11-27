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
  const firstMatch = cards.find(card => !card.hidden);\n  if (firstMatch) firstMatch.scrollIntoView({ behavior: "smooth", block: "center" });
});
searchInput.addEventListener("input", () => {
  if (!searchInput.value) {
    document.querySelectorAll(".product-card").forEach(card => card.hidden = false);
    document.getElementById("resultCount").textContent = "全商品を表示中";
  }
});


// Press A + S + D together to enter fullscreen with a simulated browser frame.
(() => {
  const pressed = new Set();
  let entering = false;
  const keys = new Set(["a", "s", "d"]);
  window.addEventListener("keydown", async event => {
    const key = event.key.toLowerCase();
    if (!keys.has(key)) return;
    pressed.add(key);
    if (pressed.size === 3 && !entering && !document.fullscreenElement) {
      entering = true;
      try {
        await document.documentElement.requestFullscreen();
      } catch (error) {
        console.warn("Fullscreen could not be started:", error);
      } finally {
        entering = false;
      }
    }
  });
  window.addEventListener("keyup", event => pressed.delete(event.key.toLowerCase()));
  window.addEventListener("blur", () => pressed.clear());

  const address = document.getElementById("fakeAddress");
  document.getElementById("browserReload").addEventListener("click", () => location.reload());
  document.getElementById("browserHome").addEventListener("click", () => {
    window.scrollTo({top: 0, behavior: "smooth"});
    address.value = "https://shop.freedeath.jp/";
  });
  document.getElementById("browserBack").addEventListener("click", () => history.back());
  document.getElementById("browserForward").addEventListener("click", () => history.forward());
  address.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      address.blur();
    }
  });
})();

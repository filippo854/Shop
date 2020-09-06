import { CartApp } from './cart.js'
import { Storage } from './localStorage.js '

class Products {
  constructor() {
    this.productsDOM = document.querySelector('.products-center')
  }

  async loadProducts() {
    try {
      let result = await fetch('products.json')
      return result
    } catch (error) {
      console.log(error)
    }
  }

  displayProducts(productsList) {
    let result = ''
    productsList.map((product) => {
      result += `<!-- single product -->
        <article class="product">
          <div class="img-container">
            <img
              src=${product.image}
              alt="product"
              class="product-img"
            />
            <button class="bag-btn" data-id=${product.id}>
              <i class="fas fa-shopping-cart"></i>
              add to cart
            </button>
          </div>
          <h3>${product.title}</h3>
          <h4>${product.price} zł</h4>
        </article>
        <!-- single product -->`
    })
    this.productsDOM.innerHTML = result
  }
}
document.addEventListener('DOMContentLoaded', () => {
  const products = new Products()
  const cartApp = new CartApp()

  cartApp.openSiteSetupApp()

  products
    .loadProducts()
    .then((response) => response.json())
    .then((data) => {
      products.displayProducts(data)
      Storage.saveProductsList(data)
    })
    .then(() => {
      cartApp.getCartButtons()
      cartApp.cartLogic()
    })
})

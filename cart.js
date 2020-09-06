import { Storage } from './localStorage.js '

class CartApp {
  buttonsDOM = []
  cart = []

  constructor() {
    this.cartItems = document.querySelector('.cart-items')
    this.cartTotal = document.querySelector('.cart-total')
    this.cartContent = document.querySelector('.cart-content')
    this.cartDOM = document.querySelector('.cart')
    this.cartOverlay = document.querySelector('.cart-overlay')
    this.cartBtn = document.querySelector('.cart-btn')
    this.closeCartBtn = document.querySelector('.close-cart')
    this.clearCartBtn = document.querySelector('.clear-cart')
  }
  getCartButtons() {
    const buttons = [...document.querySelectorAll('.bag-btn')]
    this.buttonsDOM = buttons
    buttons.forEach((button) => {
      let id = button.dataset.id
      let inCart = this.cart.find((item) => item.id === id)
      if (inCart) {
        button.innerText = 'In Cart'
        button.disabled = true
      }
      button.addEventListener('click', (event) => {
        event.target.innerText = 'In Cart'
        event.target.disabled = true
        let cartItem = { ...Storage.getProduct(id), amount: 1 }
        this.cart = [...this.cart, cartItem]
        Storage.saveCart(this.cart)
        this.setCartValues(this.cart)
        this.addCartItem(cartItem)
        this.showCart()
      })
    })
  }
  setCartValues(cart) {
    let tempTotal = 0
    let itemsTotal = 0
    cart.forEach((item) => {
      tempTotal += item.price * item.amount
      itemsTotal += item.amount
    })
    this.cartTotal.innerText = parseFloat(tempTotal.toFixed(2))
    this.cartItems.innerText = itemsTotal
  }
  addCartItem(item) {
    const div = document.createElement('div')
    div.classList.add('cart-item')
    div.innerHTML = `<img src=${item.image} alt="product" />
            <div>
              <h4>${item.title}</h4>
              <h5>${item.price} zł</h5>
              <span class="remove-item" data-id=${item.id}>remove</span>
            </div>
            <div>
              <i class="fas fa-chevron-up" data-id=${item.id}></i>
              <p class="item-amount">${item.amount}</p>
              <i class="fas fa-chevron-down" data-id=${item.id}></i>
            </div>`
    this.cartContent.appendChild(div)
  }
  showCart() {
    this.cartOverlay.classList.add('transparentBcg')
    this.cartDOM.classList.add('showCart')
  }
  openSiteSetupApp() {
    this.cart = Storage.getCart()
    this.setCartValues(this.cart)
    this.loadCartItems(this.cart)
    this.cartBtn.addEventListener('click', () => {
      this.showCart()
    })
    this.closeCartBtn.addEventListener('click', () => {
      this.hideCart()
    })
  }
  loadCartItems(cart) {
    cart.forEach((item) => this.addCartItem(item))
  }
  hideCart() {
    this.cartOverlay.classList.remove('transparentBcg')
    this.cartDOM.classList.remove('showCart')
  }
  cartLogic() {
    this.clearCartBtn.addEventListener('click', () => {
      this.clearCart()
    })
    this.cartContent.addEventListener('click', (event) => {
      if (event.target.classList.contains('remove-item')) {
        let id = event.target.dataset.id
        this.removeItem(id)
        this.cartContent.removeChild(event.target.parentElement.parentElement)
      } else if (event.target.classList.contains('fa-chevron-up')) {
        let id = event.target.dataset.id
        let tempItem = this.cart.find((item) => item.id === id)
        tempItem.amount = tempItem.amount + 1
        Storage.saveCart(this.cart)
        this.setCartValues(this.cart)
        event.target.nextElementSibling.innerText = tempItem.amount
      } else if (event.target.classList.contains('fa-chevron-down')) {
        let id = event.target.dataset.id
        let tempItem = this.cart.find((item) => item.id === id)
        tempItem.amount = tempItem.amount - 1
        if (tempItem.amount > 0) {
          Storage.saveCart(this.cart)
          this.setCartValues(this.cart)
          event.target.previousElementSibling.innerText = tempItem.amount
        } else {
          this.cartContent.removeChild(event.target.parentElement.parentElement)
          this.removeItem(id)
        }
      }
    })
  }
  clearCart() {
    let cartItems = this.cart.map((item) => item.id)
    cartItems.forEach((id) => this.removeItem(id))
    while (this.cartContent.children.length > 0) {
      this.cartContent.removeChild(this.cartContent.children[0])
    }
    this.hideCart()
  }
  removeItem(id) {
    this.cart = this.cart.filter((item) => item.id !== id)
    this.setCartValues(this.cart)
    Storage.saveCart(this.cart)
    let button = this.getSingleButton(id)
    button.disabled = false
    button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to cart`
  }
  getSingleButton(id) {
    return this.buttonsDOM.find((button) => button.dataset.id === id)
  }
}

export { CartApp }

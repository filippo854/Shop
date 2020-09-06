class Storage {
  static saveProductsList(productsList) {
    localStorage.setItem('products', JSON.stringify(productsList))
  }
  static getProduct(id) {
    let productsList = JSON.parse(localStorage.getItem('products'))
    return productsList.find((product) => product.id === id)
  }

  static saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart))
  }

  static getCart() {
    return localStorage.getItem('cart')
      ? JSON.parse(localStorage.getItem('cart'))
      : []
  }
}

export { Storage }

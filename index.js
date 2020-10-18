const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)

/** Filtros*/

const pasaFiltroCategoria = (producto) => {
  const categoria = producto.dataset.category
  const filtroCategoria = $(`.category-filter[value="${categoria}"]`)

  return filtroCategoria.checked
}

const pasaFiltroReview = (producto) => {
  const review = producto.dataset.review
  const filtroReview = $(`.review-filter[value="${review}"]`)

  return filtroReview.checked
}

const pasaFiltroBusqueda = (producto) => {
  const nombre = producto.dataset.name
  const input = $('.search-input')

  return nombre.toLowerCase().includes(input.value.toLowerCase())
}

const hayCategoriaSeleccionada = () => {
  const filtros = $$('.category-filter')

  for (const filtro of filtros) {
    if (filtro.checked) {
      return true
    }
  }

  return false
}

const hayReviewSeleccionada = () => {
  const filtros = $$('.review-filter')

  for (const filtro of filtros) {
    if (filtro.checked) {
      return true
    }
  }

  return false
}

const hayBusqueda = () => {
  return $('.search-input').value.length !== 0
}

// cambiar nombre
const pasaFiltros = (producto) => {
  return (
    (pasaFiltroCategoria(producto) || !hayCategoriaSeleccionada()) &&
    (pasaFiltroReview(producto) || !hayReviewSeleccionada()) &&
    (pasaFiltroBusqueda(producto) || !hayBusqueda())
  )
}

const actualizarCantidadProductosFiltrados = () => {
  const productos = $$('.product')
  let cantidad = 0

  for (const producto of productos) {
    if (pasaFiltros(producto)) {
      cantidad++
    }
  }

  $(
    '.filtered-products-qty'
  ).innerText = `Mostrando ${cantidad} producto(s) de ${productos.length}`
}


const actualizarProductosFiltrados = () => {
  const productos = $$('.product')

  for (const producto of productos) {
    if (pasaFiltros(producto)) {
      producto.classList.remove('hidden')
    } else {
      producto.classList.add('hidden')
    }
  }
}

const filtrarProductos = () => {
  actualizarProductosFiltrados()
  actualizarCantidadProductosFiltrados()}

const limpiarFiltros = () => {
  const filtros = $$('.filter')

  for (const filtro of filtros) {
    filtro.checked = false
  }

  $('.search-input').value = ''

  filtrarProductos()
}

const abrirFiltros = () => {
  $('.filters').classList.add('open')
  $('.close-filters-btn').focus()
  mostrarOverlay()
  restringirFoco('.filters')
}

const cerrarFiltros = () => {
  $('.filters').classList.remove('open')
  $('.open-filters-btn').focus()
  ocultarOverlay()
  habilitarFoco()
}

/**Productos */

const mostrarGrilla = () => {
  $('.products').classList.remove('list')
  $('.products').classList.add('grid')
}

const mostrarLista = () => {
  $('.products').classList.remove('grid')
  $('.products').classList.add('list')
}

/* Carrito */

const mostrarOverlay = () => {
  $('body').classList.add('with-overlay')
  $('.overlay-sidebar').classList.remove('hidden')
}

const ocultarOverlay = () => {
  $('body').classList.remove('with-overlay')
  $('.overlay-sidebar').classList.add('hidden')
}

const abrirCarrito = () => {
  $('.cart').classList.add('open')
  $('.cart').setAttribute('aria-hidden', false)
  $('.open-cart-btn').setAttribute('aria-expanded', true)

  $('.close-cart-btn').focus()
  mostrarOverlay()
  restringirFoco('.cart')
}

const cerrarCarrito = () => {
  $('.cart').classList.remove('open')
  $('.cart').setAttribute('aria-hidden', true)
  $('.open-cart-btn').setAttribute('aria-expanded', false)

  $('.open-cart-btn').focus()
  ocultarOverlay()
  habilitarFoco()
}

const calcularSubtotal = () => {
  const productos = $$('.cart-product-added')
  let total = 0

  for (const producto of productos) {
    total += Number(producto.dataset.qty) * Number(producto.dataset.price)
  }

  return total
}

const actualizarCantidadCarrito = () => {
  const cantidad = $$('.cart-product-added').length
  $('.cart-products-qty').innerText = `${cantidad} producto(s) agregado(s)`
  $('.cart-qty').innerText = cantidad
}

const actualizarSubtotalCarrito = () => {
  const totalTexto = $('.cart-subtotal .value')
  totalTexto.innerText = `$${calcularSubtotal()}`
}

const mostrarProductosCarrito = () => {
  $('.cart-empty-message').classList.add('hidden')
  $('.cart-filled').classList.remove('hidden')
}

const mostrarCarritoVacio = () => {
  $('.cart-empty-message').classList.remove('hidden')
  $('.cart-filled').classList.add('hidden')
}

const actualizarCarrito = () => {
  const cantidadProductosEnCarrito = $$('.cart-product-added').length

  if (cantidadProductosEnCarrito) {
    mostrarProductosCarrito()
    actualizarSubtotalCarrito()
  } else {
    mostrarCarritoVacio()
  }

  actualizarCantidadCarrito()
}

const vaciarCarrito = () => {
  $('.cart-products-added').innerText = ''
  cerrarModal()
  actualizarCarrito()
}

const obtenerProductoEnCarrito = (id) => {
  const productosAgregados = $$('.cart-product-added')

  for (const producto of productosAgregados) {
    if (producto.dataset.id === id) {
      return producto
    }
  }
}

const obtenerPlantillaProductoAgregado = (id, nombre, precio, imagen) => {
  return `<article class="cart-product-added" data-id="${id}" data-qty="1" data-price=${precio}>
    <img src="${imagen}" alt="" class="cart-product-img" />
    <div class="cart-product-details">
      <div class="cart-product-info">
        <h3 class="cart-product-name">${nombre}</h3>
        <button type="button" class="remove-from-cart-btn"><i class="far fa-trash-alt"></i></button>
      </div>
      <div class="cart-product-price-qty">
        <label>
          <input type="number" min="0" value="1" class="cart-product-qty" />
          unidades
        </label>
        <p class="cart-product-price">x $${precio}</p>
      </div>
    </div>
  </article>`
}

const obtenerCantidadProducto = (id) => {
  const producto = obtenerProductoEnCarrito(id)
  if (producto) {
    return Number(producto.dataset.qty)
  } else {
    return 0
  }
}

const agregarAlCarrito = (evento) => {
  const producto = evento.target.closest('.product')

  if (!obtenerProductoEnCarrito(producto.dataset.id)) {
    const carrito = $('.cart-products-added')
    const plantilla = obtenerPlantillaProductoAgregado(
      producto.dataset.id,
      producto.dataset.name,
      producto.dataset.price,
      producto.dataset.image
    )
    carrito.innerHTML += plantilla
    actualizarCarrito()
  }
}

const removerDelCarrito = (evento) => {
  if (!evento.target.closest('.remove-from-cart-btn')) {
    return
  }

  const producto = evento.target.closest('.cart-product-added')
  producto.remove()
  actualizarCarrito()
}

const modificarCantidadProducto = (evento) => {
  if (!evento.target.classList.contains('cart-product-qty')) {
    return
  }

  const producto = evento.target.closest('.cart-product-added')
  const cantidad = Number(evento.target.value)

  producto.dataset.qty = cantidad

  actualizarCarrito()
}

/*Checkout */

const obtenerDescuento = (subtotal) => (subtotal * 10) / 100

const obtenerRecargo = (subtotal) => (subtotal * 10) / 100

const actualizarDescuento = () => {
  const tieneDescuento = $('input[name="discount"]').checked
  const subtotal = calcularSubtotal()

  if (tieneDescuento) {
    $('.cart-discount').classList.remove('hidden')
    $('.cart-discount-value').innerText = '$' + obtenerDescuento(subtotal)
  } else {
    $('.cart-discount').classList.add('hidden')
  }
}

const actualizarRecargo = () => {
  const metodoPago = $('input[type="radio"]:checked').value
  const subtotal = calcularSubtotal()

  if (metodoPago === 'credit') {
    $('.cart-tax').classList.remove('hidden')
    $('.cart-tax-value').innerText = '$' + obtenerRecargo(subtotal)
  } else {
    $('.cart-tax').classList.add('hidden')
  }
}

const actualizarEnvio = () => {
  const tieneEnvio = $('input[name="delivery"]').checked

  if (tieneEnvio) {
    $('.cart-delivery').classList.remove('hidden')
    $('.cart-delivery-value').innerText = '$' + 50
  } else {
    $('.cart-delivery').classList.add('hidden')
  }
}

const calcularTotal = () => {
  const metodoPago = $('input[type="radio"]:checked').value
  const tieneDescuento = $('input[name="discount"]').checked
  const tieneEnvio = $('input[name="delivery"]').checked
  const subtotal = calcularSubtotal()

  let total = subtotal

  if (tieneDescuento) {
    total -= obtenerDescuento(subtotal)
  }

  if (metodoPago === 'credit') {
    total += obtenerRecargo(subtotal)
  }

  if (tieneEnvio) {
    total += 50
  }

  return total
}

const actualizarTotalCheckout = () => {
  const subtotal = calcularSubtotal()

  actualizarDescuento()
  actualizarRecargo()
  actualizarEnvio()

  $('.cart-subtotal-value').innerText = '$' + subtotal
  $('.cart-total-value').innerText = '$' + calcularTotal()
}

/** Modales*/

const abrirModalConfirmacion = () => {
  restringirFoco('.modal-empty-cart')

  const modal = $('.modal-empty-cart')
  const overlay = $('.overlay')

  modal.classList.remove('hidden')
  overlay.classList.remove('hidden')
  modal.setAttribute('aria-hidden', false)

  $('.cancel-empty-cart-btn').focus()
}

const abrirModalCheckout = () => {
  restringirFoco('.checkout')
  actualizarTotalCheckout()

  const modal = $('.checkout')
  const overlay = $('.overlay')

  modal.classList.remove('hidden')
  overlay.classList.remove('hidden')
  modal.setAttribute('aria-hidden', false)

  $('.cancel-buy-btn').focus()
}

const cerrarModal = () => {
  const modal = $('.modal:not(.hidden)')
  const overlay = $('.overlay')

  modal.classList.add('hidden')
  overlay.classList.add('hidden')
  modal.setAttribute('aria-hidden', true)

  $('.close-cart-btn').focus()
  habilitarFoco()
}

/** Accesibilidad */

const deshabilitarFoco = (selectorPadre = 'body') => {
  const elementosConFoco = $(selectorPadre).querySelectorAll(
    'button, link, input'
  )
  for (let elemento of elementosConFoco) {
    elemento.tabIndex = -1
  }
}

const habilitarFoco = (selectorPadre = 'body') => {
  const elementosConFoco = $(selectorPadre).querySelectorAll(
    'button, link, input'
  )
  for (let elemento of elementosConFoco) {
    elemento.tabIndex = 0
  }
}

const restringirFoco = (selectorPadre = 'body') => {
  deshabilitarFoco()
  habilitarFoco(selectorPadre)
}

/*Inicializaciones */

const iniciarFiltros = () => {
  const filtros = $$('.filter')

  for (const filtro of filtros) {
    filtro.addEventListener('change', filtrarProductos)
  }
}
const iniciarAgregarAlCarrito = () => {
  const botones = $$('.add-to-cart-btn')

  for (const boton of botones) {
    boton.addEventListener('click', agregarAlCarrito)
  }
}

const iniciarBusqueda = () => {
  const input = $('.search-input')
  input.addEventListener('input', filtrarProductos)
}

const iniciarCheckout = () => {
  const opciones = $$('.checkout input')

  for (const opcion of opciones) {
    opcion.addEventListener('change', actualizarTotalCheckout)
  }
}

const iniciar = () => {
  iniciarFiltros()
  iniciarAgregarAlCarrito()
  iniciarBusqueda()
  iniciarCheckout()

  $('.open-filters-btn').addEventListener('click', abrirFiltros)
  $('.close-filters-btn').addEventListener('click', cerrarFiltros)
  $('.filters-clear-btn').addEventListener('click', limpiarFiltros)
  $('.show-grid-btn').addEventListener('click', mostrarGrilla)
  $('.show-list-btn').addEventListener('click', mostrarLista)
  $('.cart-empty-btn').addEventListener('click', abrirModalConfirmacion)
  $('.confirm-cart-empty-btn').addEventListener('click', vaciarCarrito)
  $('.open-cart-btn').addEventListener('click', abrirCarrito)
  $('.close-cart-btn').addEventListener('click', cerrarCarrito)
  $('.buy-btn').addEventListener('click', abrirModalCheckout)
  $('.cancel-empty-cart-btn').addEventListener('click', cerrarModal)
  $('.cancel-buy-btn').addEventListener('click', cerrarModal)

  document.addEventListener('click', removerDelCarrito)
  document.addEventListener('change', modificarCantidadProducto)

  actualizarCantidadProductosFiltrados()
  deshabilitarFoco('.cart')
}

window.onload = iniciar

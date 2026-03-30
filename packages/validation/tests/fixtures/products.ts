/**
 * Fixtures de Produtos para Testes.
 *
 * @packageDocumentation
 * Dados de teste reutilizáveis para cenários de validação de produtos/e-commerce.
 */

/**
 * Produto válido para testes.
 */
export const validProduct = {
  id: 1,
  name: 'Product Name',
  description: 'Product description here',
  price: 99.99,
  quantity: 10,
  category: 'electronics',
  tags: ['tech', 'gadget'],
  images: ['https://example.com/image1.jpg'],
  active: true,
};

/**
 * Produto inválido para testes.
 */
export const invalidProduct = {
  id: 'not-a-number',
  name: '',
  description: '',
  price: -10,
  quantity: -5,
  category: '',
  tags: 'not-array',
  images: ['not-url'],
  active: 'not-boolean',
};

/**
 * Produto com dados faltantes.
 */
export const incompleteProduct = {
  id: 1,
  name: 'Product',
  // price missing
  // quantity missing
};

/**
 * Dados de criação de produto válidos.
 */
export const validCreateProduct = {
  name: 'New Product',
  description: 'Description',
  price: 49.99,
  quantity: 5,
  category: 'books',
};

/**
 * Dados de criação de produto inválidos.
 */
export const invalidCreateProduct = {
  name: '',
  description: '',
  price: 0,
  quantity: -1,
  category: '',
};

/**
 * Dados de update de produto válidos.
 */
export const validUpdateProduct = {
  name: 'Updated Product',
  price: 59.99,
  quantity: 20,
};

/**
 * Item de carrinho válido.
 */
export const validCartItem = {
  productId: 1,
  quantity: 2,
  price: 99.99,
};

/**
 * Item de carrinho inválido.
 */
export const invalidCartItem = {
  productId: 'not-number',
  quantity: 0,
  price: -10,
};

/**
 * Carrinho de compras válido.
 */
export const validCart = {
  userId: 1,
  items: [validCartItem],
  total: 199.98,
};

/**
 * Pedido válido.
 */
export const validOrder = {
  id: 1,
  userId: 1,
  items: [
    { productId: 1, quantity: 2, price: 99.99 },
    { productId: 2, quantity: 1, price: 49.99 },
  ],
  shippingAddress: {
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA',
  },
  paymentMethod: 'credit_card',
  status: 'pending',
};

/**
 * Pedido inválido.
 */
export const invalidOrder = {
  id: 'not-number',
  userId: 'not-number',
  items: [],
  shippingAddress: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  },
  paymentMethod: '',
  status: '',
};

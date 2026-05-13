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
    active: true,
    category: "electronics",
    description: "Product description here",
    id: 1,
    images: ["https://example.com/image1.jpg"],
    name: "Product Name",
    price: 99.99,
    quantity: 10,
    tags: ["tech", "gadget"],
};

/**
 * Produto inválido para testes.
 */
export const invalidProduct = {
    active: "not-boolean",
    category: "",
    description: "",
    id: "not-a-number",
    images: ["not-url"],
    name: "",
    price: -10,
    quantity: -5,
    tags: "not-array",
};

/**
 * Produto com dados faltantes.
 */
export const incompleteProduct = {
    id: 1,
    name: "Product",
    // price missing
    // quantity missing
};

/**
 * Dados de criação de produto válidos.
 */
export const validCreateProduct = {
    category: "books",
    description: "Description",
    name: "New Product",
    price: 49.99,
    quantity: 5,
};

/**
 * Dados de criação de produto inválidos.
 */
export const invalidCreateProduct = {
    category: "",
    description: "",
    name: "",
    price: 0,
    quantity: -1,
};

/**
 * Dados de update de produto válidos.
 */
export const validUpdateProduct = {
    name: "Updated Product",
    price: 59.99,
    quantity: 20,
};

/**
 * Item de carrinho válido.
 */
export const validCartItem = {
    price: 99.99,
    productId: 1,
    quantity: 2,
};

/**
 * Item de carrinho inválido.
 */
export const invalidCartItem = {
    price: -10,
    productId: "not-number",
    quantity: 0,
};

/**
 * Carrinho de compras válido.
 */
export const validCart = {
    items: [validCartItem],
    total: 199.98,
    userId: 1,
};

/**
 * Pedido válido.
 */
export const validOrder = {
    id: 1,
    items: [
        { price: 99.99, productId: 1, quantity: 2 },
        { price: 49.99, productId: 2, quantity: 1 },
    ],
    paymentMethod: "credit_card",
    shippingAddress: {
        city: "New York",
        country: "USA",
        state: "NY",
        street: "123 Main St",
        zipCode: "10001",
    },
    status: "pending",
    userId: 1,
};

/**
 * Pedido inválido.
 */
export const invalidOrder = {
    id: "not-number",
    items: [],
    paymentMethod: "",
    shippingAddress: {
        city: "",
        country: "",
        state: "",
        street: "",
        zipCode: "",
    },
    status: "",
    userId: "not-number",
};

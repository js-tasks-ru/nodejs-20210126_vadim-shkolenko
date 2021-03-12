module.exports = function mapOrder(order) {
  return {
    id: order._id,
    user: order.user,
    product: {
      id: order.product._id,
      title: order.product.title,
      images: order.product.image,
      category: order.product.category,
      subcategory: order.product.subcategory,
      price: order.product.price,
      description: order.product.description,
    },
    phone: order.phone,
    address: order.address,
  };
};

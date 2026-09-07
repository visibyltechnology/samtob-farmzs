export const productData = {
  flashSale: [],
  featured: [],
  newArrivals: []
};

export const allProducts = [
  ...productData.flashSale,
  ...productData.featured,
  ...productData.newArrivals
];

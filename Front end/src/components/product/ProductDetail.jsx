import React from 'react';

const SingleProduct = ({ product }) => {
  return (
    <div className="single-product">
      <h2>{product.name}</h2>
      <p>Description: {product.description}</p>
      <p>Price: ${product.price}</p>
      <button>Add to Cart</button>
    </div>
  );
};

export default SingleProduct;

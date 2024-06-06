// ProductDetail.jsx
import React from 'react';

const ProductDetail = ({ product }) => {
    return (
        <div>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <button>Add to Cart</button>
        </div>
    );
};

export default ProductDetail;

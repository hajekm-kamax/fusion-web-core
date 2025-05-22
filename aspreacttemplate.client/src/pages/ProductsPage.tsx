
import React from 'react';

const ProductsPage = () => {
  return (
    <div className="container p-4">
      <h1>Products</h1>
      <p className="lead">Manage your product inventory and categories.</p>
      
      <div className="card mt-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Product Catalog</h5>
          <button className="btn btn-primary btn-sm">Add Product</button>
        </div>
        <div className="card-body">
          <div className="row">
            {[1, 2, 3, 4, 5, 6].map((product) => (
              <div className="col-md-4 mb-4" key={product}>
                <div className="card h-100">
                  <div className="bg-light" style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="bi bi-box text-secondary" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">Product Name {product}</h5>
                    <p className="card-text text-muted">Category: Electronics</p>
                    <p className="card-text fw-bold">${(19.99 * product).toFixed(2)}</p>
                    <p className="card-text">
                      <span className={`badge ${product % 2 === 0 ? 'bg-success' : 'bg-danger'}`}>
                        {product % 2 === 0 ? 'In Stock' : 'Low Stock'}
                      </span>
                    </p>
                  </div>
                  <div className="card-footer d-flex justify-content-between">
                    <button className="btn btn-sm btn-outline-primary">Edit</button>
                    <button className="btn btn-sm btn-outline-danger">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;

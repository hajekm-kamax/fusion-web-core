
import React from 'react';

const OrdersPage = () => {
  return (
    <div className="container p-4">
      <h1>Orders</h1>
      <p className="lead">Manage customer orders and track shipments.</p>
      
      <div className="card mt-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Recent Orders</h5>
          <button className="btn btn-primary btn-sm">New Order</button>
        </div>
        <div className="card-body">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#ORD-1234</td>
                <td>John Smith</td>
                <td>2025-05-20</td>
                <td>$128.50</td>
                <td><span className="badge bg-success">Completed</span></td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-1">View</button>
                  <button className="btn btn-sm btn-outline-secondary">Edit</button>
                </td>
              </tr>
              <tr>
                <td>#ORD-1235</td>
                <td>Sarah Johnson</td>
                <td>2025-05-20</td>
                <td>$75.00</td>
                <td><span className="badge bg-warning text-dark">Processing</span></td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-1">View</button>
                  <button className="btn btn-sm btn-outline-secondary">Edit</button>
                </td>
              </tr>
              <tr>
                <td>#ORD-1236</td>
                <td>Robert Davis</td>
                <td>2025-05-19</td>
                <td>$220.99</td>
                <td><span className="badge bg-info">Shipped</span></td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-1">View</button>
                  <button className="btn btn-sm btn-outline-secondary">Edit</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;

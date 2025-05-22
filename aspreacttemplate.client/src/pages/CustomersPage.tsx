
import React from 'react';

const CustomersPage = () => {
  return (
    <div className="container p-4">
      <h1>Customers</h1>
      <p className="lead">Manage and view your customer base.</p>
      
      <div className="card mt-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Customer List</h5>
          <button className="btn btn-primary btn-sm">Add Customer</button>
        </div>
        <div className="card-body">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#CUST-1001</td>
                <td>John Smith</td>
                <td>john.smith@example.com</td>
                <td>(555) 123-4567</td>
                <td><span className="badge bg-success">Active</span></td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-1">View</button>
                  <button className="btn btn-sm btn-outline-secondary">Edit</button>
                </td>
              </tr>
              <tr>
                <td>#CUST-1002</td>
                <td>Sarah Johnson</td>
                <td>sarah.j@example.com</td>
                <td>(555) 987-6543</td>
                <td><span className="badge bg-success">Active</span></td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-1">View</button>
                  <button className="btn btn-sm btn-outline-secondary">Edit</button>
                </td>
              </tr>
              <tr>
                <td>#CUST-1003</td>
                <td>Robert Davis</td>
                <td>robert.d@example.com</td>
                <td>(555) 456-7890</td>
                <td><span className="badge bg-warning text-dark">Pending</span></td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-1">View</button>
                  <button className="btn btn-sm btn-outline-secondary">Edit</button>
                </td>
              </tr>
              <tr>
                <td>#CUST-1004</td>
                <td>Emily Wilson</td>
                <td>emily.w@example.com</td>
                <td>(555) 234-5678</td>
                <td><span className="badge bg-danger">Inactive</span></td>
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

export default CustomersPage;

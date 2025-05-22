
import React from 'react';

const DashboardPage = () => {
  return (
    <div className="container p-4">
      <h1>Dashboard</h1>
      <p className="lead">View your analytics and performance metrics here.</p>
      
      <div className="row mt-4">
        <div className="col-md-3 mb-4">
          <div className="card text-white bg-primary">
            <div className="card-body">
              <h5 className="card-title">Total Sales</h5>
              <h2 className="display-4">$12,564</h2>
              <p className="card-text"><i className="bi bi-arrow-up"></i> 12.5% from last month</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-4">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h5 className="card-title">New Customers</h5>
              <h2 className="display-4">120</h2>
              <p className="card-text"><i className="bi bi-arrow-up"></i> 8.2% from last month</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-4">
          <div className="card text-white bg-warning">
            <div className="card-body">
              <h5 className="card-title">Pending Orders</h5>
              <h2 className="display-4">45</h2>
              <p className="card-text"><i className="bi bi-arrow-down"></i> 3.1% from last month</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-4">
          <div className="card text-white bg-info">
            <div className="card-body">
              <h5 className="card-title">Support Tickets</h5>
              <h2 className="display-4">15</h2>
              <p className="card-text"><i className="bi bi-dash"></i> Same as last month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

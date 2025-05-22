
import React from 'react';

const HomePage = () => {
  return (
    <div className="container p-4">
      <h1>Home Page</h1>
      <p className="lead">Welcome to the Corporate Application Template</p>
      <div className="alert alert-info">
        This is the home page of your application. Customize this content according to your needs.
      </div>
      <div className="row mt-5">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Feature One</h5>
              <p className="card-text">Some quick example text to build on the feature and make up the bulk of the content.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Feature Two</h5>
              <p className="card-text">Some quick example text to build on the feature and make up the bulk of the content.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Feature Three</h5>
              <p className="card-text">Some quick example text to build on the feature and make up the bulk of the content.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;


import React from 'react';

const TestPage = () => {
  return (
    <div className="container p-4">
          <h1>Test Page</h1>
      +��������
      <p className="lead">This is a test page to demonstrate routing in your application.</p>
      <div className="alert alert-secondary">
        You can use this page as a template for creating additional pages.
      </div>

      <div className="mt-4">
        <h3>Sample Form</h3>
        <form>
          <div className="mb-3">
            <label htmlFor="inputName" className="form-label">Name</label>
            <input type="text" className="form-control" id="inputName" placeholder="Enter name" />
          </div>
          <div className="mb-3">
            <label htmlFor="inputEmail" className="form-label">Email</label>
            <input type="email" className="form-control" id="inputEmail" placeholder="Enter email" />
          </div>
          <div className="mb-3">
            <label htmlFor="inputMessage" className="form-label">Message</label>
            <textarea className="form-control" id="inputMessage" rows={3}></textarea>
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default TestPage;

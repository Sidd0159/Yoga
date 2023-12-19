// PersonForm.js

import React, { useState } from 'react';

const PersonForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    contactNumber: '',
    selectedBatch: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic client-side validation
    if (!formData.firstName || !formData.lastName || !formData.age || !formData.contactNumber || !formData.selectedBatch) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      // Make a call to the REST API
      const response = await fetch('http://your-api-endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Enrollment successful!');
        // You might want to redirect or perform other actions upon successful enrollment
      } else {
        alert('Enrollment failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during enrollment:', error);
      alert('Something went wrong. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        First Name:
        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
      </label>
      <br />
      <label>
        Last Name:
        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
      </label>
      <br />
      <label>
        Age:
        <input type="number" name="age" value={formData.age} onChange={handleChange} />
      </label>
      <br />
      <label>
        Contact Number:
        <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
      </label>
      <br />
      <label>
        Select Batch:
        <select name="selectedBatch" value={formData.selectedBatch} onChange={handleChange}>
          <option value="">Select Batch</option>
          <option value="6-7AM">6-7AM</option>
          <option value="7-8AM">7-8AM</option>
          <option value="8-9AM">8-9AM</option>
          <option value="5-6PM">5-6PM</option>
        </select>
      </label>
      <br />
      <button type="submit">Enroll</button>
    </form>
  );
};

export default PersonForm;

const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3001;

app.use(bodyParser.json());

// Create and initialize SQLite database
const db = new sqlite3.Database(':memory:'); // For simplicity, using in-memory database

db.serialize(() => {
    CREATE TABLE Person (
        PersonID INT PRIMARY KEY,
        FirstName VARCHAR(255),
        LastName VARCHAR(255),
        Age INT CHECK (Age BETWEEN 18 AND 65),
        ContactNumber VARCHAR(20)
    );
    
    CREATE TABLE Payment (
        PaymentID INT PRIMARY KEY,
        PersonID INT,
        PaymentDate DATE,
        Amount DECIMAL(10, 2) DEFAULT 500.00,
        FOREIGN KEY (PersonID) REFERENCES Person(PersonID)
    );
    
    CREATE TABLE Enrollment (
        EnrollmentID INT PRIMARY KEY,
        PersonID INT,
        Month VARCHAR(20),
        Batch VARCHAR(20),
        FOREIGN KEY (PersonID) REFERENCES Person(PersonID)
    );
    db.run('CREATE TABLE Person (PersonID INTEGER PRIMARY KEY, FirstName TEXT, LastName TEXT, Age INTEGER, ContactNumber TEXT)');
    db.run('CREATE TABLE Enrollment (EnrollmentID INTEGER PRIMARY KEY, PersonID INTEGER, Month TEXT, Batch TEXT, FOREIGN KEY (PersonID) REFERENCES Person(PersonID))');
});

// Mock function for completing payment
const CompletePayment = (personID, paymentDetails) => {
  // Assume this function performs the necessary actions for completing a payment
  // For demonstration purposes, let's assume the payment is successful
  console.log(`Processing payment for PersonID ${personID}:`, paymentDetails);
  return { success: true, message: 'Payment successful' };
};

app.post('/api/enroll', async (req, res) => {
  const { firstName, lastName, age, contactNumber, selectedBatch } = req.body;

  // Basic server-side validation
  if (!firstName || !lastName || !age || !contactNumber || !selectedBatch) {
    return res.status(400).json({ error: 'Please provide all required fields.' });
  }

  // Insert person data
  const insertPerson = db.prepare('INSERT INTO Person (FirstName, LastName, Age, ContactNumber) VALUES (?, ?, ?, ?)');
  const person = [firstName, lastName, age, contactNumber];
  const personID = insertPerson.run(person).lastID;
  insertPerson.finalize();

  // Insert enrollment data
  const insertEnrollment = db.prepare('INSERT INTO Enrollment (PersonID, Month, Batch) VALUES (?, ?, ?)');
  const enrollment = [personID, 'January', selectedBatch]; // For simplicity, using 'January' as the month
  insertEnrollment.run(enrollment);
  insertEnrollment.finalize();

  // Mock payment details
  const paymentDetails = {
    amount: 500.00, // Assuming a fixed amount for the Yoga class
    paymentMethod: 'Credit Card', // You can modify this based on your needs
  };

  try {
    // Mock call to CompletePayment() function
    const paymentResponse = CompletePayment(personID, paymentDetails);

    res.status(201).json({ message: 'Enrollment and payment successful!', personID, paymentResponse });
  } catch (error) {
    console.error('Error during payment:', error);
    res.status(500).json({ error: 'Payment failed. Please try again.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Auth } from 'aws-amplify';
import './App.css';

const API_URL = 'https://fisguuol3h.execute-api.us-east-1.amazonaws.com/';

const Database = () => {
  const [employees, setEmployees] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [department, setDepartment] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [searchEmpId, setSearchEmpId] = useState('');
  const [searchedEmployee, setSearchedEmployee] = useState(null);

  // New state for the update form
  const [updateEmployeeId, setUpdateEmployeeId] = useState('');
  const [updateFirstName, setUpdateFirstName] = useState('');
  const [updateLastName, setUpdateLastName] = useState('');
  const [updateDepartment, setUpdateDepartment] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleLogout = async () => {
    try {
      await Auth.signOut();
      console.log('User logged out successfully');
      // Optionally, you can add a redirect or perform other actions after successful logout
    } catch (error) {
      console.log('Error signing out:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${API_URL}/getAllEmp`);
      const sortedEmployees = response.data.Items.sort((a, b) => a.emp_ID - b.emp_ID);
      setEmployees(sortedEmployees);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const newEmployee = {
        first_name: firstName,
        last_name: lastName,
        department: department,
      };

      await axios.post(`${API_URL}/saveEmp`, newEmployee);
      alert('Employee added successfully');

      // Clear the form fields after successful submission
      setFirstName('');
      setLastName('');
      setDepartment('');

      // Fetch updated employee list
      fetchEmployees();

      window.location.reload();
    } catch (error) {
      console.error('Error submitting data:', error);
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      await axios.delete(`${API_URL}/deleteeEmp?emp_ID=${employeeId}`);
      alert('Employee deleted successfully');

      // Fetch updated employee list
      fetchEmployees();

      window.location.reload();
    } catch (error) {
      console.error('Error deleting employee:', error);
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();

    try {
      const updatedEmployee = {
        first_name: updateFirstName,
        last_name: updateLastName,
        department: updateDepartment,
      };

      await axios.put(`${API_URL}/modifyEmp?emp_ID=${updateEmployeeId}&first_name=${updateFirstName}&last_name=${updateLastName}&department=${updateDepartment}`);
      alert('Employee updated successfully');

      // Clear the update form fields after successful update
      setUpdateEmployeeId('');
      setUpdateFirstName('');
      setUpdateLastName('');
      setUpdateDepartment('');

      // Fetch updated employee list
      fetchEmployees();

      window.location.reload();
    } catch (error) {
      console.error('Error updating employee:', error);
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!searchEmpId) {
        alert('Please enter an emp_ID to search.');
        return;
      }

      const response = await axios.get(`${API_URL}/getEmp?emp_ID=${searchEmpId}`);
      setSearchedEmployee(response.data.Item);
      setErrorMessage('');

      
    } catch (error) {
      console.error('Error fetching data:', error);
      setSearchedEmployee(null); // Reset the searched employee data
      setErrorMessage('Employee not found with the provided emp_ID.');
    }
  };

  const handleClearSearch = () => {
    setSearchEmpId('');
    setSearchedEmployee(null);
  };

  return (
    <div>
        <button onClick={handleLogout}>Logout</button>
      <h1>Employee List</h1>
      <div className='searchbar'>
        <p>Search Employee by emp_ID</p>
        <form onSubmit={handleSearchSubmit}>
          <label>
            emp_ID:
            <input
              type="text"
              value={searchEmpId}
              onChange={(e) => setSearchEmpId(e.target.value)}
            />
          </label>
          <button type="submit">Search</button>
          {searchedEmployee && (
            <button type="button" onClick={handleClearSearch}>
              Clear Search
            </button>
          )}
        </form>
      </div>
      {searchedEmployee ? (
        <table className="employee-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr key={searchedEmployee.emp_ID}>
              <td>{searchedEmployee.emp_ID}</td>
              <td>{searchedEmployee.first_name}</td>
              <td>{searchedEmployee.last_name}</td>
              <td>{searchedEmployee.department}</td>
              <td>
                <button onClick={() => handleDeleteEmployee(searchedEmployee.emp_ID)}>Delete</button>
                <button onClick={() => {
                  setUpdateEmployeeId(searchedEmployee.emp_ID);        // Set employee ID for update
                  setUpdateFirstName(searchedEmployee.first_name);     // Populate update form with existing data
                  setUpdateLastName(searchedEmployee.last_name);       // Populate update form with existing data
                  setUpdateDepartment(searchedEmployee.department);   // Populate update form with existing data
                }}>
                  Update
                </button>
              </td>
            </tr>
          </tbody>
          <div className="updateForm">
              <h2>Update Employee</h2>
              <form onSubmit={handleUpdateEmployee}>
                <label>
                  First Name:
                  <input
                    type="text"
                    value={updateFirstName}
                    onChange={(e) => setUpdateFirstName(e.target.value)}
                  />
                </label>
                <br />
                <label>
                  Last Name:
                  <input
                    type="text"
                    value={updateLastName}
                    onChange={(e) => setUpdateLastName(e.target.value)}
                  />
                </label>
                <br />
                <label>
                  Department:
                  <select
                    value={updateDepartment}
                    onChange={(e) => setUpdateDepartment(e.target.value)}
                  >
                    <option value="">Select Department</option>
                    <option value="IT">IT</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operations">Operations</option>
                  </select>
                </label>
                <br />
                <button type="submit">Update Employee</button>
              </form>
            </div>
        </table>
        
      ) : (
        <div>
          
          <table className="employee-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.emp_ID}>
                  <td>{employee.emp_ID}</td>
                  <td>{employee.first_name}</td>
                  <td>{employee.last_name}</td>
                  <td>{employee.department}</td>
                  <td>
                    <button onClick={() => handleDeleteEmployee(employee.emp_ID)}>Delete</button>
                    <button
                      onClick={() => {
                        setUpdateEmployeeId(employee.emp_ID); // Set employee ID for update
                        setUpdateFirstName(employee.first_name); // Populate update form with existing data
                        setUpdateLastName(employee.last_name); // Populate update form with existing data
                        setUpdateDepartment(employee.department); // Populate update form with existing data
                      }}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className='Fullform'>
            <div className="updateForm">
              <h2>Update Employee</h2>
              <form onSubmit={handleUpdateEmployee}>
                <label>
                  First Name:
                  <input
                    type="text"
                    value={updateFirstName}
                    onChange={(e) => setUpdateFirstName(e.target.value)}
                  />
                </label>
                <br />
                <label>
                  Last Name:
                  <input
                    type="text"
                    value={updateLastName}
                    onChange={(e) => setUpdateLastName(e.target.value)}
                  />
                </label>
                <br />
                <label>
                  Department:
                  <select
                    value={updateDepartment}
                    onChange={(e) => setUpdateDepartment(e.target.value)}
                  >
                    <option value="">Select Department</option>
                    <option value="IT">IT</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operations">Operations</option>
                  </select>
                </label>
                <br />
                <button type="submit">Update Employee</button>
              </form>
            </div>
            <div className='newForm'>
              <h2>Add New Employee</h2>
              <form onSubmit={handleFormSubmit}>
                <label>
                  First Name:
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </label>
                <br />
                <label>
                  Last Name:
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </label>
                <br />
                <label>
                  Department:
                  <select value={department} onChange={(e) => setDepartment(e.target.value)}>
                    <option value="">Select Department</option>
                    <option value="IT">IT</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operations">Operations</option>
                  </select>
                </label>
                <br />
                <button type="submit">Add Employee</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Database;
const mySql = require('mysql2');

const connection = mySql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Luhar2024!!',
    database: 'employee_management',
});
connection.connect(err => {
    if (err) {
      console.error('Error connecting to the database:', err.message);
      return;
    }
    console.log('Connected to the MySQL database');
  });


// *************************************  getEmployees API *********************************************

const getEmployees = async (req,res,next) => {
    try {
        const data = await connection.promise().query(
          `SELECT e.empID, e.empFirstName, e.empMiddleName, e.empLastName, e.empEmail, e.empDOB, e.empJobTitle,
              d.deptName,
              a.addressLine1, a.addressLine2, a.city, a.state, a.zip, a.emContact, a.emPhone, a.homePhone
                FROM employee e
                JOIN department d ON e.deptID = d.deptID
                JOIN employee_address a ON e.empID = a.empID;`
        );
        res.status(202).json({
          employee: data[0],
        });
      } catch (err) {
        res.status(500).json({
          message: err.message || "An error occurred while fetching the employees",
        });
      }
};

// *************************************  getEmployeeByID API *********************************************

const getEmployeesByID = async (req, res, next) => {
  const empId = req.params.eid;
  try {
    const data = await connection.promise().query(
      `SELECT e.empID, e.empFirstName, e.empMiddleName, e.empLastName, e.empEmail, e.empDOB, e.empJobTitle,
          d.deptName,
          a.addressLine1, a.addressLine2, a.city, a.state, a.zip, a.emContact, a.emPhone, a.homePhone
            FROM employee e
            JOIN department d ON e.deptID = d.deptID
            JOIN employee_address a ON e.empID = a.empID
            WHERE e.empID = ?;`, [empId]
    );

    if (data.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({
      employee: data[0],
    });

  } catch (err) {
    res.status(500).json({
      message: err.message || "An error occurred while fetching the employee details",
    });
  } 

};

//  *************************************  create API *********************************************
const createEmployee = async (req, res, next) => {
    try{
        const { deptName, empFirstName, empMiddleName, empLastName, empEmail, empDOB, empJobTitle,
                addressLine1, addressLine2, city, state, zip, emContact, emPhone, homePhone
         } = req.body;

        connection.beginTransaction((err) => {
            if (err) throw err;
    
            const insertDepartment = `INSERT INTO department (deptName) VALUES (?)`;
            connection.query(insertDepartment, [deptName], (err, result) => {
                if(err) {
                    return connection.rollback(() => {
                        throw err;
                    });
                }

                const deptID = result.insertId;
                console.log("departmentId.."+deptID);
            
            
            const insertEmployee = `INSERT INTO employee (
                                        empFirstName, empMiddleName, empLastName, empEmail, empDOB, empJobTitle, deptID) 
                                        VALUES (?, ?, ?, ?, ?, ?, ?)`;
                connection.query(
                    insertEmployee, [empFirstName, empMiddleName, empLastName, empEmail, empDOB, empJobTitle, deptID], 
                        (err, result) => {
                    if (err) {
                        return connection.rollback(() => {
                            throw err;
                        });
                    }
    
                const empID = result.insertId;
                console.log("employeeId.."+empID);
    
                const insertAddress = `INSERT INTO employee_address (
                                        addressLine1, addressLine2, city, state, 
                                        zip, emContact, emPhone, homePhone, empID) 
                                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                connection.query(insertAddress, [addressLine1, addressLine2, city, state, 
                    zip, emContact, emPhone, homePhone, empID], (err, result) => {
                    if (err) {
                        return connection.rollback(() => {
                            throw err;
                        });
                    }
    
                    connection.commit((err) => {
                        if (err) {
                            return connection.rollback(() => {
                                throw err;
                            });
                        }
                        res.status(201).json({
                          message: 'Employee created successfully',
                          employee: {
                            empID,
                            empFirstName,
                            empMiddleName,
                            empLastName,
                            empEmail,
                            empDOB,
                            empJobTitle,
                            deptName,
                            address: {
                              addressLine1,
                              addressLine2,
                              city,
                              state,
                              zip,
                              emContact,
                              emPhone,
                              homePhone,
                            },
                          },
                        });
                    });
                });
            });

        })

        });

        } catch (err) {
            await connection.promise().rollback();
            res.status(500).json({
            message: err.message || "An error occurred while creating the employee",
          });
        }
    };


    // *************************************  update API *********************************************

    const updateEmployee = async (req, res, next) => {
        const empID  = req.params.eid;
        const { deptName, empFirstName, empMiddleName, empLastName, empEmail, empDOB, empJobTitle,
                addressLine1, addressLine2, city, state, zip, emContact, emPhone, homePhone } = req.body;
      
        try {
          connection.beginTransaction((err) => {
            if (err) throw err;
      
            // Update the department first
            const updateDepartment = `UPDATE department d
                                      JOIN employee e ON e.deptID = d.deptID
                                      SET d.deptName = ?
                                      WHERE e.empID = ?`;
            connection.query(updateDepartment, [deptName, empID], (err, result) => {
              if (err) {
                return connection.rollback(() => {
                  throw err;
                });
              }
      
              // Update the employee details
              const updateEmployee = `UPDATE employee
                                      SET empFirstName = ?, empMiddleName = ?, empLastName = ?, empEmail = ?, empDOB = ?, empJobTitle = ?
                                      WHERE empID = ?`;
              connection.query(updateEmployee, [empFirstName, empMiddleName, empLastName, empEmail, empDOB, empJobTitle, empID], (err, result) => {
                if (err) {
                  return connection.rollback(() => {
                    throw err;
                  });
                }
      
                // Update the employee address details
                const updateAddress = `UPDATE employee_address
                                       SET addressLine1 = ?, addressLine2 = ?, city = ?, state = ?, zip = ?, emContact = ?, emPhone = ?, homePhone = ?
                                       WHERE empID = ?`;
                connection.query(updateAddress, [addressLine1, addressLine2, city, state, zip, emContact, emPhone, homePhone, empID], (err, result) => {
                  if (err) {
                    return connection.rollback(() => {
                      throw err;
                    });
                  }
      
                  // Commit the transaction
                  connection.commit((err) => {
                    if (err) {
                      return connection.rollback(() => {
                        throw err;
                      });
                    }
                    res.status(200).json({
                      message: 'Employee updated successfully', // make sure to display the data
                    });
                  });
                });
              });
            });
          });
        } catch (err) {
          res.status(500).json({
            message: err.message || 'An error occurred while updating the employee',
          });
        }
      };


// *************************************  delete API *********************************************
const deleteEmployee = async (req, res, next) => {
  const empID = req.params.eid;

  try {
    connection.beginTransaction(async (err) => {
      if (err) throw err;

      // Delete from employee_address table first since it references empID
      const deleteAddressQuery = `DELETE FROM employee_address WHERE empID = ?`;
      connection.query(deleteAddressQuery, [empID], (err, result) => {
        if (err) {
          return connection.rollback(() => {
            throw err;
          });
        }

        // Delete from employee table
        const deleteEmployeeQuery = `DELETE FROM employee WHERE empID = ?`;
        connection.query(deleteEmployeeQuery, [empID], (err, result) => {
          if (err) {
            return connection.rollback(() => {
              throw err;
            });
          }

          // If no rows were deleted, the employee does not exist
          if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Employee not found" });
          }

          // Commit the transaction
          connection.commit((err) => {
            if (err) {
              return connection.rollback(() => {
                throw err;
              });
            }

            res.status(200).json({ message: "Employee deleted successfully" });
          });
        });
      });
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "An error occurred while deleting the employee",
    });
  }
};


exports.getEmployees = getEmployees;
exports.getEmployeesByID = getEmployeesByID;
exports.createEmployee = createEmployee;
exports.updateEmployee = updateEmployee;
exports.deleteEmployee = deleteEmployee;
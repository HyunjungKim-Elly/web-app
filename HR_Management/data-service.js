//const fs = require("fs");
//var employees = [];
//var departments = [];
//var managers = [];
const Sequelize = require("sequelize");

var sequelize = new Sequelize(
  "detvuv8s7hvhq0",
  "hjwmrrkkevkjdc",
  "2deef4b5f9642333264ddd80d6ab98cf74b2bee47f29746b83f9fd4f6874580a",
  {
    host: "ec2-107-20-177-161.compute-1.amazonaws.com",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: true
    }
  }
);

const Employee = sequelize.define("Employee", {
  employeeNum: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: Sequelize.STRING,
  SSN: Sequelize.STRING,
  addressStreet: Sequelize.STRING,
  addressCity: Sequelize.STRING,
  addressState: Sequelize.STRING,
  addressPostal: Sequelize.STRING,
  maritalStatus: Sequelize.STRING,
  isManager: Sequelize.BOOLEAN,
  employeeManagerNum: Sequelize.INTEGER,
  status: Sequelize.STRING,
  department: Sequelize.INTEGER,
  hireDate: Sequelize.STRING
});

const Department = sequelize.define("Department", {
  departmentId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  departmentName: Sequelize.STRING
});

module.exports.initialize = function() {
  return new Promise(function(resolve, reject) {
    sequelize
      .sync()
      .then(Employee => resolve(Employee))
      .then(Department => resolve(Department))
      .catch(err => reject("unable to sync the database"));
  });
};
module.exports.getAllEmployees = function() {
  return new Promise(function(resolve, reject) {
    Employee.findAll()
      .then(data => resolve(data))
      .catch(err => reject("no results returned"));
  });
};
module.exports.getEmployeesByStatus = function(status) {
  return new Promise(function(resolve, reject) {
    Employee.findAll({ where: { status: status } })
      .then(data => resolve(data))
      .catch(err => reject("no results returned"));
  });
};
module.exports.getEmployeesByDepartment = function(departmentNum) {
  return new Promise(function(resolve, reject) {
    Employee.findAll({ where: { department: departmentNum } })
      .then(data => resolve(data))
      .catch(err => reject("no results returned"));
  });
};
module.exports.getEmployeesByManager = function(manager) {
  return new Promise(function(resolve, reject) {
    Employee.findAll({ where: { employeeManagerNum: manager } })
      .then(data => resolve(data))
      .catch(err => reject("no results returned"));
  });
};
module.exports.getEmployeeByNum = function(empNum) {
  return new Promise(function(resolve, reject) {
    Employee.findAll({ where: { employeeNum: empNum } })
      .then(data => resolve(data))
      .catch(err => reject("no results returned"));
  });
};
module.exports.getDepartments = function() {
  return new Promise(function(resolve, reject) {
    Department.findAll()
      .then(data => resolve(data))
      .catch(err => reject("no results returned"));
  });
};
module.exports.addEmployee = function(employeeData) {
  return new Promise(function(resolve, reject) {
    employeeData.isManager = employeeData.isManager ? true : false;
    sequelize
      .sync()
      .then(() => {
        for (var property in employeeData) {
          if (employeeData[property] == "") {
            employeeData[property] = null;
          }
        }

        Employee.create({
          employeeNum: employeeData.employeeNum,
          firstName: employeeData.firstName,
          lastName: employeeData.lastName,
          email: employeeData.email,
          SSN: employeeData.SSN,
          addressStreet: employeeData.addressStreet,
          addresCity: employeeData.addresCity,
          isManager: employeeData.isManager,
          addressState: employeeData.addressState,
          addressPostal: employeeData.addressPostal,
          employeeManagerNum: employeeData.employeeManagerNum,
          status: employeeData.status,
          department: employeeData.department,
          hireDate: employeeData.hireDate
        })
          .then(data => resolve(data))
          .catch(err => reject("unable to create employee"));
      })
      .catch(err => reject("unable to create employee"));
  });
};
module.exports.updateEmployee = function(employeeData) {
  employeeData.isManager = employeeData.isManager ? true : false;
  return new Promise(function(resolve, reject) {
    //  sequelize
    //  .sync()
    //.then(() => {
    for (var property in employeeData) {
      if (employeeData[property] == "") {
        employeeData[property] = null;
      }
    }
    Employee.update(
      {
        employeeNum: employeeData.employeeNum,
        firstName: employeeData.firstName,
        lastName: employeeData.lastName,
        email: employeeData.email,
        SSN: employeeData.SSN,
        addressStreet: employeeData.addressStreet,
        addresCity: employeeData.addresCity,
        addressState: employeeData.addressState,
        addressPostal: employeeData.addressPostal,
        isManager: employeeData.isManager,
        employeeManagerNum: employeeData.employeeManagerNum,
        status: employeeData.status,
        department: employeeData.department,
        hireDate: employeeData.hireDate
      },
      {
        where: {
          employeeNum: employeeData.employeeNum
        }
      }
    )
      .then(data => resolve(data))
      .catch(err => reject("unable to update employee"));
  }).catch(err => reject("unable to create employee"));
  //});
};

//add new functions

module.exports.addDepartment = function(departmentData) {
  return new Promise(function(resolve, reject) {
    sequelize
      .sync()
      .then(() => {
        for (var property in departmentData) {
          if (departmentData[property] == "") {
            departmentData[property] = null;
          }
        }
        Department.create({
          departmentId: departmentData.departmentId,
          departmentName: departmentData.departmentName
        })
          .then(data => {
            // console.log(data);
            resolve(data);
          })
          .catch(err => reject("unable to create department"));
      })
      .catch(err => reject("unable to create department"));
  });
};
module.exports.updateDepartment = function(departmentData) {
  return new Promise(function(resolve, reject) {
    for (var property in departmentData) {
      if (departmentData[property] == "") {
        departmentData[property] = null;
      }
    }
    //sequelize.sync().then(() => {
    Department.update(
      {
        departmentId: departmentData.departmentId,
        departmentName: departmentData.departmentName
      },
      {
        where: { departmentId: departmentData.departmentId }
      }
    )
      .then(data => resolve(data))
      .catch(err => reject("unable to update department"));
  });
  // });
};
module.exports.getDepartmentById = function(id) {
  return new Promise(function(resolve, reject) {
    Department.findAll({ where: { departmentId: id } })
      .then(data => resolve(data))
      .catch(err => reject("no result returned"));
  });
};
module.exports.deleteEmployeeByNum = function(empNum) {
  return new Promise(function(resolve, reject) {
    sequelize
      .sync()
      .then(() => {
        Employee.destroy({
          where: { employeeNum: empNum }
        })
          .then(() => resolve("Employee is removed"))
          .catch(err => reject("cannot delete"));
      })
      .catch(err => reject("cannot delete"));
  });
};
/*module.exports.getManagers = function() {
  return new Promise(function (resolve, reject) {
  
    });
};*/

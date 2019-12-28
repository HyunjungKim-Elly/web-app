/*********************************************************************************

 * Name: Hyunjung Kim  
 *
 * Online (Heroku) Link: https://floating-sands-12275.herokuapp.com/
 *
 ********************************************************************************/

var dataService = require("./data-service.js");
const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const bodyParser = require("body-parser");
const HTTP_PORT = process.env.PORT || 8080;
const exphbs = require("express-handlebars");
const dataServiceAuth = require("./data-service-auth.js");
const clientSessions = require("client-sessions");

app.use(
  clientSessions({
    cookieName: "session",
    secret: "web322_assignment6",
    duration: 2 * 60 * 1000,
    activeDuriation: 1000 * 60
  })
);
app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});
function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
}

//assignment 4//
app.engine(
  ".hbs",
  exphbs({
    extname: ".hbs",
    defaultLayout: "main",
    helpers: {
      navLink: function(url, options) {
        return (
          "<li" +
          (url == app.locals.activeRoute ? ' class="active" ' : "") +
          '><a href="' +
          url +
          '">' +
          options.fn(this) +
          "</a></li>"
        );
      },
      equal: function(lvalue, rvalue, options) {
        if (arguments.length < 3) throw new Error("Handlebars Helper equal needs 2 parameters");
        if (lvalue != rvalue) {
          return options.inverse(this);
        } else {
          return options.fn(this);
        }
      }
    }
  })
);
app.set("view engine", ".hbs");
app.use(bodyParser.urlencoded({ extended: true }));
const storage = multer.diskStorage({
  destination: "./public/images/uploaded",
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

app.use(function(req, res, next) {
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = route == "/" ? "/" : route.replace(/\/$/, "");
  next();
});

/////////////////
const upload = multer({ storage: storage });

///assginment 2//
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.render("home");
  //res.sendFile(path.join(__dirname, "/views/home.html"));
});
app.get("/about", function(req, res) {
  res.render("about");
});

app.get("/employees", function(req, res) {
  if (req.query.status) {
    dataService
      .getEmployeesByStatus(req.query.status)
      .then(function(data) {
        if (data.length > 0) {
          res.render("employees", { employees: data });
        } else {
          res.render("employees", { message: "no results" });
        }
      })
      .catch(function(err) {
        res.json({ message: err });
      });
  } else if (req.query.department) {
    dataService
      .getEmployeesByDepartment(req.query.department)
      .then(function(data) {
        if (data.length > 0) {
          res.render("employees", { employees: data });
        } else {
          res.render("employees", { message: "no results" });
        }
      })
      .catch(function(err) {
        res.json({ message: err });
      });
  } else if (req.query.manager) {
    dataService
      .getEmployeesByManager(req.query.manager)
      .then(function(data) {
        if (data.length > 0) {
          res.render("employees", { employees: data });
        } else {
          res.render("employees", { message: "no results" });
        }
      })
      .catch(function(err) {
        res.json({ message: err });
      });
  } else {
    dataService
      .getAllEmployees()
      .then(function(data) {
        if (data.length > 0) {
          res.render("employees", { employees: data });
        } else {
          res.render("employees", { message: "no results" });
        }
      })
      .catch(function(err) {
        res.json({ message: err });
      });
  }
});
app.get("/employee/:empNum", (req, res) => {
  // initialize an empty object to store the values
  let viewData = {};
  dataService
    .getEmployeeByNum(req.params.empNum)
    .then(data => {
      if (data) {
        viewData.employee = data; //store employee data in the "viewData" object as "employee"
      } else {
        viewData.employee = null; // set employee to null if none were returned
      }
    })
    .catch(() => {
      viewData.employee = null; // set employee to null if there was an error
    })
    .then(dataService.getDepartments)
    .then(data => {
      viewData.departments = data; // store department data in the "viewData" object as "departments"
      // loop through viewData.departments and once we have found the departmentId that matches
      // the employee's "department" value, add a "selected" property to the matching
      // viewData.departments object
      for (let i = 0; i < viewData.departments.length; i++) {
        if (viewData.departments[i].departmentId == viewData.employee.department) {
          viewData.departments[i].selected = true;
        }
      }
    })
    .catch(() => {
      viewData.departments = []; // set departments to empty if there was an error
    })
    .then(() => {
      if (viewData.employee == null) {
        // if no employee - return an error
        res.status(404).send("Employee Not Found");
      } else {
        res.render("employee", { viewData: viewData }); // render the "employee" view
      }
    });
});
app.get("/employees/delete/:empNum", ensureLogin, (req, res) => {
  dataService
    .deleteEmployeeByNum(req.params.empNum)
    .then(() => {
      res.redirect("/employees");
    })
    .catch(err => {
      res.status(500).send("Unable to Remove Employeed");
    });
});
app.post("/employee/update", ensureLogin, (req, res) => {
  dataService
    .updateEmployee(req.body)
    .then(res.redirect("/employees"))
    .catch(function(err) {
      res.render("employee", { message: "no results" });
    });
});

app.get("/managers", ensureLogin, function(req, res) {
  dataService
    .getManagers()
    .then(function(data) {
      res.json(data);
    })
    .catch(function(err) {
      res.json({ message: err });
    });
});
app.get("/departments", ensureLogin, function(req, res) {
  dataService
    .getDepartments()
    .then(function(data) {
      res.render("departments", { departments: data });
    })
    .catch(function(err) {
      res.json({ message: err });
    });
});

app.get("/employees/add", ensureLogin, function(req, res) {
  dataService
    .getDepartments()
    .then(data => {
      res.render("addEmployee", { departments: data });
    })
    .catch(err => {
      res.render("addEmployee", { departments: [] });
    });
});
app.post("/employees/add", ensureLogin, function(req, res) {
  dataService.addEmployee(req.body).then(function() {
    res.redirect("/employees");
  });
});

//assignment 6 login route

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/logout", (req, res) => {
  req.session.reset();
  res.redirect("/");
});

app.get("/userHistory", ensureLogin, (req, res) => {
  res.render("userHistory"), { user: req.session.user };
});

app.post("/register", (req, res) => {
  dataServiceAuth
    .registerUser(req.body)
    .then(data => res.render("register", { successMessage: "User created" }))
    .catch(err => res.render("register", { errorMessage: err, userName: req.body.userName }));
});
app.post("/login", (req, res) => {
  req.body.userAgent = req.get("User-Agent");

  dataServiceAuth
    .checkUser(req.body)
    .then(user => {
      req.session.user = {
        userName: user.userName, // authenticated user's userName
        email: user.email, //authenticated user's email
        loginHistory: user.loginHistory // authenticated user's loginHistory
      };
      res.redirect("/employees");
    })
    .catch(err => res.render("login", { errorMessage: err, userName: req.body.userName }));
});

//assignment5 department
app.get("/departments/add", ensureLogin, function(req, res) {
  res.render("addDepartment", {
    layout: "main"
  });
});

app.post("/departments/add", ensureLogin, (req, res) => {
  dataService.addDepartment(req.body).then(function() {
    res.redirect("/departments");
  });
});

app.post("/department/update", ensureLogin, function(req, res) {
  dataService
    .updateDepartment(req.body)
    .then(res.redirect("/departments"))
    .catch(function(err) {
      res.render("department", { message: "no results" });
    });
});

app.get("/department/:departmentId", ensureLogin, function(req, res) {
  dataService
    .getDepartmentById(req.params.departmentId)
    .then(data => {
      if (data.length > 0) {
        res.render("department", { department: data });
      } else {
        res.status(404).send("Department Not Found");
      }
    })
    .catch(err => {
      res.status(404).send("Department Not Found");
    });
});

//image//
app.get("/images/add", ensureLogin, function(req, res) {
  res.render("addImage", {
    layout: "main"
  });
});

app.get("/images", ensureLogin, function(req, res) {
  var pathNew = path.join(__dirname, "/public/images/uploaded");

  fs.readdir(pathNew, function(err, file) {
    res.render("images", { images: file });
  });
});

app.post("/images/add", upload.single("imageFile"), ensureLogin, (req, res) => {
  res.redirect("/images");
});
//////////////////////////////

app.get("*", function(req, res) {
  res.status(404).send("Page Not Found");
});

//server
dataService
  .initialize()
  .then(dataServiceAuth.initialize)
  .then(function() {
    app.listen(HTTP_PORT, function() {
      console.log("app listening on: " + HTTP_PORT);
    });
  })
  .catch(function(err) {
    console.log("unable to start server: " + err);
  });

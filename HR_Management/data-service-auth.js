const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

var userSchema = new Schema({
  userName: {
    type: String,
    unique: true
  },
  password: String,
  email: String,
  loginHistory: [
    {
      dateTime: Date,
      userAgent: String
    }
  ]
});

let User;

module.exports.initialize = function() {
  return new Promise(function(resolve, reject) {
    let db = mongoose.createConnection(
      `mongodb+srv://hkim293:${encodeURIComponent(
        "mypassword"
      )}@web322a6-wamcn.mongodb.net/${encodeURIComponent("web322_a6")}?retryWrites=true`
    );
    db.on("error", err => {
      reject(err); // reject the promise with the provided error
    });
    db.once("open", () => {
      User = db.model("users", userSchema);
      resolve();
    });
  });
};

module.exports.registerUser = function(userData) {
  return new Promise(function(resolve, reject) {
    if (userData.password !== userData.password2) {
      reject("Passwords do not match");
    } else {
      bcrypt.genSalt(10, function(err, salt) {
        if (err) {
          reject("There was an error encrypting the password");
        }
        bcrypt.hash(userData.password, salt, function(err, hash) {
          if (err) {
            reject(err);
          }

          let newUser = new User(userData);

          newUser.password = hash;
          newUser.save(err => {
            if (err) {
              if (err.code == 11000) {
                reject("User Name already taken");
              } else {
                reject("There was an error creating the user: " + err);
              }
            } else {
              resolve();
            }
          });
        });
      });
    }
  });
};

module.exports.checkUser = function(userData) {
  return new Promise(function(resolve, reject) {
    console.log(userData);
    User.find({ userName: userData.userName })
      .exec()
      .then(logUser => {
        if (logUser.length === 0) {
          reject("Unable to find user:" + userData.userName);
        } else {
          bcrypt.compare(userData.password, logUser[0].password).then(res => {
            // res === true if it matches and res === false if it does not match
            if (res === false) {
              reject("Incorrect Password for user:" + userData.userName);
            } else {
              logUser[0].loginHistory.push({
                dateTime: new Date().toString(),
                userAgent: userData.userAgent
              });
              User.update(
                { userName: logUser[0].userName },
                { $set: { loginHistory: logUser[0].loginHistory } },
                { multi: false }
              )
                .exec()
                .then(() => {
                  resolve(logUser[0]);
                })
                .catch(err => {
                  reject("There was an error verifying the user:" + err);
                });
            }
          });
        }
      })
      .catch(err => {
        reject("Unable to find user:" + userData.userName);
      });
  });
};

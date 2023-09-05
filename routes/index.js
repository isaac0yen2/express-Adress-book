var express = require("express");
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('mydatabase.db');
const sqliteMiddleware = require("../sqliteMiddleware");
let UserGlob

router.use(sqliteMiddleware);

/* GET home page. */
router.get("/", function (req, res, next) {
  UserGlob = null
  res.render("index", {
    title: "Express",
    username: null
  });
});
router.get("/register", function (req, res, next) {
  res.render("register", {
    title: "thank you for joining us",
  });
  console.log("registration page rendered");
});
router.post("/register", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  console.log(username, password);
  let selectQuery = "SELECT * FROM verify WHERE username = ?";;
  let nameInsertQuery = "INSERT INTO verify (username,password) VALUES (?,?)";



  //checking if the username has been saved
  req.db.get(selectQuery, username, function (err, row) {
    let data;
    if (err) {
      console.log(err)
    } else if (row) {
      console.log('already registered')
      res.render("index", {
        title: "Express",
        username: username + ' has been registered already'
      });
    } else {
      res.status(404);
      data = `there is no such colunm as ${username} proceding to save new data`;
      //saving the username
      req.db.run(nameInsertQuery, [username, password], function (err) {
        if (err) {
          console.error(err);
          console.log("error saving data");
        } else {
          //creating the table for that user
          db.run(`
          CREATE TABLE IF NOT EXISTS ${username} (
            id INTEGER PRIMARY KEY,
            name TEXT,
            address TEXT,
            phone INTEGER,
            birth TEXT
          )
        `);
          console.log(data)
          console.log(`Inserted data with ID: ${this.lastID}`);
          //rendering the homepage with the username
          res.render("index", {
            title: "Express",
            username: `sucessfully registered ` + username
          });
        }

      });

    }
  });



});







//now for the loging in
router.post('/login', (req, res, next) => {
  let username = req.body.username
  let password = req.body.password

  let SelectQuerytring = "SELECT * FROM verify WHERE username = ?"

  //checking if the username has been saved
  req.db.get(SelectQuerytring, username, function (err, row) {
    if (err) {
      console.log(err)
    } else if (row) {
      data = `SUCESSFULLY CONFIRMED THAT ${username} IS IN OUR DATABASE`;
      if (row.password === password) {

        let dataQuery = `SELECT * FROM ${username}`
        req.db.all(dataQuery, [], (err, data) => {
          if (err) {
            console.log(err)
          } else if (data) {
            UserGlob = username
            res.render('userpage', {
              data,
              username,
              message: 'LOGGED IN SUCESSFULLY'
            })
          }
        })

      } else {
        console.log('wrong password')
        res.render("index", {
          title: "Express",
          username: `WRONG PASSWORD FOR ` + username
        });
      }
    } else {

      console.log('NOT REGISTERED')
      res.render("index", {
        title: "Express",
        username: username + ` NOT REGISTERED`
      });
    }
  });

})


router.post('/add', (req, res, next) => {
  let name = req.body.name
  let address = req.body.address
  let username = req.body.username
  let phone = req.body.phone
  let birth = req.body.birth


  // now to store it into the database

  let queryString = `INSERT INTO ${username} (name,address,phone,birth) VALUES (?,?,?,?)`

  req.db.run(queryString, [name, address, phone, birth], function (err) {
    if (err) {
      console.error(err);
      console.log("error saving data");
      let dataQuery = `SELECT * FROM ${username}`
      req.db.all(dataQuery, [], (err, data) => {
        if (err) {
          console.log(err)
        } else if (data) {
          res.render('userpage', {
            data,
            username,
            message: 'Data not saved'
          })
        }
      })
    } else {
      let dataQuery = `SELECT * FROM ${username}`
      req.db.all(dataQuery, [], (err, data) => {
        if (err) {
          console.log(err)
        } else if (data) {
          res.render('userpage', {
            data,
            username,
            message: 'Data sucessfully saved'
          })
        }
      })
      console.log('SAVED SUCESSFULLY')
    }
  })

  console.log(name, address, username, phone, birth)

})
// for delete

router.post('/deleted', (req, res, next) => {
  let tableName = req.body.username
  let recordId = req.body.recordId


  const deleteQuery = `DELETE FROM ${tableName} WHERE id = ?`;

  req.db.run(deleteQuery, recordId, function (err) {
    if (err) {
      console.error(err);
      console.log("error deleting data");
    } else {
      //code to get data

      let dataQuery = `SELECT * FROM ${tableName}`
      req.db.all(dataQuery, [], (err, data) => {
        if (err) {
          console.log(err)
        } else if (data) {
          res.render('userpage', {
            data,
            username: tableName,
            message: 'Data sucessfully deleted'
          })
        }
      })




    }
  })
})



router.post('/edited', (req, res, next) => {
  let tableName = req.body.husername
  let Id = req.body.hrecordId
  let nameEdit = req.body.hname
  let addressEdit = req.body.haddress
  let phoneEdit = req.body.hphone
  let birthEdit = req.body.hbirth
  let editQuery = `UPDATE ${tableName} SET name = ?, address = ?, phone = ?, birth = ? WHERE id = ?`;


  db.run(editQuery, [nameEdit, addressEdit, phoneEdit, birthEdit, Id], (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error updating record');
    } else {
      let dataQuery = `SELECT * FROM ${tableName}`
      req.db.all(dataQuery, [], (err, data) => {
        if (err) {
          console.log(err)
        } else if (data) {
          console.log(data)
          res.render('userpage', {
            data,
            username:tableName,
            message:'Data sucessfully updated'
          })
        }
    })


    }
  });
})
module.exports = router;
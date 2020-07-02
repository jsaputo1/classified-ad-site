const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // GET route for login page
  router.get("/", (req, res) => {
    const username = req.session.email;
    templateVars = { username };
    res.render("login", templateVars);
  });

  //POST route for login page
  router.post("/", (req, res) => {
    const values = [req.body.email, req.body.password];
    const queryString = `
    SELECT email, id, password
    FROM buyers
    WHERE buyers.email = $1
    AND buyers.password = $2;
    `;

    db.query(queryString, values)
      .then((data) => {
        const username = req.session.email;
        templateVars = { username }
        if (!data.rows[0]) {
          res.render("error", templateVars);
        }else {
        const userData = data.rows[0];
        req.session.email = userData.email;
        req.session.buyer_id = userData.id;
        console.log(`Login successful.
        // User Cookie ${req.session.email} and id is ${req.session.buyer_id}`);
        res.redirect(`/users/myaccount`);
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};
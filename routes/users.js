/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();
const { c } = require("tar");
const { query } = require("express");
const { user } = require("osenv");
// const { redirect } = require("statuses");

module.exports = (db) => {
  /*  Index Routes  */

  //GET route to show index. Index displays all listings.
  router.get("/", (req, res) => {
    const queryString = `
    SELECT *
    FROM listings;
    `;
    db.query(queryString)
      .then((data) => {
        const products = data.rows;
        const templateVars = { products };
        console.log("GET request for index page");
        res.render("listings", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //POST route to filter by price
  router.post("/listings", (req, res) => {
    const queryString = `
    SELECT *
    FROM listings
    ORDER BY price ASC;
    `;
    db.query(queryString)
      .then((data) => {
        const products = data.rows;
        const templateVars = { products };
        res.render("listings", templateVars);
        console.log("POST request for filter by price");
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  /*

  Login Routes

  */

  // GET route for login page
  router.get("/login", (req, res) => {
    res.render("login");
    console.log("Get request for login page");
  });

  //POST route for login page
  router.post("/login", (req, res) => {
    let userCookieEmail = req.session.email;
    let userCookieBuyerID = req.session.buyer_id;
    const email = req.body.email;
    console.log("Req Body:", email);
    const queryString = `
    SELECT email, id
    FROM buyers
    WHERE buyers.email = $1;

    `;

    db.query(queryString, [email])
      .then((data) => {
        if (!data.rows[0]) {
          console.log("User does not exist");
          res.status(403).json({ message: "User does not exist" });
        }
        const database = data.rows;
        for (let key in database) {
          userCookieEmail = database[key].email;
          userCookieBuyerID = database[key].id;
        }
        console.log(`Login successful.
        User Cookie ${userCookieEmail} and id is ${userCookieBuyerID}`);
        res.redirect("/users/:id");
      })

      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  // POST route to logout. Sets cookie to NULL
  router.post("/logout", (req, res) => {
    console.log("POST request to logout");
    req.session.email = null;
    req.session.buyer_id = null;
    console.log(
      "Cookie for email:",
      req.session.email,
      "Cookie for buyer id",
      req.session.buyer_id
    );
    res.redirect("/login");
  });

  /*


  User Specific Routes

  */

  //GET route for buyer's page. Shows all favourite items.
  router.get("/users/:id", (req, res) => {
    let userCookieEmail = req.session.email;
    console.log("Email Cookie is:", userCookieEmail);
    const queryString = `
    SELECT listings.*, favorites.*
    FROM favorites
    JOIN listings ON favorites.listing_id = listings.id
    JOIN buyers ON favorites.buyer_id = buyers.id
    WHERE buyers.email = 'john@gmail.com';
    `;
    // const email = req.session.email;
    // const email = userCookieEmail;
    // const values = email;
    db.query(queryString)
      .then((data) => {
        const products = data.rows;
        const templateVars = { products };
        console.log("Get request for buyer page");
        res.render("user", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //POST route to add favourite
  router.post("/:add_favorite", (req, res) => {
    let userCookieBuyerID = req.session.buyer_id;
    console.log("Email Cookie is:", userCookieBuyerID);
    const queryString = `
    INSERT INTO favorites (buyer_id, listing_id)
    VALUES  ($1, $2);
    `;
    const listingID = req.body.listingID;
    const values = [userCookieBuyerID, listingID];
    console.log(values);
    db.query(queryString, [values])
      .then((data) => {
        console.log("POST request to add favourite");
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //POST route to remove favourite
  router.post("/:remove_favorite", (req, res) => {
    let userCookieBuyerID = req.session.buyer_id;
    const queryString = `
    DELETE FROM favorites
    WHERE buyer_id = $1
    AND listing_id = $2
      `;
    // const userIDCookie = req.session.buyer_id
    const listingID = req.body.listingIDForRemoval;
    const values = [userCookieBuyerID, listingID];
    console.log(listingID);
    db.query(queryString, [values])
      .then((data) => {
        console.log("POST request to remove favourite");
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //GET route to view seller's listings
  router.get("/listings:user", (req, res) => {
    const queryString = ` Query to add specific sellers items  `;
    db.query(queryString)
      .then((data) => {
        const products = data.rows;
        const templateVars = {};
        console.log(products);
        console.log("GET request to view seller's listings");
        res.render("user", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //POST route to edit seller's listings
  router.post("/listings:user", (req, res) => {
    const queryString = ` query to edit items`;
    db.query(queryString)
      .then((data) => {
        const products = data.rows;
        console.log(products);
        console.log("POST request to edit items");
        res.render("user-listings");
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //POST route to delete seller's listings
  router.post("/listings:user/delete", (req, res) => {
    const queryString = ` Query to delete items `;
    db.query(queryString)
      .then((data) => {
        const products = data.rows;
        console.log(products);
        console.log("POST request to delete items");
        res.render("user-listings");
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  // /* End of Routes */

  return router;
};

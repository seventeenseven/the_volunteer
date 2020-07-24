const express = require("express");
const { pool } = require("./dbConfig");
const pws = require('p4ssw0rd');
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
require("dotenv").config();
const app = express();

const PORT = process.env.PORT || 3000;

const initializePassport = require("./passportConfig");

initializePassport(passport);

// Middleware

// Parses details from a form
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.use(
    session({
        // Key we want to keep secret which will encrypt all of our information
        secret: process.env.SESSION_SECRET,
        // Should we resave our session variables if nothing has changes which we dont
        resave: false,
        // Save empty value if there is no vaue which we do not want to do
        saveUninitialized: false
    })
);
// Funtion inside passport which initializes passport
app.use(passport.initialize());
// Store our variables to be persisted across the whole session. Works with app.use(Session) above
app.use(passport.session());
app.use(flash());

app.get("/", (req, res) => {
    res.render("login");
});

//REGISTER ROUTE
app.get("/register", checkAuthenticated, (req, res) => {
    res.render("login.ejs");
});
app.post("/register", async(req, res) => {
    const { firstname, lastname, email, country, username, password } = req.body;
    let errors = [];

    console.log(req.body);

    if (!firstname || !lastname || !username || !email || !country || !password) {
        errors.push({ message: "Please enter all fields" });
    }

    if (password.length < 4) {
        errors.push({ message: "Password must be a least 6 characters long" });
    }

    //if (password !== password2) {
    //  errors.push({ message: "Passwords do not match" });
    //}

    if (errors.length > 0) {
        res.render("login", { errors, firstname, lastname, email, country, username, password });
    } else {
        hashedPassword = await pws.hash(password, 10);
        console.log(hashedPassword);
        // Validation passed
        pool.query(
            `SELECT * FROM users
        WHERE username = $1`, [username],
            (err, results) => {
                if (err) {
                    console.log(err);
                }
                console.log(results.rows);

                if (results.rows.length > 0) {
                    return res.render("register", {
                        message: "Username already registered"
                    });
                } else {
                    pool.query(
                        `INSERT INTO users (first_name, last_name, mail, username, password, country, created_date)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING user_id, password`, [firstname, lastname, email, username, hashedPassword, country, new Date()],
                        (err, results) => {
                            if (err) {
                                throw err;
                            }
                            console.log(results.rows);
                            req.flash("success_msg", "You are now registered. Please log in");
                            res.redirect("/login");
                        }
                    )
                }
            }
        );
    }
});

//LOGIN ROUTE
app.get("/login", checkAuthenticated, (req, res) => {
    // flash sets a messages variable. passport sets the error message
    console.log(req.session.flash.error);
    res.render("login.ejs");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true
}));

//ALL PROJECTS ROUTES
app.get("/dashboard", checkNotAuthenticated, (req, res) => {
    console.log(req.isAuthenticated());
    console.log(req.user);
    res.render("dashboard", { user: req.user.username });
});

//THE LOGOUT
app.get("/logout", (req, res) => {
    req.logout();
    res.render("login", { message: "You have logged out successfully" });
});

//USER PROFILE ROUTE
app.get('/user_profile', checkNotAuthenticated, (req, res) => {
    console.log(req.isAuthenticated());
    res.render("user_profile", { user: req.user });
});


function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/dashboard");
    }
    next();
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
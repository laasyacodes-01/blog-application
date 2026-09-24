const express = require("express");
const cors = require("cors");

const app = express();


// =========================
// MIDDLEWARE
// =========================

app.use(cors());

app.use(express.json());


// =========================
// TEMPORARY DATA
// =========================

let users = [];

let blogs = [];


// =========================
// TEST ROUTE
// =========================

app.get("/", (req, res) => {

    res.json({
        message: "Blog Application Backend is running!"
    });

});


// =========================
// USER REGISTRATION API
// =========================

app.post("/api/register", (req, res) => {

    const { name, email, password } = req.body;


    if (!name || !email || !password) {

        return res.status(400).json({
            message: "Please fill in all fields."
        });

    }


    const existingUser = users.find(
        user => user.email === email
    );


    if (existingUser) {

        return res.status(400).json({
            message: "User already exists."
        });

    }


    const newUser = {

        id: users.length + 1,

        name: name,

        email: email,

        password: password

    };


    users.push(newUser);


    res.status(201).json({

        message: "Registration successful!",

        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        }

    });

});


// =========================
// USER LOGIN API
// =========================

app.post("/api/login", (req, res) => {

    const { email, password } = req.body;


    if (!email || !password) {

        return res.status(400).json({

            message: "Please enter email and password."

        });

    }


    const user = users.find(

        user =>
            user.email === email &&
            user.password === password

    );


    if (!user) {

        return res.status(401).json({

            message: "Invalid email or password."

        });

    }


    res.json({

        message: "Login successful!",

        user: {

            id: user.id,

            name: user.name,

            email: user.email

        }

    });

});


// =========================
// CREATE BLOG API
// =========================

app.post("/api/blogs", (req, res) => {

    const { title, category, content } = req.body;


    if (!title || !category || !content) {

        return res.status(400).json({

            message: "Please fill in all blog fields."

        });

    }


    const newBlog = {

        id: blogs.length + 1,

        title: title,

        category: category,

        content: content

    };


    blogs.push(newBlog);


    res.status(201).json({

        message: "Blog created successfully!",

        blog: newBlog

    });

});


// =========================
// GET ALL BLOGS API
// =========================

app.get("/api/blogs", (req, res) => {

    res.json({

        blogs: blogs

    });

});


// =========================
// START SERVER
// =========================

const PORT = 5000;


app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );

});
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();
const PORT = 5000;

// Supabase
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY
);

app.use(cors());
app.use(express.json());

// ==================== HOME ====================

app.get("/", (req, res) => {
    res.json({
        message: "Blog Application Backend is running!"
    });
});

// ==================== REGISTER ====================

app.post("/api/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please fill all fields."
            });
        }

        // Check existing user
        const { data: users, error: checkError } = await supabase
            .from("users")
            .select("id, email")
            .eq("email", email);

        if (checkError) {
            console.log("CHECK ERROR:", checkError);

            return res.status(500).json({
                message: "Database check failed.",
                error: checkError.message
            });
        }

        if (users && users.length > 0) {
            return res.status(400).json({
                message: "User already exists."
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const { data, error: insertError } = await supabase
            .from("users")
            .insert({
                name: name,
                email: email,
                password: hashedPassword
            })
            .select("id, name, email");

        if (insertError) {
            console.log("INSERT ERROR:", insertError);

            return res.status(500).json({
                message: "Registration failed.",
                error: insertError.message
            });
        }

        res.status(201).json({
            message: "Registration successful!",
            user: data[0]
        });

    } catch (error) {
        console.log("REGISTER ERROR:", error);

        res.status(500).json({
            message: "Registration failed.",
            error: error.message
        });
    }
});

// ==================== LOGIN ====================

app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please enter email and password."
            });
        }

        const { data: users, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", email);

        if (error) {
            console.log("LOGIN DATABASE ERROR:", error);

            return res.status(500).json({
                message: "Login failed.",
                error: error.message
            });
        }

        if (!users || users.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const user = users[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
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

    } catch (error) {
        console.log("LOGIN ERROR:", error);

        res.status(500).json({
            message: "Login failed.",
            error: error.message
        });
    }
});

// ==================== CREATE BLOG ====================

app.post("/api/blogs", async (req, res) => {
    try {
        const { title, content, author } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                message: "Title and content are required."
            });
        }

        const { data, error } = await supabase
            .from("blogs")
            .insert({
                title: title,
                content: content,
                author: author || "Anonymous"
            })
            .select("*");

        if (error) {
            console.log("BLOG INSERT ERROR:", error);

            return res.status(500).json({
                message: "Failed to create blog.",
                error: error.message
            });
        }

        res.status(201).json({
            message: "Blog created successfully!",
            blog: data[0]
        });

    } catch (error) {
        console.log("CREATE BLOG ERROR:", error);

        res.status(500).json({
            message: "Failed to create blog.",
            error: error.message
        });
    }
});

// ==================== GET ALL BLOGS ====================

app.get("/api/blogs", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("blogs")
            .select("*")
            .order("created_at", {
                ascending: false
            });

        if (error) {
            console.log("GET BLOGS ERROR:", error);

            return res.status(500).json({
                message: "Failed to fetch blogs.",
                error: error.message
            });
        }

        res.json(data);

    } catch (error) {
        console.log("GET BLOGS ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch blogs."
        });
    }
});

// ==================== GET ONE BLOG ====================

app.get("/api/blogs/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from("blogs")
            .select("*")
            .eq("id", id);

        if (error) {
            console.log("GET ONE BLOG ERROR:", error);

            return res.status(500).json({
                message: "Failed to fetch blog.",
                error: error.message
            });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({
                message: "Blog not found."
            });
        }

        res.json(data[0]);

    } catch (error) {
        console.log("GET ONE BLOG ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch blog."
        });
    }
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
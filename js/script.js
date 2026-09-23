// =========================
// REGISTER
// =========================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function(event) {

        event.preventDefault();

        alert("Registration successful!");

        window.location.href = "login.html";

    });

}


// =========================
// LOGIN
// =========================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const email =
            document.getElementById("email").value;

        const password =
            document.getElementById("password").value;


        if (email === "" || password === "") {

            alert("Please fill in all fields.");

        } else {

            alert("Login successful!");

            window.location.href = "dashboard.html";

        }

    });

}


// =========================
// CREATE / EDIT BLOG
// =========================

const blogForm =
    document.getElementById("blogForm");

if (blogForm) {

    const titleInput =
        document.getElementById("title");

    const categoryInput =
        document.getElementById("category");

    const contentInput =
        document.getElementById("content");

    const formTitle =
        document.getElementById("formTitle");

    const publishButton =
        document.getElementById("publishButton");


    const editIndex =
        localStorage.getItem("editIndex");


    if (editIndex !== null) {

        const blogs =
            JSON.parse(
                localStorage.getItem("blogs")
            ) || [];


        const blog =
            blogs[Number(editIndex)];


        if (blog) {

            titleInput.value = blog.title;

            categoryInput.value = blog.category;

            contentInput.value = blog.content;

            formTitle.textContent = "Edit Blog";

            publishButton.textContent = "Update Blog";

        }

    }


    blogForm.addEventListener("submit", function(event) {

        event.preventDefault();


        const title =
            titleInput.value.trim();

        const category =
            categoryInput.value.trim();

        const content =
            contentInput.value.trim();


        if (
            title === "" ||
            category === "" ||
            content === ""
        ) {

            alert("Please fill in all fields.");

            return;

        }


        const blogs =
            JSON.parse(
                localStorage.getItem("blogs")
            ) || [];


        if (editIndex !== null) {

            blogs[Number(editIndex)] = {

                title: title,

                category: category,

                content: content

            };


            localStorage.setItem(
                "blogs",
                JSON.stringify(blogs)
            );


            localStorage.removeItem("editIndex");


            alert("Blog updated successfully!");

        } else {

            blogs.push({

                title: title,

                category: category,

                content: content

            });


            localStorage.setItem(
                "blogs",
                JSON.stringify(blogs)
            );


            alert("Blog published successfully!");

        }


        window.location.href =
            "dashboard.html";

    });

}


// =========================
// GET ALL BLOGS
// =========================

let allBlogs = [];

const storedBlogs =
    JSON.parse(
        localStorage.getItem("blogs")
    ) || [];

allBlogs = storedBlogs;


// =========================
// DASHBOARD
// =========================

const totalBlogs =
    document.getElementById("totalBlogs");

const publishedBlogs =
    document.getElementById("publishedBlogs");

const draftBlogs =
    document.getElementById("draftBlogs");

const blogDisplay =
    document.getElementById("blogDisplay");

const searchBlog =
    document.getElementById("searchBlog");


function displayBlogs(blogs) {

    if (!blogDisplay) {
        return;
    }


    blogDisplay.innerHTML = "";


    if (blogs.length === 0) {

        blogDisplay.innerHTML = `

            <p>
                No blogs found.
            </p>

        `;

        return;

    }


    blogs.forEach(function(blog) {

        const originalIndex =
            allBlogs.indexOf(blog);


        blogDisplay.innerHTML += `

            <div class="dashboard-card">

                <h2>
                    ${blog.title}
                </h2>

                <p>
                    <strong>Category:</strong>
                    ${blog.category}
                </p>

                <p>
                    ${blog.content}
                </p>

                <button
                    onclick="editBlog(${originalIndex})"
                    style="
                        background-color: #007bff;
                        margin-right: 10px;
                    ">
                    Edit Blog
                </button>

                <button
                    onclick="deleteBlog(${originalIndex})"
                    style="
                        background-color: #dc3545;
                    ">
                    Delete Blog
                </button>

            </div>

        `;

    });

}


if (
    totalBlogs &&
    publishedBlogs &&
    draftBlogs
) {

    totalBlogs.textContent =
        allBlogs.length;

    publishedBlogs.textContent =
        allBlogs.length;

    draftBlogs.textContent =
        "0";


    displayBlogs(allBlogs);

}


// =========================
// SEARCH BLOGS
// =========================

if (searchBlog) {

    searchBlog.addEventListener("input", function() {

        const searchText =
            searchBlog.value
                .toLowerCase()
                .trim();


        const filteredBlogs =
            allBlogs.filter(function(blog) {

                return (

                    blog.title
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    blog.category
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    blog.content
                        .toLowerCase()
                        .includes(searchText)

                );

            });


        displayBlogs(filteredBlogs);

    });

}


// =========================
// EDIT BLOG
// =========================

function editBlog(index) {

    localStorage.setItem(
        "editIndex",
        index
    );


    window.location.href =
        "create-blog.html";

}


// =========================
// DELETE BLOG
// =========================

function deleteBlog(index) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this blog?"
        );


    if (confirmDelete) {

        const blogs =
            JSON.parse(
                localStorage.getItem("blogs")
            ) || [];


        blogs.splice(index, 1);


        localStorage.setItem(
            "blogs",
            JSON.stringify(blogs)
        );


        alert(
            "Blog deleted successfully!"
        );


        window.location.href =
            "dashboard.html";

    }

}


// =========================
// HOME PAGE BLOGS
// =========================

const homeBlogDisplay =
    document.getElementById("homeBlogDisplay");


if (homeBlogDisplay) {

    const blogs =
        JSON.parse(
            localStorage.getItem("blogs")
        ) || [];


    if (blogs.length === 0) {

        homeBlogDisplay.innerHTML = `

            <p>
                No blogs published yet.
            </p>

        `;

    } else {

        blogs.forEach(function(blog) {

            homeBlogDisplay.innerHTML += `

                <div class="home-blog-card">

                    <h3>
                        ${blog.title}
                    </h3>

                    <p>
                        <strong>
                            Category:
                        </strong>
                        ${blog.category}
                    </p>

                    <p>
                        ${blog.content}
                    </p>

                </div>

            `;

        });

    }

}
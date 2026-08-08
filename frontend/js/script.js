// =========================
// UTILITY & INTERACTION HELPERS
// =========================
const API_URL = "https://dream-homes-backend-14pp.onrender.com";

function viewDetails(id) {

    window.location.href =
        `property-details.html?id=${id}`;

}

function toggleInfo(id) {
    const info = document.getElementById(id);
    if (info) {
        info.style.display = (info.style.display === "block") ? "none" : "block";
    }
}

function toggleWishlist(id) {

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    if (wishlist.includes(id)) {

        wishlist = wishlist.filter(item => item !== id);

    } else {

        wishlist.push(id);

    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    loadProperties();
}
// Global state for property editing
let editId = null;

// Helper to escape HTML characters and prevent XSS
function escapeHTML(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// =========================
// LOAD PROPERTIES
// =========================

async function loadProperties() {
    try {

        const response = await fetch(`${API_URL}/api/property`);

        if (!response.ok) {
            throw new Error("Failed to fetch properties");
        }

        const properties = await response.json();
        const searchInput = document.getElementById("searchInput");
        const categoryFilter = document.getElementById("categoryFilter");

        let filteredProperties = properties;

        if (searchInput) {

            const searchValue = searchInput.value.toLowerCase();

            filteredProperties = filteredProperties.filter(property =>
                property.location.toLowerCase().includes(searchValue)
            );

        }

        if (categoryFilter && categoryFilter.value !== "") {

            filteredProperties = filteredProperties.filter(property =>
                property.category === categoryFilter.value
            );

        }
        const container =
            document.getElementById("propertyContainer") ||
            document.getElementById("adminPropertyContainer");


        if (container) {

            container.innerHTML = "";


            filteredProperties.forEach(property => {


                const card = document.createElement("div");

                card.className = "property-card";


                card.innerHTML = `

<div class="property-image">

    <img src="images/${escapeHTML(property.image)}"
         alt="${escapeHTML(property.title)}">

    <button class="wishlist-btn" onclick="toggleWishlist('${property._id}')">
    ${JSON.parse(localStorage.getItem("wishlist") || "[]").includes(property._id) ? "❤️" : "🤍"}
</button>

</div>

<div class="property-content">

    <h3>${escapeHTML(property.title)}</h3>

    <div class="property-info">

        <span>🛏 ${escapeHTML(property.bedrooms)} Bedrooms</span>

        <span>🛁 ${escapeHTML(property.bathrooms)} Bathrooms</span>

    </div>

    <p>📐 ${escapeHTML(property.area)}</p>

    <p>💰 ₹${escapeHTML(property.price)}</p>

    <p>📍 ${escapeHTML(property.location)}</p>

    <p>🏷 ${escapeHTML(property.category)}</p>
    <p class="property-description">
    ${escapeHTML(property.description)}
</p>

   <button class="details-btn" onclick="viewDetails('${property._id}')">
    More Details
</button>

</div>
`;


                if (document.getElementById("adminPropertyContainer")) {

                    const adminButtons = document.createElement("div");

                    adminButtons.innerHTML = `
    <button type="button" class="edit-btn">✏️ Edit</button>
    <button type="button" class="delete-btn">🗑 Delete</button>
`;

                    card.querySelector(".property-content").appendChild(adminButtons);

                    adminButtons.querySelector(".edit-btn").onclick = function() {
                        console.log("Edit clicked");
                        editProperty(property._id);
                    };

                    adminButtons.querySelector(".delete-btn").onclick = function() {
                        deleteProperty(property._id);
                    };
                }
                container.appendChild(card);


            });

        }


    } catch (error) {

        console.error("Error loading properties:", error);

    }
}
// =========================
// EDIT PROPERTY
// =========================

async function editProperty(id) {

    console.log("Edit button clicked", id);

    editId = id;

    try {
        const response = await fetch(`${API_URL}/api/property`);
        if (!response.ok) throw new Error("Failed to fetch property details");

        const property = await response.json();
        console.log(property);

        // Populate form inputs securely
        const titleEl = document.getElementById("title");
        const priceEl = document.getElementById("price");
        const locationEl = document.getElementById("location");
        const bedroomsEl = document.getElementById("bedrooms");
        const bathroomsEl = document.getElementById("bathrooms");
        const areaEl = document.getElementById("area");
        const mapEl = document.getElementById("map");
        const categoryEl = document.getElementById("category");
        const imageEl = document.getElementById("image");
        const descriptionEl = document.getElementById("description");
        const submitBtn = document.querySelector("#propertyForm button[type='submit']") || document.querySelector("#propertyForm button");

        if (titleEl) titleEl.value = property.title || "";
        if (priceEl) priceEl.value = property.price || "";
        if (locationEl) locationEl.value = property.location || "";
        if (bedroomsEl) bedroomsEl.value = property.bedrooms || "";
        if (bathroomsEl) bathroomsEl.value = property.bathrooms || "";
        if (areaEl) areaEl.value = property.area || "";
        if (mapEl) mapEl.value = property.map || "";
        if (categoryEl) categoryEl.value = property.category || "";
        if (imageEl) imageEl.value = property.image || "";
        if (descriptionEl) descriptionEl.value = property.description || "";

        if (submitBtn) submitBtn.innerText = "Update Property";

    } catch (error) {
        console.error("Error fetching property for edit:", error);
    }
}

// =========================
// DOM LOADED EVENT LISTENERS
// =========================

document.addEventListener("DOMContentLoaded", function() {

    // -------------------------
    // HERO SLIDER
    // -------------------------
    const heroSection = document.querySelector(".hero");

    if (heroSection) {
        const heroImages = [
            "images/hero1.jpg", "images/hero2.jpg", "images/hero3.jpg",
            "images/hero4.jpg", "images/hero5.jpg", "images/hero6.jpg",
            "images/hero7.jpg", "images/hero8.jpg", "images/hero9.jpg",
            "images/hero10.jpg"
        ];

        let currentImage = 0;

        function changeHeroImage() {
            heroSection.style.backgroundImage = `url('${heroImages[currentImage]}')`;
            currentImage = (currentImage + 1) % heroImages.length;
        }

        changeHeroImage();
        setInterval(changeHeroImage, 4000);
    }

    // -------------------------
    // LOGIN FORM
    // -------------------------
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async function(e) {
            e.preventDefault();

            const loginData = {
                email: loginForm.email.value,
                password: loginForm.password.value
            };

            try {
                const response = await fetch(`${API_URL}/api/users/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(loginData)
                });

                const data = await response.json();

                if (response.ok) {
                    alert("Login Successful ✅");
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    loginForm.reset();
                    window.location.href = "admin.html";
                } else {
                    alert(data.message || "Login failed");
                }
            } catch (error) {
                console.error("Login error:", error);
                alert("Server Error");
            }
        });
    }

    // -------------------------
    // REGISTER FORM
    // -------------------------
    const registerForm = document.getElementById("registerForm");

    if (registerForm) {
        registerForm.addEventListener("submit", async function(e) {
            e.preventDefault();

            const userData = {
                name: registerForm.name.value,
                email: registerForm.email.value,
                password: registerForm.password.value
            };

            try {
                const response = await fetch(`${API_URL}/api/users/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userData)
                });

                const data = await response.json();

                if (response.ok) {
                    alert("Registration Successful 🎉");
                    registerForm.reset();
                } else {
                    alert(data.message || "Registration failed");
                }
            } catch (error) {
                console.error("Registration error:", error);
                alert("Server Error");
            }
        });
    }

    // -------------------------
    // CONTACT FORM
    // -------------------------
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", async function(e) {
            e.preventDefault();

            const formData = {
                name: contactForm.name.value,
                email: contactForm.email.value,
                phone: contactForm.phone.value,
                message: contactForm.message.value
            };

            try {
                const response = await fetch(`${API_URL}/api/contact`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok) {
                    alert("Message Sent Successfully ✅");
                    contactForm.reset();
                } else {
                    alert(data.message || "Failed to send message");
                }
            } catch (error) {
                console.error("Contact form error:", error);
                alert("Server Error");
            }
        });
    }

    // -------------------------
    // ADMIN ADD / EDIT PROPERTY FORM
    // -------------------------
    const propertyForm = document.getElementById("propertyForm");

    if (propertyForm) {
        propertyForm.addEventListener("submit", async function(e) {
            e.preventDefault();

            const token = localStorage.getItem("token");

            const propertyData = {
                title: document.getElementById("title").value,
                price: document.getElementById("price").value,
                location: document.getElementById("location").value,
                category: document.getElementById("category").value,
                bedrooms: document.getElementById("bedrooms").value,
                bathrooms: document.getElementById("bathrooms").value,
                area: document.getElementById("area").value,
                map: document.getElementById("map").value,
                image: document.getElementById("image").value,
                description: document.getElementById("description").value
            };

            try {
                const url = editId ?
                    `${API_URL}/api/property/${editId}` :
                    "${API_URL}/api/property";

                const response = await fetch(url, {
                    method: editId ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(propertyData)
                });

                const data = await response.json();

                if (response.ok) {
                    alert(editId ? "Property Updated Successfully ✅" : "Property Added Successfully ✅");
                    propertyForm.reset();
                    editId = null;

                    const submitBtn = document.querySelector("#propertyForm button[type='submit']") || document.querySelector("#propertyForm button");
                    if (submitBtn) submitBtn.innerText = "Add Property";

                    loadProperties();
                } else {
                    alert(data.message || "Operation failed");
                }
            } catch (error) {
                console.error("Property submit error:", error);
                alert("Server Error");
            }
        });
    }

    // Initial load
    loadProperties();
    loadWishlist();

    // Search
    const searchInput = document.getElementById("searchInput");

    if (searchInput) {
        searchInput.addEventListener("keyup", loadProperties);
    }

    // Category Filter
    const categoryFilter = document.getElementById("categoryFilter");

    if (categoryFilter) {
        categoryFilter.addEventListener("change", loadProperties);
    }

});


// =========================
// DELETE PROPERTY
// =========================

async function deleteProperty(id) {

    const confirmDelete = confirm("Are you sure you want to delete this property?");

    if (!confirmDelete) {
        return;
    }

    const token = localStorage.getItem("token");

    try {

        const response = await fetch(
            `${API_URL}/api/property/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (response.ok) {

            alert("Property Deleted Successfully ✅");

            loadProperties();

        } else {

            alert(data.message || "Delete Failed");

        }

    } catch (error) {

        console.error(error);

        alert("Server Error");

    }

}

// =========================
// PROPERTY DETAILS PAGE
// =========================

async function loadPropertyDetails() {

    const params = new URLSearchParams(window.location.search);

    const id = params.get("id");

    if (!id) return;

    try {

        const response = await fetch(`${API_URL}/api/property/${id}`);

        const property = await response.json();

        const container = document.getElementById("propertyDetails");

        if (!container) return;

        container.innerHTML = `

<div class="details-card">

    <div class="details-image">

        <img src="images/${property.image}" alt="${property.title}">

        <button class="wishlist-btn"
            onclick="toggleWishlist('${property._id}')">

            ${
                JSON.parse(localStorage.getItem("wishlist") || "[]").includes(property._id)
                ? "❤️"
                : "🤍"
            }

        </button>

    </div>

    <div class="details-content">

        <h2>${property.title}</h2>

        <p>🛏 <strong>Bedrooms:</strong> ${property.bedrooms}</p>

        <p>🛁 <strong>Bathrooms:</strong> ${property.bathrooms}</p>

        <p>📐 <strong>Area:</strong> ${property.area}</p>

        <p>💰 <strong>Price:</strong> ₹${property.price}</p>

        <p>📍 <strong>Location:</strong> ${property.location}</p>

        <p>🏷 <strong>Category:</strong> ${property.category}</p>

        <p>${property.description}</p>

        <button class="details-btn"
onclick="viewDetails('${property._id}')">
    More Details
</button>

    </div>

</div>

`;

    } catch (error) {

        console.log(error);

    }

}

// Run only on property.html
loadPropertyDetails();


async function loadPropertyDetails() {

    const container = document.getElementById("propertyDetails");

    if (!container) return;

    const params = new URLSearchParams(window.location.search);

    const id = params.get("id");

    try {

        const response = await fetch(`${API_URL}/api/property/${id}`);

        const property = await response.json();

        container.innerHTML = `

        <div class="details-card">

            <img src="images/${property.image}" class="details-image">

            <div class="details-content">

                <h2>${property.title}</h2>

                <p><strong>Price :</strong> ₹${property.price}</p>

                <p><strong>Location :</strong> ${property.location}</p>

                <p><strong>Category :</strong> ${property.category}</p>

                <p><strong>Bedrooms :</strong> ${property.bedrooms}</p>

                <p><strong>Bathrooms :</strong> ${property.bathrooms}</p>

                <p><strong>Area :</strong> ${property.area}</p>

                <p>${property.description}</p>

            </div>

        </div>

        `;

    } catch (error) {

        console.log(error);

    }

}

loadPropertyDetails();

// =========================
// PROPERTY DETAILS PAGE
// =========================

async function loadPropertyDetails() {

    const detailsContainer = document.getElementById("propertyDetails");

    if (!detailsContainer) return;

    const params = new URLSearchParams(window.location.search);

    const id = params.get("id");

    try {

        const response = await fetch(`${API_URL}/api/property/${id}`);

        const property = await response.json();

        detailsContainer.innerHTML =
            `

        <div class="details-card">

            <div class="details-image">

                <img src="images/${property.image}" alt="${property.title}">

            </div>

            <div class="details-content">

                <h2>${property.title}</h2>

                <h3>₹${property.price}</h3>

                <p>📍 ${property.location}</p>

                <p>🏷 ${property.category}</p>

                <p>🛏 ${property.bedrooms} Bedrooms</p>

                <p>🛁 ${property.bathrooms} Bathrooms</p>

                <p>📐 ${property.area}</p>

                <hr>

                <h3>Description</h3>

                <p>${property.description}</p>

                <hr>

<h3>Features</h3>

<ul class="feature-list">

<li>🏊 Swimming Pool</li>

<li>🚗 Parking</li>

<li>🌳 Garden</li>

<li>🛡 24x7 Security</li>

<li>🏋 Gym</li>

</ul>

<div class="details-buttons">

    <button class="contact-btn">
        📞 Contact Owner
    </button>

    <button class="wishlist-detail">
        ❤️ Add Wishlist
    </button>

</div>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Property Details | Dream Homes</title>

    <link rel="stylesheet" href="css/style.css">
</head>

<body>

    <header>

        <h1>Dream Homes</h1>

        <nav>
            <a href="index.html" class="active">Home</a>
            <a href="properties.html">Properties</a>
            <a href="About.html">About</a>
            <a href="Contact.html">Contact</a>
            <a href="admin.html" class="active">Admin</a>
            <a href="login.html" class="nav-btn login-btn">Login</a>
            <a href="register.html" class="nav-btn register-btn">Register</a>
        </nav>

    </header>

    <section class="property-details">

        <div id="propertyDetails">

            <!-- JS will load property here -->
            <hr>

            <h3>Location</h3>

            <iframe src="${property.map}" width="100%" height="350" style="border:0; border-radius:12px;" allowfullscreen="" loading="lazy">
</iframe>

        </div>

    </section>

    <script src="js/script.js"></script>

</body>

</html>
<hr>

<h2>Related Properties</h2>

<div id="relatedProperties" class="related-properties"></div>

</div>

</div>
        `;

        // ===========================
        // LOAD RELATED PROPERTIES
        // ===========================

        const relatedResponse = await fetch(`${API_URL}/api/property`);

        const allProperties = await relatedResponse.json();

        const relatedProperties = allProperties.filter(item =>
            item.category === property.category &&
            item._id !== property._id
        );

        const relatedContainer = document.getElementById("relatedProperties");

        relatedProperties.forEach(item => {

            relatedContainer.innerHTML += `

    <div class="related-card">

        <img src="images/${item.image}" alt="${item.title}">

        <h3>${item.title}</h3>

        <p>₹${item.price}</p>

        <button onclick="viewDetails('${item._id}')">
            View Details
        </button>

    </div>

    `;

        });

    } catch (error) {

        console.log(error);

    }

}

loadPropertyDetails();

// =========================
// LOAD WISHLIST
// =========================

async function loadWishlist() {

    const container = document.getElementById("wishlistContainer");

    if (!container) return;

    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    try {

        const response = await fetch(`${API_URL}/api/property`);
        const properties = await response.json();

        const wishlistProperties = properties.filter(property =>
            wishlist.includes(property._id)
        );

        container.innerHTML = "";

        if (wishlistProperties.length === 0) {

            container.innerHTML = "<h2>No properties in wishlist ❤️</h2>";
            return;

        }

        wishlistProperties.forEach(property => {

            const card = document.createElement("div");

            card.className = "property-card";

            card.innerHTML = `

<div class="property-image">

<img src="images/${property.image}" alt="${property.title}">

</div>

<div class="property-content">

<h3>${property.title}</h3>

<p>💰 ₹${property.price}</p>

<p>📍 ${property.location}</p>

<p>🏷 ${property.category}</p>

<button class="details-btn"
onclick="viewDetails('${property._id}')">
More Details
</button>
<button class="remove-btn"
onclick="toggleWishlist('${property._id}')">
🗑 Remove
</button>
</div>

`;

            container.appendChild(card);

        });

    } catch (error) {

        console.log(error);

    }

}
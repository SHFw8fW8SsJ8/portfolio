const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const session = require("express-session");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from project root
app.use(express.static(__dirname));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Create uploads directory if it doesn't exist
const UPLOADS_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Root route serves index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Middleware to serve HTML files without .html extension
app.get("/:page", (req, res, next) => {
  const page = req.params.page;
  const filePath = path.join(__dirname, `${page}.html`);
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    next();
  }
});

app.use(session({
  secret: "your_secret_key",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

const ADMIN_USER = "admin";
const ADMIN_PASS = "123";

function isAuthenticated(req) {
  return req.session && req.session.loggedIn;
}

// Login status endpoint
app.get("/api/status", (req, res) => {
  res.json({ loggedIn: !!(req.session && req.session.loggedIn) });
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    req.session.loggedIn = true;
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, error: "Invalid credentials" });
  }
});

app.post("/api/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

app.get("/admin", (req, res) => {
  if (!isAuthenticated(req)) {
    return res.sendFile(path.join(__dirname, "admin.html"));
  }
  res.sendFile(path.join(__dirname, "admin.html"));
});

app.use("/api/admin", (req, res, next) => {
  if (!isAuthenticated(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
});
const COMMENTS_FILE = path.join(__dirname, "comments.json");
const POSTS_FILE = path.join(__dirname, "posts.json");
const PROJECTS_FILE = path.join(__dirname, "projects.json");

function readPosts() {
  try {
    const raw = fs.readFileSync(POSTS_FILE, "utf8");
    const json = JSON.parse(raw || "{}");
    return Array.isArray(json.posts) ? json.posts : [];
  } catch (e) {
    return [];
  }
}

function writePosts(all) {
  const payload = { posts: all };
  fs.writeFileSync(POSTS_FILE, JSON.stringify(payload, null, 2), "utf8");
}


function readComments() {
  try {
    const raw = fs.readFileSync(COMMENTS_FILE, "utf8");
    const json = JSON.parse(raw || "{}");
    return Array.isArray(json.comments) ? json.comments : [];
  } catch (e) {
    return [];
  }
}

function writeComments(all) {
  const payload = { comments: all };
  fs.writeFileSync(COMMENTS_FILE, JSON.stringify(payload, null, 2), "utf8");
}

function readProjects() {
  try {
    const raw = fs.readFileSync(PROJECTS_FILE, "utf8");
    const json = JSON.parse(raw || "{}");
    return Array.isArray(json.projects) ? json.projects : [];
  } catch (e) {
    return [];
  }
}

function writeProjects(all) {
  const payload = { projects: all };
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(payload, null, 2), "utf8");
}

// Get comments, optionally filtered by postId
app.get("/api/comments", (req, res) => {
  const postId = req.query.postId || null;
  const all = readComments();
  const filtered = postId ? all.filter(c => c.postId === postId) : all;
  res.json({ comments: filtered });
});

// Add a new comment (anonymous supported)
app.post("/api/comments", (req, res) => {
  const { postId, name, message, userId } = req.body || {};

  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "Message is required" });
  }

  const newComment = {
    id: Date.now().toString(),
    postId: postId && typeof postId === "string" ? postId : "default",
    name: name && name.trim() ? name.trim() : "Anonymous",
    message: message.trim(),
    createdAt: new Date().toISOString(),
    userId: userId || null
  };

  const all = readComments();
  all.push(newComment);
  writeComments(all);

  res.json({ comment: newComment });
});

// Posts API
app.get("/api/posts", (req, res) => {
  const all = readPosts();
  res.json({ posts: all });
});

app.get("/api/posts/:id", (req, res) => {
  const id = String(req.params.id || "").trim();
  const all = readPosts();
  const post = all.find(p => String(p.id) === id);
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }
  res.json({ post });
});

app.post("/api/posts", (req, res) => {
  const { title, date, author, categories, hero, excerpt, content, gallery } = req.body || {};
  if (!title || typeof title !== "string") {
    return res.status(400).json({ error: "Title is required" });
  }
  const all = readPosts();
  const nextId = all.length ? String(Math.max(...all.map(p => parseInt(p.id, 10) || 0)) + 1) : "1";
  const newPost = {
    id: nextId,
    title: title.trim(),
    date: date || new Date().toISOString().slice(0, 10),
    author: author || "Admin",
    categories: Array.isArray(categories) ? categories : [],
    hero: hero || "",
    excerpt: excerpt || "",
    content: Array.isArray(content) ? content : [],
    gallery: Array.isArray(gallery) ? gallery : []
  };
  all.push(newPost);
  writePosts(all);
  res.json({ post: newPost });
});

app.put("/api/posts/:id", (req, res) => {
  const id = String(req.params.id || "").trim();
  const all = readPosts();
  const idx = all.findIndex(p => String(p.id) === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Post not found" });
  }
  const current = all[idx];
  const body = req.body || {};

  const updated = {
    ...current,
    title: typeof body.title === "string" ? body.title.trim() : current.title,
    date: typeof body.date === "string" ? body.date : current.date,
    author: typeof body.author === "string" ? body.author : current.author,
    hero: typeof body.hero === "string" ? body.hero : current.hero,
    excerpt: typeof body.excerpt === "string" ? body.excerpt : current.excerpt,
    categories: Array.isArray(body.categories)
      ? body.categories
      : (typeof body.categories === "string" ? body.categories.split(",").map(s => s.trim()).filter(Boolean) : current.categories),
    content: Array.isArray(body.content)
      ? body.content
      : (typeof body.content === "string" ? body.content.split(/\r?\n/).map(s => s.trim()).filter(Boolean) : current.content),
    gallery: Array.isArray(body.gallery)
      ? body.gallery
      : (typeof body.gallery === "string" ? body.gallery.split(",").map(s => s.trim()).filter(Boolean) : current.gallery)
  };

  all[idx] = updated;
  writePosts(all);
  res.json({ post: updated });
});

app.delete("/api/posts/:id", (req, res) => {
  const id = String(req.params.id || "").trim();
  const all = readPosts();
  const next = all.filter(p => String(p.id) !== id);
  if (next.length === all.length) {
    return res.status(404).json({ error: "Post not found" });
  }
  writePosts(next);
  res.json({ success: true });
});

// ==================== PROJECTS API ====================
app.get("/api/projects", (req, res) => {
  const all = readProjects();
  res.json({ projects: all });
});

app.get("/api/projects/:id", (req, res) => {
  const id = String(req.params.id || "").trim();
  const all = readProjects();
  const project = all.find(p => String(p.id) === id);
  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }
  res.json({ project });
});

app.post("/api/projects", (req, res) => {
  const { title, date, category, image1, image2, image3, image4, paragraph1, paragraph2Title, paragraph2 } = req.body || {};
  if (!title || typeof title !== "string") {
    return res.status(400).json({ error: "Title is required" });
  }
  const all = readProjects();
  const nextId = all.length ? String(Math.max(...all.map(p => parseInt(p.id, 10) || 0)) + 1) : "1";
  const newProject = {
    id: nextId,
    title: title.trim(),
    date: date || new Date().toISOString().slice(0, 10),
    category: category || "",
    image1: image1 || "",
    image2: image2 || "",
    image3: image3 || "",
    image4: image4 || "",
    paragraph1: paragraph1 || "",
    paragraph2Title: paragraph2Title || "",
    paragraph2: paragraph2 || ""
  };
  all.push(newProject);
  writeProjects(all);
  res.json({ project: newProject });
});

app.put("/api/projects/:id", (req, res) => {
  const id = String(req.params.id || "").trim();
  const all = readProjects();
  const idx = all.findIndex(p => String(p.id) === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Project not found" });
  }
  const current = all[idx];
  const body = req.body || {};

  const updated = {
    ...current,
    title: typeof body.title === "string" ? body.title.trim() : current.title,
    date: typeof body.date === "string" ? body.date : current.date,
    category: typeof body.category === "string" ? body.category : (current.category || ""),
    image1: typeof body.image1 === "string" ? body.image1 : current.image1,
    image2: typeof body.image2 === "string" ? body.image2 : current.image2,
    image3: typeof body.image3 === "string" ? body.image3 : current.image3,
    image4: typeof body.image4 === "string" ? body.image4 : (current.image4 || ""),
    paragraph1: typeof body.paragraph1 === "string" ? body.paragraph1 : current.paragraph1,
    paragraph2Title: typeof body.paragraph2Title === "string" ? body.paragraph2Title : (current.paragraph2Title || ""),
    paragraph2: typeof body.paragraph2 === "string" ? body.paragraph2 : current.paragraph2
  };

  all[idx] = updated;
  writeProjects(all);
  res.json({ project: updated });
});

app.delete("/api/projects/:id", (req, res) => {
  const id = String(req.params.id || "").trim();
  const all = readProjects();
  const next = all.filter(p => String(p.id) !== id);
  if (next.length === all.length) {
    return res.status(404).json({ error: "Project not found" });
  }
  writeProjects(next);
  res.json({ success: true });
});

// Image upload route
app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({ filePath: `/uploads/${req.file.filename}` });
});

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3001;
function startServer(port){
  const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      const next = port + 1;
      console.log(`Port ${port} in use, retrying on ${next}...`);
      startServer(next);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
}
startServer(DEFAULT_PORT);
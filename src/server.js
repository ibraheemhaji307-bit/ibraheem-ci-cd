const express = require("express");
const session = require("express-session");
const path = require("path");
const bcrypt = require("bcrypt");
const { db, initDb } = require("./db");
const { seed } = require("./seed");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "ibraheem-secret",
    resave: false,
    saveUninitialized: false
  })
);

function requireLogin(req, res, next) {
  if (!req.session.user) return res.redirect("/login");
  next();
}

initDb();
seed();

app.get("/", (req, res) => res.redirect("/restaurants"));

app.get("/restaurants", (req, res) => {
  db.all("SELECT * FROM restaurants ORDER BY id DESC", (err, rows) => {
    res.render("restaurants", { restaurants: rows || [], user: req.session.user });
  });
});

app.get("/login", (req, res) => {
  res.render("login", { error: null });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
    if (!user) return res.render("login", { error: "wrong login" });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.render("login", { error: "wrong login" });

    req.session.user = { id: user.id, username: user.username };
    res.redirect("/admin");
  });
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
});

app.get("/admin", requireLogin, (req, res) => {
  db.all("SELECT * FROM restaurants ORDER BY id DESC", (err, rows) => {
    res.render("admin", { restaurants: rows || [], user: req.session.user });
  });
});

app.post("/admin/add", requireLogin, (req, res) => {
  const { name, city, rating } = req.body;
  if (!name || !city || !rating) return res.redirect("/admin");

  db.run(
    "INSERT INTO restaurants (name, city, rating) VALUES (?, ?, ?)",
    [name, city, Number(rating)],
    () => res.redirect("/admin")
  );
});

app.post("/admin/delete", requireLogin, (req, res) => {
  const { id } = req.body;
  db.run("DELETE FROM restaurants WHERE id = ?", [id], () => res.redirect("/admin"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("running on port " + PORT);
});

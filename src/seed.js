const bcrypt = require("bcrypt");
const { db } = require("./db");

async function seed() {
  const hash = await bcrypt.hash("admin123", 10);

  db.serialize(() => {
    db.run(`INSERT OR IGNORE INTO users (username, password_hash) VALUES (?, ?)`, [
      "admin",
      hash
    ]);

    db.get(`SELECT COUNT(*) AS c FROM restaurants`, (err, row) => {
      if (err) return;
      if (row.c === 0) {
        const items = [
          ["Ibraheem Grill", "Hebron", 5],
          ["Falafel Place", "Ramallah", 4],
          ["Pizza Time", "Nablus", 4]
        ];
        const stmt = db.prepare(`INSERT INTO restaurants (name, city, rating) VALUES (?, ?, ?)`);
        items.forEach((x) => stmt.run(x));
        stmt.finalize();
      }
    });
  });
}

module.exports = { seed };

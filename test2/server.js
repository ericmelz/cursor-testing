const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Database setup
const db = new sqlite3.Database('recipes.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the recipes database.');
});

// Initialize database with sample recipes
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS recipes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        ingredients TEXT NOT NULL,
        instructions TEXT NOT NULL,
        mood TEXT NOT NULL
    )`);

    // Insert sample recipes if the table is empty
    db.get("SELECT COUNT(*) as count FROM recipes", (err, row) => {
        if (row.count === 0) {
            const sampleRecipes = [
                {
                    name: "Comforting Mac and Cheese",
                    ingredients: "Macaroni, Cheese, Milk, Butter, Flour",
                    instructions: "1. Cook macaroni\n2. Make cheese sauce\n3. Combine and bake",
                    mood: "sad"
                },
                {
                    name: "Energizing Smoothie Bowl",
                    ingredients: "Banana, Berries, Yogurt, Granola, Honey",
                    instructions: "1. Blend fruits\n2. Top with granola\n3. Drizzle honey",
                    mood: "tired"
                },
                {
                    name: "Celebration Cake",
                    ingredients: "Flour, Sugar, Eggs, Butter, Vanilla",
                    instructions: "1. Mix ingredients\n2. Bake\n3. Decorate",
                    mood: "happy"
                }
            ];

            const stmt = db.prepare("INSERT INTO recipes (name, ingredients, instructions, mood) VALUES (?, ?, ?, ?)");
            sampleRecipes.forEach(recipe => {
                stmt.run(recipe.name, recipe.ingredients, recipe.instructions, recipe.mood);
            });
            stmt.finalize();
        }
    });
});

// Routes
app.get('/api/recipes/:mood', (req, res) => {
    const mood = req.params.mood;
    db.all("SELECT * FROM recipes WHERE mood = ?", [mood], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 
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
                    mood: "devastated"
                },
                {
                    name: "Energizing Smoothie Bowl", 
                    ingredients: "Banana, Berries, Yogurt, Granola, Honey",
                    instructions: "1. Blend fruits\n2. Top with granola\n3. Drizzle honey",
                    mood: "exhausted"
                },
                {
                    name: "Celebration Cake",
                    ingredients: "Flour, Sugar, Eggs, Butter, Vanilla",
                    instructions: "1. Mix ingredients\n2. Bake\n3. Decorate",
                    mood: "ecstatic"
                },
                {
                    name: "Comforting Chicken Enchiladas",
                    ingredients: "Chicken, Tortillas, Enchilada Sauce, Cheese, Onion, Garlic",
                    instructions: "1. Cook and shred chicken\n2. Mix with sauce and cheese\n3. Roll in tortillas\n4. Bake until bubbly",
                    mood: "devastated"
                },
                {
                    name: "Energizing Breakfast Burrito",
                    ingredients: "Eggs, Chorizo, Potatoes, Cheese, Tortilla, Salsa",
                    instructions: "1. Cook chorizo and potatoes\n2. Scramble eggs\n3. Combine in tortilla\n4. Top with salsa",
                    mood: "exhausted"
                },
                {
                    name: "Fiesta Nachos",
                    ingredients: "Tortilla Chips, Cheese, Beans, Jalapeños, Sour Cream, Guacamole",
                    instructions: "1. Layer chips and toppings\n2. Bake until cheese melts\n3. Add fresh toppings",
                    mood: "euphoric"
                },
                {
                    name: "Soothing Tortilla Soup",
                    ingredients: "Chicken, Tomatoes, Onion, Garlic, Cilantro, Avocado, Tortilla Strips",
                    instructions: "1. Sauté vegetables\n2. Add broth and chicken\n3. Simmer\n4. Top with fresh ingredients",
                    mood: "overwhelmed"
                },
                {
                    name: "Spicy Huevos Rancheros",
                    ingredients: "Eggs, Tortillas, Beans, Salsa, Avocado, Cilantro",
                    instructions: "1. Fry eggs\n2. Warm tortillas\n3. Layer with beans\n4. Top with salsa and avocado",
                    mood: "exhausted"
                },
                {
                    name: "Party Quesadillas",
                    ingredients: "Tortillas, Cheese, Chicken, Bell Peppers, Onions, Salsa",
                    instructions: "1. Layer ingredients\n2. Cook until golden\n3. Cut into wedges\n4. Serve with salsa",
                    mood: "euphoric"
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
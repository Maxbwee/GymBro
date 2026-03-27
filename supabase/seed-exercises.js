/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Seeds the exercises table directly via the Supabase JS client.
 * No SQL generation needed — avoids escaping issues.
 *
 * Usage:
 *   1. Download exercises.json from https://github.com/yuhonas/free-exercise-db
 *   2. Place it in this folder as exercises.json
 *   3. Set your Supabase URL and service role key below
 *   4. Run: node supabase/seed-exercises.js
 */

const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SERVICE_ROLE_KEY;

const inputPath = path.join(__dirname, "exercises.json");

if (!fs.existsSync(inputPath)) {
  console.error(
    "Error: exercises.json not found.\n" +
      "Download it from https://github.com/yuhonas/free-exercise-db\n" +
      "and place it in the supabase/ folder."
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
const exercises = JSON.parse(fs.readFileSync(inputPath, "utf-8"));

async function seed() {
  // Map JSON fields to our DB column names
  const rows = exercises.map((ex) => ({
    id: ex.id,
    name: ex.name,
    force: ex.force || null,
    level: ex.level || null,
    mechanic: ex.mechanic || null,
    equipment: ex.equipment || null,
    category: ex.category || null,
    primary_muscles: ex.primaryMuscles || [],
    secondary_muscles: ex.secondaryMuscles || [],
    instructions: ex.instructions || [],
    images: ex.images || [],
  }));

  // Insert in batches of 100 to avoid request size limits
  const BATCH_SIZE = 100;
  let inserted = 0;

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from("exercises").insert(batch);

    if (error) {
      console.error(`Error inserting batch starting at index ${i}:`, error.message);
      process.exit(1);
    }

    inserted += batch.length;
    console.log(`Inserted ${inserted} / ${rows.length} exercises`);
  }

  console.log("Done! All exercises seeded.");
}

seed();

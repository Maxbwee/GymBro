/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Converts the free-exercise-db JSON into SQL INSERT statements.
 *
 * Usage:
 *   1. Download exercises.json from https://github.com/yuhonas/free-exercise-db
 *   2. Place it in this folder as exercises.json
 *   3. Run: node generate-seed.js
 *   4. Copy the output from seed-exercises.sql into the Supabase SQL Editor
 */

const fs = require("fs");
const path = require("path");

const inputPath = path.join(__dirname, "exercises.json");
const outputPath = path.join(__dirname, "seed-exercises.sql");

if (!fs.existsSync(inputPath)) {
  console.error(
    "Error: exercises.json not found.\n" +
      "Download it from https://github.com/yuhonas/free-exercise-db\n" +
      "and place it in the supabase/ folder."
  );
  process.exit(1);
}

const exercises = JSON.parse(fs.readFileSync(inputPath, "utf-8"));

function escapeStr(str) {
  if (str == null) return "NULL";
  return "'" + str.replace(/'/g, "''") + "'";
}

function toPgArray(arr) {
  if (!arr || arr.length === 0) return "'{}'";
  const escaped = arr.map((s) => '"' + s.replace(/"/g, '\\"') + '"');
  return "'{" + escaped.join(",") + "}'";
}

let sql = "-- Auto-generated exercise seed data\n";
sql += "-- Generated from free-exercise-db\n\n";
sql += "INSERT INTO exercises (id, name, force, level, mechanic, equipment, category, primary_muscles, secondary_muscles, instructions, images) VALUES\n";

const rows = exercises.map((ex) => {
  return (
    "(" +
    [
      escapeStr(ex.id),
      escapeStr(ex.name),
      escapeStr(ex.force),
      escapeStr(ex.level),
      escapeStr(ex.mechanic),
      escapeStr(ex.equipment),
      escapeStr(ex.category),
      toPgArray(ex.primaryMuscles),
      toPgArray(ex.secondaryMuscles),
      toPgArray(ex.instructions),
      toPgArray(ex.images),
    ].join(", ") +
    ")"
  );
});

sql += rows.join(",\n") + ";\n";

fs.writeFileSync(outputPath, sql, "utf-8");
console.log(`Done! Generated ${rows.length} exercise inserts.`);
console.log(`Output: ${outputPath}`);
console.log("Paste the contents of seed-exercises.sql into the Supabase SQL Editor.");

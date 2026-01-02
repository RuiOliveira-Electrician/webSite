import fs from "fs";
import path from "path";
import { Merger } from "json-merger";
import { supportedTranledLngs } from "../../i18n/langs.js";

const FILE_NAMES = ["certifications", "experiences", "educations", "other", "projects", "programmingLanguages", "languages", "softSkills", "hardSkills"];
const BASE_FILES_DIR = "src/assets/data/base";
const INPUT_FILES_DIR = "src/assets/data";
const OUTPUT_DIR = path.resolve("src/resource/generated/translations");

// Base files per language
const BASE_FILES = Object.fromEntries(
  supportedTranledLngs.map(lang => [lang, path.resolve(BASE_FILES_DIR, `base_${lang}.json`)])
);

// Input files mapped to keys
const INPUT_FILES = FILE_NAMES.map(name => ({
  file: path.resolve(INPUT_FILES_DIR, `${name}.json`),
  key: name,
}));
// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// --- Extract a specific language ---
function extractLanguage(obj, lang) {
  if (Array.isArray(obj)) return obj.map(item => extractLanguage(item, lang));
  if (obj && typeof obj === "object") {
    const result = {};
    for (const key in obj) {
      const value = obj[key];
      if (value && typeof value === "object" && value[lang] !== undefined) {
        result[key] = value[lang];
      } else {
        result[key] = extractLanguage(value, lang);
      }
    }
    return result;
  }
  return obj;
}

// --- JSON merger setup ---
const merger = new Merger({
  defaultArrayMergeOperation: "concat",
  stringify: false, // keep as object
  spaces: 2,
  errorOnFileNotFound: true,
});

// --- Process each language ---
supportedTranledLngs.forEach(lang => {
  // Load or create base file
  if (!fs.existsSync(BASE_FILES[lang])) {
    console.warn(`Base file not found for ${lang}, creating empty JSON: ${BASE_FILES[lang]}`);
    fs.writeFileSync(BASE_FILES[lang], JSON.stringify({}, null, 2), "utf-8");
  }

  const baseJSON = JSON.parse(fs.readFileSync(BASE_FILES[lang], "utf-8"));

  // Merge all input files under their keys
  const mergedContent = INPUT_FILES.reduce((acc, { file, key }) => {
    if (!fs.existsSync(file)) {
      console.warn(`Input file not found: ${file}`);
      return acc;
    }

    const jsonData = JSON.parse(fs.readFileSync(file, "utf-8"));
    const langData = extractLanguage(jsonData, lang);

    // Merge under its own key
    return merger.mergeObject({
      ...acc,
      [key]: {
        $merge: {
          source: acc[key] || {},
          with: langData,
        },
      },
    });
  }, baseJSON);

  const outFile = path.resolve(OUTPUT_DIR, `${lang}.json`);
  fs.writeFileSync(outFile, JSON.stringify(mergedContent, null, 2), "utf-8");
  console.log(`Merged ${lang.toUpperCase()} JSON written to: ${outFile}`);
});

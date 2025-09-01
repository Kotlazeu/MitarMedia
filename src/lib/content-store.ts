
"use server";

import { promises as fs } from 'fs';
import path from 'path';

// In a real app, this would be a database. For now, we'll use a JSON file.
const contentFilePath = path.join(process.cwd(), 'src/lib/content.json');

const defaultContent = {
  "aiSection": {
    "rotatingTexts": ["Be", "We are"],
    "staticText": "Different"
  },
  "metrics": [
    { "value": 150, "unit": "M+", "labelKey": "views" },
    { "value": 5, "unit": "M+", "labelKey": "followers" },
    { "value": 200, "unit": "+", "labelKey": "clients" },
    { "value": 25, "unit": "M+", "labelKey": "revenue" }
  ]
};

async function ensureContentFile() {
  try {
    await fs.access(contentFilePath);
  } catch {
    await fs.writeFile(contentFilePath, JSON.stringify(defaultContent, null, 2), 'utf-8');
  }
}

export async function getContent() {
  await ensureContentFile();
  try {
    const fileContent = await fs.readFile(contentFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading content file, returning default content.", error);
    return defaultContent;
  }
}

export async function saveContent(content: any) {
  await ensureContentFile();
  await fs.writeFile(contentFilePath, JSON.stringify(content, null, 2), 'utf-8');
}

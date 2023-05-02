import path from "path";
import { saveFileToAzureStorage } from "../common/azure-blob-storage";
import { db } from "../common/db";
import { faker } from "@faker-js/faker";
import singale from "signale";
import { getConfig } from "../common/config";

async function main() {
  getConfig();
  const pictrue = await saveFileToAzureStorage({
    mimetype: "image/jpg",
    path: path.join(__dirname, "salesforce.jpg"),
    name: "Salesforce-Administration",
    access: "public",
  });

  // Create a course
  await db.course.create({
    data: {
      title: faker.science.chemicalElement().name,
      description: faker.random.words(100),
      pictrue,
    },
  });

  singale.info("Seed: course added");
}

main().catch(console.error);

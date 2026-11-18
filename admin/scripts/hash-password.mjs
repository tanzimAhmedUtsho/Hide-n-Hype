import { randomBytes, scryptSync } from "node:crypto";

const password = process.argv[2];
if (!password || password.length < 12) {
  console.error("Usage: node admin/scripts/hash-password.mjs <password> (minimum 12 characters)");
  process.exit(1);
}
const salt = randomBytes(16);
console.log(`${salt.toString("hex")}:${scryptSync(password, salt, 64).toString("hex")}`);

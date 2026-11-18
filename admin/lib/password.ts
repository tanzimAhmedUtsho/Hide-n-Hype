import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export function hashPassword(password: string) {
  if (password.length < 12 || password.length > 256) throw new Error("Password must be between 12 and 256 characters.");
  const salt = randomBytes(16);
  return `${salt.toString("hex")}:${scryptSync(password, salt, 64).toString("hex")}`;
}
export function verifyPassword(password: string, encodedHash: string) {
  const [saltHex, expectedHex] = encodedHash.split(":");
  if (!saltHex || !expectedHex || !/^[a-f0-9]{32}$/i.test(saltHex) || !/^[a-f0-9]{128}$/i.test(expectedHex)) return false;
  const actual = scryptSync(password, Buffer.from(saltHex, "hex"), 64);
  return timingSafeEqual(actual, Buffer.from(expectedHex, "hex"));
}

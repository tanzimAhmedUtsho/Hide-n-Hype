import { randomUUID } from "node:crypto";
import { getDb } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";

type CustomerRecord = {
  _id: string;
  email: string;
  name: string;
  phone: string;
  division: string;
  district: string;
  postalCode: string;
  address: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
};

export type CustomerProfile = Omit<CustomerRecord, "password_hash" | "_id" | "created_at" | "updated_at"> & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

function safeProfile(customer: CustomerRecord): CustomerProfile {
  return {
    id: customer._id, email: customer.email, name: customer.name, phone: customer.phone,
    division: customer.division, district: customer.district, postalCode: customer.postalCode, address: customer.address,
    createdAt: customer.created_at, updatedAt: customer.updated_at,
  };
}

function customers() {
  return getDb().then(db => db.collection<CustomerRecord>("customer_users"));
}

export async function createCustomer(input: {
  email: string; password: string; name: string; phone: string; division: string; district: string; postalCode: string; address: string;
}) {
  const email = input.email.trim().toLowerCase();
  const now = new Date().toISOString();
  const customer: CustomerRecord = {
    _id: randomUUID(), email, name: input.name.trim(), phone: input.phone.trim(), division: input.division.trim(),
    district: input.district.trim(), postalCode: input.postalCode.trim(), address: input.address.trim(),
    password_hash: hashPassword(input.password), created_at: now, updated_at: now,
  };
  await (await customers()).insertOne(customer);
  return safeProfile(customer);
}

export async function findCustomerByEmail(email: string) {
  return (await customers()).findOne({ email: email.trim().toLowerCase() });
}

export async function findCustomerById(id: string) {
  return (await customers()).findOne({ _id: id });
}

export async function listCustomers() {
  const records = await (await customers()).find().sort({ created_at: -1 }).limit(1000).toArray();
  return records.map(safeProfile);
}

export async function deleteCustomer(id: string) {
  const result = await (await customers()).deleteOne({ _id: id });
  return result.deletedCount > 0;
}

export async function verifyCustomerPassword(email: string, password: string) {
  const customer = await findCustomerByEmail(email);
  return customer && verifyPassword(password, customer.password_hash) ? safeProfile(customer) : null;
}

export async function updateCustomerProfile(id: string, input: Pick<CustomerProfile, "name" | "phone" | "division" | "district" | "postalCode" | "address">) {
  const updatedAt = new Date().toISOString();
  const result = await (await customers()).findOneAndUpdate(
    { _id: id },
    { $set: { ...input, updated_at: updatedAt } },
    { returnDocument: "after" },
  );
  return result ? safeProfile(result) : null;
}

export async function changeCustomerPassword(id: string, currentPassword: string, nextPassword: string) {
  const collection = await customers();
  const customer = await collection.findOne({ _id: id });
  if (!customer || !verifyPassword(currentPassword, customer.password_hash)) return false;
  await collection.updateOne({ _id: id }, { $set: { password_hash: hashPassword(nextPassword), updated_at: new Date().toISOString() } });
  return true;
}

export function toPublicCustomer(record: CustomerRecord) { return safeProfile(record); }

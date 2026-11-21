import assert from "node:assert/strict";
import test from "node:test";
import { normalizeEmail, normalizeCode } from "../lib/auth/input.ts";
import { readAuthSettings } from "../lib/auth/settings.ts";

test("email input is trimmed and rejects invalid or oversized form data", () => {
  assert.equal(normalizeEmail(" participant@example.test "), "participant@example.test");
  for (const value of [null, new Blob(["text"]), "name", "a b@example.test", "e@x@x.test", "x".repeat(250) + "@ex.test"]) {
    assert.equal(normalizeEmail(value), null);
  }
});

test("one-time codes preserve leading zeroes and reject malformed input", () => {
  assert.equal(normalizeCode(" 000492 "), "000492");
  assert.equal(normalizeCode("0001234567"), "0001234567");
  for (const value of ["", "123", "123456abc", "12345678901", null]) assert.equal(normalizeCode(value), null);
});

test("authentication requires both a key and a valid provider URL", () => {
  for (const url of [undefined, "bogus", "http://example.test", "https://a:b@example.test", "file:///tmp/db"]) {
    assert.equal(readAuthSettings({ SUPABASE_URL: url, SUPABASE_PUBLISHABLE_KEY: "example" }), null);
  }
  assert.equal(readAuthSettings({ SUPABASE_URL: "https://example.test" }), null);
  for (const url of ["http://127.0.0.1:54321", "https://auth.example.test"]) {
    assert.deepEqual(readAuthSettings({ SUPABASE_URL: url + "/", SUPABASE_PUBLISHABLE_KEY: "example" }), { url, key: "example" });
  }
});

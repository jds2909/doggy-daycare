import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);
const ownerId = "10000000-0000-4000-8000-000000000001";
const otherId = "20000000-0000-4000-8000-000000000002";

// Exercise the actual TypeScript server modules with isolated Auth/database boundaries.
function load(relativePath, mocks = {}, environment = {}) {
  const source = readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const loadedModule = { exports: {} };
  vm.runInNewContext(compiled, {
    exports: loadedModule.exports,
    module: loadedModule,
    require: (name) => {
      if (name === "server-only") return {};
      if (Object.hasOwn(mocks, name)) return mocks[name];
      if (name.startsWith("@/") || name.startsWith("next/")) throw new Error(`Unmocked boundary: ${name}`);
      return require(name);
    },
    process: { env: environment },
  }, { filename: relativePath });
  return loadedModule.exports;
}

function authModule(getUser, configuredId = ownerId) {
  return load("lib/admin/auth.ts", {
    "next/navigation": { redirect: (path) => { throw new Error(`redirect:${path}`); } },
    "@/lib/supabase-auth-server": { createAuthClient: async () => ({ auth: { getUser } }) },
  }, { ADMIN_USER_ID: configuredId });
}

test("guard denies missing, invalid and failed Auth sessions", async () => {
  for (const getUser of [
    async () => ({ data: { user: null }, error: null }),
    async () => ({ data: { user: { id: ownerId } }, error: { message: "invalid token" } }),
    async () => { throw new Error("Auth unavailable"); },
  ]) {
    await assert.rejects(authModule(getUser).requireAdmin(), /redirect:\/admin\/login$/);
  }
});

test("guard denies a valid Supabase user who is not the owner", async () => {
  const auth = authModule(async () => ({ data: { user: { id: otherId } }, error: null }));
  await assert.rejects(auth.requireAdmin(), /redirect:\/admin\/login\?denied=1/);
});

test("guard accepts only the verified owner and fails closed without configuration", async () => {
  const getUser = async () => ({ data: { user: { id: ownerId } }, error: null });
  assert.equal((await authModule(getUser).requireAdmin()).id, ownerId);
  for (const value of [undefined, "", "not-a-uuid"]) {
    await assert.rejects(authModule(getUser, value === undefined ? "" : value).requireAdmin(), /not configured/);
  }
});

const schema = load("lib/admin/enquiry-schema.ts");

function dataModule(guard, result = { data: null, error: null }) {
  const calls = [];
  const query = {};
  for (const method of ["from", "select", "order", "eq", "update"]) {
    query[method] = (...args) => { calls.push([method, ...args]); return query; };
  }
  query.range = async (...args) => { calls.push(["range", ...args]); return result; };
  query.maybeSingle = async () => result;
  const data = load("lib/admin/enquiries.ts", {
    "@/lib/admin/auth": { requireAdmin: async () => { calls.push(["guard"]); await guard(); } },
    "@/lib/admin/enquiry-schema": schema,
    "@/lib/supabase-server": { getSupabaseServerClient: () => { calls.push(["service-client"]); return query; } },
  });
  return { data, calls };
}

test("each read and mutation independently guards before obtaining the service client", async () => {
  for (const operation of [
    (data) => data.listEnquiries(1),
    (data) => data.getEnquiry(ownerId),
    (data) => data.updateEnquiryStatus({ enquiryId: ownerId, status: "CLOSED" }),
    (data) => data.updateEnquiryStatus({ enquiryId: "invalid", status: "invalid" }),
  ]) {
    const { data, calls } = dataModule(async () => { throw new Error("denied"); });
    await assert.rejects(operation(data), /denied/);
    assert.deepEqual(calls, [["guard"]]);
  }
});

test("status mutation rejects invalid statuses and IDs without database access", async () => {
  for (const input of [
    { enquiryId: ownerId, status: "DELETED" },
    { enquiryId: ownerId, status: "new" },
    { enquiryId: "invalid", status: "NEW" },
    { enquiryId: ownerId, status: "NEW", full_name: "overwrite" },
  ]) {
    const { data, calls } = dataModule(async () => {});
    assert.ok((await data.updateEnquiryStatus(input)).error);
    assert.deepEqual(calls, [["guard"]]);
  }
});

test("all four allowed statuses update only status and updated_at after authorization", async () => {
  for (const status of ["NEW", "PENDING_REVIEW", "CONTACTED", "CLOSED"]) {
    const { data, calls } = dataModule(async () => {}, { data: { id: ownerId }, error: null });
    assert.equal((await data.updateEnquiryStatus({ enquiryId: ownerId, status })).success, "Status saved.");
    assert.deepEqual(calls.slice(0, 2), [["guard"], ["service-client"]]);
    const update = calls.find(([method]) => method === "update")[1];
    assert.deepEqual(Object.keys(update).sort(), ["status", "updated_at"]);
    assert.equal(update.status, status);
    assert.ok(Number.isFinite(Date.parse(update.updated_at)));
    assert.ok(calls.some(([method, column, value]) => method === "eq" && column === "id" && value === ownerId));
  }
});

test("missing records and database errors do not report successful status changes", async () => {
  for (const result of [{ data: null, error: null }, { data: null, error: { message: "private database details" } }]) {
    const { data } = dataModule(async () => {}, result);
    const state = await data.updateEnquiryStatus({ enquiryId: ownerId, status: "NEW" });
    assert.ok(state.error);
    assert.equal(state.success, "");
    assert.doesNotMatch(state.error, /private database details/);
  }
});

test("list pagination is bounded and authorized before querying", async () => {
  const { data, calls } = dataModule(async () => {}, { data: [], error: null, count: 51 });
  assert.equal((await data.listEnquiries(2)).hasNext, true);
  assert.deepEqual(calls.slice(0, 2), [["guard"], ["service-client"]]);
  assert.deepEqual(calls.find(([method]) => method === "range"), ["range", 25, 49]);
});

test("detail preserves sensitive business fields and sorts dogs in recorded order", async () => {
  const { data } = dataModule(async () => {}, {
    error: null,
    data: {
      id: ownerId, status: "NEW", full_name: "Fictional Owner", home_address: "Fictional Address",
      enquiry_dogs: [
        { id: otherId, name: "Second", position: 2, dog_permissions: [] },
        { id: ownerId, name: "First", position: 1, microchip_number: "FICTIONAL", medical_condition_details: "Fictional details", dog_permissions: { off_lead_walking: false } },
      ],
    },
  });
  const detail = await data.getEnquiry(ownerId);
  assert.equal(detail.enquiry_dogs[0].name, "First");
  assert.equal(detail.enquiry_dogs[0].microchip_number, "FICTIONAL");
  assert.equal(detail.enquiry_dogs[0].medical_condition_details, "Fictional details");
  assert.equal(detail.enquiry_dogs[0].dog_permissions.off_lead_walking, false);
});

function loginActions(userId) {
  const calls = [];
  const actions = load("app/admin/actions.ts", {
    "next/headers": { cookies: async () => ({ getAll: () => [], set: () => {} }) },
    "next/navigation": { redirect: (path) => { throw new Error(`redirect:${path}`); } },
    "@/lib/admin/auth": { getAdminUserId: () => ownerId },
    "@/lib/supabase-auth-config": { adminCookieName: "doggy-admin-auth", adminCookieAttributes: {} },
    "@/lib/supabase-auth-server": { createAuthClient: async (writable) => {
      assert.equal(writable, true);
      return { auth: {
        signInWithPassword: async () => { calls.push("sign-in"); return { data: { user: userId ? { id: userId } : null }, error: null }; },
        signOut: async ({ scope }) => { calls.push(`sign-out:${scope}`); return { error: null }; },
      } };
    } },
  });
  return { actions, calls };
}

test("login validates credentials and rejects non-owner accounts", async () => {
  const invalid = loginActions(ownerId);
  assert.ok((await invalid.actions.login({}, new FormData())).error);
  assert.deepEqual(invalid.calls, []);
  const other = loginActions(otherId);
  const form = new FormData();
  form.set("email", "fictional@example.com");
  form.set("password", "fictional-test-password");
  assert.ok((await other.actions.login({}, form)).error);
  assert.deepEqual(other.calls, ["sign-in", "sign-out:local"]);
  const owner = loginActions(ownerId);
  await assert.rejects(owner.actions.login({}, form), /redirect:\/admin\/enquiries/);
});

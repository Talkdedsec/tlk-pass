// Runs the generator code from index.html against fake form controls. No dependencies: node --test tests/*.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const start = html.indexOf("<script>") + "<script>".length;
const end = html.indexOf("function paint(");
assert.ok(start > 8 && end > start, "generator code not found in index.html");

function load(controls = {}) {
  const el = {
    len: { value: "16" }, words: { value: "4" }, pinLen: { value: "6" }, sep: { value: "-" },
    oUp: { checked: true }, oLow: { checked: true }, oNum: { checked: true }, oSym: { checked: true },
    oAmb: { checked: false }, pCap: { checked: false }, pNum: { checked: false }, autoclear: { checked: false },
  };
  for (const [id, v] of Object.entries(controls)) Object.assign(el[id], v);
  const ctx = vm.createContext({
    crypto: globalThis.crypto,
    navigator: { language: "en-US" },
    localStorage: { getItem: () => null, setItem() {} },
    document: { getElementById: (id) => el[id] },
  });
  vm.runInContext(
    html.slice(start, end) +
      ";globalThis.api={rand,buildPool,genChars,genPhrase,genPin,entropy,crackTime,SETS,AMB,WORDS,setMode:m=>{mode=m}};",
    ctx,
  );
  return ctx.api;
}

test("rand stays in range and covers every value evenly", () => {
  const { rand } = load();
  const bins = new Array(10).fill(0);
  const draws = 100_000;
  for (let i = 0; i < draws; i++) {
    const v = rand(10);
    assert.ok(Number.isInteger(v) && v >= 0 && v < 10);
    bins[v]++;
  }
  // 10% tolerance is ~30 standard deviations here: a real bias fails, chance never does.
  for (const b of bins) assert.ok(Math.abs(b - draws / 10) < draws / 100, `uneven bins: ${bins}`);
});

test("character passwords have the right length and one of every chosen set", () => {
  const { genChars, SETS } = load({ len: { value: "12" } });
  const pool = SETS.up + SETS.low + SETS.num + SETS.sym;
  for (let i = 0; i < 500; i++) {
    const pw = genChars();
    assert.equal(pw.length, 12);
    for (const set of Object.values(SETS)) assert.ok([...pw].some((c) => set.includes(c)), `${pw} misses ${set}`);
    assert.ok([...pw].every((c) => pool.includes(c)));
  }
});

test("only the chosen sets are used", () => {
  const { genChars } = load({ oUp: { checked: false }, oSym: { checked: false } });
  for (let i = 0; i < 200; i++) assert.match(genChars(), /^[a-z0-9]{16}$/);
});

test("excluding ambiguous characters removes them all", () => {
  const { genChars, AMB } = load({ oAmb: { checked: true }, len: { value: "64" } });
  for (let i = 0; i < 200; i++) assert.ok([...genChars()].every((c) => !AMB.has(c)));
});

test("no set selected gives an empty password", () => {
  const off = { checked: false };
  const { genChars } = load({ oUp: off, oLow: off, oNum: off, oSym: off });
  assert.equal(genChars(), "");
});

test("passphrases use the word list, separator, capitals and digits", () => {
  const { genPhrase, WORDS } = load({ words: { value: "5" }, sep: { value: "." }, pCap: { checked: true }, pNum: { checked: true } });
  const words = new Set(WORDS.en);
  for (let i = 0; i < 200; i++) {
    const parts = genPhrase().split(".");
    assert.equal(parts.length, 6);
    const n = Number(parts.pop());
    assert.ok(n >= 10 && n <= 99);
    for (const w of parts) {
      assert.match(w[0], /[A-Z]/);
      assert.ok(words.has(w.toLowerCase()), w);
    }
  }
});

test("PINs are digits of the chosen length", () => {
  const { genPin } = load({ pinLen: { value: "8" } });
  for (let i = 0; i < 200; i++) assert.match(genPin(), /^\d{8}$/);
});

test("entropy matches the pool size and mode", () => {
  const api = load();
  const pool = api.buildPool().pool.length;
  assert.equal(api.entropy("x".repeat(16)), 16 * Math.log2(pool));
  api.setMode("pin");
  assert.equal(api.entropy("123456"), 6 * Math.log2(10));
  api.setMode("phrase");
  assert.equal(api.entropy(""), 4 * Math.log2(api.WORDS.en.length));
});

test("crack time covers both ends of the scale", () => {
  const { crackTime } = load();
  assert.equal(crackTime(0), "instant");
  assert.equal(crackTime(200), "forever");
});

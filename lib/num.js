// Math.sin/cos/hypot can differ in the last digits between Node (server render) and the browser,
// which makes React report hydration mismatches. Round anything rendered into the HTML.
export const r = (n, d = 2) => {
  const k = 10 ** d;
  return Math.round(n * k) / k;
};

// Deterministic 0..1 pseudo-random from an integer, using only integer math (identical everywhere).
export const hash01 = (i) => {
  let x = (i + 1) * 0x9e3779b1;
  x = Math.imul(x ^ (x >>> 16), 0x85ebca6b);
  x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35);
  x ^= x >>> 16;
  return (x >>> 0) / 4294967296;
};

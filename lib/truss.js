// Minimal 2D truss solver (direct stiffness method).
// Nodes: [{x, y}], members: [[i, j]], supports: {nodeIndex: [fixX, fixY]}.

export function buildPratt(panels = 6, span = 600, height = 110) {
  const dx = span / panels;
  const nodes = [];
  for (let i = 0; i <= panels; i++) nodes.push({ x: i * dx, y: 0 }); // bottom chord
  for (let i = 1; i < panels; i++) nodes.push({ x: i * dx, y: -height }); // top chord
  const top = (i) => panels + i; // top node above bottom node i (1..panels-1)

  const members = [];
  for (let i = 0; i < panels; i++) members.push([i, i + 1]);
  for (let i = 1; i < panels - 1; i++) members.push([top(i), top(i + 1)]);
  for (let i = 1; i < panels; i++) members.push([i, top(i)]); // verticals
  members.push([0, top(1)], [panels, top(panels - 1)]); // end posts
  const mid = panels / 2;
  for (let i = 1; i < panels - 1; i++) {
    // Pratt diagonals slope down toward midspan
    if (i < mid) members.push([top(i), i + 1]);
    else members.push([i, top(i + 1)]);
  }
  return { nodes, members, supports: { 0: [1, 1], [panels]: [0, 1] }, deck: panels + 1 };
}

// loads: [{node, fx, fy}]. Returns {forces[], displacements[], reactions{}}.
export function solve({ nodes, members, supports }, loads, EA = 1e5) {
  const n = nodes.length * 2;
  const K = Array.from({ length: n }, () => new Float64Array(n));
  const F = new Float64Array(n);
  const geo = members.map(([a, b]) => {
    const ddx = nodes[b].x - nodes[a].x;
    const ddy = nodes[b].y - nodes[a].y;
    const L = Math.hypot(ddx, ddy);
    return { a, b, c: ddx / L, s: ddy / L, L };
  });

  for (const { a, b, c, s, L } of geo) {
    const k = EA / L;
    const m = [c * c, c * s, s * s];
    const local = [
      [m[0], m[1], -m[0], -m[1]],
      [m[1], m[2], -m[1], -m[2]],
      [-m[0], -m[1], m[0], m[1]],
      [-m[1], -m[2], m[1], m[2]],
    ];
    const dof = [2 * a, 2 * a + 1, 2 * b, 2 * b + 1];
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) K[dof[i]][dof[j]] += k * local[i][j];
  }
  for (const { node, fx = 0, fy = 0 } of loads) {
    F[2 * node] += fx;
    F[2 * node + 1] += fy;
  }

  const fixed = new Set();
  for (const [node, [fx, fy]] of Object.entries(supports)) {
    if (fx) fixed.add(2 * node);
    if (fy) fixed.add(2 * node + 1);
  }
  const free = [...Array(n).keys()].filter((d) => !fixed.has(d));

  // Gaussian elimination on the reduced system.
  const m = free.length;
  const A = free.map((r) => [...free.map((c) => K[r][c]), F[r]]);
  for (let col = 0; col < m; col++) {
    let piv = col;
    for (let r = col + 1; r < m; r++) if (Math.abs(A[r][col]) > Math.abs(A[piv][col])) piv = r;
    [A[col], A[piv]] = [A[piv], A[col]];
    for (let r = col + 1; r < m; r++) {
      const f = A[r][col] / A[col][col];
      if (!f) continue;
      for (let c = col; c <= m; c++) A[r][c] -= f * A[col][c];
    }
  }
  const x = new Float64Array(m);
  for (let r = m - 1; r >= 0; r--) {
    let sum = A[r][m];
    for (let c = r + 1; c < m; c++) sum -= A[r][c] * x[c];
    x[r] = sum / A[r][r];
  }
  const U = new Float64Array(n);
  free.forEach((d, i) => (U[d] = x[i]));

  // Axial force: + tension, − compression.
  const forces = geo.map(({ a, b, c, s, L }) => {
    const du = (U[2 * b] - U[2 * a]) * c + (U[2 * b + 1] - U[2 * a + 1]) * s;
    return (EA / L) * du;
  });

  const reactions = {};
  for (const node of Object.keys(supports)) {
    const ry = K[2 * node + 1].reduce((acc, k, j) => acc + k * U[j], 0) - F[2 * node + 1];
    const rx = K[2 * node].reduce((acc, k, j) => acc + k * U[j], 0) - F[2 * node];
    reactions[node] = { rx, ry };
  }
  return { forces, displacements: U, reactions };
}

// Distribute a point load P at fraction t (0..1) along the deck to its two nearest deck nodes.
export function deckLoad(t, P, panels) {
  const pos = Math.min(Math.max(t, 0), 1) * panels;
  const i = Math.min(Math.floor(pos), panels - 1);
  const f = pos - i;
  return [
    { node: i, fy: P * (1 - f) },
    { node: i + 1, fy: P * f },
  ];
}

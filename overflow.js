function triAreaHeron(a, b, c) {
  const s = (a + b + c) / 2.0;
  return Math.sqrt(s * (s - a) * (s - b) * (s - c));
}
function bary_X16(sides) {
  const [a,b,c]=sides;
  const sqrt3 = Math.sqrt(3.0);
  const area = triAreaHeron(a, b, c);
  const c2 = c * c;
  const b2 = b * b;
  const S = 2 * area;
  const a2 = a * a;
  const v1 = a2 * (2 * S + (a2 - b2 - c2) * sqrt3);
  const v2 = b2 * (2 * S + (-a2 + b2 - c2) * sqrt3);
  const v3 = c2 * (2 * S + (-a2 - b2 + c2) * sqrt3);
  return [v1, v2, v3];
}

function tri_sides(p1,p2,p3) {
  const s1 = dist(p2, p3);
  const s2 = dist(p3, p1);
  const s3 = dist(p1, p2);
  return [s1, s2, s3];
}
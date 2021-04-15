
// debugging
//const gpu = new GPU({ mode: 'dev' });
//const gpu = new GPU({canvas:HTMLCanvasElement});
const gpu = new GPU();


function sqr(x) { return x * x; }
function sum3(sides) { return sides[0] + sides[1] + sides[2]; }
function vscale(v, s) { return [s * v[0], s * v[1]]; }
function dist(u, v) { return Math.sqrt(sqr(u[0] - v[0]) + sqr(u[1] - v[1])); }
function vsum3(uvw) { const [u, v, w] = uvw; return [u[0] + v[0] + w[0], u[1] + v[1] + w[1]]; }
function magn(u) { return Math.sqrt(vdot(u, u)); }
function magn2(u) { return vdot(u, u); }
function vnorm(u) { return vscale(u, 1 / magn(u)); }

function vdiff(u, v) { return [u[0] - v[0], u[1] - v[1]]; }
function vdot(u, v) { return u[0] * v[0] + u[1] * v[1]; };
function perp(u) { return [-u[1], u[0]]; }
function dist2(u, v) { return sqr(u[0] - v[0]) + sqr(u[1] - v[1]); }

gpu.addFunction(sqr, { argumentTypes: { x: 'Number' }, returnType: 'Number' });
gpu.addFunction(sum3, { argumentTypes: { sides: 'Array(3)' }, returnType: 'Number' });
gpu.addFunction(vscale, { argumentTypes: { v: 'Array(2)', s: 'Number' }, returnType: 'Array(2)' });
gpu.addFunction(vdot, { argumentTypes: { u: 'Array(2)', v: 'Array(2)' }, returnType: 'Number' });
gpu.addFunction(perp, { argumentTypes: { u: 'Array(2)' }, returnType: 'Array(2)' });
gpu.addFunction(vdiff, { argumentTypes: { u: 'Array(2)', v: 'Array(2)' }, returnType: 'Array(2)' });
gpu.addFunction(dist2, { argumentTypes: { u: 'Array(2)', v: 'Array(2)' }, returnType: 'Number' });

function perp_err(v0, v1, p) {
  const d1 = vdiff(p, v0);
  const d2 = vdiff(v1, v0);
  return vdot(perp(d1), d2);
}

gpu.addFunction(perp_err, { argumentTypes: { v0: 'Array(2)', v1: 'Array(2)', p: 'Array(2)' }, returnType: 'Number' });

function get_side_error(t0, t1, t2, M) {
  const e1 = Math.abs(perp_err(t0, t1, M));
  const e2 = Math.abs(perp_err(t1, t2, M));
  const e3 = Math.abs(perp_err(t2, t0, M));
  const err_min = Math.min(Math.min(e1, e2), e3);
  return err_min;
}
gpu.addFunction(get_side_error,
  { argumentTypes: { t0: 'Array(2)', t1: 'Array(2)', t2: 'Array(2)', M: 'Array(2)' }, returnType: 'Number' });

function tri_sides_sqr(p1, p2, p3) {
  const s1 = dist2(p2, p3);
  const s2 = dist2(p3, p1);
  const s3 = dist2(p1, p2);
  return [s1, s2, s3];
}
gpu.addFunction(tri_sides_sqr, { argumentTypes: { p1: 'Array(2)', p2: 'Array(2)', p3: 'Array(2)'}, returnType: 'Array(3)' });

function triAreaHeronSqr(a2, b2, c2) {
  return (2 * (a2 * b2 + b2 * c2 + c2 * a2) - a2 * a2 - b2 * b2 - c2 * c2) / 16;
}
gpu.addFunction(bary_X16_sqr, { argumentTypes: { a2: 'Number', b2: 'Number', c2: 'Number'}, returnType: 'Number' });

function bary_X16_sqr(a2, b2, c2) {
  const sqrt3 = 1.7320508075688772;
  const area2 = triAreaHeronSqr(a2, b2, c2);
  const twoS = 4 * Math.sqrt(area2);
  const v1 = a2 * (twoS + (a2 - b2 - c2) * sqrt3);
  const v2 = b2 * (twoS + (-a2 + b2 - c2) * sqrt3);
  const v3 = c2 * (twoS + (-a2 - b2 + c2) * sqrt3);
  return [v1, v2, v3];
}
gpu.addFunction(bary_X16_sqr, { argumentTypes: { a2: 'Number', b2: 'Number', c2: 'Number'}, returnType: 'Array(3)' });

function barys_to_cartesian(p1, p2, p3, bs) {
  const bs_sum = sum3(bs);
  const tri_scaled = [vscale(p1, bs[0]), vscale(p2, bs[1]), vscale(p3, bs[2])];
  const tri_scaled_norm = vscale(vsum3(tri_scaled), 1 / bs_sum);
  return tri_scaled_norm;
}
gpu.addFunction(barys_to_cartesian,
  { argumentTypes: { p1:'Array(2)', p2:'Array(2)', p3:'Array(2)', bs:'Array(3)' }, returnType: Array/*'Array2D(1)'*/ });

function get_X16(p1, p2, p3) {
  const sides2 = tri_sides_sqr(p1, p2, p3);
  const bs = bary_X16_sqr(sides2[0], sides2[1], sides2[2]);
  return barys_to_cartesian(p1, p2, p3, bs);
}
gpu.addFunction(get_X16, { argumentTypes: { p1: 'Array(2)', p2: 'Array(2)', p3: 'Array(2)'}, returnType: 'Array(3)' });


function get_X16_map(t0, t1, t2, M) {
  const p = get_X16(M, t1, t2);
  const q = get_X16(M, t2, t0);
  const r = get_X16(M, t0, t1);
  return [p, q, r];
}
gpu.addFunction(get_X16_map, { argumentTypes: { t0: 'Array(2)', t1: 'Array(2)', t2: 'Array(2)', M: 'Array(2)' }, 
returnType: Array/*'Array2D(1)'*/ });

function tri_dist_sqr(p1, p2, p3, q1, q2, q3) { return dist2(p1, q1) + dist2(p2, q2) + dist2(p3, q3); }
gpu.addFunction(tri_dist_sqr, { argumentTypes: { p1: 'Array(2)', p2: 'Array(2)', p3: 'Array(2)',
 q1: 'Array(2)', q2: 'Array(2)', q3: 'Array(2)' }, returnType: 'Number' });


function get_triple_X16_map_error(t0, t1, t2, M) {
  const [x1, y1, z1] = get_X16_map(t0, t1, t2, M);
  const [x2, y2, z2] = get_X16_map(x1, y1, z1, M);
  const [x3, y3, z3] = get_X16_map(x2, y2, z2, M);
  const d2 = tri_dist_sqr(t0, t1, t2, x3, y3, z3);
  //const d2 = tri_dist_sqr([t0,t1,t2],[x3,y3,z3]);
  return d2;
}
gpu.addFunction(get_triple_X16_map_error,
  { argumentTypes: { t0: 'Array(2)', t1: 'Array(2)', t2: 'Array(2)', M: 'Array(2)' }, returnType: 'Number' });


const render = gpu.createKernel(function (tri0, tri1, tri2) {
  let dim = 512; // this.constants.dim
  let half_dim = dim >> 1;
  let max = 5; // this.constants.max
  let i = this.thread.x;
  let j = this.thread.y;
  let x = max * (i - half_dim) / dim;
  let y = max * (j - half_dim) / dim;

  //let err = get_triple_X16_map_area_error(tri[0],tri[1],tri[2], [x, y]);

  let side_err = get_side_error(tri0, tri1, tri2, [x, y]);
  if (side_err < 1e-2) this.color(1, 0, 0, 1); else {
    let err = get_triple_X16_map_error(tri0, tri1, tri2, [x, y]);
    if (err < 1e-9) this.color(0, 0, 1, 1); else
    this.color(.9, .9, .9, 1);
  }
  //  this.color(clr,clr,clr, 1);
}, { argumentTypes: { tri0: 'Array(2)', tri1: 'Array(2)', tri2: 'Array(2)' } })
  .setConstants({ dim: 512, max: 5 })
  .setGraphical(true)
  .setOutput([512, 512]);
//{ source: function, argumentTypes: object, returnType: string }
//.setFunctions([{ source: get_triple_X16_map_error,
//  argumentTypes:{ t0:'Array(2)', t1:'Array(2)', t2:'Array(2)', M:'Array(2)' }, returnType: 'Number' }]);
// ??? kernel.setNativeFunctions(array)

// equilateral
const reg3 = [[.75, 0], [-.5, .866025], [-.5, -.866025]];
//render(new Float32Array(reg3[0]),new Float32Array(reg3[1]),new Float32Array(reg3[2]));
//render(reg3[0],reg3[1],reg3[2]);
render(...reg3);


const canvas = render.canvas;
//canvas.setAttribute('id', 'canvas');
document.getElementsByTagName('body')[0].appendChild(canvas);

/*
function draw() {
  var canvas = document.getElementById('canvas');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.moveTo(75, 50);
    ctx.lineTo(100, 75);
    ctx.lineTo(100, 25);
    ctx.fill();
  }
}
draw();*/
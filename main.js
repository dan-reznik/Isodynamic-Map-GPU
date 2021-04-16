
// debugging
//const gpu = new GPU({ mode: 'dev' });
//const gpu = new GPU({ mode: 'cpu' });
//const gpu = new GPU({canvas:HTMLCanvasElement});
const gpu = new GPU();

//function squared(x) { return x * x; }
function sum3(sides) { return sides[0] + sides[1] + sides[2]; }
function vscale(v, s) { return [s * v[0], s * v[1]]; }

function vsum3(u,v,w) { return [u[0] + v[0] + w[0], u[1] + v[1] + w[1]]; }
//function magn(u) { return Math.sqrt(vdot(u, u)); }
//function magn2(u) { return vdot(u, u); }
//function vnorm(u) { return vscale(u, 1 / magn(u)); }

function vdiff(u, v) { return [u[0] - v[0], u[1] - v[1]]; }
function vdot(u, v) { return u[0] * v[0] + u[1] * v[1]; };
function perp(u) { return [-u[1], u[0]]; }

//gpu.addFunction(squared, { argumentTypes: { x: 'Number' }, returnType: 'Number' });
gpu.addFunction(sum3, { argumentTypes: { sides: 'Array(3)' }, returnType: 'Number' });
gpu.addFunction(vsum3, { argumentTypes: { u: 'Array(2)', v: 'Array(2)', w: 'Array(2)' }, returnType: 'Array(2)' });
gpu.addFunction(vscale, { argumentTypes: { v: 'Array(2)', s: 'Number' }, returnType: 'Array(2)' });
gpu.addFunction(vdot, { argumentTypes: { u: 'Array(2)', v: 'Array(2)' }, returnType: 'Number' });
gpu.addFunction(perp, { argumentTypes: { u: 'Array(2)' }, returnType: 'Array(2)' });
gpu.addFunction(vdiff, { argumentTypes: { u: 'Array(2)', v: 'Array(2)' }, returnType: 'Array(2)' });

// needs sqr
//function dist(u, v) { return Math.sqrt(sqr(u[0] - v[0]) + sqr(u[1] - v[1])); }
function dist2(u, v) { return (u[0] - v[0])*(u[0] - v[0]) + (u[1] - v[1])*(u[1] - v[1]); }
gpu.addFunction(dist2, { argumentTypes: { u: 'Array(2)', v: 'Array(2)' }, returnType: 'Number' });

function perp_err(v0, v1, p) {
  const d1 = vdiff(p, v0);
  const d2 = vdiff(v1, v0);
  return vdot(perp(d1), d2);
}
gpu.addFunction(perp_err, { argumentTypes: { v0: 'Array(2)', v1: 'Array(2)', p: 'Array(2)' }, returnType: 'Number' });

function closest_perp(l1,l2,p) {
    const dl = vdiff(l2,l1);
    const s = vdot(vdiff(p,l1),dl)/vdot(dl,dl);
    return [l1[0]+s*dl[0], l1[1]+s*dl[1]];
}
gpu.addFunction(closest_perp, { argumentTypes: { l1: 'Array(2)', l2: 'Array(2)',p: 'Array(2)' }, returnType: 'Array(2)' });

function get_side_error(t0, t1, t2, M) {
  const e1 = dist2(M,closest_perp(t0,t1,M));
  const e2 = dist2(M,closest_perp(t1,t2,M));
  const e3 = dist2(M,closest_perp(t2,t0,M));
  //const e1 = Math.abs(perp_err(t0, t1, M));
  //const e2 = Math.abs(perp_err(t1, t2, M));
  //const e3 = Math.abs(perp_err(t2, t0, M));
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
gpu.addFunction(triAreaHeronSqr, { argumentTypes: { a2: 'Number', b2: 'Number', c2: 'Number'}, returnType: 'Number' });

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
  const s0 = vscale(p1, bs[0]);
  const s1 = vscale(p2, bs[1]);
  const s2 = vscale(p3, bs[2]);
  const cartesians = vscale(vsum3(s0,s1,s2), 1 / bs_sum);
  //return tri_scaled_norm;
  return cartesians
}
gpu.addFunction(barys_to_cartesian,
  { argumentTypes: { p1:'Array(2)', p2:'Array(2)', p3:'Array(2)', bs:'Array(3)' }, returnType: 'Array(2)' });

function get_X16(p1, p2, p3) {
  const sides2 = tri_sides_sqr(p1, p2, p3);
  const bs = bary_X16_sqr(sides2[0], sides2[1], sides2[2]);
  return barys_to_cartesian(p1, p2, p3, bs);
}
gpu.addFunction(get_X16, { argumentTypes: { p1: 'Array(2)', p2: 'Array(2)', p3: 'Array(2)'}, returnType: 'Array(2)' });

/*
function get_X16_map(t0, t1, t2, M) {
  const p = get_X16(M, t1, t2);
  const q = get_X16(M, t2, t0);
  const r = get_X16(M, t0, t1);
  return [p, q, r];
}
gpu.addFunction(get_X16_map, { argumentTypes: { t0: 'Array(2)', t1: 'Array(2)', t2: 'Array(2)', M: 'Array(2)' }, 
returnType: 'Array)' });
*/

function tri_dist_sqr(p1, p2, p3, q1, q2, q3) { return dist2(p1, q1) + dist2(p2, q2) + dist2(p3, q3); }
gpu.addFunction(tri_dist_sqr, { argumentTypes: { p1: 'Array(2)', p2: 'Array(2)', p3: 'Array(2)',
 q1: 'Array(2)', q2: 'Array(2)', q3: 'Array(2)' }, returnType: 'Number' });

function get_triple_X16_map_error(t0, t1, t2, M) {
  // had to unroll for GPU
  const p0=get_X16(M, t1, t2);
  const p1=get_X16(M, t2, t0);
  const p2=get_X16(M, t0, t1);
  const q0=get_X16(M, p1, p2);
  const q1=get_X16(M, p2, p0);
  const q2=get_X16(M, p0, p1);
  const r0=get_X16(M, q1, q2);
  const r1=get_X16(M, q2, q0);
  const r2=get_X16(M, q0, q1);
  const d2 = tri_dist_sqr(t0,t1,t2,r0,r1,r2);
  return d2;
}
gpu.addFunction(get_triple_X16_map_error,
  { argumentTypes: { t0: 'Array(2)', t1: 'Array(2)', t2: 'Array(2)', M: 'Array(2)' }, returnType: 'Number' });

// Lemniscate da Gerono: https://mathworld.wolfram.com/EightCurve.html
function get_curve_err(a,x,y) {
  const x2 = x*x;
  const err = x2*x2-a*a*(x2-y*y);
  return err*err;
}
gpu.addFunction(get_curve_err);

const displX=1,scaleX=2,scaleY=3;
const render = gpu.createKernel(function (tri0, tri1, tri2) {
  let dimX = this.constants.dimX>>1; // this.constants.dim
  let dimY = this.constants.dimY>>1;
  let maxX = this.constants.max;
  let maxY = maxX*(dimY/dimX);
  let i = this.thread.x;
  let j = this.thread.y;
  let x = maxX * (i - dimX) / dimX;
  let y = maxY * (j - dimY) / dimY;

  //let err = get_triple_X16_map_area_error(tri[0],tri[1],tri[2], [x, y]);

  const displX=1,scaleX=2,scaleY=3;
  if (get_triple_X16_map_error(tri0, tri1, tri2, [x, y]) < 1e-6)
    this.color(0, 0, 1, 1); else
  if (get_side_error(tri0, tri1, tri2, [x, y]) < 1e-4)
    this.color(1, 0, 0, 1);
  else if (get_curve_err(.5,(displX-x)/scaleX,y/scaleY) < 1e-6)
    this.color(0, 1, 0, 1);
   else
    this.color(.9, .9, .9, 1);
  //  this.color(clr,clr,clr, 1);
}, { argumentTypes: { tri0: 'Array(2)', tri1: 'Array(2)', tri2: 'Array(2)' } })
  .setFixIntegerDivisionAccuracy(true)
  .setPrecision('single')
  .setTactic('precision')
  .setConstants({ dimX: 1280, dimY: 720, max: 4 })
  .setGraphical(true)
  .setOutput([1280,720]);
//{ source: function, argumentTypes: object, returnType: string }
//.setFunctions([{ source: get_triple_X16_map_error,
//  argumentTypes:{ t0:'Array(2)', t1:'Array(2)', t2:'Array(2)', M:'Array(2)' }, returnType: 'Number' }]);
// ??? kernel.setNativeFunctions(array)


let reg3 = [[1, 0], [-.5, .866025], [-.5, -.866025]];
let t = 0;
render(...reg3);
const canvas = render.canvas;
//canvas.setAttribute('id', 'canvas');
document.getElementsByTagName('body')[0].appendChild(canvas);


function canvas_draw(ctx) {
  //var ctx = cvs.getContext('2d');

  ctx.beginPath();
  ctx.moveTo(75, 50);
  ctx.lineTo(100, 75);
  ctx.lineTo(100, 25);
  ctx.fill();
}

let start;
function oneFrame(timestamp) {
  const r = 0.5;
  if (start === undefined) start = timestamp;
  const elapsed = timestamp - start;
  reg3[0] = [displX+scaleX*r*Math.cos(elapsed/2000),scaleY*(r/2)*Math.sin(2*elapsed/2000)];
  render(...reg3);
  //canvas_draw(render.canvas);
  window.requestAnimationFrame(oneFrame);
}

window.requestAnimationFrame(oneFrame);

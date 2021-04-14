
// debugging
// const gpu = new GPU({ mode: 'dev' });
//const gpu = new GPU({canvas:HTMLCanvasElement});
const gpu = new GPU();

function sqr(x) { return x*x; }
function sum3(sides) { return sides[0]+sides[1]+sides[2]; }
function vscale(v,s) { return [s*v[0], s*v[1], s*v[2]]; }
function dist(u,v) { return Math.sqrt(sqr(u[0]-v[0])+sqr(u[1]-v[1])); }
function dist2(u,v) { return sqr(u[0]-v[0])+sqr(u[1]-v[1]); }
function vsum3(uvw) { const [u,v,w]=uvw; return [u[0] + v[0] + w[0], u[1] + v[1] + w[1]]; }

//function get_subtris(tri,M) {
//  const ret = [];
 //  ret.push([M,tri[1],tri[2]]);
//   ret.push([M,tri[2],tri[0]]);
 //  ret.push([M,tri[0],tri[1]]);
//   return ret;
//}

function triAreaHeron(a, b, c) {
  let s = (a + b + c) / 2.0;
  return Math.sqrt(s * (s - a) * (s - b) * (s - c));
}

function bary_X16(sides) {
  const [a,b,c]=sides;
  const sqrt3 = Math.sqrt(3.0);
  let area = triAreaHeron(a, b, c);
  let c2 = c * c;
  let b2 = b * b;
  let S = 2 * area;
  let a2 = a * a;
  let v1 = a2 * (2 * S + (a2 - b2 - c2) * sqrt3);
  let v2 = b2 * (2 * S + (-a2 + b2 - c2) * sqrt3);
  let v3 = c2 * (2 * S + (-a2 - b2 + c2) * sqrt3);
  return [v1, v2, v3];
}

function tri_sides(ps) {
  const [p1,p2,p3]=ps;
  let s1 = dist(p2, p3);
  let s2 = dist(p3, p1);
  let s3 = dist(p1, p2);
  return [s1, s2, s3];
}

function barys_to_cartesian(tri, bs) {
  const bs_sum = sum3(bs);
  const tri_scaled = [bs[0]*tri[0],bs[1]*tri[1],bs[2]*tri[2]];
  const tri_scaled_norm = vscale(vsum3(tri_scaled), 1 / bs_sum);
  return tri_scaled_norm;
}

function get_X16(tri) {
  const sides = tri_sides(tri);
  const bs = bary_X16(sides);
  return barys_to_cartesian(tri,bs);
}

function get_X16_map(tri,M) {
    const tri0 = [M,tri[1],tri[2]];
    const tri1 = [M,tri[2],tri[0]];
    const tri2 = [M,tri[0],tri[1]];
    const p = get_X16(tri0);
    const q = get_X16(tri1);
    const r = get_X16(tri2);
    return [p,q,r];
}

function tri_dist(t1,t2) { return dist2(t1[0],t2[0])+dist2(t1[1],t2[1])+dist2(t1[2],t2[2]); }

function get_triple_X16_map_error(tri,M) {
    const t1 = get_X16_map(tri,M);
    //const t2 = get_X16_map(t1,M);
    //const t3 = get_X16_map(t2,M);
    return tri_dist(tri,t1);
}

gpu.addFunction(sqr);
gpu.addFunction(sum3);
gpu.addFunction(vscale);
gpu.addFunction(dist);
gpu.addFunction(dist2);
gpu.addFunction(vsum3);
gpu.addFunction(tri_sides);
gpu.addFunction(triAreaHeron);
gpu.addFunction(barys_to_cartesian);
gpu.addFunction(bary_X16);
gpu.addFunction(get_X16);
//gpu.addFunction(get_subtris);
//gpu.addFunction(get_X16_map,{ argumentTypes: { tri:'Array2D(3)', M:'Array(2)' }, returnType: 'Array2D(3)' });
gpu.addFunction(get_X16_map);
gpu.addFunction(tri_dist);
gpu.addFunction(get_triple_X16_map_error);

const render = gpu.createKernel(function(tri) {
   const dim = this.constants.dim;
   const half_dim = dim>>1;
   const max = this.constants.max;
   const i = this.thread.x;
   const j = this.thread.y;
   const x = max*(i-half_dim)/dim;
   const y = max*(j-half_dim)/dim;

  const err = get_triple_X16_map_error(tri, [x, y]);
  if (err<1e-6) this.color(0,0,0, 1); else this.color(0,0,1, 1);
}, {
  constants: { dim: 512, max: 3 },
  output: [512, 512],
  graphical: true
});


// equilateral
const reg3 = [[1,0],[-.5,.866025],[-.5,-.866025]]; 
render(reg3);

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

// debugging
const gpu = new GPU({ mode: 'dev' });
//const gpu = new GPU({canvas:HTMLCanvasElement});
//const gpu = new GPU();

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

function barys_to_cartesian(p1,p2,p3, bs) {
  const bs_sum = sum3(bs);
  const tri_scaled = [bs[0]*p1,bs[1]*p2,bs[2]*p3];
  const tri_scaled_norm = vscale(vsum3(tri_scaled), 1 / bs_sum);
  return tri_scaled_norm;
}

function get_X16(p1,p2,p3) {
  const sides = tri_sides(p1,p2,p3);
  const bs = bary_X16(sides);
  return barys_to_cartesian(p1,p2,p3,bs);
}

function get_X16_map(t0,t1,t2,M) {
    const p = get_X16(M,t1,t2);
    const q = get_X16(M,t2,t0);
    const r = get_X16(M,t0,t1);
    return [p,q,r];
}

function tri_dist(p1,p2,p3,q1,q2,q3) { return dist2(p1[0],q1[0])+dist2(p2[1],q2[1])+dist2(p3[2],q3[2]); }

function get_triple_X16_map_error(t0,t1,t2,M) {
    const [x1,y1,z1] = get_X16_map(t0,t1,t2,M);
    const [x2,y2,z2] = get_X16_map(x1,y1,z1,M);
    const [x3,y3,z3] = get_X16_map(x2,y2,z2,M);
    return tri_dist(t0,t1,t2,x3,y3,z3);
}

gpu.addFunction(sqr);
gpu.addFunction(sum3);
gpu.addFunction(vscale);
gpu.addFunction(dist);
gpu.addFunction(dist2,{ argumentTypes: { u:'Array(2)', v:'Array(2)' }, returnType: 'Number' });
gpu.addFunction(vsum3);
gpu.addFunction(tri_sides,{ argumentTypes: { p1:'Array(2)', p2:'Array(2)', p3:'Array(2)' }, returnType: 'Array(3)' } );
gpu.addFunction(triAreaHeron);
gpu.addFunction(barys_to_cartesian);
gpu.addFunction(bary_X16);
gpu.addFunction(get_X16,{ argumentTypes: { p1:'Array(2)', p2:'Array(2)', p3:'Array(2)' }, returnType: 'Array(2)' });
//gpu.addFunction(get_subtris);
//gpu.addFunction(get_X16_map,{ argumentTypes: { tri:'Array2D(3)', M:'Array(2)' }, returnType: 'Array2D(3)' });
gpu.addFunction(get_X16_map,{ argumentTypes: { t1:'Array(2)', t2:'Array(2)', t3:'Array(2)' }, returnType: 'Array1D(2)' });
gpu.addFunction(tri_dist, { argumentTypes: { p1:'Array(2)', p2:'Array(2)', p3:'Array(2)', q1:'Array(2)', q2:'Array(2)', q3:'Array(2)' }, returnType: 'Number' } );
gpu.addFunction(get_triple_X16_map_error,
  { argumentTypes: { t0:'Array(2)', t1:'Array(2)', t2:'Array(2)', M:'Array(2)' }, returnType: 'Number' });

const render = gpu.createKernel(function(t0,t1,t2) {
   const dim = 512;
   const half_dim = dim>>1;
   const max = 3;
   const i = this.thread.x;
   const j = this.thread.y;
   const x = max*(i-half_dim)/dim;
   const y = max*(j-half_dim)/dim;

  const err = get_triple_X16_map_error(t0,t1,t2, [x, y]);
  if (err<1e-6) this.color(0,0,0, 1); else this.color(0,0,1, 1);
}, {
  argumentTypes: { t0:'Array(2)', t1:'Array(2)', t2:'Array(2)' },
  constants: { dim: 512, max: 3 },
  output: [512, 512],
  graphical: true
});


// equilateral
const reg3 = [[1,0],[-.5,.866025],[-.5,-.866025]]; 
render(new FloatArray(reg3[0]),new FloatArray(reg3[1]),new FloatArray(reg3[2]));

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
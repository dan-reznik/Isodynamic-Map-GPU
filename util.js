// vector utilities
const sum3 = ([x, y, z]) => x + y + z;
const vscale = (u, s) => [u[0] * s, u[1] * s];
const vsum3 = (u, v, w) => [u[0] + v[0] + w[0], u[1] + v[1] + w[1]];
magn2 = (p) => p[0] * p[0] + p[1] * p[1];
magn = (p) => sqrt(magn2(p));
vdiff = (u, v) => [u[0] - v[0], u[1] - v[1]];
const edist2 = (p1, p2) => magn2(vdiff(p1, p2));
const edist = (p1, p2) => magn(vdiff(p1, p2));

// get a triangle's sidelengths
function tri_sides([p1, p2, p3]) {
    let s1 = edist(p2, p3);
    let s2 = edist(p3, p1);
    let s3 = edist(p1, p2);
    return [s1, s2, s3];
}

//area of tri with sidelengths a,b,c
function triAreaHeron(a, b, c) {
    let s = (a + b + c) / 2.0;
    return sqrt(s * (s - a) * (s - b) * (s - c));
}

// barycenters for X3 = circumcenter
function bary_X3([a, b, c]) {
    let c2 = c * c;
    let b2 = b * b;
    let a2 = a * a;
    let v1 = a2 * (a2 - b2 - c2);
    let v2 = b2 * (-a2 + b2 - c2);
    let v3 = c2 * (-a2 - b2 + c2);
    return [v1, v2, v3];
}

// barycenters for the 2nd isodynamic point
function bary_X16([a, b, c]) {
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

// get cartesians from tri and barycentrics
function barys_to_cartesian(tri, bs) {
    const bs_sum = sum3(bs);
    const tri_scaled = tri.map((v, i) => vscale(v, bs[i]));
    const tri_scaled_norm = vscale(vsum3(...tri_scaled), 1 / bs_sum);
    return tri_scaled_norm;
}

// get an Xn given a barycentric function
function get_Xn(tri, fn_bary) {
    const sides = tri_sides(tri);
    const bs = fn_bary(sides);
    return barys_to_cartesian(tri, bs);
}

// nicholas this is what you care about
// of course I have all the bary_Xn you may ever need... but here are just a couple
const get_X3 = (tri) => get_Xn(tri, bary_X3)
const get_X16 = (tri) => get_Xn(tri, bary_X16)
// const get_Xnnn = (tri) = get_Xn(tri, bary_Xnnn)

function get_subtris(tri,M) {
    return [
     [M,tri[1],tri[2]],
     [M,tri[2],tri[0]],
     [M,tri[0],tri[1]]];
 }
 
 function get_xn_map(o, p, bary_Xn) {
    const subtris = get_subtris(o,p);
    const xks = subtris.map(t=>get_Xn(t,bary_Xn));
    return xks;
}

const get_x16_map = (o, p) => get_xn_map(o, p, bary_X16);

const tri_dist = (t1,t2) => sum3(t1.map((t,i)=>edist2(t,t2[i])));

function get_triple_map_error(o,p,fn_map) {
    const o3 = fn_map(fn_map(fn_map(o,p),p),p);
    return tri_dist(o,o3);
}

const get_triple_map_error_x16 = (o,p) => get_triple_map_error(o,p,get_x16_map);
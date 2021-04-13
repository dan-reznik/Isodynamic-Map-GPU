
// debugging
//const gpu = new GPU({ mode: 'cpu' });
const gpu = new GPU();

function get_triple_map_error(tri,p) {
  return p[0]*p[0]+p[1]*p[1];
}

gpu.addFunction(get_triple_map_error);
const render = gpu.createKernel(function(tri) {
  const err = get_triple_map_error(tri,[3*(this.thread.x-128)/256,3*(this.thread.y-128)/256]);
  this.color(err, err, err, 1);
})
  .setOutput([256, 256])
  .setGraphical(true);


render([[1,0],[-.5,.866025],[-.5,-.866025]]);

const canvas = render.canvas;
document.getElementsByTagName('body')[0].appendChild(canvas);
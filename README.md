# Identity zones of the triple isodynamic map

The [isodynamic points](https://mathworld.wolfram.com/IsodynamicPoints.html) S and S' of a triangle (called X(15) and X(16) on Kimberling's [ETC](https://faculty.evansville.edu/ck6/encyclopedia/ETC.html), are at at the intersections of 3 special circles: for each vertex V, consider the circle thru  vertex V and the intersection of V's internal and external bisectors with the side opposite to V:

![Construction of the Isodynamic Points](construction.png)

Here we consider a very interesting phenomenn. Let M denote a pointo the plane of some triangle T=ABC. Define the *isodynamic map* as sending T to a new triangle T' whose vertices are the X(16) of MBC,MCA,MAB.

It turns out that given a starting T, there are *regions* of the plane such that the thrice-applied isodynamic map produces T again, i.e., it is the identity.

To visualize this we've implemented a [GPU.js](gpu.rocks)-based animation, consisting of a family of triangles (red) with two stationary vertices and one moving vertex. The latter's path is a lemniscate (green), but could have been anything. The regions for which the triple isodynamic map is the identity are colored blue.

![Triple Isodynamic Map](isodynamic.png)

Note: some salt-and-pepper noise appears along the boundary of the identity zones. This is due to 32-bit float precision in javascript. 64-bit floats are currently not available but they mostly solve the problem.

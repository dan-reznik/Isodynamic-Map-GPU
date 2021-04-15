# Identity zones of the triple isodynamic map

The first and second [isodynamic points](https://mathworld.wolfram.com/IsodynamicPoints.html) S and S' of a triangle (called X(15) and X(16) on Kimberling's [ETC](https://faculty.evansville.edu/ck6/encyclopedia/ETC.html), are the two intersections of the 3 Apollonius circles: consider a circle thru vertex V and he intersection of the opposite side with V's internal and external bisectors:

![Construction of the Isodynamic Points](construction.png)

Let M denote a point in the plane of a triangle T=ABC. Define the *2nd isodynamic map* as sending T to a new triangle T' whose vertices are the X(16) of MBC,MCA,MAB.

It turns out that given a starting T, there are entire *regions* of the plane such that the thrice-applied 2nd isodynamic map returns T again, i.e., it is the identity. Note: this does not happen if the 1st isodynamic point X(15) is used.

To visualize this in real time and on your browser, we've implemented a [GPU.js](gpu.rocks)-based animation, consisting of a family of triangles (red) with two stationary vertices and one moving vertex, e.g., along a lemniscate (green).

The regions for which the triple isodynamic map is the identity are colored blue, some appear and disappear:

![Triple Isodynamic Map](isodynamic.png)

Note: there is significant salt-and-pepper noise along the boundary of the identity zones. This is due to low-precision floats in browser-based GPU calculations. We hope to fix this.

Link to the live visualiation: [here](https://dan-reznik.github.io/Isodynamic-Map-GPU/)

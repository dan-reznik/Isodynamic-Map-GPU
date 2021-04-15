# Identity zones of the triple isodynamic map

Given a triangle T=ABC, its [isodynamic points](https://mathworld.wolfram.com/IsodynamicPoints.html) S and S' (called X(15) and X(16) in Kimberling's [ETC](https://faculty.evansville.edu/ck6/encyclopedia/ETC.html)), are the two common intersections of 3 *Apollonius* circles: each goes thru a vertex V of T and the intersection of V's internal (blue) and external (red) bisectors with the side opposite to V. For example, the first Apollonius circle goes thru A, and the intersection of the internal and external bisectors of A with side BC:

<img src="construction.png" alt="alt text" width="300">

Let M be a point in the plane of T=ABC (red below). Define the *2nd isodynamic map* as sending T to a new triangle T' (green) whose vertices are the X(16) of MBC,MCA,MAB:

<img src="plotX16.png" alt="alt text" width="300">

It turns out that given a starting T, there are entire *regions* of the plane such that the thrice-applied 2nd isodynamic map returns T again, i.e., it is the identity. Note: the phenomenon described below does not work if X(15) is used.

We've implemented a [GPU](gpu.rocks)-based [animation](https://dan-reznik.github.io/Isodynamic-Map-GPU/) which shows the identity zones (blue) for a family of triangles (red) with two stationary vertices and one sliding along a lemniscate (green):

<img src="isodynamic.png" alt="alt text" width="600">

Note: the salt-and-pepper noise along the boundary of the identity zones is due to low-precision floats in GPU-based calculations. We hope to fix this.

See it [live](https://dan-reznik.github.io/Isodynamic-Map-GPU/)

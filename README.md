# Identity zones of the triple isodynamic map

The 1st and 2nd [isodynamic points](https://mathworld.wolfram.com/IsodynamicPoints.html) of a triangle (called X(15) and X(16) on Kimberling's [ETC](https://faculty.evansville.edu/ck6/encyclopedia/ETC.html), are the two common intersections of the 3 Apollonius circles: these go thru each vertex V and the intersection of the opposite side with V's internal and external bisectors:

<img src="construction.png" alt="alt text" width="300">

Let M denote a point in the plane of a triangle T=ABC. Define the *2nd isodynamic map* as sending T to a new triangle T' whose vertices are the X(16) of MBC,MCA,MAB. Note: the phenomenon described below does not work if X(15) is used.

It turns out that given a starting T, there are entire *regions* of the plane such that the thrice-applied 2nd isodynamic map returns T again, i.e., it is the identity. 

We've implemented a [GPU](gpu.rocks)-based [animation](https://dan-reznik.github.io/Isodynamic-Map-GPU/) which shows the identity zones (blue) for a family of triangles (red): two stationary vertices and one moving along a lemniscate (green):

<img src="isodynamic.png" alt="alt text" width="600">

Note: the salt-and-pepper noise along the boundary of the identity zones is due to low-precision floats in GPU-based calculations. We hope to fix this.

See it [live](https://dan-reznik.github.io/Isodynamic-Map-GPU/)

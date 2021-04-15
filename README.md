# Identity zones of the triple isodynamic map

Given a triangle T=ABC, its [isodynamic points](https://mathworld.wolfram.com/IsodynamicPoints.html) S and S' (called X(15) and X(16) in Kimberling's [ETC](https://faculty.evansville.edu/ck6/encyclopedia/ETC.html)), are the two common intersections of 3 *Apollonius* circles: each goes thru a vertex V of T and the intersection of V's internal (blue) and external (red) bisectors with the side opposite to V. For example, the first Apollonius circle goes thru A and the intersection of the internal and external bisectors of A with side BC:

<img src="construction.png" alt="alt text" width="300">

Consider a triangle T=ABC (red below) and a point M (interior or exterior to T). Define the *2nd isodynamic map* as sending T to a new triangle T' (green) whose vertices are the X(16) of MBC,MCA,MAB:

<img src="plotX16.png" alt="alt text" width="400">

It turns out that given a starting T, there are *regions* for M such that a thrice-applied 2nd isodynamic map returns T again, i.e., it is the identity. Note: the phenomenon described below does not work if X(15) is used.

Though we initially identified this phenomenon with [Wolfram Mathematica](https://www.wolfram.com/mathematica/), computing the identity zones for a given triangle may take minutes to hours. Thanks to the amazing [GPU.js](gpu.rocks) library, we can now calculate identity zones for a moving family of triangles (red) at many frames per second using the GPU directly from the browser!

One frame of the [animation](https://dan-reznik.github.io/Isodynamic-Map-GPU/) is shown below. The reference triangle is bounded by the three red lines. Its two left vertices are stationary and a third, right one moves along a lemniscate (green). The real-time computed identity zones are shown blue (the salt-and-pepper noise along its boundary is due to low precision currently available for GPU-based calculations. We hope to fix this soon).

<img src="isodynamic.png" alt="alt text" width="600">

See it [live](https://dan-reznik.github.io/Isodynamic-Map-GPU/)

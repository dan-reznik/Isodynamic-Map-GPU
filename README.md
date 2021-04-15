# Identity Zones of the Triple Isodynamic Map

Given a triangle T=ABC, its [isodynamic points](https://mathworld.wolfram.com/IsodynamicPoints.html) S and S' (called X(15) and X(16) in Kimberling's [ETC](https://faculty.evansville.edu/ck6/encyclopedia/ETC.html)), are the two common intersections of 3 *Apollonius* circles: each goes thru a vertex V of T and the intersection of V's internal (blue) and external (red) bisectors with the side opposite to V. For example, the first Apollonius circle goes thru A and the intersection of the internal and external bisectors of A with side BC:

<img src="construction.png" alt="alt text" width="300">

Consider a triangle T=ABC (red below) and a point M (interior or exterior to T). Define the *2nd isodynamic map* as sending T to a new triangle T' (green) whose vertices are the X(16) of MBC,MCA,MAB:

<img src="plotX16.png" alt="alt text" width="400">

After some exploration with [Wolfram Mathematica](https://www.wolfram.com/mathematica/), we noticed a fancy phenomenon with X(16). Given a starting T, there are *zones* for M such that a thrice-applied 2nd isodynamic map returns T again, i.e., it is the identity. When T is an equilateral (below), 6 such identity zones are formed (light blue): 3 exterior and 3 glued to each side (the latter we call "tents"):

<img src="mathematica.png" alt="alt text" width="400">

So for the example shown above, the map will oscillate forever between the initial equilateral (red), a green 1st generation, and a blue 2nd generation triangles, after which the sequence repeats forever.

Computing the identity zones with great quality as possible with Mathematica may take minutes to hours. With the amazing [GPU.js](gpu.rocks) library, we can leverage GPU-based parallelism (accessible from the browser!) and calculate said zones for a *moving* family of triangles (red) at dozens of frames per second!

One frame of such an [animation](https://dan-reznik.github.io/Isodynamic-Map-GPU/) is shown below. The reference triangle is bounded by the three red lines. Its two left vertices are stationary and a third, right one moves along a lemniscate (green). The real-time computed identity zones are shown blue (the salt-and-pepper noise along its boundary is due to low precision currently available for GPU-based calculations. We hope to fix this soon).

<img src="isodynamic.png" alt="alt text" width="600">

See it [live](https://dan-reznik.github.io/Isodynamic-Map-GPU/)

# Identity zones of the triple isodynamic map

The *isodynamic point* X(16) (see [Encyclopedia of Triangle Centers](https://faculty.evansville.edu/ck6/encyclopedia/ETC.html)) is one of the two intersections of the 3 Apollonius circles of a triangle.

Given a point M and a triangle T, define the *isodynamic map* as sending T to a new triangle T' whose vertices are the 2nd isodynamic points of MBC,MCA,MAB.

The [GPU.js](gpu.rocks)-based animation shows a family of starting triangles (red), with two stationary vertices and one which moves along some curve (green Lemniscate). Also shown are regions (blue) where 3 consecutive applications of the isodynamic map is the identity.

![Triple Isodynamic Map](isodynamic.png)

The salt-and-pepper noise along the boundary of the identity zones is due to the 32-bit floats in javascript. With 64-bit floats they mostly go away. But this is currently not available.
/**
 *  @class ProjectionMatrix
 *  @memberof SQR
 *
 *  @description The 4x4 matrix is a specialized 4x4 matrix used for perspective and orthographic projection.
 */
SQR.ProjectionMatrix = function() {
    if (typeof Float32Array == 'undefined') Float32Array = Array;
    this.data = new Float32Array(16);

    this.copyTo = function(m) {
        var a = this.data, b = m.data || m;
        for (var i = 0; i < 16; i++) b[i] = a[i];
        return m;
    }

    this.identity();
}


SQR.ProjectionMatrix.getBoundsAtDistance = function(fov, distance, width, height) {
    width = width || window.innerWidth;
    height = height || window.innerHeight;
    var aspect = width/height;
    var t = Math.tan(fov / 180 * Math.PI / 2);
    var h = distance * t;
    var w = h * aspect;
    return { w : w, h : h };
};

/**
 *  Resets the matrix to identity
 */
SQR.ProjectionMatrix.prototype.identity = function() {
    var m = this.data;
    m[0] = 1,m[1] = 0,m[2] = 0,m[3] = 0;
    m[4] = 0,m[5] = 1,m[6] = 0,m[7] = 0;
    m[8] = 0,m[9] = 0,m[10] = 1,m[11] = 0;
    m[12] = 0,m[13] = 0,m[14] = 0,m[15] = 1;
    return this;
}

/**
 *  Returns an orthographic projection matrix that is set in screen coordinates.
 */
SQR.ProjectionMatrix.prototype.screenPixels2d = function() {
    this.orthographic(0, window.innerWidth, 0, window.innerHeight, -1, 1000);
    return this;
}

/**
 *  Returns an orthographic projection matrix.
 */
SQR.ProjectionMatrix.prototype.orthographic = function(left, right, top, bottom, near, far) {

    var m = this.data;

     /**
     *  @property the near clipping
     *  @readonly
     */
    this.near = near;

    /**
     *  @property the far clipping
     *  @readonly
     */
    this.far = far;
    
    var w = right - left;
    var h = top - bottom;
    var p = far - near;

    var x = ( right + left ) / w;
    var y = ( top + bottom ) / h;
    var z = ( far + near ) / p;

    m[0] = 2 / w;    m[4] = 0;        m[8] = 0;        m[12] = -x;
    m[1] = 0;        m[5] = 2 / h;    m[9] = 0;        m[13] = -y;
    m[2] = 0;        m[6] = 0;        m[10] = -2/p;    m[14] = -z;
    m[3] = 0;        m[7] = 0;        m[11] = 0;       m[15] = 1;
    return this;
}

/**
 *  Returns a perspective projection matrix.
 */
SQR.ProjectionMatrix.prototype.perspective = function(fov, aspect, near, far) {

    this.near = near;
    this.far = far;

    /**
     *  @property {Number} the field ov view
     *  @readonly
     */
    this.fov = fov;

    var m = this.data;
    var t = near * Math.tan(fov * Math.PI / 360);
    var n = far - near;

    m[0] = near / (t * aspect);
    m[4] =  0;
    m[8] =  0;
    m[12] = 0;

    m[1] = 0;
    m[5] = near / t;
    m[9] = 0;
    m[13] = 0;

    m[2] = 0;
    m[6] = 0;
    m[10] = -(far + near) / n;
    m[14] = -(2 * far * near) / n;

    m[3] = 0;
    m[7] = 0;
    m[11] = -1;
    m[15] = 0;

    return this;
}

/**
 *  Returns vector mautipled by this matrix
 */
SQR.ProjectionMatrix.prototype.transformVector = function(v, pv) {
    var x = v.x, y = v.y, z = v.z, w = v.w;
    var m = this.data;
    pv = pv || v;

    pv.x = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
    pv.y = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
    pv.z = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
//  pv.w = d[3] * x + d[7] * y + d[11] * z + d[15] * w;

    return pv;
}

/**
 *  Inverses the matrix. Useful for projecting screen coordinates back in to 3d space.
 */
SQR.ProjectionMatrix.prototype.inverse = function (m) {
    var mat = this.data;
    m = m || this.data;

    var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3],
        a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7],
        a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11],
        a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        d = (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06),
        invDet;

    // Calculate the determinant
    if (!d) {
        return null;
    }
    invDet = 1 / d;

    m[0] = (a11 * b11 - a12 * b10 + a13 * b09) * invDet;
    m[1] = (-a01 * b11 + a02 * b10 - a03 * b09) * invDet;
    m[2] = (a31 * b05 - a32 * b04 + a33 * b03) * invDet;
    m[3] = (-a21 * b05 + a22 * b04 - a23 * b03) * invDet;

    m[4] = (-a10 * b11 + a12 * b08 - a13 * b07) * invDet;
    m[5] = (a00 * b11 - a02 * b08 + a03 * b07) * invDet;
    m[6] = (-a30 * b05 + a32 * b02 - a33 * b01) * invDet;
    m[7] = (a20 * b05 - a22 * b02 + a23 * b01) * invDet;

    m[8] = (a10 * b10 - a11 * b08 + a13 * b06) * invDet;
    m[9] = (-a00 * b10 + a01 * b08 - a03 * b06) * invDet;
    m[10] = (a30 * b04 - a31 * b02 + a33 * b00) * invDet;
    m[11] = (-a20 * b04 + a21 * b02 - a23 * b00) * invDet;

    m[12] = (-a10 * b09 + a11 * b07 - a12 * b06) * invDet;
    m[13] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;
    m[14] = (-a30 * b03 + a31 * b01 - a32 * b00) * invDet;
    m[15] = (a20 * b03 - a21 * b01 + a22 * b00) * invDet;

    return m;
};
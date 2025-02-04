/**
 *  @class Quaternion
 *  @memberof SQR
 *
 *  @description Represents a quaternion with optionally setting the values directly.
 *
 *  Just as a reminder, given an angle `a` and an axis `x,y,z` 
 *  this is what the quaternion values are:
 *  @example
var q = new SQR.Quaternion();
var s = Math.sin(a / 2);
q.x = x * s;
q.y = y * s;
q.z = z * s;
q.w = Math.cos(a / 2);
 */
SQR.Quaternion = function(x, y, z, w) {
    this.set(w, x, y, z);
}

/**
 *  Set value of the Quaternion directly.
 */
SQR.Quaternion.prototype.set = function(x, y, z, w) {
    this.w = w || 1;
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    return this;
}

SQR.Quaternion.prototype.copyTo = function(p) {
    p.x = this.x;
    p.y = this.y;
    p.z = this.z;
    p.w = this.w;
    return this;
}

/**
 *  Copy the values from another quaternion.
 *  @param q the quaternion to copy values from
 */
SQR.Quaternion.prototype.copyFrom = function(q) {
    this.w = q.w;
    this.x = q.x;
    this.y = q.y;
    this.z = q.z;
    return this;
}

/**
 *  Resets the quaternion values to identity.
 */
SQR.Quaternion.prototype.identity = function() {
    this.set();
    return this;
}

/**
 * Multiplies rq (or this if no rq) by q
 * @param q
 * @param rq if not defined this is multiplied by q
 */
SQR.Quaternion.prototype.mul = function(q, rq) {
    rq = rq || this;

    var w = (rq.w * q.w - rq.x * q.x - rq.y * q.y - rq.z * q.z);
    var x = (rq.w * q.x + rq.x * q.w + rq.y * q.z - rq.z * q.y);
    var y = (rq.w * q.y - rq.x * q.z + rq.y * q.w + rq.z * q.x);
    var z = (rq.w * q.z + rq.x * q.y - rq.y * q.x + rq.z * q.w);

    rq.set(x, y, z, w);

    rq.normalize();

    return rq;
}

SQR.Quaternion.prototype.dot = function(q) {
    return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
}

/**
 *  Sets the quaternion to point in the given direction.
 *  @param _dir the direction to look at
 *  @param _up the up vector
 */
SQR.Quaternion.prototype.lookAt = function(_dir, _up) {

    var dir = SQR.Quaternion.__tv1;
    var right = SQR.Quaternion.__tv2;
    var up = SQR.Quaternion.__tv3;

    _dir.copyTo(dir);
    _up.copyTo(up);

    dir.norm();

    // If direction is back, the returned quaternion is flipped. Not sure why, but that fixes it.
    if(dir.z == -1) {
        dir.x = 0.0001;
        dir.norm();
    }

    // Probably should do the orthonormalization but not sure how that works :)
    // tangent.sub(up, forward.mul(SQR.V3.dot(forward, up))).norm();
    right.cross(up, dir);
    up.cross(dir, right);

    this.w = Math.sqrt(1 + right.x + up.y + dir.z) * 0.5;
    var rc = 4 * this.w;
    this.x = (dir.y - up.z) / rc;
    this.y = (right.z - dir.x) / rc;
    this.z = (up.x - right.y) / rc;

    this.normalize();

    return this;
}

/**
 *  Creates a quaternion out of an angle axis representation.
 *  @param a angle in radians
 *  @param x x component of the axis
 *  @param y y component of the axis
 *  @param z z component of the axis
 */
SQR.Quaternion.prototype.fromAngleAxis = function(a, x, y, z) {
    var s = Math.sin(a / 2);
    this.x = x * s;
    this.y = y * s;
    this.z = z * s;
    this.w = Math.cos(a / 2);
    return this;
}

/**
 *  Returns the magniture of the quaternion.
 */
SQR.Quaternion.prototype.mag = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
}

/**
 *  Normalizes the quaternion.
 */
SQR.Quaternion.prototype.normalize = function() {
    var n = this.mag();
    this.x /= n;
    this.y /= n;
    this.z /= n;
    this.w /= n;
    return this;
}


/**
 *  Inverses the quaternion.
 */
SQR.Quaternion.prototype.neg = function() {
    this.x *= -1;
    this.y *= -1;
    this.z *= -1;
    this.w *= -1;
    return this;
}

/**
 *  That method doesn't do anything. 
 *  Check {SQR.Matrix44.TQS()} to see how to turn a 
 *  Quanternion into a matrix representation.
 *
 *  @todo Implement (or not... not sure how much this is needed)
 */
SQR.Quaternion.prototype.toMatrix = function(m) {
    throw "SQR.Quaternion.toMatrix() is not implemented. Check SQR.Matrix44.TQS()"; 
}


// This one is from three.js (used for reference )
// SQR.Quaternion.slerp2 = function(qa, qb, t, qr) {

//     qr = qr || new SQR.Quaternion();


//     if ( t === 0 ) return qr.copyFrom(qa);
//     if ( t === 1 ) return qr.copyFrom(qb);

//     var x = qa.x, y = qa.y, z = qa.z, w = qa.w;

//     // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/
//     var cosHalfTheta = w * qb.w + x * qb.x + y * qb.y + z * qb.z;

//     if (cosHalfTheta < 0) {
//         qr.w = - qb.w;
//         qr.x = - qb.x;
//         qr.y = - qb.y;
//         qr.z = - qb.z;
//         cosHalfTheta = - cosHalfTheta;
//     } else {
//         qr.copyFrom( qb );
//     }

//     if (cosHalfTheta >= 1.0) {
//         qr.w = w;
//         qr.x = x;
//         qr.y = y;
//         qr.z = z;
//         return qr;
//     }

//     var halfTheta = Math.acos( cosHalfTheta );
//     var sinHalfTheta = Math.sqrt( 1.0 - cosHalfTheta * cosHalfTheta );

//     if (Math.abs( sinHalfTheta ) < 0.001) {
//         qr.w = 0.5 * (w + qr.w);
//         qr.x = 0.5 * (x + qr.x);
//         qr.y = 0.5 * (y + qr.y);
//         qr.z = 0.5 * (z + qr.z);
//         return qr;
//     }

//     var ratioA = Math.sin( ( 1 - t ) * halfTheta ) / sinHalfTheta,
//     ratioB = Math.sin( t * halfTheta ) / sinHalfTheta;

//     qr.w = (w * ratioA + qr.w * ratioB);
//     qr.x = (x * ratioA + qr.x * ratioB);
//     qr.y = (y * ratioA + qr.y * ratioB);
//     qr.z = (z * ratioA + qr.z * ratioB);

//     return qr;

// }

/**
 *  Returns a spherical linear interpolation between two quaternions.
 *  @param qa first quaternion
 *  @param qb second quaternion
 *  @param t interpolation value [0-1]
 *  @param qr the quaterion to store the results in and return. If omitted results are returned in a new quaternion object.
 */
SQR.Quaternion.slerp = function(qa, qb, t, qr) {
    qr = qr || new SQR.Quaternion();

    if (t === 0) return qr.copyFrom(qa);
    if (t === 1) return qr.copyFrom(qb);

    // Try taking the dot product of your two quaternions (i.e., the 4-D dot product), 
    // and if the dot product is negative, replace your quaterions q1 and q2 with -q1 and q2 before performing Slerp.
    // http://stackoverflow.com/questions/2886606/flipping-issue-when-interpolating-rotations-using-quaternions

    // (This is not working for me)


    var cha = SQR.Quaternion.dot(qa, qb);

    if(cha < 0) {
        qa.neg();
        cha = SQR.Quaternion.dot(qa, qb);
    }

    var ha = Math.acos(cha);
    var sha = Math.sqrt(1 - cha * cha);
    var ra = Math.sin((1 - t) * ha) / sha;
    var rb = Math.sin(t * ha) / sha;

    if (Math.abs(cha) >= 1) {
        // If angle is 0 (i.e cos(a) = 1) just
        // return the first quaternion
        ra = 1;
        rb = 0;
    } else if (Math.abs(sha) < 0.001) {
        // If angle is 180 deg (i.e. sin(a) = 0) there is
        // an infinite amount of possible rotations between those 2
        ra = 0.5;
        rb = 0.5;
    }

    qr.w = (qa.w * ra + qb.w * rb);
    qr.x = (qa.x * ra + qb.x * rb);
    qr.y = (qa.y * ra + qb.y * rb);
    qr.z = (qa.z * ra + qb.z * rb);
    return qr;
}

SQR.Quaternion.dot = function(qa, qb) {
    return qa.x * qb.x + qa.y * qb.y + qa.z * qb.z + qa.w * qb.w;
}

SQR.Quaternion.prototype.slerp = function(qa, qb, t) {
    SQR.Quaternion.slerp(qa, qb, t, this);
    return this;
}

SQR.Quaternion.__tv1 = new SQR.Quaternion();
SQR.Quaternion.__tv2 = new SQR.Quaternion();
SQR.Quaternion.__tv3 = new SQR.Quaternion();















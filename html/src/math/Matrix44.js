/**
 *  @class Matrix44
 *  @memberof SQR
 *
 *  @description A multi-purpose 4x4 matrix.
 */
SQR.Matrix44 = function(data) {

	this.data = data || new Float32Array(16);

	this.identity = function(m) {
		var d = m || this.data;
		d[0] = 1,d[4] = 0,d[8] = 0,d[12] = 0;
		d[1] = 0,d[5] = 1,d[9] = 0,d[13] = 0;
		d[2] = 0,d[6] = 0,d[10] = 1,d[14] = 0;
		d[3] = 0,d[7] = 0,d[11] = 0,d[15] = 1;
		return this;
	}

	/**
	 *  @memberof SQR.Matrix44.prototype
	 *  @description Multiplies the vector v by my this matrix and stores the result in the vector pv.
	 *
	 *  @param {SQR.V3} v - the vector to be multiplies by this matrix
	 *  @param {SQR.V3=} pv - the vector in which to store the result. If ommited, result is stored in v.
	 */
	this.transformVector = function (v, pv) {
		var d = this.data;
		var x = v.x, y = v.y, z = v.z, w = v.w;
		pv = pv || v;
		
		pv.x = d[0] * x + d[4] * y + d[8] * z + d[12] * w;
		pv.y = d[1] * x + d[5] * y + d[9] * z + d[13] * w;
		pv.z = d[2] * x + d[6] * y + d[10] * z + d[14] * w;
		// pv.w = d[3] * x + d[7] * y + d[11] * z + d[15] * w;

		return pv;
	}

	this.rotateVector = function (v, pv) {
		var d = this.data;
		var x = v.x, y = v.y, z = v.z, w = v.w;
		pv = pv || v;
		
		pv.x = d[0] * x + d[4] * y + d[8] * z;
		pv.y = d[1] * x + d[5] * y + d[9] * z;
		pv.z = d[2] * x + d[6] * y + d[10] * z;
		// pv.w = d[3] * x + d[7] * y + d[11] * z + d[15] * w;

		return pv;
	}

	/**
	 *  @memberof SQR.Matrix44.prototype
	 *  @description Multiplies this matrix by m
	 *  @param {SQR.Matrix44} m - matrix to multiply this matrix by
	 */
	this.multiply = function(m) {
		var a = this.data, b = m.data || m;

		var a00, a01, a02, a03, a04, a05, a06, a07, a08, a09, a10, a11, a12, a13, a14, a15;
		var b00, b01, b02, b03, b04, b05, b06, b07, b08, b09, b10, b11, b12, b13, b14, b15;

		a00 = a[0],a01 = a[1],a02 = a[2],a03 = a[3];
		a04 = a[4],a05 = a[5],a06 = a[6],a07 = a[7];
		a08 = a[8],a09 = a[9],a10 = a[10],a11 = a[11];
		a12 = a[12],a13 = a[13],a14 = a[14],a15 = a[15];

		b00 = b[0],b01 = b[1],b02 = b[2],b03 = b[3];
		b04 = b[4],b05 = b[5],b06 = b[6],b07 = b[7];
		b08 = b[8],b09 = b[9],b10 = b[10],b11 = b[11];
		b12 = b[12],b13 = b[13],b14 = b[14],b15 = b[15];

		a[0] = a00 * b00 + a04 * b01 + a08 * b02 + a12 * b03;
		a[1] = a01 * b00 + a05 * b01 + a09 * b02 + a13 * b03;
		a[2] = a02 * b00 + a06 * b01 + a10 * b02 + a14 * b03;
		a[3] = a03 * b00 + a07 * b01 + a11 * b02 + a15 * b03;

		a[4] = a00 * b04 + a04 * b05 + a08 * b06 + a12 * b07;
		a[5] = a01 * b04 + a05 * b05 + a09 * b06 + a13 * b07;
		a[6] = a02 * b04 + a06 * b05 + a10 * b06 + a14 * b07;
		a[7] = a03 * b04 + a07 * b05 + a11 * b06 + a15 * b07;

		a[8] = a00 * b08 + a04 * b09 + a08 * b10 + a12 * b11;
		a[9] = a01 * b08 + a05 * b09 + a09 * b10 + a13 * b11;
		a[10] = a02 * b08 + a06 * b09 + a10 * b10 + a14 * b11;
		a[11] = a03 * b08 + a07 * b09 + a11 * b10 + a15 * b11;

		a[12] = a00 * b12 + a04 * b13 + a08 * b14 + a12 * b15;
		a[13] = a01 * b12 + a05 * b13 + a09 * b14 + a13 * b15;
		a[14] = a02 * b12 + a06 * b13 + a10 * b14 + a14 * b15;
		a[15] = a03 * b12 + a07 * b13 + a11 * b14 + a15 * b15;

		return this;
	}

	/**
	 *  @method setTQS
	 *  @memberof SQR.Matrix44.prototype
	 *  @description Sets the translation/rotation/scale values at once. 
	 *  Similar to setTRS but the rotation is defined as a quaternion.
	 *  @param tx x translation
	 *  @param ty y translation
	 *  @param tz y translation
	 *  @param qw w compoment of the quaternion
	 *  @param qx x compoment of the quaternion
	 *  @param qx y compoment of the quaternion
	 *  @param qx z compoment of the quaternion
	 *  @param sx x scale
	 *  @param sy y scale
	 *  @param sz z scale
	 *  @param m the matrix to set scale to, applies to `this` if ommited
	 */
	this.setTQS = function(tx, ty, tz, qw, qx, qy, qz, sx, sy, sz, m) {

		var d = m || this.data;
		this.identity(m);

		var sqx = qx * qx;
		var sqy = qy * qy;
		var sqz = qz * qz;

		// fliping this part changes from left handed to right handed (I think)
		if(SQR.flipMatrix) {
			d[0] = (1 - 2 * sqy - 2 * sqz) * sx;
			d[1] = (2 * qx * qy - 2 * qz * qw) * sx;
			d[2] = (2 * qx * qz + 2 * qy * qw) * sx;

			d[4] = (2 * qx * qy + 2 * qz * qw) * sy;
			d[5] = (1 - 2 * sqx - 2 * sqz) * sy;
			d[6] = (2 * qy * qz - 2 * qx * qw) * sy;

			d[8] = (2 * qx * qz - 2 * qy * qw) * sz;
			d[9] = (2 * qy * qz + 2 * qx * qw) * sz;
			d[10] = (1 - 2 * sqx - 2 * sqy) * sz;
		} else {
			d[0] = (1 - 2 * sqy - 2 * sqz) * sx;
			d[4] = (2 * qx * qy - 2 * qz * qw) * sx;
			d[8] = (2 * qx * qz + 2 * qy * qw) * sx;

			d[1] = (2 * qx * qy + 2 * qz * qw) * sy;
			d[5] = (1 - 2 * sqx - 2 * sqz) * sy;
			d[9] = (2 * qy * qz - 2 * qx * qw) * sy;

			d[2] = (2 * qx * qz - 2 * qy * qw) * sz;
			d[6] = (2 * qy * qz + 2 * qx * qw) * sz;
			d[10] = (1 - 2 * sqx - 2 * sqy) * sz;
		}

		d[12] = tx;
		d[13] = ty;
		d[14] = tz;

		return m || this;
	}

	/**
	 *  @method setTRS
	 *  @memberof SQR.Matrix44.prototype
	 *  @description Sets the translation/rotation/scale values at once.
	 *  @param tx x translation
	 *  @param ty y translation
	 *  @param tz y translation
	 *  @param rx rotation angle in radians on the x axis
	 *  @param ry rotation angle in radians on the y axis
	 *  @param rz rotation angle in radians on the z axis
	 *  @param sx x scale
	 *  @param sy y scale
	 *  @param sz z scale
	 *  @param m the matrix to set scale to, applies to `this` if ommited
	 */
	this.setTRS = function(tx, ty, tz, rx, ry, rz, sx, sy, sz, m) {

		var d = m || this.data;
		this.identity(m);

		var six = Math.sin(rx), cox = Math.cos(rx), siy = Math.sin(ry), coy = Math.cos(ry), siz = Math.sin(rz), coz = Math.cos(rz);

		// fliping this part changes from left handed to right handed (I think)
		if(SQR.flipMatrix) {
			d[0] = (coy * coz + siy * six * siz) * sx;
			d[1] = (-coy * siz + siy * six * coz) * sx;
			d[2] = siy * cox * sx;

			d[4] = siz * cox * sy;
			d[5] = coz * cox * sy;
			d[6] = -six * sy;

			d[8] = (-siy * coz + coy * six * siz) * sz;
			d[9] = (siz * siy + coy * six * coz) * sz;
			d[10] = coy * cox * sz;
		} else {
			d[0] = (coy * coz + siy * six * siz) * sx;
			d[4] = (-coy * siz + siy * six * coz) * sx;
			d[8] = siy * cox * sx;

			d[1] = siz * cox * sy;
			d[5] = coz * cox * sy;
			d[9] = -six * sy;

			d[2] = (-siy * coz + coy * six * siz) * sz;
			d[6] = (siz * siy + coy * six * coz) * sz;
			d[10] = coy * cox * sz;
		}

		d[12] = tx;
		d[13] = ty;
		d[14] = tz;

		return m || this;
	}

	/**
	 *  @method setScale
	 *  @memberof SQR.Matrix44.prototype
	 *  @description Sets the scale values.
	 *  @param sx x scale
	 *  @param sy y scale
	 *  @param sz z scale
	 *  @param m the matrix to set scale to, applies to `this` if ommited
	 */
	this.setScale = function(sx, sy, sz, m) {
		var d = m || this.data;
		d[0] = sx,d[5] = sy,d[10] = sz;
		return m || this;
	}

	/**
	 *  @method setTranslation
	 *  @memberof SQR.Matrix44.prototype
	 *  @description Sets the translation values.
	 *  @param tx x translation
	 *  @param ty y translation
	 *  @param tz z translation
	 *  @param m the matrix to set translation to, applies to `this` if ommited
	 */
	this.setTranslation = function(tx, ty, tz, m) {
		var d = m || this.data;
		d[12] = tx, d[13] = ty, d[14] = tz;
		return m || this;
	}

	/**
	 *  @method setRotation
	 *  @memberof SQR.Matrix44.prototype
	 *  @description Sets the rotation value.
	 *  @param rx angle in radians of the rotation on x axis
	 *  @param ry angle in radians of the rotation on y axis
	 *  @param rz angle in radians of the rotation on z axis
	 *  @param m the matrix to set rotation to, applies to `this` if ommited
	 */
	this.setRotation = function(rx, ry, rz, m) {
		var d = m || this.data;
		var six = Math.sin(rx), cox = Math.cos(rx), 
			siy = Math.sin(ry), coy = Math.cos(ry), 
			siz = Math.sin(rz), coz = Math.cos(rz);

		d[0] = coy * coz + siy * six * siz;
		d[1] = -coy * siz + siy * six * coz;
		d[2] = siy * cox;

		d[4] = siz * cox;
		d[5] = coz * cox;
		d[6] = -six;

		d[8] = -siy * coz + coy * six * siz;
		d[9] = siz * siy + coy * six * coz;
		d[10] = coy * cox;

		return m || this;
	}

	/** 
	 *  @method translate
	 *  @memberof SQR.Matrix44.prototype
	 *  @description Applies translation to matrix
	 *  @param tx x translation
	 *  @param ty y translation
	 *  @param tz z translation
	 */
	this.translate = function(tx, ty, tz) {
		this.identity(SQR.Matrix44.__temp);
		this.setTranslation(tx, ty, tz, SQR.Matrix44.__temp);
		return this.multiply(SQR.Matrix44.__temp);
	}

	/** 
	 *  @method rotate
	 *  @memberof SQR.Matrix44.prototype
	 *  @param rx angle in radians of the rotation on x axis
	 *  @param ry angle in radians of the rotation on y axis
	 *  @param rz angle in radians of the rotation on z axis
	 *  @description Applies rotation to matrix
	 */
	this.rotate = function(rx, ry, rz) {
		this.identity(SQR.Matrix44.__temp);
		this.setRotation(rx, ry, rz, SQR.Matrix44.__temp);
		return this.multiply(SQR.Matrix44.__temp);
	}

	/** 
	 *  @method scale
	 *  @memberof SQR.Matrix44.prototype
	 *  @param sx x scale
	 *  @param sy y scale
	 *  @param sz z scale
	 *  @description Applies scale to matrix
	 */
	this.scale = function(sx, sy, sz) {
		this.identity(SQR.Matrix44.__temp);
		this.setScale(sx, sy, sz, SQR.Matrix44.__temp);
		return this.multiply(SQR.Matrix44.__temp);
	}

	/** 
	 *  @method copyTo
	 *  @memberof SQR.Matrix44.prototype
	 *  Copies the values from this matrix into m
	 *
	 *  @param {SQR.Matrix44|Float32Array} m - the matrix or 16-compoment array to copy the values to
	 */
	this.copyTo = function(m) {
		var a = this.data, b = m.data || m;
		for (var i = 0; i < 16; i++) b[i] = a[i];
		return m;
	}

	/** 
	 *  @method copyRotationTo
	 *  @memberof SQR.Matrix44.prototype
	 *  Copies only the rotation/scale portion of the matrix into m to the current matrix
	 *
	 *  @param {SQR.Matrix44|Float32Array} m - the matrix or 16-compoment array to copy the values to
	 */
	this.copyRotationTo = function(m) {
		var a = this.data, b = m.data || m;

		b[0] = a[0];
		b[1] = a[1];
		b[2] = a[2];

		b[3] = a[4];
		b[4] = a[5];
		b[5] = a[6];

		b[6] = a[8];
		b[7] = a[9];
		b[8] = a[10];

		return m;
	}

	/** 
	 *  @method extractPosition
	 *  @memberof SQR.Matrix44.prototype
	 *  Sets v to the translation vakue of this matrix. Useful for extracting position of an element
	 *  based on it's transformation matrix, ex. this is how the the global position of a {@link SQR.Transform} 
	 *  is obtained.
	 *
	 *  @param {SQR.V3} v - the vector to copy the translation values to
	 */
	this.extractPosition = function(v) {
		var d = this.data;
		v.set(d[12], d[13], d[14]);
		return v;
	}

	this.determinant = function() {
		var d = this.data;

		return d[0] * (d[5] * d[10] - d[9] * d[6]) +
			d[4] * (d[9] * d[2] - d[1] * d[10]) +
			d[8] * (d[1] * d[6] - d[5] * d[2]);
	}

	this.inverse = function(m) {
		var a = this.data;
		var d = (m) ? m.data || m : this.data;

		var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
			a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
			a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
			a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

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

			// Calculate the determinant
			det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

		if (!det) { 
			return null; 
		}
		det = 1.0 / det;

		d[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
		d[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
		d[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
		d[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
		d[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
		d[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
		d[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
		d[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
		d[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
		d[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
		d[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
		d[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
		d[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
		d[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
		d[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
		d[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

		return m;
	};

	
	this.inverseMat3 = function(m) {
		// adapted from gl-Matrix.js
		var d = this.data;
		var a = m.data;
		var det = this.determinant();

		if (Math.abs(det) < 0.0001) {
			console.warn("> SQR.Matrix44 - Attempt to inverse a singular matrix44. ", this.data);
			console.trace();
			return m;
		}

		var d0 = d[0], d4 = d[4], d8 = d[8],   d12 = d[12],
			d1 = d[1], d5 = d[5], d9 = d[9],   d13 = d[13],
			d2 = d[2], d6 = d[6], d10 = d[10], d14 = d[14];

		det = 1 / det;

		// To make a NormalMatrix - needs to be transposed
		a[0] = (d5 * d10 - d9 * d6) * det;
		a[1] = (d8 * d6 - d4 * d10) * det;
		a[2] = (d4 * d9 - d8 * d5) * det;

		a[3] = (d9 * d2 - d1 * d10) * det;
		a[4] = (d0 * d10 - d8 * d2) * det;
		a[5] = (d8 * d1 - d0 * d9) * det;

		a[6] = (d1 * d6 - d5 * d2) * det;
		a[7] = (d4 * d2 - d0 * d6) * det;
		a[8] = (d0 * d5 - d4 * d1) * det;
		// m.transpose();

		// To make a NormalMatrix - doesn't need to be transposed
		// a[0] = (d5 * d10 - d9 * d6) * det;
		// a[3] = (d8 * d6 - d4 * d10) * det;
		// a[6] = (d4 * d9 - d8 * d5) * det;

		// a[1] = (d9 * d2 - d1 * d10) * det;
		// a[4] = (d0 * d10 - d8 * d2) * det;
		// a[7] = (d8 * d1 - d0 * d9) * det;

		// a[2] = (d1 * d6 - d5 * d2) * det;
		// a[5] = (d4 * d2 - d0 * d6) * det;
		// a[8] = (d0 * d5 - d4 * d1) * det;

		

		return m;
	}

	this.transpose = function(m) {
		var d = this.data;
		var a = (m) ? m.data || m : this.data;

		var d0 = d[0], d4 = d[4], d8 = d[8],
			d1 = d[1], d5 = d[5], d9 = d[9],
			d2 = d[2], d6 = d[6], d10 = d[10];

		a[0] = d0;
		a[1] = d4;
		a[2] = d8;

		a[4] = d1;
		a[5] = d5;
		a[6] = d9;

		a[8] = d2;
		a[9] = d6;
		a[10] = d10;
	}

	this.lookAt = function (target, up) {
		var d = this.data;
		var x = SQR.V3.__tv1;
		var y = SQR.V3.__tv2;
		var z = SQR.V3.__tv3;

		up = up || SQR.V3.up;

		// console.log(target, up);

		z.set(d[12], d[13], d[14]);
		z.sub(z, target).norm();
		if (z.magsq() === 0) z.z = 1;

		x.cross(up, z).norm();
		if (x.magsq() === 0) {
			z.x += 0.0001;
			x.cross(up, z).norm();
		}

		y.cross(z, x);

		d[0] = x.x, d[4] = y.x, d[8] = z.x;
		d[1] = x.y, d[5] = y.y, d[9] = z.y;
		d[2] = x.z, d[6] = y.z, d[10] = z.z;

		return this;
	}

	if(!data) this.identity();
}

SQR.Matrix44.__temp = new Float32Array(16);











 /**
 *  @method create2DQuad
 *  @memberof SQR.Primitives
 *
 *  @description Creates a 2d quad
 *
 *  @param {Number} x - x position of the quad
 *  @param {Number} y - y position of the quad
 *  @param {Number} w - width of the quad
 *  @param {Number} h - height of the quad
 *
 *  @returns {SQR.Buffer}
 */
SQR.Primitives.create2DQuad = function(x, y, w, h) {
	return SQR.Buffer()
		.layout(SQR.v2u2(), 6)
		.data('aPosition',   x, y+h,   x+w, y,     x+w, y+h,    x+w, y,    x, y+h,    x, y)
		.data('aUV',         0, 0,     1,   1,     1,   0,      1,   1,    0, 0,      0, 1)
		.update();
}

/**
 *  @method createPlane
 *  @memberof SQR.Primitives
 *
 *  @description Creates a plane, by default on the X/Y plane
 *
 *  @param {Number} w - width of the plane
 *  @param {Number} h - height of the plane
 *  @param {Number} wd - number of segments along the width
 *  @param {Number} hd - number of segments along the height
 *  @param {Number} wo - horizontal offset
 *  @param {Number} ho - vertical offset
 *
 *  @returns {SQR.Buffer}
 */
SQR.Primitives.createPlane = function(w, h, wd, hd, wo, ho, options) {

	var faces = [], indices = [];

	var geo = new SQR.Buffer();
	var options = options || {};
	
	geo.width = w;
	geo.height = h;

	var w = w * 0.5;
	var h = h * 0.5;

	var wo = wo || 0;
	var ho = ho || 0;

	var wd = wd || 1;
	var hd = hd || 1;

	faces.length = [];

	var wStart = -w + wo;
	var hStart = -h + ho;

	var wb = geo.width / wd;
	var hb = geo.height / hd;

	var i, j;
	var vertices = [], uvs = [];

	for (i = 0; i < wd+1; i++) {
		for (j = 0; j < hd+1; j++) {
			var bvStart = wStart + i * wb;
			var bhStart = hStart + j * hb;
			var ij = i * (hd+1) + j;

			if(options.perQuadUV) {
				uvs[ij] = new SQR.V2(i % 2, j % 2);
			} else {
				uvs[ij] = new SQR.V2(i/wd, j/hd);
			}

			if (!options.zUp) {
				vertices[ij] = new SQR.V3(bvStart, 0, bhStart);
			} else {
				vertices[ij] = new SQR.V3(bvStart, bhStart, 0);
			}
		}
	}

	for (i = 0; i < wd; i++) {
		for (j = 0; j < hd; j++) {

			var bvStart = wStart + i * wb;
			var bvEnd = bvStart + wb;
			var bhStart = hStart + j * hb;
			var bhEnd = bhStart + hb;

			var ij = i * (hd+1) + j;
			var ij2 = (i+1) * (hd+1) + j;

			var q = new SQR.Face().setIndex(vertices, ij, ij+1, ij2, ij2+1);
			faces.push(q);
			indices.push(ij, ij+1, ij2,   ij2, ij+1, ij2+1);
		}
	}


	layout = (options.layout) ? options.layout : {};

	layout.aPosition = 3;
	layout.aNormal = 3;
	layout.aUV = 2;

	geo.layout(layout, vertices.length);

	geo.faces = faces;
	geo.vertices = vertices;

	geo.recalculateNormals = function() {
		faces.forEach(function(f) {
			f.calculateNormal();
			f.addNormalToVertices();
		});

		return geo;
	}

	geo.updateFromFaces = function() {

		geo.iterate('aPosition', function(i, data, c) {
			var v = vertices[c];
			data[i+0] = v.x;
			data[i+1] = v.y;
			data[i+2] = v.z;
		});

		geo.iterate('aNormal', function(i, data, c) {
			var v = vertices[c];
			v.normal.norm();
			data[i+0] = v.normal.x;
			data[i+1] = v.normal.y;
			data[i+2] = v.normal.z;
		});

		geo.iterate('aUV', function(i, data, c) {
			var v = uvs[c];
			data[i+0] = v.x;
			data[i+1] = v.y;
		});

		geo.index(indices);

		return geo;
	}


	return geo.recalculateNormals().updateFromFaces().update();
}















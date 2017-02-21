var gl;


class Grid{
	constructor(gl){
		this.init(gl, 10, 10);
	}

	init(gl, n, len){
		var vertices = new Array(3*(n+1)*2*2);
		var colors = new Array(4*(n+1)*2*2);

		for(var i=0; i<=n; i++)
		{
			vertices[i*6+0] = i-len/2.0
			vertices[i*6+1] = 0
			vertices[i*6+2] = -len/2.0

			vertices[i*6+3] = i-len/2.0
			vertices[i*6+4] = 0
			vertices[i*6+5] = len/2.0

			vertices[i*6+n*6+0] = -len/2.0
			vertices[i*6+n*6+1] = 0
			vertices[i*6+n*6+2] = i-len/2.0

			vertices[i*6+n*6+3] = len/2.0
			vertices[i*6+n*6+4] = 0
			vertices[i*6+n*6+5] = i-len/2.0

			var col=0.2+(0.8*i/n);

			colors[i*8+0] = col;
			colors[i*8+1] = col;
			colors[i*8+2] = col;
			colors[i*8+3] = 1;

			colors[i*8+4] = col;
			colors[i*8+5] = col;
			colors[i*8+6] = col;
			colors[i*8+7] = 1;

			colors[i*8+n*8+0] = col;
			colors[i*8+n*8+1] = col;
			colors[i*8+n*8+2] = col;
			colors[i*8+n*8+3] = 1;

			colors[i*8+n*8+4] = col;
			colors[i*8+n*8+5] = col;
			colors[i*8+n*8+6] = col;
			colors[i*8+n*8+7] = 1;
		}

		this.vertexBuffer = gl.createBuffer();
		this.colorBuffer = gl.createBuffer();

		this.num_vertices = (n+1)*2 * 2;

		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	}

	draw(gl)
	{
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
		gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
		gl.drawArrays(gl.LINES, 0, this.num_vertices);
	}

}

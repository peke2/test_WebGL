var gl;

var vertexPositionAttribute;
var vertexColorAttribute;
var shaderProgram;

var rotation_deg;

function start()
{
	var canvas = document.getElementById("glcanvas");

	gl = initWebGL(canvas);
	if( !gl )	return;

	gl.clearColor(0.1, 0.4, 0.6, 1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);


	var vertexShaderSource = 
	'attribute vec3 position;\n'+
	'attribute vec4 color;\n'+
	'uniform mat4 viewMatrix;\n'+
	'uniform mat4 projMatrix;\n'+
	'varying lowp vec4 vColor;\n'+
	'void main(){\n'+
	'gl_Position = projMatrix * viewMatrix * vec4(position, 1.0);\n'+
	'vColor = color;\n'+
	'}';

	var fragmentShaderSource = 
	'varying lowp vec4 vColor;\n'+
	'void main(){\n'+
	'gl_FragColor = vColor;\n'+
	'}';

	var vertexShader = createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
	var fragmentShader = createShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);

	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if( !gl.getProgramParameter(shaderProgram, gl.LINK_STATUS) )
	{
		console.log('シェーダープログラムのリンクに失敗しました。'+gl.getProgramInfoLog(shaderProgram));
	}

	gl.useProgram(shaderProgram);
	vertexPositionAttribute = gl.getAttribLocation(shaderProgram, 'position');
	gl.enableVertexAttribArray(vertexPositionAttribute);
	vertexColorAttribute = gl.getAttribLocation(shaderProgram, 'color');
	gl.enableVertexAttribArray(vertexColorAttribute);

	initBuffer();

	rotation_deg = 0;

	setInterval(drawScene, 16);
}

function initWebGL(canvas)
{
	gl = null;
	try{
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
	}
	catch(e){
	}

	if( !gl )
	{
		alert("WebGL を初期化できません。ブラウザはサポートしていないようです。");
	}

	return	gl;
}

function createShader(gl, source, type)
{
	var shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if( !gl.getShaderParameter(shader, gl.COMPILE_STATUS) )
	{
		var info = gl.getShaderInfoLog(shader);
		throw 'Shaderをコンパイルできませんでした。\n\n'+info;
	}
	return	shader;
}


var vertexBuffer;
var colorBuffer;

function initBuffer()
{
	var vertices = [
		 0.0,  0.578, 0,
		 0.5, -0.288, 0,
		-0.5, -0.288, 0,
	];
	var colors = [
		 1.0, 0.0, 0.0, 1.0,
		 0.0, 1.0, 0.0, 1.0,
		 0.0, 0.0, 1.0, 1.0,
	];
	//var vertexBuffer = gl.createBuffer();
	//var colorBuffer = gl.createBuffer();

	vertexBuffer = gl.createBuffer();
	colorBuffer = gl.createBuffer();

	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
}

function applyMatrix()
{
/*
	var viewMatrix = [
		0.5, 0.0, 0.0, 0.0,
		0.0, 1.0, 0.0, 0.0,
		0.0, 0.0, 1.0, 0.0,
		0.0, 0.0, 0.0, 1.0,
	];

	var projMatrix = [
		1.0, 0.0, 0.0, 0.0,
		0.0, 1.0, 0.0, 0.0,
		0.0, 0.0, 1.0, 0.0,
		0.0, 0.0, 0.0, 1.0,
	];
*/
	var viewMatrix = mat4.create();
	var projMatrix = mat4.create();

	var aspect = 640.0/480.0;
	var near = 0.5;
	var far = 500.0;
	mat4.perspective(projMatrix, Math.PI/180.0*45, aspect, near, far);

	var trans = vec3.create();
	vec3.set(trans, 0,0,-5);
	mat4.translate(viewMatrix, viewMatrix, trans);

	var rad = rotation_deg/180.0*Math.PI;
	var rotMatrix = mat4.create();
	rotMatrix[0] = Math.cos(rad);
	rotMatrix[1] = Math.sin(rad);
	rotMatrix[4] = -Math.sin(rad);
	rotMatrix[5] = Math.cos(rad);
	mat4.multiply(viewMatrix, viewMatrix, rotMatrix);

	var uniform = gl.getUniformLocation(shaderProgram, "viewMatrix");
	gl.uniformMatrix4fv(uniform, false, new Float32Array(viewMatrix));

	uniform = gl.getUniformLocation(shaderProgram, "projMatrix");
	gl.uniformMatrix4fv(uniform, false, new Float32Array(projMatrix));
}


function drawScene()
{
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	applyMatrix();

	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);

	rotation_deg += 1;
	rotation_deg = rotation_deg%360;
}


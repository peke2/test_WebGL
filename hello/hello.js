var gl;

function start()
{
	var canvas = document.getElementById("glcanvas");

	gl = initWebGL(canvas);
	if( !gl )	return;

	gl.clearColor(0.1, 0.4, 0.6, 1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);

	setInterval(drawScene, 16);
}

function initWebGL(canvas)
{
	gl = null;
	try
	{
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
	}
	catch(e)
	{
	}

	if( !gl )
	{
		alert("WebGL を初期化できません。ブラウザはサポートしていないようです。");
	}

	return	gl;
}

function drawScene()
{
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.begin(gl.TRIANGLES);
	gl.vertex(0,0.578,0);
	gl.vertex(-0.5,-0.288,0);
	gl.vertex(0.5,-0.288,0);
	gl.end();
}


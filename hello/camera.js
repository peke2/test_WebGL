
//	カメラ

class Camera
{
	constructor()
	{
		this.pos = vec3.create();
		this.look = vec3.create();
	}

	setPos(x, y, z)
	{
		vec3.set(this.pos, -x,-y,-z);
	}

	lookAt(x, y, z)
	{
		vec3.set(this.look, x,y,z);
	}

	calcMatrix()
	{
		var	front, right, up;
		front = vec3.create();
		right = vec3.create();
		up    = vec3.create();
		vec3.sub(front, this.pos, this.look);
		vec3.normalize(front, front);

		var u = vec3.create();
		vec3.set(u, 0,1,0);
		vec3.cross(right, u, front);
		//vec3.normalize(right, right);
		vec3.cross(up, right, front);

		var	mat = mat4.create();
		mat[0] = right[0];
		mat[4] = right[1];
		mat[8] = right[2];

		mat[1] = up[0];
		mat[5] = up[1];
		mat[9] = up[2];

		mat[2] = front[0];
		mat[6] = front[1];
		mat[10] = front[2];

		mat[12] = this.pos[0];
		mat[13] = this.pos[1];
		mat[14] = this.pos[2];

		return	mat;
	}

}

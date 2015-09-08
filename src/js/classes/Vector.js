export default class Vector {
	constructor(xname, yname){
		this.xname = xname;
		this.yname = yname;
		this.reset();
	}
	reset(){
		this.point = null;
		this._x  = 0;
		this._y  = 0;
	}
	update(point){
		this.point = point;
		this._x    = point[this.xname].toFixed(3) * 1;
		this._y    = point[this.yname].toFixed(3) * 1;
	}
	get x() {
		return this._x;
	}
	get y() {
		return this._y;
	}
	set x(value) {
		var point = this.point;
		if (point) {
			point[this.xname] = value;
			this._x = value;
		}
	}
	set y(value) {
		var point = this.point;
		if (point) {
			point[this.yname] = value;
			this._y = value;
		}
	}
}
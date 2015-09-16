var DetailPlugin = require('./DetailPlugin');
export default class VectorDetailPlugin extends DetailPlugin {
	constructor({xname = 'x', yname = 'y', header, fields}){
		super({header, fields});
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
		this._x = point[this.xname];
		if (this._x && this._x.toFixed) {
			this._x = this._x.toFixed(3) * 1;
		}
		this._y = point[this.yname];
		if (this._y && this._y.toFixed) {
			this._y = this._y.toFixed(3) * 1;
		}
	}
	get x() {
		return this._x * 1;
	}
	get y() {
		return this._y * 1;
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
var _ = require('lodash')
var VectorDetailPlugin = require('../classes/VectorDetailPlugin');

export default class AnchorPlugin extends VectorDetailPlugin {
	constructor(){
		super({
			header : 'Anchor',
			fields : [{
				detail : {
					data  : 'x',
					flex  : 8,
					input : true,
					type  : 'number'
				}
			},{
				detail : {
					data  : 'y',
					flex  : 8,
					input : true,
					type  : 'number'
				}
			}]
		});
	}
	reset(obj){
		if (!obj) return;
		this.show = !_.isUndefined(obj.anchor);
	}
	update(obj){
		super.update(obj.anchor);
	}
}
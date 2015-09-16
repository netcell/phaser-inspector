var _ = require('lodash');
var VectorDetailPlugin = require('../classes/VectorDetailPlugin');

export default class TargetSizePlugin extends VectorDetailPlugin {
	constructor(){
		super({
			xname  : 'targetWidth',
			yname  : 'targetHeight',
			header : 'Target size',
			fields : [{
				label : {
					text : 'width',
					flex : 4
				},
				detail : {
					data  : 'x',
					flex  : 5,
					input : true,
					type  : 'number'
				}
			},{
				label  : {
					text : 'height',
					flex : 5
				},
				detail : {
					data  : 'y',
					flex  : 5,
					input : true,
					type  : 'number'
				}
			}]
		});
	}
	reset(obj){
		if (!obj) return;
		this.show = !_.isUndefined(obj.targetWidth);
	}
}
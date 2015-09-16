var VectorDetailPlugin = require('../classes/VectorDetailPlugin');

export default class BoundsPlugin extends VectorDetailPlugin {
	constructor(){
		super({
			xname  : 'width',
			yname  : 'height',
			header : 'Bounds',
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
	update(obj){
		var bounds = obj.getBounds();
		super.update(bounds);
	}
}
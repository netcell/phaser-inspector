var VectorDetailPlugin = require('../classes/VectorDetailPlugin');

export default class ScalePlugin extends VectorDetailPlugin {
	constructor(){
		super({
			header : 'Scale',
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
	update(obj){
		super.update(obj.scale);
	}
}
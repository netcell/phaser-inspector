var VectorDetailPlugin = require('../classes/VectorDetailPlugin');

export default class WorldPlugin extends VectorDetailPlugin {
	constructor(){
		super({
			xname  : 'tx',
			yname  : 'ty',
			header : 'World Position',
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
		super.update(obj.worldTransform);
	}
}
var VectorDetailPlugin = require('../classes/VectorDetailPlugin');

export default class SizePlugin extends VectorDetailPlugin {
	constructor(){
		super({
			xname  : 'width',
			yname  : 'height',
			header : 'Size',
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
}
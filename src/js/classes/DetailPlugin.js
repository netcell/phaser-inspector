var _ = require('lodash');
export default class DetailPlugin {
	constructor({gameManager, header, fields }){
		this.show        = true;
		this.gameManager = gameManager;
		this.header      = header;
		this.fields      = fields;
		var self         = this;

		if ( fields.template ) {
			var data = fields.data;
			Object.defineProperty(fields, 'data', {
				get(){
					return self[data];
				},
				set(value){
					return self[data] = value;
				}
			})
		} else for (var i = fields.length - 1; i >= 0; i--) {
			let field = fields[i];
			field.label = field.label || {};
			let {label, detail} = field;
			if (_.isString(label)) {
				field.label = { text : label };
				label = field.label;
			}
			label.text = label.text || detail.data;
			let data = detail.data;
			Object.defineProperty(detail, 'data', {
				get(){
					return self[data];
				},
				set(value){
					return self[data] = value;
				}
			})
		};
		//TODO: Make some check here
	}
	reset(){
	}
	update(obj){
	}
}

DetailPlugin.plugins = [];
DetailPlugin.add = function(Plugin){
	DetailPlugin.plugins.push(Plugin);
}
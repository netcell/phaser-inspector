var _ = require('lodash')
var DetailPlugin = require('../classes/DetailPlugin');

export default class FrameRenderPlugin extends DetailPlugin {
	constructor(gameManager){
		super({
			gameManager : gameManager,
			header      : 'Frame',
			fields      : {
				template : "<div class=\"frame-img\" ng-style=\"{\
								'padding-left'        : 0,\
								background            :'url('+plugin.img.url+')',\
								width                 : plugin.img.width+'px',\
								height                : plugin.img.height+'px',\
								'background-position' : (-plugin.img.x) + 'px ' + (-plugin.img.y) + 'px',\
								transform             : 'scale(' + plugin.img.scale + ')'\
							}\"></div>"
			}
		});
	}
	reset(obj, wrapObj){
		if (!obj) return;
		this.img = wrapObj.img;
		this.show = !!wrapObj.img.url;
	}
	update(obj, wrapObj){
		this.img = wrapObj.img;
	}
}
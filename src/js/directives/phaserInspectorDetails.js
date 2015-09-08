var detailsTpl = require('../../tpl/details.html');

export default function($compile) {
	return {
		controller   : 'DetailCtrl',
		controllerAs : 'detailCtrl',
		template     : detailsTpl
	};
};
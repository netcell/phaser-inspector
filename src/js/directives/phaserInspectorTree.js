var treeTpl = require('../../tpl/tree.html');

export default function($compile) {
	return {
		controller   : 'TreeCtrl',
		controllerAs : 'treeCtrl',
		template     : treeTpl
	};
};
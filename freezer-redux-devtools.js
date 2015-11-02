var Redux = require('redux');
var DevTools = require('redux-devtools');
var FreezerMiddleware = require('./freezer-redux-middleware');

/**
 * Creates a redux store and adds FreezerMiddleware to it.
 * @param  {Freezer} State   Freezer's app state.
 * @param  {boolean} persist When to persist the current session on window reloads.
 * @return {ReduxStore}      A store to be used by the DevTools component.
 */
function getStore( State, persist ){
	var store = Redux.compose(
		FreezerMiddleware.FreezerMiddleware( State ),
		DevTools.devTools(),
		DevTools.persistState( persist || window.location.href.match(/[?&]debug_session=([^&]+)\b/) )
	)(Redux.createStore)( function( state ){ return state } );

	return store;
}

module.exports = {
	getStore: getStore
};

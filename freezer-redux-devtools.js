import { createStore, compose } from 'redux';
import { devTools, persistState } from 'redux-devtools';

var ActionTypes = {
	INIT: '@@INIT',
	COMMIT: 'COMMIT'
};

/**
 * Redux middleware to make freezer and devtools
 * talk to each other.
 * @param {Freezer} State Freezer's app state.
 */
function FreezerMiddleware( State ){
	return function( next ){
		return function FreezerStoreEnhancer(){
			var commitedState = State.get(),
				/**
				 * Freezer reducer will trigger events on any
				 * devtool action to synchronize freezer's and
				 * devtool's states.
				 *
				 * @param  {Object} state  Current devtool state. We don't use it.
				 * @param  {Object} action Action being dispatched.
				 * @return {Object}        Freezer state after the action.
				 */
				reducer = function( state, action ){
					if( action.type == ActionTypes.INIT ){
						State.set( commitedState );
					}
					else {
						// Flag that we are dispatching to not
						// to dispatch the same action twice
						State.skipDispatch = 1;
						State.trigger.apply( State, [ action.type ].concat( action.arguments || [] ) );
					}

					// The only valid state is freezer's one.
					return State.get();
				},
				store = next( reducer ),
				toolsDispatcher = store.devToolsStore.dispatch
			;

			// Override devTools store's dispatch, to set commitedState
			// on Commit action.
			store.devToolsStore.dispatch = function( action ){
				var states;

				if( action.type == ActionTypes.COMMIT ){
					states = store.devToolsStore.getState().computedStates;
					commitedState = states[ states.length - 1 ].state;
				}

				toolsDispatcher.apply( store.devToolsStore, arguments );
				return action;
			};

			// Dispatch any freezer "fluxy" event to let the devTools
			// know about the update.
			State.on('afterAll', function( reactionName ){
				reactionName != 'update' || return;

				// We don't dispatch if the flag is true
				if( this.skipDispatch )
					this.skipDispatch = 0;
				else {
					var args = [].slice.call( arguments, 1 );
					store.dispatch({ type: reactionName, args: args });
				}
			});

			return store;
		};
	};
}

/**
 * Creates a redux store and adds FreezerMiddleware to it.
 * @param  {Freezer} State   Freezer's app state.
 * @param  {boolean} persist When to persist the current session on window reloads.
 * @return {ReduxStore}      A store to be used by the DevTools component.
 */
function getStore( State, persist ){
	var store = compose(
		FreezerMiddleware( State ),
		devTools(),
		persistState( persist || window.location.href.match(/[?&]debug_session=([^&]+)\b/) ),
		createStore
	)( function( state ){ return state } );

	return store;
}

module.exports = {
	getStore: getStore,
	FreezerMiddleware: FreezerMiddleware
};

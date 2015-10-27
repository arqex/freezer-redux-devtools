# freezer-redux-devtools

A bind to use [redux-devtools](https://github.com/gaearon/redux-devtools) in [freezer-js](https://github.com/arqex/freezer) apps.

Dan Abramov's [redux](https://github.com/rackt/redux) is a really clever piece of software, but I love the simplicity of freezer-js to create flux apps. Redux has the best tools for developers and freezer-js has nothing similar. Fortunatelly both solutions relies in having all the app state in a single object, so make redux-devtools working with freezer instead of redux is not difficult.

This package creates a redux store that communicates redux-devtools and freezer-js.

## Installation
Go to your project root and...
```
npm install --save freezer-redux-devtools
```

## Usage
See the [freezer-redux-devtools example](https://github.com/arqex/freezer-redux-devtools-example) to see this module working.

```js
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import React, { Component } from 'react';
import { getStore } from './freezer-redux-devtools/freezer-redux-devtools';

// Our state is a freezer object
var State = new Freezer({hello: 'world'});

// Create a redux store that talks to freezer state
const store = getStore( State );

// Root component including devtools and refreshing on state change
export default class App extends Component {
  render() {
    return (
      <div>
        <MyApp state={ State.get() } />
        <DebugPanel top right bottom>
            <DevTools store={store} monitor={LogMonitor} />
        </DebugPanel>
      </div>
    );
  }
  componentDidMount() {
    State.on('update', () => this.forceUpdate());
  }
}
```

Every event triggered in `State` object will be shown in the `DevTools` sidebar. And all the actions dispatched by the `DevTools` will be reflected in 
`State`-

`freezer-redux-devtools` module exports:
* `getStore( Freezer:State, boolean:persist=/[?&]debug_session=([^&]+)\b/)` creates a store to be used directly by `DevTools` component.
* `FreezerMiddleware( Freezer:State )` creates a redux store enhancer to let you create your own redux store.

## Collaborate
This project is in some way a fully functional proof of concept, but there is room for improvement:
* Extract the names of reaction arguments and show them in the sidebar.
* How to display asynchronous reactions?

## [License MIT](LICENSE)

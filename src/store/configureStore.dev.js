import { compose, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'

// import timelineMap from '../lib/timelineMap'
// import config from '../config'
import reducers from '../reducers'
import api from '../middleware/api'
// import timeline from '../middleware/timeline'

export default (initialState) => {
    const store = createStore(
        reducers,
        initialState,
        compose(
            applyMiddleware(
                thunk, api,
                // timeline(config.timeline.token, timelineMap),
                createLogger()
            ),
            window.devToolsExtension ? window.devToolsExtension() : f => f
        )
    )

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers', () => {
            /* eslint-disable */
            const nextRootReducer = require('../reducers').default
            /* eslint-enable */
            store.replaceReducer(nextRootReducer)
        })
    }

    return store
}

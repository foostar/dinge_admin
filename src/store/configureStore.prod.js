import { compose, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

// import timelineMap from '../lib/timelineMap'
// import config from '../config'
// import timeline from '../middleware/timeline'
import reducers from '../reducers'
import api from '../middleware/api'

export default (initialState) => {
    const store = createStore(
        reducers,
        initialState,
        compose(
            applyMiddleware(
              thunk,
              api,
              // timeline(config.timeline.token, timelineMap)
            )
        )
    )

    return store
}

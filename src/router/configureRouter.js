import React from 'react'
import { Router, Route, browserHistory, IndexRoute,
    IndexRedirect, Redirect } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'


import Container from '../containers/Container'
import login from '../containers/login'

export default (store) => {
    const history = syncHistoryWithStore(browserHistory, store)
    return (
      <Router history={ history }>
        <Route path="/" component={ Container } >
          <Route path="login" component={ login } />
        </Route>
      </Router>
    )
}


import React from 'react'
import { Router, Route, browserHistory, Redirect } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import localforage from 'localforage'

/*
 * @公共部分
 */
import Container from '../containers/Container'
import Login from '../containers/login'
import Layout from '../containers/layout'
/*
 * @电影部分
 */
import MovieList from '../containers/movie/movielist'
import Editmovie from '../containers/movie/editmovie'
// movie end
/*
 * @评论部分
 */
import CommentList from '../containers/comment/commentlist'
import ReportComment from '../containers/comment/reportcomment'
// comment end
/*
 * @用户部分
 */
import UserList from '../containers/user/userlist'
import UserConfirm from '../containers/user/userconfirm'
import ReportUser from '../containers/user/reportuser'
// user end
/*
 * @公共部分
 */
import AdCarsousel from '../containers/ad/adcarsousel'
import EditAdSel from '../containers/ad/editadsel'
// ad end

export default (store) => {
    const history = syncHistoryWithStore(browserHistory, store)
    const requireAuth = (nextState, replace) => {
        localforage.getItem('dingeToken')
        .then((result) => {
            if (!result) {
                replace('/login')
            }
        })
    }
    const requireNotAuth = (nextState, replace) => {
        localforage.getItem('dingeToken')
        .then((result) => {
            if (result) {
                replace('/app/movielist')
            }
        })
    }
    return (
      <Router history={ history }>
        <Redirect from="/" to="/login" />
        <Route path="/" component={ Container }>
          <Route path="login" component={ Login } onEnter={ requireNotAuth } />
          <Route path="app" component={ Layout } onEnter={ requireAuth } >
            <Route path="movielist" component={ MovieList } />
            <Route path="editmovie" component={ Editmovie } />
            <Route path="commentlist" component={ CommentList } />
            <Route path="userlist" component={ UserList } />
            <Route path="userconfirm" component={ UserConfirm } />
            <Route path="reportcomment" component={ ReportComment } />
            <Route path="reportuser" component={ ReportUser } />
            <Route path="adcarsousel" component={ AdCarsousel } />
            <Route path="editadsel" component={ EditAdSel } />
            {/* route */}
          </Route>
        </Route>
      </Router>
    )
}


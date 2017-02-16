import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import Login from './login'
/*
 * @电影部分
 */
import MovieList from './movie/movielist'
import EditMovie from './movie/editmovie'
// movie end
/*
 * @评论部分
 */
import CommentList from './comment/commentlist'
// comment end
/*
 * @用户部分
 */
import UserList from './user/userlist'
import UserConfirm from './user/userconfirm'
import ReportUser from './user/reportuser'
// user end
/*
 * @广告部分
 */
import AdCarsousel from './ad/adcarsousel'
import EditAdSel from './ad/editadsel'
// ad end

const reducers = combineReducers({
    login: Login,
    movielist: MovieList,
    movie: EditMovie,
    commentlist: CommentList,
    userlist: UserList,
    userconfirm: UserConfirm,
    reportuser: ReportUser,
    adcarsousel: AdCarsousel,
    editadsel: EditAdSel,
    // reducers
    routing: routerReducer
})

export default reducers

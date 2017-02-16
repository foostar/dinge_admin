import { createAction, createReducer } from 'redux-act'
import { CALL_API } from '../../middleware/api'
import { format, raw } from '../../utils/util'
/*
 * @静态方法
 */
// 电影列表
const movieListRequest = createAction('movieListRequest')
const movieListSuccess = createAction('movieListSuccess')
const movieListFailure = createAction('movieListFailure')
// 删除电影
const deleteMovieRequest = createAction('deleteMovieRequest')
const deleteMovieSuccess = createAction('deleteMovieSuccess')
const deleteMovieFailure = createAction('deleteMovieFailure')
/*
 * @直接改变
 */
export const changeSelectRows = createAction('changeSelectRows')    // 改变选择的行数
export const changeActiveMenu = createAction('changeActiveMenu')  // 改变选择的导航
/*
 * @请求改变
 */
// 电影列表
export const getMovieList = (body, callback) => {
    return {
        [ CALL_API ]: {
            actions: [ movieListRequest, movieListSuccess, movieListFailure ],
            endpoint: `/movie/movielist?${raw(body)}`,
            success: (data) => {
                callback && callback(data)
                return data
            }
        }
    }
}
// 删除电影
export const deleteMovie = (body, callback) => {
    return {
        [ CALL_API ]: {
            actions: [ deleteMovieRequest, deleteMovieSuccess, deleteMovieFailure ],
            endpoint: `/movie/delete?${raw(body)}`,
            success: (data) => {
                callback && callback(data)
                return data
            }
        }
    }
}

export default createReducer({
    [ changeActiveMenu ]: (state, activeMenu) => {
        return Object.assign({}, state, { activeMenu })
    },
    [ changeSelectRows ]: (state, keys) => {
        return Object.assign({}, state, {
            selectKeys: keys
        })
    },
    [ movieListRequest ]: (state) => {
        return Object.assign({}, state, {
            isFetching: true
        })
    },
    [ movieListSuccess ]: (state, json) => {
        const { data } = json
        data.list.forEach((v) => {
            v.key = v._id
            v.createdAt = format(v.createdAt)
        })
        return Object.assign({}, state, {
            list: data.list,
            totalNum: data.totalNum,
            page: data.page,
            isFetching: false
        })
    },
    [ movieListFailure ]: (state) => {
        return Object.assign({}, state, {
            isFetching: false
        })
    },
    [ deleteMovieRequest ]: (state) => {
        return Object.assign({}, state, {
            isFetching: true
        })
    },
    [ deleteMovieSuccess ]: (state, json) => {
        let list = state.list
        const { moviesId } = json
        moviesId.forEach((v) => {
            list = list.filter(j => j._id != v)
        })
        return Object.assign({}, state, {
            list,
            totalNum: state.totalNum - moviesId.length,
            isFetching: false
        })
    },
    [ deleteMovieFailure ]: (state) => {
        return Object.assign({}, state, {
            isFetching: false
        })
    }
}, {
    list: [],
    totalNum: 50,
    page: 1,
    selectKeys: [],
    isFetching: false,
    activeMenu: [ 'movielist' ]
})

import { createAction, createReducer } from 'redux-act'
import { CALL_API } from '../../middleware/api'
import { raw, mapToString } from '../../utils/util'

/*
 * @静态方法
 */
// 获取豆瓣电影
const DoubanMovieRequest = createAction('DoubanMovieRequest')
const DoubanMovieSuccess = createAction('DoubanMovieSuccess')
const DoubanMovieFailure = createAction('DoubanMovieFailure')
// 新增电影
const addMovieRequest = createAction('addMovieRequest')
const addMovieSuccess = createAction('addMovieSuccess')
const addMovieFailure = createAction('addMovieFailure')
// 获取电影详情
const getMovieRequest = createAction('getMovieRequest')
const getMovieSuccess = createAction('getMovieSuccess')
const getMovieFailure = createAction('getMovieFailure')
// 修改电影详情
const editMovieRequest = createAction('editMovieRequest')
const editMovieSuccess = createAction('editMovieSuccess')
const editMovieFailure = createAction('editMovieFailure')
/*
 * @请求改变
 */
// 获取豆瓣电影
export const getDoubanMovie = (did, callback) => {
    return {
        [ CALL_API ]: {
            actions: [ DoubanMovieRequest, DoubanMovieSuccess, DoubanMovieFailure ],
            endpoint: `/movie/dbMovie?movieId=${did}`,
            success: (data) => {
                callback && callback(data)
                return data
            }
        }
    }
}
// 新增电影
export const addMovie = (body, callback) => {
    return {
        [ CALL_API ]: {
            actions: [ addMovieRequest, addMovieSuccess, addMovieFailure ],
            endpoint: '/movie/addMovie',
            request: {
                method: 'post',
                body
            },
            success: (data) => {
                callback && callback(data)
                return data
            }
        }
    }
}
// 获取电影详情
export const getMovieById = (body, callback) => {
    return {
        [ CALL_API ]: {
            actions: [ getMovieRequest, getMovieSuccess, getMovieFailure ],
            endpoint: `/movie/movielist?${raw(body)}`,
            success: (data) => {
                callback && callback(data)
                return data
            }
        }
    }
}
// 修改电影详情
export const exitMovie = (body, callback) => {
    return {
        [ CALL_API ]: {
            actions: [ editMovieRequest, editMovieSuccess, editMovieFailure ],
            endpoint: '/movie/addMovie',
            request: {
                method: 'post',
                body
            },
            success: (data) => {
                callback && callback(data)
                return data
            }
        }
    }
}

const initState = {
    _id: '',
    did: '',
    title: '',
    directors: '',
    casts: '',
    country: '',
    genres: '',
    aka: '',
    language: '',
    actime: '',
    images: {
        large: '',
        medium: '',
        small: ''
    },
    rating: {
        star: 4,
        average: 8
    },
    subject: '',
    releaseTime: '',
    isFetching: false,
    isShowDid: true
}
export default createReducer({
    [ DoubanMovieRequest ]: (state) => {
        return Object.assign({}, state, {
            isFetching: true
        })
    },
    [ DoubanMovieSuccess ]: (state, json) => {
        return Object.assign({}, state, json.data, {
            isFetching: false
        })
    },
    [ DoubanMovieFailure ]: (state) => {
        return Object.assign({}, state, {
            isFetching: false
        })
    },
    [ addMovieRequest ]: (state) => {
        return Object.assign({}, state, {
            isFetching: true
        })
    },
    [ addMovieSuccess ]: (state) => {
        return Object.assign({}, state, initState)
    },
    [ addMovieFailure ]: (state) => {
        return Object.assign({}, state, {
            isFetching: false
        })
    },
    [ getMovieRequest ]: (state) => {
        return Object.assign({}, state, {
            isFetching: true,
            isShowDid: false
        })
    },
    [ getMovieSuccess ]: (state, json) => {
        const data = json.data.list[ 0 ]
        return Object.assign({}, state, {
            isFetching: false,
            _id: data._id,
            title: data.title,
            directors: mapToString(data.directors),
            casts: mapToString(data.casts),
            country: mapToString(data.country),
            genres: mapToString(data.genres),
            aka: mapToString(data.aka),
            language: mapToString(data.language),
            actime: data.actime,
            images: data.images,
            rating: data.rating,
            subject: data.subject,
            releaseTime: data.releaseTime
        })
    },
    [ getMovieFailure ]: (state) => {
        return Object.assign({}, state, {
            isFetching: false
        })
    },
    [ editMovieRequest ]: (state) => {
        return Object.assign({}, state, {
            isFetching: true
        })
    },
    [ editMovieSuccess ]: (state) => {
        return Object.assign({}, state, initState)
    },
    [ editMovieFailure ]: (state) => {
        return Object.assign({}, state, {
            isFetching: false
        })
    }
}, initState)

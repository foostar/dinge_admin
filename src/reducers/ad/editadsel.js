import { createAction, createReducer } from 'redux-act'
import { CALL_API } from '../../middleware/api'
import { raw } from '../../utils/util'

/*
 * @静态方法
 */
// 新增广告
const addCarouselRequest = createAction('addCarouselRequest')
const addCarouselSuccess = createAction('addCarouselSuccess')
const addCarouselFailure = createAction('addCarouselFailure')
// 获取广告详情
const getCarouselRequest = createAction('getCarouselRequest')
const getCarouselSuccess = createAction('getCarouselSuccess')
const getCarouselFailure = createAction('getCarouselFailure')
// 修改广告详情
const editCarouselRequest = createAction('editCarouselRequest')
const editCarouselSuccess = createAction('editCarouselSuccess')
const editCarouselFailure = createAction('editCarouselFailure')
/*
 * @直接改变
 */
/*
 * @请求改变
 */
// 新增广告
export const addCarousel = (body, callback) => {
    return {
        [ CALL_API ]: {
            actions: [ addCarouselRequest, addCarouselSuccess, addCarouselFailure ],
            endpoint: '/ad/addCarousel',
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
// 获取广告详情
export const getCarouselById = (body, callback) => {
    return {
        [ CALL_API ]: {
            actions: [ getCarouselRequest, getCarouselSuccess, getCarouselFailure ],
            endpoint: `/ad/adlist?${raw(body)}`,
            success: (data) => {
                callback && callback(data)
                return data
            }
        }
    }
}
// 修改广告详情
export const editCarousel = (body, callback) => {
    return {
        [ CALL_API ]: {
            actions: [ editCarouselRequest, editCarouselSuccess, editCarouselFailure ],
            endpoint: '/ad/addCarousel',
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
export default createReducer({
    [ addCarouselRequest ]: (state) => {
        return Object.assign({}, state, {
            isFetching: true
        })
    },
    [ addCarouselSuccess ]: state => state,
    [ addCarouselFailure ]: (state) => {
        return Object.assign({}, state, {
            isFetching: false
        })
    },
    [ getCarouselRequest ]: (state) => {
        return Object.assign({}, state, {
            isFetching: true
        })
    },
    [ getCarouselSuccess ]: (state, json) => {
        const data = json.data.list[ 0 ]
        return Object.assign({}, state, data, {
            isFetching: false
        })
    },
    [ getCarouselFailure ]: (state) => {
        return Object.assign({}, state, {
            isFetching: false
        })
    },
    [ editCarouselRequest ]: (state) => {
        return Object.assign({}, state, {
            isFetching: true
        })
    },
    [ editCarouselSuccess ]: state => state,
    [ editCarouselFailure ]: (state) => {
        return Object.assign({}, state, {
            isFetching: false
        })
    }
}, {
    _id: '',
    url: '',
    title: '',
    content: '',
    isFetching: false
})

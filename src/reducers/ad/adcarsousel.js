import { createAction, createReducer } from 'redux-act'
import { CALL_API } from '../../middleware/api'
import { format, raw } from '../../utils/util'

/*
 * @静态方法
 */
// 广告列表
const adlistRequest = createAction('adlistRequest')
const adlistSuccess = createAction('adlistSuccess')
const adlistFailure = createAction('adlistFailure')
// 删除广告
const addeleteRequest = createAction('addeleteRequest')
const addeleteSuccess = createAction('addeleteSuccess')
const addeleteFailure = createAction('addeleteFailure')
// 更改权重
const changeWeightRequest = createAction('changeWeightRequest')
const changeWeightSuccess = createAction('changeWeightSuccess')
const changeWeightFailure = createAction('changeWeightFailure')
/*
 * @直接改变
 */
export const setModalVisible = createAction('setModalVisible') // 开关弹出层
export const checkCarousel = createAction('checkCarousel')  // 查看单个广告
/*
 * @请求改变
 */
// 广告列表
export const getCarousel = (body, callback) => {
    return {
        [ CALL_API ]: {
            actions: [ adlistRequest, adlistSuccess, adlistFailure ],
            endpoint: `/ad/adlist?${raw(body)}`,
            success: (data) => {
                callback && callback(data)
                return data
            }
        }
    }
}
// 删除广告
export const deleteCarousel = (body, callback) => {
    return {
        [ CALL_API ]: {
            actions: [ addeleteRequest, addeleteSuccess, addeleteFailure ],
            endpoint: `/ad/delete?${raw(body)}`,
            success: (data) => {
                callback && callback(data)
                return data
            }
        }
    }
}
// 更高权重
export const changeWeight = (body, callback) => {
    return {
        [ CALL_API ]: {
            actions: [ changeWeightRequest, changeWeightSuccess, changeWeightFailure ],
            endpoint: `/ad/changeWeight?${raw(body)}`,
            success: (data) => {
                callback && callback(data)
                return data
            }
        }
    }
}
export default createReducer({
    [ adlistRequest ]: (state) => {
        return Object.assign({}, state, {
            isFetching: true
        })
    },
    [ adlistSuccess ]: (state, json) => {
        const { list, totalNum, page } = json.data
        list.forEach((v) => {
            v.key = v._id
            v.createdAt = format(v.createdAt)
        })
        return Object.assign({}, state, {
            isFetching: false,
            list,
            totalNum,
            page
        })
    },
    [ adlistFailure ]: (state) => {
        return Object.assign({}, state, {
            isFetching: false
        })
    },
    [ setModalVisible ]: (state, isShow) => {
        return Object.assign({}, state, {
            modalShow: isShow
        })
    },
    [ checkCarousel ]: (state, id) => {
        let data = {}
        state.list.forEach((v) => {
            if (v._id == id) {
                data = v
            }
        })
        return Object.assign({}, state, {
            modalShow: true,
            carousel: data
        })
    },
    [ addeleteRequest ]: (state) => {
        return Object.assign({}, state, {
            isFetching: true
        })
    },
    [ addeleteSuccess ]: (state, json) => {
        let list = state.list
        const { carouselId } = json
        carouselId.forEach((v) => {
            list = list.filter(j => j._id != v)
        })
        return Object.assign({}, state, {
            list,
            totalNum: state.totalNum - carouselId.length,
            isFetching: false
        })
    },
    [ addeleteFailure ]: (state) => {
        return Object.assign({}, state, {
            isFetching: false
        })
    }
}, {
    list: [],
    totalNum: 50,
    page: 1,
    selectKeys: [],
    modalShow: false,
    isFetching: false,
    carousel: {}
})

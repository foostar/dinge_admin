import { createAction, createReducer } from 'redux-act'
import { CALL_API } from '../../middleware/api'
import { format, raw } from '../../utils/util'

/*
 * @静态方法
 */
// 获取举报列表
const reportUserRequest = createAction('reportUserRequest')
const reportUserSuccess = createAction('reportUserSuccess')
const reportUserFailure = createAction('reportUserFailure')
/*
 * @直接改变
 */
/*
 * @请求改变
 */
// 获取举报列表
export const getReportsList = (body, callback) => {
    return {
        [ CALL_API ]: {
            actions: [ reportUserRequest, reportUserSuccess, reportUserFailure ],
            endpoint: `/common/reports?${raw(body)}`,
            success: (data) => {
                callback && callback(data)
                return data
            }
        }
    }
}

export default createReducer({
    [ reportUserRequest ]: (state) => {
        return Object.assign({}, state, {
            isFetching: true
        })
    },
    [ reportUserSuccess ]: (state, json) => {
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
    [ reportUserFailure ]: (state) => {
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
    user: {}
})

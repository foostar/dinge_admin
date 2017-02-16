import { createAction, createReducer } from 'redux-act'
import { CALL_API } from '../../middleware/api'
/*
 * @静态方法
 */
// 获取用户列表
const changePassRequest = createAction('changePassRequest')
const changePassSuccess = createAction('changePassSuccess')
const changePassFailure = createAction('changePassFailure')
/*
 * @请求改变
 */
export const changePassword = (body, callback) => {
    return {
        [ CALL_API ]: {
            actions: [ changePassRequest, changePassSuccess, changePassFailure ],
            endpoint: '/user/changepassword',
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
    [ changePassRequest ]: (state) => {
        return Object.assign({}, state, {
            isFetching: true
        })
    },
    [ changePassSuccess ]: (state) => {
        return Object.assign({}, state, {
            isFetching: false
        })
    },
    [ changePassFailure ]: (state) => {
        return Object.assign({}, state, {
            isFetching: false
        })
    }
}, {
    isFetching: false
})

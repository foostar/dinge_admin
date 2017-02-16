import { createAction, createReducer } from 'redux-act'
import { CALL_API } from '../middleware/api'
/*
 * @静态方法
 */
const loginRequest = createAction('loginRequest')
const loginSuccess = createAction('loginSuccess')
const loginFailure = createAction('loginFailure')
/*
 * @改变state
 */
// 直接改变
export const changeFetching = createAction('changeFetching')
// 请求改变
export const login = (body, callback) => {
    return {
        [ CALL_API ]: {
            actions: [ loginRequest, loginSuccess, loginFailure ],
            endpoint: '/user/login',
            request: {
                method: 'POST',
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
    [ loginRequest ]: (state) => {
        return Object.assign({}, state, { isFetching: true })
    },
    // 登录成功
    [ loginSuccess ]: (state) => {
        return Object.assign({}, state, { isFetching: false, authenticated: true })
    },
    // 登录失败
    [ loginFailure ]: (state) => {
        return Object.assign({}, state, { isFetching: false })
    }
}, {
    isFetching: false,
    authenticated: false
})

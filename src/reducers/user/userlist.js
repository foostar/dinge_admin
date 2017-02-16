import { createAction, createReducer } from 'redux-act'
import { CALL_API } from '../../middleware/api'
import { format, raw } from '../../utils/util'
/*
 * @静态方法
 */
// 获取用户列表
const userListRequest = createAction('userListRequest')
const userListSuccess = createAction('userListSuccess')
const userListFailure = createAction('userListFailure')
// 封用户
const shutUserRequest = createAction('shutUserRequest')
const shutUserSuccess = createAction('shutUserSuccess')
const shutUserFailure = createAction('shutUserFailure')
/*
 * @直接改变
 */
export const setModalVisible = createAction('setModalVisible') // 开关弹出层
export const checkUser = createAction('checkUser')  // 查看单个评论
/*
 * @请求改变
 */
// 获取用户列表
export const getUserList = (body, callback) => {
    return {
        [ CALL_API ]: {
            actions: [ userListRequest, userListSuccess, userListFailure ],
            endpoint: `/user/userlist?${raw(body)}`,
            success: (data) => {
                callback && callback(data)
                return data
            }
        }
    }
}
// 封用户
export const shield = (body, callback) => {
    return {
        [ CALL_API ]: {
            actions: [ shutUserRequest, shutUserSuccess, shutUserFailure ],
            endpoint: `/user/shut?${raw(body)}`,
            success: (data) => {
                callback && callback(data)
                return data
            }
        }
    }
}

export default createReducer({
    [ userListRequest ]: (state) => {
        return Object.assign({}, state, {
            isFetching: true
        })
    },
    [ userListSuccess ]: (state, json) => {
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
    [ userListFailure ]: (state) => {
        return Object.assign({}, state, {
            isFetching: false
        })
    },
    [ setModalVisible ]: (state, isShow) => {
        return Object.assign({}, state, {
            modalShow: isShow
        })
    },
    [ checkUser ]: (state, id) => {
        let data = {}
        state.list.forEach((v) => {
            if (v._id == id) {
                data = v
            }
        })
        return Object.assign({}, state, {
            modalShow: true,
            user: data
        })
    },
    [ shutUserRequest ]: (state) => {
        return Object.assign({}, state, {
            isFetching: true
        })
    },
    [ shutUserSuccess ]: (state, json) => {
        let list = state.list
        const { userId, type } = json
        list.forEach((v) => {
            if (v._id == userId) {
                v.valid = type == 'shut' ? 2 : 0
            }
        })
        return Object.assign({}, state, {
            isFetching: false,
            list
        })
    },
    [ shutUserFailure ]: (state) => {
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

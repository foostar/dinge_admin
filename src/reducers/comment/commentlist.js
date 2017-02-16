import { createAction, createReducer } from 'redux-act'
import { CALL_API } from '../../middleware/api'
import { format, raw } from '../../utils/util'
/*
 * @静态方法
 */
// 获取评论列表
const commentListRequest = createAction('commentListRequest')
const commentListSuccess = createAction('commentListSuccess')
const commentListFailure = createAction('commentListFailure')
// 屏蔽评论
const shieldRequest = createAction('shieldRequest')
const shieldSuccess = createAction('shieldSuccess')
const shieldFailure = createAction('shieldFailure')
// 删除评论
const delCommentRequest = createAction('delCommentRequest')
const delCommentSuccess = createAction('delCommentSuccess')
const delCommentFailure = createAction('delCommentFailure')
// 更改权重
const changeWeightRequest = createAction('changeWeightRequest')
const changeWeightSuccess = createAction('changeWeightSuccess')
const changeWeightFailure = createAction('changeWeightFailure')
/*
 * @直接改变
 */
export const changeSelectRows = createAction('changeSelectRows')    // 改变选择的行数
export const setModalVisible = createAction('setModalVisible') // 开关弹出层
export const checkComment = createAction('checkComment')  // 查看单个评论
/*
 * @请求改变
 */
// 获取评论列表
export const getCommentList = (body, callback) => {
    return {
        [ CALL_API ]: {
            actions: [ commentListRequest, commentListSuccess, commentListFailure ],
            endpoint: `/comment/commentlist?${raw(body)}`,
            success: (data) => {
                callback && callback(data)
                return data
            }
        }
    }
}
// 屏蔽评论
export const shield = (body, callback) => {
    return {
        [ CALL_API ]: {
            actions: [ shieldRequest, shieldSuccess, shieldFailure ],
            endpoint: `/comment/shield?${raw(body)}`,
            success: (data) => {
                callback && callback(data)
                return data
            }
        }
    }
}
// 删除评论
export const deleteComment = (body, callback) => {
    return {
        [ CALL_API ]: {
            actions: [ delCommentRequest, delCommentSuccess, delCommentFailure ],
            endpoint: `/comment/delete?${raw(body)}`,
            success: (data) => {
                callback && callback(data)
                return data
            }
        }
    }
}
// 更改权重
export const changeWeight = (body, callback) => {
    return {
        [ CALL_API ]: {
            actions: [ changeWeightRequest, changeWeightSuccess, changeWeightFailure ],
            endpoint: `/comment/changeWeight?${raw(body)}`,
            success: (data) => {
                callback && callback(data)
                return data
            }
        }
    }
}


export default createReducer({
    [ changeSelectRows ]: (state, keys) => {
        return Object.assign({}, state, {
            selectKeys: keys
        })
    },
    [ commentListRequest ]: (state) => {
        return Object.assign({}, state, {
            isFetching: true
        })
    },
    [ commentListSuccess ]: (state, json) => {
        const { list, totalNum, page } = json.data
        list.forEach((v) => {
            v.key = v._id
            v.createdAt = format(v.createdAt)
            v.reply = v.reply.length
            v.collet = v.collet.length
            v.star = v.star.length
        })
        return Object.assign({}, state, {
            isFetching: false,
            list,
            totalNum,
            page
        })
    },
    [ commentListFailure ]: (state) => {
        return Object.assign({}, state, {
            isFetching: false
        })
    },
    [ shieldRequest ]: (state) => {
        return Object.assign({}, state, {
            isFetching: true
        })
    },
    [ shieldSuccess ]: (state, json) => {
        let list = state.list
        const { commentId, type } = json
        list.forEach((v) => {
            if (v._id == commentId) {
                v.valid = type == 'shield' ? 1 : 0
            }
        })
        return Object.assign({}, state, {
            isFetching: false,
            list
        })
    },
    [ shieldFailure ]: (state) => {
        return Object.assign({}, state, {
            isFetching: false
        })
    },
    [ delCommentRequest ]: (state) => {
        return Object.assign({}, state, {
            isFetching: true
        })
    },
    [ delCommentSuccess ]: (state, json) => {
        let list = state.list
        const { commentsId } = json
        commentsId.forEach((v) => {
            list = list.filter(j => j._id != v)
        })
        return Object.assign({}, state, {
            list,
            totalNum: state.totalNum - commentsId.length,
            isFetching: false
        })
    },
    [ delCommentFailure ]: (state) => {
        return Object.assign({}, state, {
            isFetching: false
        })
    },
    [ setModalVisible ]: (state, isShow) => {
        return Object.assign({}, state, {
            modalShow: isShow
        })
    },
    [ checkComment ]: (state, id) => {
        let data = {}
        state.list.forEach((v) => {
            if (v._id == id) {
                data = v
            }
        })
        return Object.assign({}, state, {
            modalShow: true,
            comment: data
        })
    },
    [ changeWeightRequest ]: (state) => {
        return Object.assign({}, state, {
            isFetching: true
        })
    },
    [ changeWeightSuccess ]: (state, json) => {
        const { _id, weight } = json
        const list = state.list.map((v) => {
            if (v._id == _id) {
                v.weight = weight
            }
            return v
        })
        return Object.assign({}, state, {
            isFetching: false,
            list
        })
    },
    [ changeWeightFailure ]: (state) => {
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
    comment: {
        movie: {},
        commentFrom: {}
    }
})

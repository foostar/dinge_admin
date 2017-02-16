import { Schema, arrayOf, normalize } from 'normalizr'
import { camelizeKeys } from 'humps'
import 'isomorphic-fetch'
import { browserHistory } from 'react-router'
import localforage from 'localforage'
import { notification } from 'antd'
import config from '../config/config'


const getNextPageUrl = (response) => {
    const link = response.headers.get('link')
    if (!link) {
        return null
    }

    const nextLink = link.split(',').find(s => s.indexOf('rel="next"') > -1)
    if (!nextLink) {
        return null
    }

    return nextLink.split(';')[ 0 ].slice(1, -1)
}

// const timeout = (ms, promise) => {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             reject({ code: null, message: '与服务器连接失败，请稍后重试...' })
//         }, ms)
//         promise.then(resolve, reject)
//     })
// }

let API_ROOT = config.host

const callApi = (endpoint, request = {}) => {
    const fullUrl = (endpoint.indexOf(API_ROOT) === -1) ? API_ROOT + endpoint : endpoint
    if (request.body && typeof request.body !== 'string') {
        request.body = JSON.stringify(request.body)
    }
    return localforage.getItem('dingeToken')
        .then((result) => {
            let options = Object.assign({}, {
                headers: Object.assign({}, {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }, (result ? {
                    authentication: result,
                } : {}))
            }, request)
            return fetch(fullUrl, options)
        })
        .then(response => response.json().then(json => ({ json, response })))
        .then(({ json, response }) => {
            if (!response.ok) {
                if (json.errcode == 100101) {
                    localforage.removeItem('dingeToken')
                    browserHistory.replace('/login')
                }
                notification.error({
                    message: json.msg,
                    duration: 3
                })
                return Promise.reject(json)
            }
            return { json, response }
        })
}

const userSchema = new Schema('users', {
    idAttribute: 'login'
})

const repoSchema = new Schema('repos', {
    idAttribute: 'fullName'
})

repoSchema.define({
    owner: userSchema
})

export const Schemas = {
    USER: userSchema,
    USER_ARRAY: arrayOf(userSchema),
    REPO: repoSchema,
    REPO_ARRAY: arrayOf(repoSchema)
}

export const CALL_API = Symbol('Call API')

export default store => next => (action) => {
    const callAPI = action[ CALL_API ]
    if (typeof callAPI === 'undefined') {
        return next(action)
    }
    let { endpoint } = callAPI

    const { schema, actions, request, success = data => data, failure, id, filter } = callAPI

    if (typeof endpoint === 'function') {
        endpoint = endpoint(store.getState())
    }

    if (typeof endpoint !== 'string') {
        throw new Error('Specify a string endpoint URL.')
    }
    // if (!schema) {
    //     throw new Error('Specify one of the exported Schemas.')
    // }
    if (!Array.isArray(actions) || actions.length !== 3) {
        throw new Error('Expected an array of three actions.')
    }

    function actionWith(data) {
        const finalAction = Object.assign({}, action, data)
        delete finalAction[ CALL_API ]
        return finalAction
    }

    const [ requestAction, successAction, failureAction ] = actions
    next(actionWith(requestAction()))

    return callApi(endpoint, request)
    .then(({ json, response }) => {
        if (filter) json = filter(json)
        if (id) json[ id.field || 'id' ] = (id.value || id)
        const camelizedJson = camelizeKeys(json)
        const nextPageUrl = getNextPageUrl(response)
        if (!schema) {
            return json
        }
        return Object.assign({},
            normalize(camelizedJson, schema),
            { nextPageUrl }
        )
    })
    .then(success, failure)
    .then(
        response => next(actionWith(successAction(response))),
        error => next(actionWith(failureAction(error)))
    )
}

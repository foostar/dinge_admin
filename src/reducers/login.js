import { createReducer } from 'redux-act'

export default createReducer({

}, {
    isFetching: false,
    isInstallStatusFetching: false,
    list: [],
    forumUrl: {},
})

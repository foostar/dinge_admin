import storePro from './configureStore.prod'
import storeDev from './configureStore.dev'

if (process.env.NODE_ENV === 'production') {
    module.exports = storePro
} else {
    module.exports = storeDev
}

import devConfig from './config.dev'
import proConfig from './config.pro'

if (process.env.NODE_ENV === 'production') {
    module.exports = proConfig
} else {
    module.exports = devConfig
}

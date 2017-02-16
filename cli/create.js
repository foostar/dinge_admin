#!/usr/bin/env node
const program = require('commander')
const path = require('path')
const fs = require('fs')
const ejs = require('ejs')

const containerDir = path.resolve(process.cwd(), 'src/containers')
const reducerDir = path.resolve(process.cwd(), 'src/reducers')
const routerDir = path.resolve(process.cwd(), 'src/router')
// 读取文件夹目录
const readDir = (readPath) => {
    return fs.readdirSync(readPath).filter(p =>
        fs.statSync(path.resolve(readPath, p)).isDirectory()
    )
}
// 获取type
const getType = (name) => {
    const types = readDir(containerDir)
    return types.filter(v => name.match(v))[ 0 ]
}
// 写文件
const writeFile = (filePath, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}
// 创建文件
const createFile = (name) => {
    const lowerName = name.toLowerCase()
    const type = getType(lowerName)
    const containerPath = path.join(__dirname, '../template/container.js')
    const reducerPath = path.join(__dirname, '../template/reducer.js')
    const container = fs.readFileSync(containerPath, 'utf8')
    const reducer = fs.readFileSync(reducerPath, 'utf8')
    let reducerIndex = fs.readFileSync(path.join(__dirname, '../src/reducers/index.js'), 'utf8')
    reducerIndex = `${reducerIndex.substring(0, reducerIndex.lastIndexOf(`// ${type} end`))}import ${name} from './${type}/${lowerName}'\n${reducerIndex.substring(reducerIndex.lastIndexOf(`// ${type} end`), reducerIndex.lastIndexOf('// reducers'))}${lowerName}: ${name},\n    ${reducerIndex.substring(reducerIndex.lastIndexOf('// reducers'), reducerIndex.length)}`
    let router = fs.readFileSync(path.join(__dirname, '../src/router/configureRouter.js'), 'utf8')
    router = `${router.substring(0, router.lastIndexOf(`// ${type} end`))}import ${name} from '../containers/${type}/${lowerName}'\n${router.substring(router.lastIndexOf(`// ${type} end`), router.lastIndexOf('{/* route */}'))}<Route path="${lowerName}" component={ ${name} } />\n            ${router.substring(router.lastIndexOf('{/* route */}'), router.length)}`
    Promise.all([
        writeFile(path.join(containerDir, `${type}/${lowerName}.js`), ejs.render(container, { name, lowerName, action: `${name}Actions`, url: `../../reducers/${type}/${lowerName}` })),
        writeFile(path.join(reducerDir, `${type}/${lowerName}.js`), ejs.render(reducer, {})),
        writeFile(path.join(reducerDir, 'index.js'), reducerIndex),
        writeFile(path.join(routerDir, 'configureRouter.js'), router)
    ])
    .then(() => {
        process.exit(0)
    })
    .catch((err) => {
        console.error(err)
        console.log('生成失败！')
        process.exit(0)
    })
}


program
    .version(require('../package.json').version)
    .command('create [name]')
    .description('创建插件')
    .action((name) => {
        if (name) {
            if (!/^([A-Z])([A-Za-z]+)$/.test(name)) {
                console.error('命名方式不正确')
                process.exit(0)
                return
            }
            createFile(name)
        }
    })

program.parse(process.argv)

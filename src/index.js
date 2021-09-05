// import '@babel/polyfill'// 自动引入

import { list } from './list'
// list()

import logo from '../assets/images/logo.png'
import ttf from '../assets/fonts/1.ttf'
import '../assets/css/index.less'

console.log(logo)

console.log(111)

const arr = [1,2,3]
const newArr = [...arr,4,5]
newArr.map(i=>i+233)

console.log(newArr)

// 进行热更新
if (module.hot) {
    module.hot.accept('./list.js', () => { // 此页面更改则部分更改/否则全部更改
        console.log('list'),
            list()
    })
    // !关闭热更新:  
    // module.hot.decline("./list.js")
}

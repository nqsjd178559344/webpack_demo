// import '@babel/polyfill'// 自动引入

// import { list } from './list'
// import { chunk } from 'lodash-es'
// import { fn1,fn2 } from './common/utils' // 即使引用了,未使用TreeShaking依旧会优化掉
// // list()

// import logo from '../assets/images/logo.png'
// import ttf from '../assets/fonts/1.ttf'
// import '../assets/css/index.less'

// console.log(logo)

console.log(111)
// fn1()
// // fn2()

// const arr = [1, 2, 3]
// const arr2 = chunk(arr,4)
// console.log(chunk([1, 2, 3], 4))

// const newArr = [...arr,4,5]
// newArr.map(i=>i+233)

// console.log(newArr)

// 进行热更新
// if (module.hot) {
//     module.hot.accept('./list.js', () => { // 此页面更改则部分更改/否则全部更改
//         console.log('list'),
//             list()
//     })
//     // !关闭热更新:  
//     // module.hot.decline("./list.js")
// }

// ! 打包优化[动态加载]
// import(/*webpackChunkName:'jquery'*/'jquery').then(({ default: $ })=>{ //! 如报错 dynamicImport,则先安装 @babel/plugin-syntax-dynamic-import
//     console.log($.length)
// })

import jquery from 'jquery'
import './assets/css/index.less'


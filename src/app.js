import 'promise'
import 'isomorphic-fetch'
import 'antd/dist/antd.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from './store/configureStore'
import configureRouter from './router/configureRouter'

const store = configureStore()
const router = configureRouter(store)

const element = document.getElementById('application')

ReactDOM.render(<Provider store={ store }>{router}</Provider>, element)

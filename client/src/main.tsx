// import React from 'react'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { store } from './app/store.ts'
import './scss/utils.scss'
import './scss/index.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <div onContextMenu={(e) => e.preventDefault()}>
            <App />
        </div>
    </Provider>
)

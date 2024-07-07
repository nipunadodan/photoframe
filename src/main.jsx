import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <div className={'dark:bg-gray-800 text-gray-800 dark:text-gray-200 min-h-screen'}>
            <App/>
        </div>
    </React.StrictMode>
,
)

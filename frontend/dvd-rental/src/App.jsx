import './App.css'
import {ApiProvider} from '@reduxjs/toolkit/query/react'
import {store} from './slices/store'

function App() {

	return (
		<ApiProvider store={store}>

		</ApiProvider>
	)
}

export default App

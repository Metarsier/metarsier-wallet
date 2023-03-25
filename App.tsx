import React, { useEffect } from 'react';
import type { PropsWithChildren } from 'react'
import '@ethersproject/shims'
import Navigator from './views/Navigator'
import { useDispatch } from 'react-redux';
import { getNetworks, getTokens } from './store/reducers/walletSlice';

// type SectionProps = PropsWithChildren<{
// 	title: string;
// }>

function App() {
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(getNetworks() as any)
		dispatch(getTokens() as any)
	}, [])

	return (
		<>
			<Navigator/>
		</>
	)
}

export default App

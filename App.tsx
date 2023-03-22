import React, { useEffect } from 'react';
import type { PropsWithChildren } from 'react'
import '@ethersproject/shims'
import Navigator from './views/Navigator'
import { useDispatch } from 'react-redux';
import { getNetworks } from './store/actions/walletAction';

// type SectionProps = PropsWithChildren<{
// 	title: string;
// }>

function App() {
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(getNetworks() as any)
	}, [])

	return (
		<>
			<Navigator/>
		</>
	)
}

export default App

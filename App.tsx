import React from 'react';
import type { PropsWithChildren } from 'react'
import '@ethersproject/shims'
import Navigator from './views/Navigator'

// type SectionProps = PropsWithChildren<{
// 	title: string;
// }>

function App() {

	return (
		<>
			<Navigator/>
		</>
	)
}

export default App

const CONTRACT_MAP: {[chainNetworkType: string]: Token[]} = {
    'Ethereum_mainnet': [
        {
            name: 'Tether USDT',
            logo: '',
            symbol: 'USDT',
            decimals: 6,
            address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
            balance: '0',
            type: 'ERC20'
        },{
            name: 'USD Coin',
            logo: '',
            symbol: 'USDC',
            decimals: 6,
            address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            balance: '0',
            type: 'ERC20'
        },{
            name: 'Binance USD',
            logo: '',
            symbol: 'BUSD',
            decimals: 18,
            address: '0x4Fabb145d64652a948d72533023f6E7A623C7C53',
            balance: '0',
            type: 'ERC20'
        },{
            name: 'Chainlink Token',
            logo: '',
            symbol: 'LINK',
            decimals: 18,
            address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
            balance: '0',
            type: 'ERC20'
        },{
            name: 'Dai Stablecoin',
            logo: '',
            symbol: 'DAI',
            decimals: 18,
            address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
            balance: '0',
            type: 'ERC20'
        },{
            name: 'Wrapped BTC',
            logo: '',
            symbol: 'WBTC',
            decimals: 8,
            address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
            balance: '0',
            type: 'ERC20'
        },{
            name: 'yearn.finance',
            logo: '',
            symbol: 'YFI',
            decimals: 18,
            address: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
            balance: '0',
            type: 'ERC20'
        },{
            name: 'Uniswap',
            logo: '',
            symbol: 'UNI',
            decimals: 18,
            address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
            balance: '0',
            type: 'ERC20'
        },
    ],
    'Tron_mainnet': [
        {
            name: 'Tether USDT',
            logo: '',
            symbol: 'USDT',
            decimals: 6,
            address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
            balance: '0',
            type: 'TRC20'
        }
    ]
}

export default CONTRACT_MAP
import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
	semanticTokens: {
		colors: {
			'brand.0': {
				default: '#ffffff',
				_dark: '#1A1A1A'
			},
			'brand.50': {
				default: '#EDE0D4',
				_dark: '#1A1A1A'
			},
			'brand.100': {
				default: '#E6CCB2',
				_dark: '#2B2B2B'
			},
			'brand.200': {
				default: '#DDB892',
				_dark: '#333333'
			},
			'brand.300': {
				default: '#B08968',
				_dark: '#4D4D4D'
			},
			'brand.400': {
				default: '#7F5539',
				_dark: '#666666'
			},
			'brand.500': {
				default: '#9C6644',
				_dark: '#808080'
			},
			'brand.600': {
				default: '#EDE0D4',
				_dark: '#999999'
			},
			'brand.700': {
				default: '#EDE0D4',
				_dark: '#1A1A1A'
			},
			'brand.800': {
				default: '#ffffff',
				_dark: '#0f0f0f'
			},
			'brand.900': {
				default: '#0f0f0f',
				_dark: '#ffffff'
			}
		}
	},
	styles: {
		global: (props: { colorMode: string }) => ({
			body: {
				bg: props.colorMode === 'dark' ? 'brand.0' : 'brand.50',
				color: props.colorMode === 'dark' ? 'brand.600' : 'brand.400',
				fontFamily: 'Parkinsans, sans-serif'
			},
			'*': {
				fontFamily: 'Parkinsans, sans-serif'
			},
			breakpoints: {
				sm: '320px',
				md: '768px',
				lg: '960px',
				xl: '1200px'
			}
		})
	}
})

export default theme

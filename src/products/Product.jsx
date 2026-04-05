import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductDetail from './components/ProductDetail'
import ProductDownloads from './components/ProductDownloads'
import ProductsVideo from './components/ProductsVideo'
import ProductNew from './components/ProductNew'

const Product = () => {
	return (
		<div className='bg-white min-h-screen text-black selection:bg-[#e21e26] selection:text-white'>
			<Navbar />
			<ProductDetail />
			<ProductsVideo />
			<ProductDownloads />
			<ProductNew />

			<Footer />
		</div>
	)
}

export default Product

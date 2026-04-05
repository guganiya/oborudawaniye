import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Rss } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import OtherNews from './components/OtherNews'
import NewsGridCard from './components/NewsGridCard'
import apiClient from '../api/api'

const brandRed = '#e21e26'

const NewsContent = () => {
	const { id } = useParams()
	const [hoveredProduct, setHoveredProduct] = useState(null)
	const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
	const [newsItem, setNewsItem] = useState({})

	useEffect(() => {
		const getNews = async () => {
			try {
				const response = await apiClient.get(`/get-exact-news/${id}`)
				const data = response.data
				setNewsItem(data)
				console.log(data)
			} catch (error) {
				console.log(error)
			}
		}
		getNews()
	}, [])

	// Данные статьи
	// const newsItem = {
	// 	date: '20.03.2026',
	// 	title: 'Chameleon Touring Systems инвестирует в iFORTE LTX',
	// 	products: ['iFORTE® LTX WB', 'iFORTE® LTX FS'],
	// 	content: [
	// 		{
	// 			type: 'lead',
	// 			text: 'Chameleon Touring Systems из Сиднея приобрели пятнадцать iFORTE LTX и Robe iFORTE LTX FS.',
	// 		},
	// 		{
	// 			type: 'text',
	// 			text: 'Компанию по прокату света и риггингу возглавляет Тони Джикс, хорошо известная фигура в индустрии...',
	// 		},
	// 		// ... остальные данные
	// 	],
	// 	photoCredit: 'Louise Stickland',
	// }

	const handleMouseMove = e => {
		setMousePos({ x: e.clientX, y: e.clientY })
	}

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [id])

	return (
		<div className='bg-white min-h-screen font-sans selection:bg-[#e21e26] selection:text-white'>
			<Navbar />
			{/* 
		
			<AnimatePresence>
				{hoveredProduct && (
					<motion.div
						initial={{ opacity: 0, scale: 0.8, y: 10 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.8 }}
						className='fixed z-[100] pointer-events-none bg-white p-2 shadow-2xl border border-gray-100 rounded-lg '
						style={{
							left: mousePos.x + 20,
							top: mousePos.y - 120,
						}}
					>
						<div className='w-40 h-40 bg-gray-50 flex items-center justify-center '>
							<img
								src={PRODUCT_IMAGES[hoveredProduct]}
								alt={hoveredProduct}
								className='max-w-full max-h-full object-contain'
							/>
						</div>
						<p className='text-[10px] font-black uppercase mt-2 text-center text-gray-900'>
							{hoveredProduct}
						</p>
					</motion.div>
				)}
			</AnimatePresence>

			<main className='pt-32 pb-20'>
				<article className='max-w-[800px] mx-auto px-6'>
					<div className='flex justify-between items-center mb-8 border-b border-gray-100 pb-4 '>
						<span className='text-[12px] font-bold text-gray-400 tracking-widest '>
							{newsItem.date}
						</span>
					</div>

					<h1 className='text-3xl md:text-5xl font-black uppercase tracking-tighter leading-[1.1] text-center mb-16'>
						{newsItem.title}
					</h1>

			
					<div className='text-center mb-16 relative'>
						<h3 className='text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4'>
							Продукты в данной статье
						</h3>
						<div className='flex flex-wrap justify-center gap-6'>
							{newsItem.products.map(prod => (
								<span
									key={prod}
									onMouseEnter={() => setHoveredProduct(prod)}
									onMouseLeave={() => setHoveredProduct(null)}
									onMouseMove={handleMouseMove}
									className='text-[11px] font-bold uppercase tracking-wider underline decoration-2 underline-offset-8 cursor-help transition-all hover:text-black cursor-pointer'
									style={{ color: brandRed }}
								>
									{prod}
								</span>
							))}
						</div>
					</div>

					<div className='space-y-6 text-gray-700 leading-relaxed text-[15px] md:text-[16px]'>
						{newsItem.content.map((block, idx) => (
							<p
								key={idx}
								className={
									block.type === 'lead'
										? 'font-bold text-gray-900 text-lg mb-8'
										: ''
								}
							>
								{block.text}
							</p>
						))}
					</div>
				</article>
			</main>
			<OtherNews currentId={id} />
			<section className='bg-white py-20 px-6'>
				<div className='max-w-[1400px] mx-auto'>
					<h2 className='text-2xl md:text-3xl font-black uppercase tracking-tighter mb-10 italic'>
						Актуально сейчас<span style={{ color: brandRed }}>.</span>
					</h2>

					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8'>

						{[1, 2, 3, 4].map(item => (
							<NewsGridCard
								key={item}
								item={{
									id: item,
									year: '20.03.2026',
									title: 'Chameleon Touring Systems инвестирует в iFORTE LTX',
									description:
										'Chameleon Touring Systems из Сиднея приобрели пятнадцать iFORTE LTX и Robe iFORTE LTX FS...',
									image:
										'https://images.unsplash.com/photo-1548512198-d1a1b18d2d64?q=80&w=1000',
									topic: 'Закупки',
								}}
							/>
						))}
					</div>

					<div className='flex justify-center mt-16'>
						<Link
							to='/news'
							className='inline-block bg-[#e21e26] text-white px-12 py-4 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-lg shadow-red-500/20 active:scale-95 no-underline'
						>
							Развернуть
						</Link>
					</div>
				</div>
			</section> */}
			<Footer />
		</div>
	)
}

export default NewsContent

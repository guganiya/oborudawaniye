import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Rss } from 'lucide-react'
import { useTranslation } from 'react-i18next' // Добавлено
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import NewsGalery from './components/NewsGalery.jsx'
import NewsGridCard from './components/NewsGridCard'
import apiClient from '../api/api'

const brandRed = '#e21e26'

const NewsContent = () => {
	const { id } = useParams()
	const { t } = useTranslation() // Добавлено
	const [hoveredProduct, setHoveredProduct] = useState(null)
	const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
	const [newsItem, setNewsItem] = useState({})

	useEffect(() => {
		const getNews = async () => {
			try {
				const response = await apiClient.get(`/get-exact-news/${id}`)
				const data = response.data
				setNewsItem(data)
			} catch (error) {
				console.log(error)
			}
		}
		getNews()
	}, [id])

	const handleMouseMove = e => {
		setMousePos({ x: e.clientX, y: e.clientY })
	}

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [id])

	// Helper function to get product image
	const getProductImage = product => {
		if (!product) return '/placeholder-image.jpg'
		return product.poster
	}

	return (
		<div className='bg-white min-h-screen font-sans selection:bg-[#e21e26] selection:text-white'>
			<Navbar />

			<AnimatePresence>
				{hoveredProduct && (
					<motion.div
						initial={{ opacity: 0, scale: 0.8, y: 10 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.8 }}
						className='fixed z-[100] pointer-events-none bg-white p-2 shadow-2xl border border-gray-100 rounded-lg flex flex-col items-center'
						style={{
							left: Math.min(mousePos.x + 20, window.innerWidth - 200),
							top: Math.min(mousePos.y - 120, window.innerHeight - 250),
							width: '180px', // Фиксированная ширина карточки
						}}
					>
						{/* Контейнер картинки: используем shrink-0, чтобы текст не сжимал блок */}
						<div className='w-40 h-40 bg-gray-50 flex items-center justify-center rounded shrink-0 overflow-hidden'>
							<img
								src={getProductImage(hoveredProduct)}
								alt={hoveredProduct.name}
								className='max-w-[90%] max-h-[90%] object-contain block'
								onError={e => {
									e.target.src = '/placeholder-image.jpg'
								}}
							/>
						</div>

						{/* Контейнер текста: отделен от картинки */}
						<div className='w-full mt-2 flex flex-col items-center'>
							<p className='text-[10px] font-black uppercase text-center text-gray-900 leading-tight w-full break-words px-1'>
								{hoveredProduct.name}
							</p>

							{hoveredProduct.category && (
								<p className='text-[8px] text-gray-500 text-center mt-1 italic'>
									{hoveredProduct.category}
								</p>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			<main className='pt-32 pb-20'>
				<article className='max-w-[800px] mx-auto px-6'>
					<div className='flex justify-between items-center mb-8 border-b border-gray-100 pb-4'>
						<span className='text-[12px] font-bold text-gray-400 tracking-widest'>
							{newsItem.date}
						</span>
					</div>

					<h1 className='text-3xl md:text-5xl font-black uppercase tracking-tighter leading-[1.1] text-center mb-16'>
						{newsItem.title}
					</h1>

					{newsItem.products && newsItem.products.length > 0 && (
						<div className='text-center mb-16 relative'>
							<h3 className='text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4'>
								{t('news_products_in_article')}
							</h3>
							<div className='flex flex-wrap justify-center gap-6'>
								{newsItem.products?.map(prod => (
									<Link
										to={`/product/${prod.id}`}
										key={prod.id}
										onMouseEnter={() => setHoveredProduct(prod)}
										onMouseLeave={() => setHoveredProduct(null)}
										onMouseMove={handleMouseMove}
										className='text-[11px] font-bold uppercase tracking-wider underline decoration-2 underline-offset-8 cursor-help transition-all hover:text-black cursor-pointer'
										style={{ color: brandRed }}
									>
										{prod.name}
									</Link>
								))}
							</div>
						</div>
					)}

					<div className='max-w-3xl mx-auto space-y-6 text-gray-700 leading-relaxed text-[15px] md:text-[17px]'>
						<p className='font-medium text-gray-900 text-xl md:text-2xl mb-10 leading-snug text-balance'>
							{newsItem.content}
						</p>
					</div>
				</article>
			</main>

			{newsItem.gallery && newsItem.gallery.length > 0 && (
				<NewsGalery gallery={newsItem.gallery} />
			)}

			{newsItem.related_news && newsItem.related_news.length > 0 && (
				<section className='bg-white py-20 px-6'>
					<div className='max-w-[1400px] mx-auto'>
						<h2 className='text-2xl md:text-3xl font-black uppercase tracking-tighter mb-10 italic'>
							{t('news_related_title')}
							<span style={{ color: brandRed }}>.</span>
						</h2>

						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8'>
							{newsItem.related_news?.map(item => (
								<NewsGridCard
									key={item.id}
									item={{
										id: item.id,
										year: item.date,
										title: item.title,
										description: item.short_description,
										image: item.poster,
										topic: item.category,
									}}
								/>
							))}
						</div>

						<div className='flex justify-center mt-16'>
							<Link
								to='/news'
								className='inline-block bg-[#e21e26] text-white px-12 py-4 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-lg shadow-red-500/20 active:scale-95 no-underline'
							>
								{t('news_all_btn')}
							</Link>
						</div>
					</div>
				</section>
			)}

			<Footer />
		</div>
	)
}

export default NewsContent

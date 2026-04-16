import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Search, X, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import apiClient from '../api/api'

const Products = () => {
	const { t, i18n } = useTranslation()
	const [items, setItems] = useState([])
	const [searchTerm, setSearchTerm] = useState('')
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [currentSlide, setCurrentSlide] = useState(0)

	const getCategoryName = item => {
		const lang = i18n.language
		if (lang === 'en' && item.name_en) return item.name_en
		if (lang === 'tk' && item.name_tk) return item.name_tk
		return item.name_ru || item.name
	}

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				setLoading(true)
				const response = await apiClient.get('/get-product-categories')
				setItems(response.data)
			} catch (err) {
				setError(t('catalog_error_fetch'))
			} finally {
				setLoading(false)
			}
		}
		fetchCategories()
	}, [t])

	// Pick 3 random categories for the slider
	const sliderItems = useMemo(() => {
		if (items.length <= 3) return items
		return [...items].sort(() => 0.5 - Math.random()).slice(0, 3)
	}, [items])

	// Auto-play slider
	useEffect(() => {
		if (sliderItems.length > 0) {
			const timer = setInterval(() => {
				setCurrentSlide(prev => (prev + 1) % sliderItems.length)
			}, 6000)
			return () => clearInterval(timer)
		}
	}, [sliderItems])

	const filteredItems = items.filter(item =>
		getCategoryName(item).toLowerCase().includes(searchTerm.toLowerCase()),
	)

	return (
		<div className='bg-white min-h-screen font-sans selection:bg-[#e21e26] selection:text-white'>
			<Navbar />

			{/* --- HERO SLIDER HEADER --- */}
			<header className='relative h-[80vh] min-h-[600px] w-full overflow-hidden bg-black'>
				<AnimatePresence mode='wait'>
					{sliderItems.length > 0 && (
						<motion.div
							key={sliderItems[currentSlide].id}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 1 }}
							className='absolute inset-0'
						>
							{/* Background Image with Ken Burns Effect */}
							<motion.img
								initial={{ scale: 1.1 }}
								animate={{ scale: 1 }}
								transition={{ duration: 6 }}
								src={sliderItems[currentSlide].poster}
								className='w-full h-full object-cover opacity-60'
								alt='Hero'
							/>

							{/* Gradient Overlay */}
							<div className='absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent' />

							{/* Content */}
							<div className='absolute inset-0 flex items-center px-6 md:px-20'>
								<div className='max-w-[800px]'>
									<motion.span
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: 0.5 }}
										className='text-[#e21e26] font-black uppercase tracking-[0.4em] text-sm mb-4 block'
									>
										{t('catalog_featured_tag')}
									</motion.span>
									<motion.h1
										initial={{ opacity: 0, y: 30 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.7 }}
										className='text-white text-5xl md:text-8xl font-black uppercase leading-none italic mb-8'
									>
										{getCategoryName(sliderItems[currentSlide])}
									</motion.h1>
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 0.9 }}
									>
										<Link
											to={`/subcategory/${sliderItems[currentSlide].id}`}
											className='inline-flex items-center gap-4 bg-[#e21e26] text-white px-8 py-4 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-white hover:text-black transition-all duration-300'
										>
											{t('catalog_view_btn')} <ArrowRight size={16} />
										</Link>
									</motion.div>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Slider Controls */}
				<div className='absolute bottom-10 right-10 flex gap-4 z-20'>
					<button
						onClick={() => setCurrentSlide(prev => (prev - 1 + sliderItems.length) % sliderItems.length)}
						className='p-4 border border-white/20 text-white hover:bg-[#e21e26] hover:border-[#e21e26] transition-all rounded-full'
					>
						<ChevronLeft size={20} />
					</button>
					<button
						onClick={() => setCurrentSlide(prev => (prev + 1) % sliderItems.length)}
						className='p-4 border border-white/20 text-white hover:bg-[#e21e26] hover:border-[#e21e26] transition-all rounded-full'
					>
						<ChevronRight size={20} />
					</button>
				</div>

				{/* Slider Indicators */}
				<div className='absolute bottom-10 left-10 flex gap-2 z-20'>
					{sliderItems.map((_, idx) => (
						<div
							key={idx}
							className={`h-1 transition-all duration-500 ${idx === currentSlide ? 'w-12 bg-[#e21e26]' : 'w-4 bg-white/30'}`}
						/>
					))}
				</div>
			</header>

			{/* --- SEARCH BAR SECTION --- */}
			<div className='bg-gray-50 border-b border-gray-100 py-12 px-6'>
				<div className='max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8'>
					<div>
						<h2 className='text-3xl font-black uppercase tracking-tighter'>{t('catalog_title')}</h2>
						<p className='text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em]'>{t('catalog_subtitle')}</p>
					</div>

					<div className='relative w-full md:w-96'>
						<input
							type='text'
							placeholder={t('catalog_search_placeholder')}
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
							className='w-full bg-white border border-gray-200 p-4 pl-12 rounded-2xl text-xs font-bold uppercase tracking-widest focus:border-[#e21e26] outline-none transition-all'
						/>
						<Search className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-300' size={18} />
					</div>
				</div>
			</div>

			{/* --- GRID SECTION --- */}
			<main className='max-w-[1400px] mx-auto px-6 py-20'>
				{loading ? (
					<div className='flex justify-center py-20'><Loader2 className='animate-spin text-[#e21e26]' size={40} /></div>
				) : (
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
						<AnimatePresence mode='popLayout'>
							{filteredItems.map((category, index) => (
								<ProductCard
									key={category.id}
									category={category}
									index={index}
									getCategoryName={getCategoryName}
								/>
							))}
						</AnimatePresence>
					</div>
				)}
			</main>

			<Footer />
		</div>
	)
}

const ProductCard = ({ category, getCategoryName }) => {
	const { t } = useTranslation()
	return (
		<motion.div
			layout
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, scale: 0.9 }}
			className='group'
		>
			<Link to={`/subcategory/${category.id}`} className='block'>
				<div className='relative aspect-[4/5] overflow-hidden rounded-3xl bg-gray-100 mb-6'>
					<img
						src={category.poster}
						alt={getCategoryName(category)}
						className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
					/>
					<div className='absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500' />
				</div>
				<h3 className='text-xl font-black uppercase tracking-tighter group-hover:text-[#e21e26] transition-colors'>
					{getCategoryName(category)}
				</h3>
				<p className='text-gray-400 text-[11px] font-bold uppercase tracking-widest mt-2'>
					{t('catalog_card_tag')}
				</p>
			</Link>
		</motion.div>
	)
}

export default Products
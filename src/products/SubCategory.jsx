import React, { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {Loader2, Search, X, Layers, ArrowRight, ArrowLeft} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import apiClient from '../api/api'

const SubCategory = () => {
	const { categoryId } = useParams()
	const { t, i18n } = useTranslation()
	const [subcategories, setSubcategories] = useState([])
	const [searchTerm, setSearchTerm] = useState('')
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [currentSlide, setCurrentSlide] = useState(0)

	const getLocalizedName = (item, fieldBase = 'name') => {
		const lang = i18n.language
		if (lang === 'en' && item[`${fieldBase}_en`]) return item[`${fieldBase}_en`]
		if (lang === 'tk' && item[`${fieldBase}_tk`]) return item[`${fieldBase}_tk`]
		return item[`${fieldBase}_ru`] || item[fieldBase]
	}

	useEffect(() => {
		const fetchSubcategories = async () => {
			try {
				setLoading(true)
				const response = await apiClient.get(`/get-product-subcategories/${categoryId}`)
				setSubcategories(response.data)
				setError(null)
			} catch (err) {
				setError(t('subcat_error_fetch'))
			} finally {
				setLoading(false)
			}
		}
		if (categoryId) fetchSubcategories()
	}, [categoryId, t])

	// Feature 3 random subcategories in the slider
	const featuredItems = useMemo(() => {
		if (subcategories.length <= 3) return subcategories
		return [...subcategories].sort(() => 0.5 - Math.random()).slice(0, 3)
	}, [subcategories])

	useEffect(() => {
		if (featuredItems.length > 0) {
			const timer = setInterval(() => {
				setCurrentSlide(prev => (prev + 1) % featuredItems.length)
			}, 5000)
			return () => clearInterval(timer)
		}
	}, [featuredItems])

	const filteredItems = subcategories.filter(item =>
		getLocalizedName(item).toLowerCase().includes(searchTerm.toLowerCase()),
	)

	const parentCategoryName = subcategories.length > 0
		? getLocalizedName(subcategories[0], 'category')
		: t('subcat_default_parent')

	return (
		<div className='bg-white min-h-screen font-sans selection:bg-[#e21e26] selection:text-white text-[#1a1a1a]'>
			<Navbar />

			{/* --- CINEMATIC RECOMMENDATION SLIDER --- */}
			<header className='relative h-[100vh] min-h-[550px] bg-black overflow-hidden'>
				<AnimatePresence mode='wait'>
					{featuredItems.length > 0 && (
						<motion.div
							key={featuredItems[currentSlide].id}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.8 }}
							className='absolute inset-0 flex flex-col lg:flex-row'
						>
							{/* Content Side */}
							<div className='w-full lg:w-1/2 h-full flex flex-col justify-center px-6 md:px-20 z-10 bg-black'>
								<motion.div
									initial={{ opacity: 0, x: -30 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.3 }}
								>
                                <span className='text-[#e21e26] font-black uppercase tracking-[0.4em] text-[10px] mb-4 block'>
                                    {t('subcat_recommended')} // {parentCategoryName}
                                </span>
									<h1 className='text-white text-4xl md:text-7xl font-black uppercase leading-[0.9] tracking-tighter italic mb-8'>
										{getLocalizedName(featuredItems[currentSlide])}
									</h1>
									<Link
										to={`/products/${featuredItems[currentSlide].id}`}
										className='group inline-flex items-center gap-6 text-white border border-white/20 px-8 py-4 rounded-full hover:bg-[#e21e26] hover:border-[#e21e26] transition-all duration-500'
									>
										<span className='text-[10px] font-black uppercase tracking-widest'>{t('subcat_view_btn')}</span>
										<ArrowRight size={16} className='group-hover:translate-x-2 transition-transform' />
									</Link>
								</motion.div>
							</div>

							{/* Image Side */}
							<div className='w-full lg:w-1/2 h-full relative'>
								<motion.img
									initial={{ scale: 0.9 }}
									animate={{ scale: 1 }}
									transition={{ duration: 5 }}
									src={featuredItems[currentSlide].poster}
									className='absolute inset-0 w-full h-full object-contain object-center opacity-70 lg:opacity-100'
								/>
								<div className='absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black via-transparent to-transparent' />
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Slider Navigation */}
				<div className='absolute bottom-10 left-6 md:left-20 flex items-center gap-6 z-20'>
					<div className='flex gap-2'>
						{featuredItems.map((_, idx) => (
							<button
								key={idx}
								onClick={() => setCurrentSlide(idx)}
								className={`h-1 transition-all duration-500 ${idx === currentSlide ? 'w-12 bg-[#e21e26]' : 'w-4 bg-white/30'}`}
							/>
						))}
					</div>
					<div className='flex gap-2'>
						<button onClick={() => setCurrentSlide(prev => (prev - 1 + featuredItems.length) % featuredItems.length)} className='text-white/50 hover:text-[#e21e26] transition-colors'>
							<ArrowLeft size={24} />
						</button>
						<button onClick={() => setCurrentSlide(prev => (prev + 1) % featuredItems.length)} className='text-white/50 hover:text-[#e21e26] transition-colors'>
							<ArrowRight size={24} />
						</button>
					</div>
				</div>
			</header>

			{/* --- STICKY FILTER BAR --- */}
			<section className='sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-black/5'>
				<div className='max-w-[1400px] mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-6'>
					<div className='flex items-center gap-4'>
						<div className='bg-black text-white p-2 rounded-lg'>
							<Layers size={18} />
						</div>
						<nav className='flex flex-col'>
                        <span className='text-[9px] font-black text-[#e21e26] uppercase tracking-widest leading-none mb-1'>
                           {t('subcat_breadcrumb_catalog')}
                        </span>
							<h2 className='text-sm font-bold uppercase tracking-tighter'>
								{parentCategoryName} ({filteredItems.length})
							</h2>
						</nav>
					</div>

					<div className='relative w-full md:w-96'>
						<input
							type='text'
							placeholder={t('subcat_search_placeholder')}
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
							className='w-full bg-gray-50 border-none p-4 pl-12 rounded-2xl text-[11px] font-bold uppercase tracking-widest focus:ring-2 focus:ring-[#e21e26] outline-none transition-all'
						/>
						<Search className='absolute left-4 top-1/2 -translate-y-1/2 text-black' size={18} />
					</div>
				</div>
			</section>

			{/* --- MAIN GRID --- */}
			<main className='max-w-[1400px] mx-auto px-6 py-20'>
				{loading ? (
					<div className='flex justify-center py-40'><Loader2 className='animate-spin text-[#e21e26]' size={40} /></div>
				) : (
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10'>
						<AnimatePresence mode='popLayout'>
							{filteredItems.map((sub, index) => (
								<motion.div
									key={sub.id}
									layout
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, scale: 0.9 }}
									transition={{ duration: 0.5 }}
								>
									<Link to={`/products/${sub.id}`} className='group block'>
										<div className='relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-gray-100 mb-6'>
											<img
												src={sub.poster}
												className='w-full h-full object-contain transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0'
												alt={getLocalizedName(sub)}
											/>
											<div className='absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500' />
										</div>

										<div className='px-2'>
											<div className='flex justify-between items-center mb-1'>
												<span className='text-[10px] font-black text-[#e21e26] tracking-widest uppercase'>0{index + 1}</span>
												<ArrowRight size={14} className='opacity-0 group-hover:opacity-100 transition-opacity text-[#e21e26]' />
											</div>
											<h3 className='text-lg font-black uppercase tracking-tighter leading-none group-hover:text-[#e21e26] transition-colors'>
												{getLocalizedName(sub)}
											</h3>
										</div>
									</Link>
								</motion.div>
							))}
						</AnimatePresence>
					</div>
				)}

				{!loading && filteredItems.length === 0 && (
					<div className='text-center py-40 border-t border-gray-100'>
						<h2 className='text-3xl font-black uppercase italic opacity-10'>{t('subcat_no_results')}</h2>
					</div>
				)}
			</main>

			<Footer />
		</div>
	)
}

export default SubCategory
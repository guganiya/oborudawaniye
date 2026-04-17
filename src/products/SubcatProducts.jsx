import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
	Loader2,
	ChevronRight,
	Search,
	X,
	ArrowRight,
	Maximize2,
	ChevronLeft,
	Box, ArrowLeft
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import apiClient from '../api/api'

const SubCategoryProducts = () => {
	const { subId } = useParams()
	const navigate = useNavigate()
	const { t, i18n } = useTranslation()

	const [items, setItems] = useState([])
	const [searchTerm, setSearchTerm] = useState('')
	const [loading, setLoading] = useState(true)
	const [loadingMore, setLoadingMore] = useState(false)
	const [hasMore, setHasMore] = useState(true)
	const [total, setTotal] = useState(0)
	const [currentSlide, setCurrentSlide] = useState(0)

	const sentinelRef = useRef(null)
	const observerRef = useRef(null)
	const pageRef = useRef(1)
	const busyRef = useRef(false)

	const getLoc = (item, field) => {
		if (!item) return ''
		const lang = i18n.language
		if (lang === 'en' && item[`${field}_en`]) return item[`${field}_en`]
		if (lang === 'tk' && item[`${field}_tk`]) return item[`${field}_tk`]
		return item[`${field}_ru`] || item[field]
	}

	// Top 5 products for the spotlight
	const spotlightItems = useMemo(() => items.slice(0, 5), [items])

	useEffect(() => {
		if (spotlightItems.length > 0) {
			const timer = setInterval(() => {
				setCurrentSlide(prev => (prev + 1) % spotlightItems.length)
			}, 7000)
			return () => clearInterval(timer)
		}
	}, [spotlightItems])

	const loadProducts = useCallback(
		async (pageNum, append = false) => {
			if (busyRef.current) return
			busyRef.current = true
			if (!append) setLoading(true)
			else setLoadingMore(true)

			try {
				const response = await apiClient.get('/products', {
					params: { subcategory: subId, page: pageNum },
				})
				const data = response.data
				const newItems = data.results || []
				setTotal(data.count || 0)
				setHasMore(data.next !== null)
				if (append) setItems(prev => [...prev, ...newItems])
				else setItems(newItems)
			} catch (err) {
				console.error('Fetch error:', err)
			} finally {
				setLoading(false)
				setLoadingMore(false)
				busyRef.current = false
			}
		},
		[subId],
	)

	useEffect(() => {
		pageRef.current = 1
		setItems([])
		loadProducts(1, false)
	}, [subId, loadProducts])

	useEffect(() => {
		if (observerRef.current) observerRef.current.disconnect()
		observerRef.current = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting && hasMore && !busyRef.current && searchTerm === '') {
				const nextPage = pageRef.current + 1
				pageRef.current = nextPage
				loadProducts(nextPage, true)
			}
		}, { rootMargin: '400px' })
		if (sentinelRef.current) observerRef.current.observe(sentinelRef.current)
		return () => observerRef.current?.disconnect()
	}, [hasMore, loadProducts, searchTerm])

	const filteredItems = items.filter(product => {
		const name = getLoc(product, 'name').toLowerCase()
		const desc = getLoc(product, 'short_description').toLowerCase()
		const query = searchTerm.toLowerCase()
		return name.includes(query) || desc.includes(query)
	})

	const subcategoryName = items.length > 0 ? getLoc(items[0], 'subcategory') : t('products_loading')

	return (
		<div className='bg-white min-h-screen font-sans selection:bg-[#e21e26] selection:text-white text-black'>
			<Navbar />

			{/* --- PRODUCT SPOTLIGHT HEADER --- */}
			<header className='relative h-screen min-h-[700px] bg-black overflow-hidden'>
				<AnimatePresence mode='wait'>
					{spotlightItems.length > 0 ? (
						<motion.div
							key={spotlightItems[currentSlide].id}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 1 }}
							className='absolute inset-0'
						>
							{/* Immersive Image */}
							<motion.img
								initial={{ scale: 0.9 }}
								animate={{ scale: 1 }}
								transition={{ duration: 7 }}
								src={spotlightItems[currentSlide].poster}
								className='w-full h-full object-contain opacity-60 grayscale-[0.5]'
								alt='Spotlight'
							/>
							<div className='absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent' />

							{/* Content Overlay */}
							<div className='absolute inset-0 flex items-center px-6 md:px-20'>
								<div className='max-w-[1400px] w-full mx-auto grid grid-cols-1 lg:grid-cols-2 items-end gap-12'>
									<div className='space-y-6'>
										<motion.div
											initial={{ opacity: 0, x: -20 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: 0.4 }}
											className='flex items-center gap-3 text-[#e21e26] text-[10px] font-black uppercase tracking-[0.4em]'
										>
											<div className='w-8 h-[1px] bg-[#e21e26]' />
											{t('products_spotlight_tag')}
										</motion.div>
										<motion.h1
											initial={{ opacity: 0, y: 30 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.5 }}
											className='text-white text-5xl md:text-8xl font-[1000] uppercase leading-[0.85] italic tracking-tighter'
										>
											{getLoc(spotlightItems[currentSlide], 'name')}
										</motion.h1>
										<motion.p
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ delay: 0.6 }}
											className='text-white/60 text-sm md:text-lg max-w-lg font-medium leading-relaxed'
										>
											{getLoc(spotlightItems[currentSlide], 'short_description')}
										</motion.p>
										<motion.div
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.7 }}
										>
											<Link
												to={`/product/${spotlightItems[currentSlide].id}`}
												className='inline-flex items-center gap-4 bg-[#e21e26] text-white px-10 py-5 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all duration-300'
											>
												{t('products_view_details')} <ArrowRight size={16} />
											</Link>
										</motion.div>
									</div>

									{/* Tech Specs Side */}
									<motion.div
										initial={{ opacity: 0, scale: 0.9 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ delay: 0.8 }}
										className='hidden lg:flex flex-col gap-4 border-l border-white/10 pl-12 pb-4'
									>
										<div className='flex flex-col'>
											<span className='text-white/30 text-[9px] font-black uppercase tracking-widest mb-1'>{t('products_spec_label_size')}</span>
											<span className='text-white text-2xl font-bold'>{spotlightItems[currentSlide].size}</span>
										</div>
										<div className='flex flex-col'>
											<span className='text-white/30 text-[9px] font-black uppercase tracking-widest mb-1'>{t('products_spec_label_cat')}</span>
											<span className='text-white text-lg font-bold uppercase'>{getLoc(spotlightItems[currentSlide], 'subcategory')}</span>
										</div>
									</motion.div>
								</div>
							</div>
						</motion.div>
					) : (
						<div className='absolute inset-0 flex items-center justify-center'>
							<Loader2 className='animate-spin text-white/20' size={40} />
						</div>
					)}
				</AnimatePresence>

				{/* Slider Navigation */}
				<div className='absolute bottom-12 right-6 md:right-20 flex items-center gap-8 z-20'>
					<div className='flex gap-2'>
						{spotlightItems.map((_, idx) => (
							<div key={idx} className={`h-[2px] transition-all duration-700 ${idx === currentSlide ? 'w-16 bg-[#e21e26]' : 'w-4 bg-white/20'}`} />
						))}
					</div>
					<div className='flex gap-4'>
						<button
							onClick={() => setCurrentSlide(prev => (prev - 1 + spotlightItems.length) % spotlightItems.length)}
							className='p-4 border border-white/10 rounded-full text-white hover:bg-[#e21e26] hover:border-[#e21e26] transition-all'
						>
							<ArrowLeft size={20} />
						</button>
						<button
							onClick={() => setCurrentSlide(prev => (prev + 1) % spotlightItems.length)}
							className='p-4 border border-white/10 rounded-full text-white hover:bg-[#e21e26] hover:border-[#e21e26] transition-all'
						>
							<ArrowRight size={20} />
						</button>
					</div>
				</div>
			</header>

			{/* --- SEARCH & BREADCRUMBS BAR --- */}
			<div className='sticky top-0 z-40 bg-white border-b border-gray-100 py-6 px-6'>
				<div className='max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6'>
					<nav className='flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-400'>
						<Link to='/products' className='hover:text-black transition-colors'>{t('products_breadcrumb_catalog')}</Link>
						<ChevronRight size={10} />
						<span className='text-[#e21e26]'>{subcategoryName} ({total})</span>
					</nav>

					<div className='relative w-full md:w-96'>
						<input
							type='text'
							placeholder={t('products_search_placeholder')}
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
							className='w-full bg-gray-50 border-none p-4 pl-12 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-[#e21e26] outline-none transition-all'
						/>
						<Search className='absolute left-4 top-1/2 -translate-y-1/2 text-black' size={18} />
						{searchTerm && <X onClick={() => setSearchTerm('')} className='absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer' size={16} />}
					</div>
				</div>
			</div>

			<main className='max-w-[1400px] mx-auto px-4 md:px-6 py-20 relative z-10'>
				{loading && items.length === 0 ? (
					<div className='flex justify-center py-40'><Loader2 className='animate-spin text-[#e21e26]' size={48} /></div>
				) : (
					<>
						<div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12 md:gap-y-20'>
							<AnimatePresence mode='popLayout'>
								{filteredItems.map(product => (
									<ProductCard key={product.id} product={product} getLoc={getLoc} />
								))}
							</AnimatePresence>
						</div>

						{searchTerm === '' && <div ref={sentinelRef} className='h-20' />}
						{loadingMore && <div className='flex justify-center py-10'><Loader2 className='animate-spin text-[#e21e26]' size={32} /></div>}
					</>
				)}
			</main>

			<Footer />
		</div>
	)
}

const ProductCard = ({ product, getLoc }) => {
	return (
		<motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='group'>
			<Link to={`/product/${product.id}`} className='block'>
				<div className='relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-gray-50 border border-gray-100 mb-6'>
					<img
						src={product.poster}
						alt={getLoc(product, 'name')}
						className='w-full h-full object-contain transition-transform duration-1000 scale-100 group-hover:scale-110 grayscale group-hover:grayscale-0'
					/>
					<div className='absolute bottom-6 left-6'>
                        <span className='bg-white text-black text-[8px] font-black uppercase px-3 py-1.5 rounded-full shadow-xl'>
                            {product.size}
                        </span>
					</div>
				</div>

				<div className='px-4'>
					<h3 className='text-lg font-black uppercase tracking-tighter group-hover:text-[#e21e26] transition-colors leading-tight'>
						{getLoc(product, 'name')}
					</h3>
					<p className='text-gray-400 text-[10px] font-bold mt-2 uppercase tracking-tight line-clamp-1'>
						{getLoc(product, 'short_description')}
					</p>
				</div>
			</Link>
		</motion.div>
	)
}

export default SubCategoryProducts
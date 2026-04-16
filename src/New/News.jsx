import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Search, ArrowRight, Loader2, X, ChevronLeft, ChevronRight } from 'lucide-react'
import apiClient from '../api/api.js'

// ─── Константы ────────────────────────────────────────────────────────────────
const PAGE_SIZE = 3
const SLIDER_NEWS_COUNT = 5
const brandRed = '#e21e26'

const GRID_PATTERN = [3, 6, 3, 5, 4, 3, 3, 3, 6, 3, 3, 3, 3, 3]

const COL_SPAN = {
	3: 'lg:col-span-3',
	4: 'lg:col-span-4',
	5: 'lg:col-span-5',
	6: 'lg:col-span-6',
}

const IMG_HEIGHT = {
	3: 'h-[180px]',
	4: 'h-[210px]',
	5: 'h-[230px]',
	6: 'h-[260px]',
}

// ─── Текстовая карточка ────────────────────────────────────────────
const TextCard = ({ item, span, delay, t }) => (
	<motion.article
		layout
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		exit={{ opacity: 0, scale: 0.97 }}
		transition={{ duration: 0.4, delay }}
		className={`${COL_SPAN[span]}`}
	>
		<Link
			to={`/news-content/${item.id}`}
			className='relative group flex flex-col justify-between bg-white border border-black/8 overflow-hidden hover:shadow-xl transition-all duration-400 h-full no-underline'
			style={{ minHeight: span >= 6 ? 260 : span >= 5 ? 230 : 180 }}
		>
			<div
				className='absolute top-0 right-0 text-white px-4 py-1.5 text-[9px] font-black uppercase tracking-widest z-10'
				style={{ backgroundColor: brandRed }}
			>
				{item.category || item.topic || t('news_category_default_news')}
			</div>

			<div className='p-6 flex flex-col h-full justify-between'>
				<div>
					<p className='text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 mb-3'>
						{item.date?.split('-')[0] || item.year}
					</p>
					<span
						className='block font-black uppercase leading-none mb-3 tracking-tight'
						style={{ fontSize: span >= 5 ? '2rem' : '1.5rem', color: '#111' }}
					>
						{item.products?.[0]?.name ||
							item.product ||
							t('news_default_subject')}
					</span>
					<div
						className='w-7 h-[3px] mb-4'
						style={{ backgroundColor: brandRed }}
					/>
					<h2 className='text-[11px] font-bold uppercase tracking-wider text-gray-600 leading-snug line-clamp-3'>
						{item.title}
					</h2>
				</div>
				<div className='flex items-center justify-end gap-1.5 mt-5 text-[9px] font-black uppercase tracking-widest text-gray-400 group-hover:text-[#e21e26] transition-colors duration-300'>
					{t('news_read_more')}{' '}
					<ArrowRight
						size={10}
						className='group-hover:translate-x-1 transition-transform duration-300'
					/>
				</div>
			</div>
		</Link>
	</motion.article>
)

// ─── Карточка с фото ──────────────────────────────────────────────────────────
const ImageCard = ({ item, span, delay, t }) => (
	<motion.article
		layout
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		exit={{ opacity: 0, scale: 0.97 }}
		transition={{ duration: 0.4, delay }}
		className={`${COL_SPAN[span]}`}
	>
		<Link
			to={`/news-content/${item.id}`}
			className='relative group flex flex-col bg-white border border-black/8 overflow-hidden hover:shadow-xl transition-all duration-400 h-full no-underline'
		>
			<div
				className={`relative ${IMG_HEIGHT[span]} overflow-hidden bg-gray-100 flex-shrink-0`}
			>
				<img
					src={item.poster || item.image}
					alt={item.title}
					loading='lazy'
					className='w-full h-full object-cover md:grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105'
					onError={e => {
						e.target.src = '/placeholder-image.jpg'
					}}
				/>
				<div className='absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/25 to-transparent pointer-events-none' />
				<div
					className='absolute top-0 right-0 text-white px-4 py-1.5 text-[9px] font-black uppercase tracking-widest'
					style={{ backgroundColor: brandRed }}
				>
					{item.category || item.topic || t('news_category_default_news')}
				</div>
			</div>

			<div className='p-5 flex-grow flex flex-col'>
				<span
					className='text-[10px] font-black uppercase tracking-[0.15em] mb-2 block'
					style={{ color: brandRed }}
				>
					{item.date?.split('-')[0] || item.year} ·{' '}
					{item.products?.[0]?.name ||
						item.product ||
						t('news_default_subject')}
				</span>
				<h2
					className={`font-black uppercase tracking-tight leading-snug mb-3 group-hover:italic transition-all duration-300 group-hover:text-black/65 ${
						span >= 6
							? 'text-lg md:text-xl'
							: span >= 5
								? 'text-base md:text-lg'
								: 'text-sm md:text-base'
					}`}
				>
					{item.title}
				</h2>
				{span >= 5 && (
					<p className='hidden md:block text-[10px] text-gray-500 font-semibold uppercase tracking-wider leading-relaxed line-clamp-2 mb-3'>
						{item.short_description || item.description}
					</p>
				)}
				<div className='mt-auto flex items-center justify-end gap-1.5 text-[9px] font-black uppercase tracking-widest text-gray-400 group-hover:text-[#e21e26] transition-colors duration-300'>
					{t('news_read_more')}{' '}
					<ArrowRight
						size={10}
						className='group-hover:translate-x-1 transition-transform duration-300'
					/>
				</div>
			</div>
		</Link>
	</motion.article>
)

const NewsCard = ({ item, span, delay, t }) =>
	item.poster || item.image ? (
		<ImageCard item={item} span={span} delay={delay} t={t} />
	) : (
		<TextCard item={item} span={span} delay={delay} t={t} />
	)

const News = () => {
	const { t } = useTranslation()
	// State
	const [items, setItems] = useState([])
	const [loading, setLoading] = useState(true)
	const [loadingMore, setLoadingMore] = useState(false)
	const [hasMore, setHasMore] = useState(true)
	const [total, setTotal] = useState(0)
	const [page, setPage] = useState(1)
	const [topicOptions, setTopicOptions] = useState([])

	// Slider state
	const [sliderNews, setSliderNews] = useState([])
	const [currentSlide, setCurrentSlide] = useState(0)

	// Get URL params
	const [searchParams, setSearchParams] = useSearchParams()
	const category_id = searchParams.get('category_id') || ''

	// Initialize filters from URL params directly
	const [activeFilters, setActiveFilters] = useState({
		topic: category_id,
	})

	// Refs for infinite scroll
	const sentinelRef = useRef(null)
	const observerRef = useRef(null)
	const pageRef = useRef(1)
	const filtersRef = useRef(activeFilters)
	const hasMoreRef = useRef(true)
	const busyRef = useRef(false)
	const abortControllerRef = useRef(null)
	const isInitialMount = useRef(true)
	const sliderIntervalRef = useRef(null)

	// Parallax scroll effect
	const { scrollY } = useScroll()
	const headerY = useTransform(scrollY, [0, 500], [0, 150])
	const headerOpacity = useTransform(scrollY, [0, 300], [1, 0.3])
	const watermarkX = useTransform(scrollY, [0, 500], [0, -100])
	const titleScale = useTransform(scrollY, [0, 300], [1, 0.85])

	pageRef.current = page
	filtersRef.current = activeFilters
	hasMoreRef.current = hasMore

	// Load news from API
	const loadNews = useCallback(async (pageNum, filters, append = false) => {
		if (busyRef.current) return

		if (abortControllerRef.current) {
			abortControllerRef.current.abort()
		}

		abortControllerRef.current = new AbortController()
		busyRef.current = true

		if (!append) setLoading(true)
		else setLoadingMore(true)

		try {
			const params = new URLSearchParams()
			params.append('page', pageNum)
			params.append('page_size', PAGE_SIZE)

			if (filters.topic && filters.topic !== '') {
				params.append('category', filters.topic)
			}

			const url = `/news?${params.toString()}`
			const response = await apiClient.get(url, {
				signal: abortControllerRef.current.signal,
			})

			const data = response.data
			const newItems = data.results || data.items || []
			const totalCount = data.count || data.total || newItems.length

			setTotal(totalCount)
			const newHasMore = pageNum * PAGE_SIZE < totalCount
			setHasMore(newHasMore)

			if (append) {
				setItems(prev => [...prev, ...newItems])
			} else {
				setItems(newItems)
			}

			return newItems
		} catch (err) {
			if (err.name !== 'AbortError' && err.code !== 'ERR_CANCELED') {
				console.error('News fetch error:', err)
			}
			return []
		} finally {
			setLoading(false)
			setLoadingMore(false)
			busyRef.current = false
			abortControllerRef.current = null
		}
	}, [])

	// Load latest news for slider
	const loadSliderNews = useCallback(async () => {
		try {
			const params = new URLSearchParams()
			params.append('page', 1)
			params.append('page_size', SLIDER_NEWS_COUNT)

			const url = `/news?${params.toString()}`
			const response = await apiClient.get(url)
			const data = response.data
			const newsItems = data.results || data.items || []
			setSliderNews(newsItems.slice(0, SLIDER_NEWS_COUNT))
		} catch (err) {
			console.error('Slider news fetch error:', err)
		}
	}, [])

	useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false
			return
		}
		setPage(1)
		setHasMore(true)
		setItems([])
		loadNews(1, activeFilters, false)
	}, [activeFilters.topic, loadNews])

	useEffect(() => {
		loadNews(1, activeFilters, false)
		loadSliderNews()
	}, [])

	// Auto-slider functionality
	useEffect(() => {
		if (sliderNews.length <= 1) return

		sliderIntervalRef.current = setInterval(() => {
			setCurrentSlide(prev => (prev + 1) % sliderNews.length)
		}, 5000)

		return () => {
			if (sliderIntervalRef.current) {
				clearInterval(sliderIntervalRef.current)
			}
		}
	}, [sliderNews])

	useEffect(() => {
		if (observerRef.current) {
			observerRef.current.disconnect()
		}

		observerRef.current = new IntersectionObserver(
			([entry]) => {
				if (
					entry.isIntersecting &&
					hasMoreRef.current &&
					!busyRef.current &&
					!loading &&
					!loadingMore
				) {
					const nextPage = pageRef.current + 1
					setPage(nextPage)
					loadNews(nextPage, filtersRef.current, true)
				}
			},
			{
				rootMargin: '200px',
				threshold: 0.1,
			},
		)

		const currentSentinel = sentinelRef.current
		if (currentSentinel) {
			observerRef.current.observe(currentSentinel)
		}

		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect()
			}
		}
	}, [loadNews, loading, loadingMore])

	useEffect(() => {
		if (!isInitialMount.current) {
			window.scrollTo({ top: 0, behavior: 'smooth' })
		}
	}, [activeFilters.topic])

	useEffect(() => {
		const fetchOptions = async () => {
			try {
				const response = await apiClient('/get-news-categories')
				setTopicOptions(response.data)
			} catch (e) {
				console.error('Error fetching filter options:', e)
			}
		}
		fetchOptions()
	}, [])

	const handleFilterChange = (filterType, value) => {
		const newFilters = { ...activeFilters, [filterType]: value }
		setActiveFilters(newFilters)
		const newParams = new URLSearchParams()
		if (newFilters.topic) newParams.set('category_id', newFilters.topic)
		setSearchParams(newParams, { replace: true })
	}

	const clearFilters = () => {
		setActiveFilters({ topic: '' })
		setSearchParams({}, { replace: true })
	}

	const nextSlide = () => {
		setCurrentSlide(prev => (prev + 1) % sliderNews.length)
		resetSliderInterval()
	}

	const prevSlide = () => {
		setCurrentSlide(prev => (prev - 1 + sliderNews.length) % sliderNews.length)
		resetSliderInterval()
	}

	const resetSliderInterval = () => {
		if (sliderIntervalRef.current) {
			clearInterval(sliderIntervalRef.current)
		}
		if (sliderNews.length > 1) {
			sliderIntervalRef.current = setInterval(() => {
				setCurrentSlide(prev => (prev + 1) % sliderNews.length)
			}, 5000)
		}
	}

	const handleSliderClick = (item) => {
		window.location.href = `/news-content/${item.id}`
	}

	const getSpan = index => GRID_PATTERN[index % GRID_PATTERN.length]
	const hasActiveFilters = !!activeFilters.topic

	return (
		<div className='bg-[#f2f2f2] min-h-screen font-sans selection:bg-[#e21e26] selection:text-white'>
			<Navbar />

			{/* Professional Header with Slider and Parallax */}
			<motion.header
				style={{ y: headerY, opacity: headerOpacity }}
				className='relative h-screen min-h-[700px] bg-black overflow-hidden'
			>
				{/* Slider Background */}
				<div className='absolute inset-0 z-0'>
					<AnimatePresence mode='wait'>
						{sliderNews.length > 0 && (
							<motion.div
								key={currentSlide}
								initial={{ opacity: 0, scale: 1.1 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.95 }}
								transition={{ duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] }}
								className='absolute inset-0 cursor-pointer'
								onClick={() => handleSliderClick(sliderNews[currentSlide])}
							>
								<img
									src={sliderNews[currentSlide]?.poster || sliderNews[currentSlide]?.image || '/placeholder-image.jpg'}
									alt={sliderNews[currentSlide]?.title}
									className='w-full h-full object-cover'
								/>
								{/* Gradient Overlay */}
								<div className='absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90' />
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				{/* Slider Navigation Dots */}
				{sliderNews.length > 1 && (
					<div className='absolute bottom-32 left-1/2 -translate-x-1/2 z-20 flex gap-3'>
						{sliderNews.map((_, index) => (
							<button
								key={index}
								onClick={() => {
									setCurrentSlide(index)
									resetSliderInterval()
								}}
								className={`h-[2px] transition-all duration-500 ${
									currentSlide === index
										? 'w-12 bg-[#e21e26]'
										: 'w-8 bg-white/30 hover:bg-white/50'
								}`}
							/>
						))}
					</div>
				)}

				{/* Slider Arrows - Fixed z-index and pointer-events */}
				{sliderNews.length > 1 && (
					<>
						<button
							onClick={(e) => {
								e.stopPropagation()
								prevSlide()
							}}
							className='absolute left-8 top-1/2 -translate-y-1/2 z-[100] w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/30 hover:scale-110 transition-all duration-300 group pointer-events-auto cursor-pointer'
							aria-label="Previous slide"
						>
							<ChevronLeft className='w-5 h-5 group-hover:-translate-x-0.5 transition-transform' />
						</button>
						<button
							onClick={(e) => {
								e.stopPropagation()
								nextSlide()
							}}
							className='absolute right-8 top-1/2 -translate-y-1/2 z-[100] w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/30 hover:scale-110 transition-all duration-300 group pointer-events-auto cursor-pointer'
							aria-label="Next slide"
						>
							<ChevronRight className='w-5 h-5 group-hover:translate-x-0.5 transition-transform' />
						</button>
					</>
				)}

				{/* Watermark Text with Parallax */}
				<motion.div
					style={{ x: watermarkX }}
					className='absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden z-10'
				>
					<span
						className='absolute bottom-0 md:-bottom-20 -left-10 text-[12rem] md:text-[25rem] font-black uppercase leading-none text-transparent'
						style={{ WebkitTextStroke: '2px white' }}
					>
						{t('news_watermark')}
					</span>
				</motion.div>

				{/* Content Overlay with Parallax */}
				<motion.div
					style={{ scale: titleScale }}
					className='relative z-20 h-full flex flex-col items-center justify-center px-6'
				>
					<div className='max-w-6xl mx-auto text-center'>
						{/* Featured Label */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							className='mb-6'
						>
							<span className='inline-flex items-center gap-2 px-4 py-2 bg-[#e21e26]/10 backdrop-blur-sm border border-[#e21e26]/30 rounded-full'>
								<span className='w-2 h-2 bg-[#e21e26] rounded-full animate-pulse' />
								<span className='text-[10px] font-black uppercase tracking-[0.3em] text-white'>
									{t('news_featured_label')}
								</span>
							</span>
						</motion.div>

						{/* Main Title */}
						<motion.h1
							initial={{ opacity: 0, y: 40 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
							className='text-6xl md:text-9xl font-[1000] uppercase tracking-tighter leading-[0.9] text-white mb-8'
						>
							{t('news_title_main')}
						</motion.h1>

						{/* Current Slide Info */}
						{sliderNews[currentSlide] && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.4 }}
								className='mb-8'
							>
								<h2 className='text-2xl md:text-4xl font-black uppercase tracking-wider text-white max-w-3xl mx-auto'>
									{sliderNews[currentSlide].title}
								</h2>
								<p className='text-gray-300 text-sm md:text-base mt-3 max-w-2xl mx-auto line-clamp-2'>
									{sliderNews[currentSlide].short_description || sliderNews[currentSlide].description}
								</p>
							</motion.div>
						)}

						{/* Subtitle */}
						<motion.p
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.8, delay: 0.5 }}
							className='text-gray-300 text-base md:text-xl leading-relaxed font-light max-w-3xl mx-auto px-4 mb-12'
						>
							{t('news_subtitle')}
						</motion.p>

						{/* CTA Button */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.8 }}
						>
							<button
								onClick={() => handleSliderClick(sliderNews[currentSlide])}
								className='group inline-flex items-center gap-3 px-8 py-4 bg-[#e21e26] text-white text-sm font-black uppercase tracking-widest rounded-full hover:bg-white hover:text-black transition-all duration-500'
							>
								<span>{t('news_btn_explore')}</span>
								<ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
							</button>
						</motion.div>
					</div>
				</motion.div>

				{/* Bottom Gradient Line */}
				<div className='absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#e21e26] to-transparent z-20' />

				{/* Slide Counter */}
				{sliderNews.length > 0 && (
					<div className='absolute bottom-8 right-8 z-20 text-white/40 text-xs font-mono tracking-wider'>
						<span className='text-white text-lg font-black'>{String(currentSlide + 1).padStart(2, '0')}</span>
						<span className='mx-1'>/</span>
						<span>{String(sliderNews.length).padStart(2, '0')}</span>
					</div>
				)}

				{/* Scroll Indicator */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1.5 }}
					className='absolute bottom-8 left-8 z-20'
				>
					<div className='flex flex-col items-center gap-2'>
						<span className='text-[9px] font-black uppercase tracking-[0.3em] text-white/40'>{t('news_scroll_down')}</span>
						<div className='w-px h-12 bg-gradient-to-b from-white/40 to-transparent' />
					</div>
				</motion.div>
			</motion.header>

			{/* Filter Section */}
			<section className='bg-black border-t border-b border-white/10'>
				<div className='max-w-[1500px] mx-auto px-6 md:px-12 py-8'>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
						<div className='space-y-3'>
							<label className='text-[10px] font-black uppercase tracking-[0.2em] text-gray-400'>
								{t('news_filter_categories')}
							</label>
							<div className='relative'>
								<select
									value={activeFilters.topic || ''}
									onChange={e => handleFilterChange('topic', e.target.value)}
									className='w-full bg-white/5 border border-white/10 px-6 py-4 text-xs font-bold uppercase tracking-widest outline-none appearance-none cursor-pointer focus:border-[#e21e26] rounded-xl transition-colors text-white'
								>
									<option value='' className='bg-black text-white'>
										{t('news_filter_all')}
									</option>
									{topicOptions.map(opt => (
										<option
											key={opt.id}
											value={String(opt.id)}
											className='bg-black text-white'
										>
											{opt.name}
										</option>
									))}
								</select>
								<Search
									size={14}
									className='absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400'
								/>
							</div>
						</div>

						{hasActiveFilters && (
							<div className='md:col-span-3 mt-4 flex flex-wrap gap-2 items-center'>
								<span className='text-[9px] font-black uppercase tracking-[0.15em] text-gray-400'>
									{t('news_active_filters')}:
								</span>
								{activeFilters.topic && (
									<div className='flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full'>
										<span className='text-[10px] font-bold uppercase text-white'>
											{topicOptions.find(
												opt => String(opt.id) === activeFilters.topic,
											)?.name || activeFilters.topic}
										</span>
										<button
											onClick={() => handleFilterChange('topic', '')}
											className='hover:text-[#e21e26] transition-colors text-white'
										>
											<X size={12} />
										</button>
									</div>
								)}
								<button
									onClick={clearFilters}
									className='text-[9px] font-black uppercase tracking-[0.15em] text-gray-400 hover:text-[#e21e26] transition-colors ml-2'
								>
									{t('news_filter_clear')}
								</button>
							</div>
						)}
					</div>
				</div>
			</section>

			<main className='max-w-[1400px] mx-auto px-6 md:px-10 py-6 min-h-[600px]'>
				{loading ? (
					<div className='flex flex-col items-center justify-center py-40 gap-4'>
						<Loader2
							className='animate-spin'
							style={{ color: brandRed }}
							size={34}
						/>
						<p className='text-[10px] font-black uppercase tracking-[0.3em] text-gray-400'>
							{t('news_loading')}
						</p>
					</div>
				) : items.length === 0 ? (
					<div className='flex flex-col items-center justify-center py-40 gap-4'>
						<p className='text-[10px] font-black uppercase tracking-[0.3em] text-gray-400'>
							{t('news_empty')}
						</p>
						{hasActiveFilters && (
							<button
								onClick={clearFilters}
								className='px-6 py-3 bg-white border border-black/10 text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300 rounded-full'
							>
								{t('news_filter_btn_reset')}
							</button>
						)}
					</div>
				) : (
					<>
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3'>
							<AnimatePresence mode='popLayout'>
								{items.map((item, index) => (
									<NewsCard
										key={item.id}
										item={item}
										span={getSpan(index)}
										delay={index < PAGE_SIZE ? (index % PAGE_SIZE) * 0.03 : 0}
										t={t}
									/>
								))}
							</AnimatePresence>
						</div>

						<div ref={sentinelRef} className='h-2 mt-6' aria-hidden='true' />

						{loadingMore && (
							<div className='flex items-center justify-center py-10 gap-3'>
								<Loader2
									className='animate-spin'
									style={{ color: brandRed }}
									size={22}
								/>
								<p className='text-[9px] font-black uppercase tracking-[0.3em] text-gray-400'>
									{t('news_loading_more')}
								</p>
							</div>
						)}

						{!hasMore && !loadingMore && items.length > 0 && (
							<div className='flex items-center gap-6 py-12'>
								<div className='flex-1 h-px bg-black/10' />
								<p className='text-[9px] font-black uppercase tracking-[0.3em] text-gray-400'>
									{t('news_all_loaded', { count: total })}
								</p>
								<div className='flex-1 h-px bg-black/10' />
							</div>
						)}

						{hasMore && !loadingMore && items.length > 0 && (
							<div className='flex justify-center py-8'>
								<button
									onClick={() => {
										const nextPage = page + 1
										setPage(nextPage)
										loadNews(nextPage, activeFilters, true)
									}}
									className='px-8 py-3 bg-white border border-black/10 text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300 rounded-full'
								>
									{t('news_btn_more_news')}
								</button>
							</div>
						)}
					</>
				)}
			</main>

			<Footer />
		</div>
	)
}

export default News
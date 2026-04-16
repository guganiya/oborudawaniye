import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { Loader2, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import apiClient from '../api/api'
import { useTranslation } from 'react-i18next'

// ─── Константы ────────────────────────────────────────────────────────────────
const PAGE_SIZE = 5
const brandRed = '#e21e26'

const Innovations = () => {
	const { t } = useTranslation()
	const [items, setItems] = useState([])
	const [loading, setLoading] = useState(true)
	const [loadingMore, setLoadingMore] = useState(false)
	const [hasMore, setHasMore] = useState(true)
	const [total, setTotal] = useState(0)
	const [page, setPage] = useState(1)

	// Slider state
	const [currentSlide, setCurrentSlide] = useState(0)
	const [sliderItems, setSliderItems] = useState([])

	// Refs for infinite scroll
	const sentinelRef = useRef(null)
	const observerRef = useRef(null)
	const pageRef = useRef(1)
	const hasMoreRef = useRef(true)
	const busyRef = useRef(false)
	const abortControllerRef = useRef(null)
	const headerRef = useRef(null)
	const sliderIntervalRef = useRef(null)

	// Parallax scroll effect
	const { scrollY } = useScroll()
	const headerY = useTransform(scrollY, [0, 500], [0, 150])
	const headerOpacity = useTransform(scrollY, [0, 300], [1, 0.3])
	const watermarkX = useTransform(scrollY, [0, 500], [0, -100])
	const titleScale = useTransform(scrollY, [0, 300], [1, 0.85])

	pageRef.current = page
	hasMoreRef.current = hasMore

	// Load innovations from API with query parameters
	const loadInnovations = useCallback(async (pageNum, append = false) => {
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

			const url = `/innovations?${params.toString()}`

			const response = await apiClient.get(url, {
				signal: abortControllerRef.current.signal,
			})

			const data = response.data
			const newItems = data.results
			const totalCount =
				data.count ||
				data.total ||
				(data.results ? data.count : newItems.length)

			setTotal(totalCount)
			const newHasMore = pageNum * PAGE_SIZE < totalCount
			setHasMore(newHasMore)

			if (append) {
				setItems(prev => [...prev, ...newItems])
			} else {
				setItems(newItems)
				// Set first 5 items as slider items
				if (newItems.length > 0) {
					setSliderItems(newItems.slice(0, 5))
				}
			}

			return newItems
		} catch (err) {
			if (err.name !== 'AbortError' && err.code !== 'ERR_CANCELED') {
				console.error('Innovations fetch error:', err)
			}
			return []
		} finally {
			setLoading(false)
			setLoadingMore(false)
			busyRef.current = false
			abortControllerRef.current = null
		}
	}, [])

	// Load initial data
	useEffect(() => {
		setPage(1)
		setHasMore(true)
		setItems([])
		loadInnovations(1, false)
	}, [loadInnovations])

	// Auto-slider functionality
	useEffect(() => {
		if (sliderItems.length <= 1) return

		sliderIntervalRef.current = setInterval(() => {
			setCurrentSlide(prev => (prev + 1) % sliderItems.length)
		}, 5000)

		return () => {
			if (sliderIntervalRef.current) {
				clearInterval(sliderIntervalRef.current)
			}
		}
	}, [sliderItems])

	// Setup infinite scroll observer
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
					loadInnovations(nextPage, true)
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
	}, [loadInnovations, loading, loadingMore])

	const nextSlide = () => {
		setCurrentSlide(prev => (prev + 1) % sliderItems.length)
		resetSliderInterval()
	}

	const prevSlide = () => {
		setCurrentSlide(prev => (prev - 1 + sliderItems.length) % sliderItems.length)
		resetSliderInterval()
	}

	const resetSliderInterval = () => {
		if (sliderIntervalRef.current) {
			clearInterval(sliderIntervalRef.current)
		}
		if (sliderItems.length > 1) {
			sliderIntervalRef.current = setInterval(() => {
				setCurrentSlide(prev => (prev + 1) % sliderItems.length)
			}, 5000)
		}
	}

	// Handle slider item click
	const handleSliderItemClick = (item) => {
		// Navigate to innovation detail
		window.location.href = `/innovations/${item.id}`
	}

	return (
		<div className='bg-white min-h-screen font-sans selection:bg-[#e21e26] selection:text-white'>
			<Navbar />

			{/* Professional Header with Slider and Parallax - Shows Latest 5 Innovations */}
			<motion.header
				ref={headerRef}
				style={{ y: headerY, opacity: headerOpacity }}
				className='relative h-screen min-h-[700px] bg-black overflow-hidden'
			>
				{/* Slider Background */}
				<div className='absolute inset-0 z-0'>
					<AnimatePresence mode='wait'>
						{sliderItems.length > 0 && (
							<motion.div
								key={currentSlide}
								initial={{ opacity: 0, scale: 1.1 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.95 }}
								transition={{ duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] }}
								className='absolute inset-0 cursor-pointer'
								onClick={() => handleSliderItemClick(sliderItems[currentSlide])}
							>
								<img
									src={sliderItems[currentSlide]?.image}
									alt={sliderItems[currentSlide]?.name}
									className='w-full h-full object-cover'
								/>
								{/* Gradient Overlay */}
								<div className='absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90' />
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				{/* Slider Navigation Dots */}
				{sliderItems.length > 1 && (
					<div className='absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3'>
						{sliderItems.map((_, index) => (
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

				{/* Slider Arrows - Fixed for clickability */}
				{sliderItems.length > 1 && (
					<>
						<button
							onClick={(e) => {
								e.stopPropagation()
								prevSlide()
							}}
							className='absolute left-8 top-1/2 -translate-y-1/2 z-[100] w-14 h-14 flex items-center justify-center bg-black/40 backdrop-blur-md border border-white/30 rounded-full text-white hover:bg-[#e21e26] hover:border-[#e21e26] hover:scale-110 transition-all duration-300 group pointer-events-auto cursor-pointer'
							aria-label="Previous slide"
						>
							<ChevronLeft className='w-6 h-6 group-hover:-translate-x-0.5 transition-transform' />
						</button>
						<button
							onClick={(e) => {
								e.stopPropagation()
								nextSlide()
							}}
							className='absolute right-8 top-1/2 -translate-y-1/2 z-[100] w-14 h-14 flex items-center justify-center bg-black/40 backdrop-blur-md border border-white/30 rounded-full text-white hover:bg-[#e21e26] hover:border-[#e21e26] hover:scale-110 transition-all duration-300 group pointer-events-auto cursor-pointer'
							aria-label="Next slide"
						>
							<ChevronRight className='w-6 h-6 group-hover:translate-x-0.5 transition-transform' />
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
						{t('innovations_watermark')}
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
									{t('innovations_featured_label')}
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
							{t('innovations_title_main')}
						</motion.h1>

						{/* Current Slide Title */}
						{sliderItems[currentSlide] && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.4 }}
								className='mb-8'
							>
								<h2 className='text-2xl md:text-4xl font-black uppercase tracking-wider text-white'>
									{sliderItems[currentSlide].name}
								</h2>
							</motion.div>
						)}

						{/* Subtitle */}
						<motion.p
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.8, delay: 0.5 }}
							className='text-gray-300 text-base md:text-xl leading-relaxed font-light max-w-3xl mx-auto px-4 mb-12'
						>
							{t('innovations_subtitle')}
						</motion.p>

						{/* CTA Button */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.8 }}
						>
							<button
								onClick={() => handleSliderItemClick(sliderItems[currentSlide])}
								className='group inline-flex items-center gap-3 px-8 py-4 bg-[#e21e26] text-white text-sm font-black uppercase tracking-widest rounded-full hover:bg-white hover:text-black transition-all duration-500'
							>
								<span>{t('innovations_btn_explore')}</span>
								<ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
							</button>
						</motion.div>
					</div>
				</motion.div>

				{/* Bottom Gradient Line */}
				<div className='absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#e21e26] to-transparent z-20' />

				{/* Slide Counter */}
				{sliderItems.length > 0 && (
					<div className='absolute bottom-8 right-8 z-20 text-white/40 text-xs font-mono tracking-wider'>
						<span className='text-white text-lg font-black'>{String(currentSlide + 1).padStart(2, '0')}</span>
						<span className='mx-1'>/</span>
						<span>{String(sliderItems.length).padStart(2, '0')}</span>
					</div>
				)}
			</motion.header>

			<main className='max-w-[1400px] mx-auto px-6 py-20'>
				{loading ? (
					<div className='flex flex-col items-center justify-center py-40 gap-4'>
						<Loader2 className='animate-spin text-[#e21e26]' size={40} />
						<p className='text-[10px] font-black uppercase tracking-[0.3em] text-gray-400'>
							{t('innovations_loading')}
						</p>
					</div>
				) : items.length === 0 ? (
					<div className='flex items-center justify-center py-40'>
						<p className='text-[10px] font-black uppercase tracking-[0.3em] text-gray-400'>
							{t('innovations_empty')}
						</p>
					</div>
				) : (
					<>
						{/* Section Title */}
						<div className='mb-16 text-center'>
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								className='inline-block'
							>
								<h2 className='text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4'>
									{t('innovations_grid_title')}
								</h2>
								<div className='w-20 h-[2px] bg-[#e21e26] mx-auto' />
							</motion.div>
						</div>

						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20'>
							<AnimatePresence>
								{items.map((item, index) => (
									<InnovationCard key={item.id} item={item} index={index} />
								))}
							</AnimatePresence>
						</div>

						{/* Sentinel for infinite scroll */}
						<div ref={sentinelRef} className='h-2 mt-6' aria-hidden='true' />

						{loadingMore && (
							<div className='flex items-center justify-center py-10 gap-3 mt-8'>
								<Loader2
									className='animate-spin'
									style={{ color: brandRed }}
									size={22}
								/>
								<p className='text-[9px] font-black uppercase tracking-[0.3em] text-gray-400'>
									{t('innovations_loading_more')}
								</p>
							</div>
						)}

						{!hasMore && !loadingMore && items.length > 0 && (
							<div className='flex items-center gap-6 py-12 mt-8'>
								<div className='flex-1 h-px bg-gray-200' />
								<p className='text-[9px] font-black uppercase tracking-[0.3em] text-gray-400'>
									{t('innovations_all_loaded', { count: total })}
								</p>
								<div className='flex-1 h-px bg-gray-200' />
							</div>
						)}

						{/* Manual load more button (fallback) */}
						{hasMore && !loadingMore && items.length > 0 && (
							<div className='flex justify-center py-8 mt-8'>
								<button
									onClick={() => {
										const nextPage = page + 1
										setPage(nextPage)
										loadInnovations(nextPage, true)
									}}
									className='px-8 py-3 bg-white border border-gray-300 text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white hover:border-black transition-all duration-300 rounded-full'
								>
									{t('innovations_btn_more')}
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

const InnovationCard = ({ item, index }) => (
	<motion.div
		initial={{ opacity: 0, y: 30 }}
		whileInView={{ opacity: 1, y: 0 }}
		viewport={{ once: true }}
		transition={{ duration: 0.5, delay: Math.min(index * 0.1, 0.5) }}
		className='group'
	>
		<Link
			to={`/innovations/${item.id}`}
			className='flex flex-col h-full no-underline'
		>
			<div className='relative aspect-[16/9] overflow-hidden bg-gray-100 mb-8'>
				<img
					src={item.image}
					alt={item.title}
					className='w-full h-full object-cover transition-all duration-1000 md:grayscale group-hover:grayscale-0 group-hover:scale-105'
				/>
				<div className='absolute top-4 right-4 text-white text-[9px] font-black uppercase tracking-widest opacity-30'>
					AlyX
				</div>
			</div>

			<div className='flex flex-col items-center text-center px-4'>
				<h3 className='text-black text-lg font-black uppercase tracking-widest mb-4 group-hover:text-[#e21e26] transition-colors duration-300'>
					{item.name}
				</h3>
				<p className='text-gray-500 text-[13px] leading-relaxed font-medium line-clamp-4'>
					{item.description}
				</p>
				<div className='mt-8 flex justify-center'>
					<div className='w-6 h-[2px] bg-gray-200 group-hover:w-12 group-hover:bg-[#e21e26] transition-all duration-500' />
				</div>
			</div>
		</Link>
	</motion.div>
)

export default Innovations
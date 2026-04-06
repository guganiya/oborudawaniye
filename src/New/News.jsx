import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Search, ArrowRight, Loader2, X } from 'lucide-react'
import apiClient from "../api/api.js"

// ─── Константы ────────────────────────────────────────────────────────────────
const PAGE_SIZE = 3
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
const TextCard = ({ item, span, delay }) => (
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
				{item.category || item.topic}
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
						{item.products?.[0]?.name || item.product || 'News'}
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
					Read more{' '}
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
const ImageCard = ({ item, span, delay }) => (
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
					onError={(e) => {
						e.target.src = '/placeholder-image.jpg'
					}}
				/>
				<div className='absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/25 to-transparent pointer-events-none' />
				<div
					className='absolute top-0 right-0 text-white px-4 py-1.5 text-[9px] font-black uppercase tracking-widest'
					style={{ backgroundColor: brandRed }}
				>
					{item.category || item.topic}
				</div>
			</div>

			<div className='p-5 flex-grow flex flex-col'>
				<span
					className='text-[10px] font-black uppercase tracking-[0.15em] mb-2 block'
					style={{ color: brandRed }}
				>
					{item.date?.split('-')[0] || item.year} · {item.products?.[0]?.name || item.product || 'News'}
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
					Read more{' '}
					<ArrowRight
						size={10}
						className='group-hover:translate-x-1 transition-transform duration-300'
					/>
				</div>
			</div>
		</Link>
	</motion.article>
)

const NewsCard = ({ item, span, delay }) =>
	item.poster || item.image ? (
		<ImageCard item={item} span={span} delay={delay} />
	) : (
		<TextCard item={item} span={span} delay={delay} />
	)

const News = () => {
	// State
	const [items, setItems] = useState([])
	const [loading, setLoading] = useState(true)
	const [loadingMore, setLoadingMore] = useState(false)
	const [hasMore, setHasMore] = useState(true)
	const [total, setTotal] = useState(0)
	const [page, setPage] = useState(1)
	const [topicOptions, setTopicOptions] = useState([])

	// Get URL params
	const [searchParams, setSearchParams] = useSearchParams()
	const category_id = searchParams.get('category_id') || ''

	// Initialize filters from URL params directly
	const [activeFilters, setActiveFilters] = useState({
		topic: category_id
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

	pageRef.current = page
	filtersRef.current = activeFilters
	hasMoreRef.current = hasMore

	// Load news from API
	const loadNews = useCallback(async (pageNum, filters, append = false) => {
		if (busyRef.current) return

		// Cancel previous request
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

			// Add category filter if present
			if (filters.topic && filters.topic !== '') {
				params.append('category', filters.topic)
			}

			const url = `/news?${params.toString()}`
			console.log('Fetching:', url)

			const response = await apiClient.get(url, {
				signal: abortControllerRef.current.signal
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

	// Load initial data when filters change
	useEffect(() => {
		// Skip the first mount to avoid double fetch
		if (isInitialMount.current) {
			isInitialMount.current = false
			return
		}

		setPage(1)
		setHasMore(true)
		setItems([])
		loadNews(1, activeFilters, false)
	}, [activeFilters.topic, loadNews]) // Only depend on topic, not entire activeFilters

	// Initial load
	useEffect(() => {
		loadNews(1, activeFilters, false)
	}, []) // Empty deps - run once on mount

	// Setup infinite scroll observer
	useEffect(() => {
		if (observerRef.current) {
			observerRef.current.disconnect()
		}

		observerRef.current = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && hasMoreRef.current && !busyRef.current && !loading && !loadingMore) {
					const nextPage = pageRef.current + 1
					console.log('Loading more items - page:', nextPage)
					setPage(nextPage)
					loadNews(nextPage, filtersRef.current, true)
				}
			},
			{
				rootMargin: '200px',
				threshold: 0.1
			}
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

	// Reset scroll position when filters change
	useEffect(() => {
		if (!isInitialMount.current) {
			window.scrollTo({ top: 0, behavior: 'smooth' })
		}
	}, [activeFilters.topic])

	// Fetch filter options
	useEffect(() => {
		const fetchOptions = async () => {
			try {
				const response = await apiClient("/get-news-categories")
				setTopicOptions(response.data)
			} catch (e) {
				console.error('Error fetching filter options:', e)
			}
		}
		fetchOptions()
	}, [])

	// Handle filter changes
	const handleFilterChange = (filterType, value) => {
		const newFilters = { ...activeFilters, [filterType]: value }
		setActiveFilters(newFilters)

		// Update URL params
		const newParams = new URLSearchParams()
		if (newFilters.topic) newParams.set('category_id', newFilters.topic)
		setSearchParams(newParams, { replace: true })
	}

	// Clear all filters
	const clearFilters = () => {
		setActiveFilters({ topic: '' })
		setSearchParams({}, { replace: true })
	}

	const getSpan = index => GRID_PATTERN[index % GRID_PATTERN.length]

	// Check if any filters are active
	const hasActiveFilters = !!activeFilters.topic

	return (
		<div className='bg-[#f2f2f2] min-h-screen font-sans selection:bg-[#e21e26] selection:text-white'>
			<Navbar />

			<section className='pt-40 pb-16 bg-[#fafafa] border-b border-black/5 relative overflow-hidden'>
				<div className='absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden'>
					<span className='absolute bottom-0 left-0 md:-bottom-10 md:-left-10 text-[7rem] sm:text-[10rem] md:text-[20rem] font-black uppercase leading-[0.8]'>
						News
					</span>
				</div>

				<div className='max-w-[1500px] mx-auto px-6 md:px-12 relative z-10'>
					<div className='flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14'>
						<h1 className='text-5xl md:text-8xl font-black uppercase tracking-tighter italic leading-none'>
							News<span style={{ color: brandRed }}>.</span>
						</h1>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
						{/* Category Filter */}
						<div className='space-y-3'>
							<label className='text-[10px] font-black uppercase tracking-[0.2em] text-gray-400'>
								Категории
							</label>
							<div className='relative'>
								<select
									value={activeFilters.topic || ''}
									onChange={(e) => handleFilterChange('topic', e.target.value)}
									className='w-full bg-white border border-black/10 px-6 py-4 text-xs font-bold uppercase tracking-widest outline-none appearance-none cursor-pointer focus:border-black rounded-xl shadow-inner transition-colors'
								>
									<option value="">Все категории</option>
									{topicOptions.map(opt => (
										<option key={opt.id} value={String(opt.id)}>
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

						{/* Active Filters Display */}
						{hasActiveFilters && (
							<div className='md:col-span-3 mt-4 flex flex-wrap gap-2 items-center'>
								<span className='text-[9px] font-black uppercase tracking-[0.15em] text-gray-400'>
									Активные фильтры:
								</span>
								{activeFilters.topic && (
									<div className='flex items-center gap-2 px-3 py-1.5 bg-white border border-black/10 rounded-full'>
										<span className='text-[10px] font-bold uppercase'>
											{topicOptions.find(opt => String(opt.id) === activeFilters.topic)?.name || activeFilters.topic}
										</span>
										<button
											onClick={() => handleFilterChange('topic', '')}
											className='hover:text-[#e21e26] transition-colors'
										>
											<X size={12} />
										</button>
									</div>
								)}
								<button
									onClick={clearFilters}
									className='text-[9px] font-black uppercase tracking-[0.15em] text-gray-400 hover:text-[#e21e26] transition-colors ml-2'
								>
									Очистить все
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
							Загрузка новостей...
						</p>
					</div>
				) : items.length === 0 ? (
					<div className='flex flex-col items-center justify-center py-40 gap-4'>
						<p className='text-[10px] font-black uppercase tracking-[0.3em] text-gray-400'>
							Ничего не найдено
						</p>
						{hasActiveFilters && (
							<button
								onClick={clearFilters}
								className='px-6 py-3 bg-white border border-black/10 text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300 rounded-full'
							>
								Очистить фильтры
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
									/>
								))}
							</AnimatePresence>
						</div>

						{/* Sentinel for infinite scroll */}
						<div ref={sentinelRef} className='h-2 mt-6' aria-hidden='true' />

						{loadingMore && (
							<div className='flex items-center justify-center py-10 gap-3'>
								<Loader2
									className='animate-spin'
									style={{ color: brandRed }}
									size={22}
								/>
								<p className='text-[9px] font-black uppercase tracking-[0.3em] text-gray-400'>
									Загружаем ещё...
								</p>
							</div>
						)}

						{!hasMore && !loadingMore && items.length > 0 && (
							<div className='flex items-center gap-6 py-12'>
								<div className='flex-1 h-px bg-black/10' />
								<p className='text-[9px] font-black uppercase tracking-[0.3em] text-gray-400'>
									Все загружено ({total} новостей)
								</p>
								<div className='flex-1 h-px bg-black/10' />
							</div>
						)}

						{/* Manual load more button (fallback) */}
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
									Загрузить еще
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
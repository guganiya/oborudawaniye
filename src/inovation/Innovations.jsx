import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import apiClient from '../api/api'
import { useTranslation } from 'react-i18next' // Добавлено

// ─── Константы ────────────────────────────────────────────────────────────────
const PAGE_SIZE = 3
const brandRed = '#e21e26'

const Innovations = () => {
	const { t } = useTranslation() // Добавлено
	const [items, setItems] = useState([])
	const [loading, setLoading] = useState(true)
	const [loadingMore, setLoadingMore] = useState(false)
	const [hasMore, setHasMore] = useState(true)
	const [total, setTotal] = useState(0)
	const [page, setPage] = useState(1)

	// Refs for infinite scroll
	const sentinelRef = useRef(null)
	const observerRef = useRef(null)
	const pageRef = useRef(1)
	const hasMoreRef = useRef(true)
	const busyRef = useRef(false)
	const abortControllerRef = useRef(null)

	pageRef.current = page
	hasMoreRef.current = hasMore

	// Load innovations from API with query parameters
	const loadInnovations = useCallback(async (pageNum, append = false) => {
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
			// Build query parameters
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
					console.log('Loading more innovations - page:', nextPage)
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

	return (
		<div className='bg-white min-h-screen font-sans selection:bg-[#e21e26] selection:text-white'>
			<Navbar />

			{/* Шапка страницы с фоновым текстом */}
			<header className='relative pt-44 pb-20 px-6 border-b border-gray-50 overflow-hidden'>
				{/* ФОНОВЫЙ ТЕКСТ (Watermark) */}
				<div className='absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden'>
					<span className='absolute bottom-2 md:-bottom-10 -left-10 text-[6rem] md:text-[18rem] font-black uppercase leading-none'>
						{t('innovations_watermark')}
					</span>
				</div>

				<div className='max-w-4xl mx-auto text-center relative z-10'>
					<motion.h1
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						className='text-4xl md:text-6xl font-black uppercase tracking-tighter italic mb-8'
					>
						{t('innovations_title_main')}
						<span className='text-[#e21e26]'>.</span>
					</motion.h1>
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2 }}
						className='text-gray-500 text-sm md:text-base leading-relaxed font-medium px-4'
					>
						{t('innovations_subtitle')}
					</motion.p>
				</div>
			</header>

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
					Robe
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

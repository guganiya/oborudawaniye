import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next' // Добавлено
import {
	Loader2,
	ChevronRight,
	Search,
	X,
	ArrowRight,
	Maximize2,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import apiClient from '../api/api'

const SubCategoryProducts = () => {
	const { subId } = useParams()
	const navigate = useNavigate()
	const { t, i18n } = useTranslation() // Добавлено

	// State
	const [items, setItems] = useState([])
	const [searchTerm, setSearchTerm] = useState('')
	const [loading, setLoading] = useState(true)
	const [loadingMore, setLoadingMore] = useState(false)
	const [hasMore, setHasMore] = useState(true)
	const [page, setPage] = useState(1)
	const [total, setTotal] = useState(0)

	// Refs for Infinite Scroll
	const sentinelRef = useRef(null)
	const observerRef = useRef(null)
	const pageRef = useRef(1)
	const busyRef = useRef(false)
	const abortControllerRef = useRef(null)

	pageRef.current = page

	// Хелпер для локализации полей из БД
	const getLoc = (item, field) => {
		if (!item) return ''
		const lang = i18n.language
		if (lang === 'en' && item[`${field}_en`]) return item[`${field}_en`]
		if (lang === 'tk' && item[`${field}_tk`]) return item[`${field}_tk`]
		return item[`${field}_ru`] || item[field]
	}

	const loadProducts = useCallback(
		async (pageNum, query = '', append = false) => {
			if (busyRef.current) return

			if (abortControllerRef.current) abortControllerRef.current.abort()
			abortControllerRef.current = new AbortController()

			busyRef.current = true
			if (!append) setLoading(true)
			else setLoadingMore(true)

			try {
				const params = new URLSearchParams()
				params.append('subcategory', subId)
				params.append('page', pageNum)
				if (query) params.append('search', query)

				const response = await apiClient.get(`/products?${params.toString()}`, {
					signal: abortControllerRef.current.signal,
				})

				const data = response.data
				const newItems = data.results || []
				const totalCount = data.count || 0

				setTotal(totalCount)
				setHasMore(data.next !== null)

				if (append) {
					setItems(prev => [...prev, ...newItems])
				} else {
					setItems(newItems)
				}
			} catch (err) {
				if (err.name !== 'AbortError') console.error('Fetch error:', err)
			} finally {
				setLoading(false)
				setLoadingMore(false)
				busyRef.current = false
				abortControllerRef.current = null
			}
		},
		[subId],
	)

	useEffect(() => {
		setPage(1)
		setHasMore(true)
		loadProducts(1, searchTerm, false)
	}, [subId, searchTerm, loadProducts])

	useEffect(() => {
		if (observerRef.current) observerRef.current.disconnect()

		observerRef.current = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && hasMore && !busyRef.current && !loading) {
					const nextPage = pageRef.current + 1
					setPage(nextPage)
					loadProducts(nextPage, searchTerm, true)
				}
			},
			{ rootMargin: '400px' },
		)

		if (sentinelRef.current) observerRef.current.observe(sentinelRef.current)
		return () => observerRef.current?.disconnect()
	}, [hasMore, loading, loadProducts, searchTerm])

	// Данные для шапки и крошек (берем из первого товара)
	const categoryName =
		items.length > 0 ? getLoc(items[0], 'category') : t('products_catalog')
	const subcategoryName =
		items.length > 0 ? getLoc(items[0], 'subcategory') : t('products_loading')

	return (
		<div className='bg-white min-h-screen font-sans selection:bg-[#e21e26] selection:text-white'>
			<Navbar />

			<div className='absolute top-44 left-0 w-full opacity-[0.02] pointer-events-none select-none overflow-hidden'>
				<div className='text-[15rem] md:text-[25rem] font-black uppercase leading-none block whitespace-nowrap'>
					{subcategoryName}
				</div>
			</div>

			<main className='max-w-[1400px] mx-auto px-6 pt-44 pb-32 relative z-10'>
				<div className='flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 border-b border-gray-100 pb-8'>
					<nav className='flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400'>
						<Link
							to='/products'
							className='hover:text-[#e21e26] transition-colors duration-300'
						>
							{t('products_breadcrumb_catalog')}
						</Link>
						<ChevronRight size={10} className='text-slate-300' />
						<button
							onClick={() => navigate(-1)}
							className='hover:text-[#e21e26] transition-colors duration-300 uppercase tracking-[0.15em]'
						>
							{categoryName}
						</button>
						<ChevronRight size={10} className='text-slate-300' />
						<span className='text-[#e21e26] font-black truncate max-w-[150px]'>
							{subcategoryName}
						</span>
					</nav>

					<div className='relative w-full md:w-80 group'>
						<input
							type='text'
							placeholder={t('products_search_placeholder')}
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
							className='w-full bg-transparent border border-black p-3 pr-10 text-[11px] font-black uppercase tracking-widest focus:border-[#e21e26] transition-all outline-none placeholder:text-gray-300 rounded-2xl'
						/>
						<div className='absolute right-3 top-1/2 -translate-y-1/2'>
							{searchTerm ? (
								<X
									size={16}
									className='cursor-pointer text-gray-400'
									onClick={() => setSearchTerm('')}
								/>
							) : (
								<Search size={16} className='text-gray-300' />
							)}
						</div>
					</div>
				</div>

				<header className='mb-20'>
					<motion.h1
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						className='text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-none'
					>
						{subcategoryName}
						<span className='text-[#e21e26]'>.</span>
					</motion.h1>
				</header>

				{loading && items.length === 0 ? (
					<div className='flex flex-col items-center py-40 gap-4'>
						<Loader2 className='animate-spin text-[#e21e26]' size={40} />
						<p className='text-[10px] font-black uppercase tracking-widest text-gray-400'>
							{t('products_loading_text')}
						</p>
					</div>
				) : (
					<>
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16'>
							<AnimatePresence mode='popLayout'>
								{items.map(product => (
									<ProductCard
										key={product.id}
										product={product}
										getLoc={getLoc}
									/>
								))}
							</AnimatePresence>
						</div>

						<div ref={sentinelRef} className='h-20' />

						{loadingMore && (
							<div className='flex justify-center py-10'>
								<Loader2 className='animate-spin text-[#e21e26]' size={32} />
							</div>
						)}

						{!hasMore && items.length > 0 && (
							<div className='text-center py-20 border-t border-gray-50 mt-10'>
								<p className='text-gray-300 text-[9px] font-black uppercase tracking-[0.5em]'>
									{t('products_end_of_catalog')} — {total}{' '}
									{t('products_count_label')}
								</p>
							</div>
						)}
					</>
				)}
			</main>
			<Footer />
		</div>
	)
}

const ProductCard = ({ product, getLoc }) => (
	<motion.div
		layout
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		exit={{ opacity: 0, scale: 0.95 }}
		className='group'
	>
		<Link to={`/product/${product.id}`} className='block no-underline'>
			<div className='relative aspect-[4/5] overflow-hidden bg-[#f9f9f9] mb-6'>
				<img
					src={product.poster}
					alt={getLoc(product, 'name')}
					className='w-full h-full object-cover transition-all duration-700 md:grayscale group-hover:grayscale-0 group-hover:scale-110'
				/>
				<div className='absolute top-4 right-4'>
					<span className='bg-black text-white text-[8px] font-black uppercase px-3 py-1.5 tracking-tighter rounded-full'>
						{product.size}
					</span>
				</div>
				<div className='absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center'>
					<div className='bg-white p-4 rounded-full scale-50 group-hover:scale-100 transition-transform duration-500 shadow-xl'>
						<Maximize2 size={20} className='text-black' />
					</div>
				</div>
			</div>

			<div className='space-y-3'>
				<div className='flex justify-between items-start'>
					<h3 className='text-black text-xl font-black uppercase tracking-tighter leading-none group-hover:text-[#e21e26] transition-colors duration-300'>
						{getLoc(product, 'name')}
					</h3>
					<ArrowRight
						size={18}
						className='opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#e21e26]'
					/>
				</div>
				<p className='text-gray-400 text-[11px] font-medium leading-relaxed line-clamp-2 uppercase'>
					{getLoc(product, 'short_description')}
				</p>
			</div>
		</Link>
	</motion.div>
)

export default SubCategoryProducts

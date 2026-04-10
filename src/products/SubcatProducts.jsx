import React, { useState, useEffect, useCallback, useRef } from 'react'
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
	const [page, setPage] = useState(1)
	const [total, setTotal] = useState(0)

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

	const filteredItems = items.filter(product => {
		const name = getLoc(product, 'name').toLowerCase()
		const desc = getLoc(product, 'short_description').toLowerCase()
		const query = searchTerm.toLowerCase()
		return name.includes(query) || desc.includes(query)
	})

	const loadProducts = useCallback(
		async (pageNum, append = false) => {
			if (busyRef.current) return
			busyRef.current = true

			if (!append) setLoading(true)
			else setLoadingMore(true)

			try {
				const response = await apiClient.get('/products', {
					params: {
						subcategory: subId,
						page: pageNum,
					},
				})

				const data = response.data
				const newItems = data.results || []

				setTotal(data.count || 0)
				setHasMore(data.next !== null)

				if (append) {
					setItems(prev => [...prev, ...newItems])
				} else {
					setItems(newItems)
				}
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
		setPage(1)
		pageRef.current = 1
		setItems([])
		loadProducts(1, false)
	}, [subId, loadProducts])

	useEffect(() => {
		if (observerRef.current) observerRef.current.disconnect()

		observerRef.current = new IntersectionObserver(
			([entry]) => {
				if (
					entry.isIntersecting &&
					hasMore &&
					!busyRef.current &&
					searchTerm === ''
				) {
					const nextPage = pageRef.current + 1
					setPage(nextPage)
					pageRef.current = nextPage
					loadProducts(nextPage, true)
				}
			},
			{ rootMargin: '400px' },
		)

		if (sentinelRef.current) observerRef.current.observe(sentinelRef.current)
		return () => observerRef.current?.disconnect()
	}, [hasMore, loadProducts, searchTerm])

	const categoryName =
		items.length > 0 ? getLoc(items[0], 'category') : t('products_catalog')
	const subcategoryName =
		items.length > 0 ? getLoc(items[0], 'subcategory') : t('products_loading')

	return (
		<div className='bg-white min-h-screen font-sans selection:bg-[#e21e26] selection:text-white text-black'>
			<Navbar />

			<header className='relative pt-52 pb-20 px-6 bg-black overflow-hidden'>
				<div
					className='absolute inset-0 z-0'
					style={{
						background:
							'linear-gradient(to left, rgba(226, 30, 38, 0.15) 0%, rgba(0, 0, 0, 1) 70%)',
					}}
				/>

				<div className='absolute inset-0 opacity-[0.05] pointer-events-none select-none overflow-hidden z-0'>
					<div
						className='text-[10rem] md:text-[20rem] font-black uppercase leading-none block whitespace-nowrap text-transparent'
						style={{ WebkitTextStroke: '2px white' }}
					>
						{subcategoryName}
					</div>
				</div>

				<div className='max-w-[1400px] mx-auto relative z-10'>
					<div className='flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 border-b border-white/10 pb-8'>
						<nav className='flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white/40'>
							<Link
								to='/products'
								className='hover:text-[#e21e26] transition-colors uppercase'
							>
								{t('products_breadcrumb_catalog')}
							</Link>
							<ChevronRight size={10} className='text-white/20' />
							<button
								onClick={() => navigate(-1)}
								className='hover:text-[#e21e26] transition-colors uppercase'
							>
								{categoryName}
							</button>
							<ChevronRight size={10} className='text-white/20' />
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
								className='w-full bg-white/5 border border-white/20 p-3 pr-10 text-[11px] font-black uppercase tracking-widest focus:border-[#e21e26] transition-all outline-none rounded-2xl text-white placeholder:text-white/20'
							/>
							<div className='absolute right-3 top-1/2 -translate-y-1/2'>
								{searchTerm ? (
									<X
										size={16}
										className='cursor-pointer text-white/40'
										onClick={() => setSearchTerm('')}
									/>
								) : (
									<Search size={16} className='text-white/20' />
								)}
							</div>
						</div>
					</div>

					<motion.h1
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						className='text-6xl md:text-9xl font-[1000] uppercase tracking-tighter italic leading-none text-white'
					>
						{subcategoryName}
						{/* Точка удалена отсюда, если нужно было только в заголовке, либо в карточке (см. ниже) */}
					</motion.h1>
				</div>
			</header>

			<main className='max-w-[1400px] mx-auto px-4 md:px-6 py-12 md:py-24 relative z-10'>
				{loading && items.length === 0 ? (
					<div className='flex flex-col items-center py-40 gap-4'>
						<Loader2 className='animate-spin text-[#e21e26]' size={40} />
						<p className='text-[10px] font-black uppercase tracking-widest text-gray-400'>
							{t('products_loading_text')}
						</p>
					</div>
				) : (
					<>
						{/* Сетка: на мобилках 2 колонки, карточки меньше, зазоры меньше */}
						<div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 md:gap-x-8 gap-y-10 md:gap-y-16'>
							<AnimatePresence mode='popLayout'>
								{filteredItems.map(product => (
									<ProductCard
										key={product.id}
										product={product}
										getLoc={getLoc}
									/>
								))}
							</AnimatePresence>
						</div>

						{filteredItems.length === 0 && (
							<div className='text-center py-20'>
								<p className='text-gray-300 text-[10px] font-black uppercase tracking-widest'>
									{t('no_results_found')}
								</p>
							</div>
						)}

						{searchTerm === '' && <div ref={sentinelRef} className='h-20' />}

						{loadingMore && (
							<div className='flex justify-center py-10'>
								<Loader2 className='animate-spin text-[#e21e26]' size={32} />
							</div>
						)}

						{!hasMore && items.length > 0 && searchTerm === '' && (
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
		<Link to={`/product/${product.id}`} className='block no-underline h-full'>
			{/* Добавлен border-black/5 для легкого контура */}
			<div className='relative aspect-[4/5] overflow-hidden bg-[#f9f9f9] mb-4 md:mb-6 border border-black/5'>
				<img
					src={product.poster}
					alt={getLoc(product, 'name')}
					className='w-full h-full object-cover transition-all duration-700 md:grayscale group-hover:grayscale-0 group-hover:scale-110'
				/>
				<div className='absolute top-2 right-2 md:top-4 md:right-4'>
					<span className='bg-black text-white text-[7px] md:text-[8px] font-black uppercase px-2 py-1 md:px-3 md:py-1.5 rounded-full'>
						{product.size}
					</span>
				</div>
				{/* Скрываем лупу на мобилках для чистоты дизайна */}
				<div className='hidden md:flex absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center'>
					<div className='bg-white p-4 rounded-full scale-50 group-hover:scale-100 transition-transform shadow-xl'>
						<Maximize2 size={20} className='text-black' />
					</div>
				</div>
			</div>

			<div className='space-y-2 md:space-y-3'>
				<div className='flex justify-between items-start'>
					{/* Убрал точку из названия. Размер шрифта уменьшен для мобилок */}
					<h3 className='text-black text-sm md:text-xl font-black uppercase tracking-tighter leading-none group-hover:text-[#e21e26] transition-colors'>
						{getLoc(product, 'name')}
					</h3>
					<ArrowRight
						size={16}
						className='hidden md:block opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#e21e26]'
					/>
				</div>
				<p className='text-gray-400 text-[9px] md:text-[11px] font-medium line-clamp-2 uppercase leading-tight'>
					{getLoc(product, 'short_description')}
				</p>
			</div>
		</Link>
	</motion.div>
)

export default SubCategoryProducts

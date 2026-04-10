import React, { useState, useRef, useEffect, useCallback } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Search, ChevronDown, Check, Loader2, X } from 'lucide-react'
import apiClient from '../api/api.js'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion' // Добавил импорт для анимаций

const PAGE_SIZE = 3
const brandRed = '#e21e26'

const SearchPage = () => {
	const { t } = useTranslation()

	// Search states
	const [mainSearch, setMainSearch] = useState('')
	const [selectedCategory, setSelectedCategory] = useState('')
	const [selectedSubcategory, setSelectedSubcategory] = useState('')
	const [selectedSize, setSelectedSize] = useState('')

	// Data states
	const [categories, setCategories] = useState([])
	const [subcategories, setSubcategories] = useState([])
	const [sizes, setSizes] = useState([])
	const [products, setProducts] = useState([])

	// UI states
	const [loading, setLoading] = useState(false)
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
	const filtersRef = useRef({})

	pageRef.current = page
	hasMoreRef.current = hasMore

	filtersRef.current = {
		search: mainSearch,
		category: selectedCategory,
		subcategory: selectedSubcategory,
		size: selectedSize,
	}

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await apiClient('/get-product-categories')
				const data = await response.data
				setCategories(data)
			} catch (e) {
				console.error('Error fetching categories:', e)
			}
		}
		fetchCategories()
	}, [])

	useEffect(() => {
		if (!selectedCategory) {
			setSubcategories([])
			setSelectedSubcategory('')
			return
		}

		const fetchSubcategories = async () => {
			try {
				const response = await apiClient.get(
					`/get-product-subcategories/${selectedCategory}`,
				)
				const data = await response.data
				setSubcategories(data)
				setSelectedSubcategory('')
			} catch (e) {
				console.error('Error fetching subcategories:', e)
				setSubcategories([])
			}
		}
		fetchSubcategories()
	}, [selectedCategory])

	useEffect(() => {
		const fetchSizes = async () => {
			try {
				const response = await apiClient.get('/sizes')
				const data = await response.data
				setSizes(data)
			} catch (e) {
				console.error('Error fetching sizes:', e)
			}
		}
		fetchSizes()
	}, [])

	const loadProducts = useCallback(async (pageNum, filters, append = false) => {
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

			if (filters.search) params.append('name', filters.search)
			if (filters.category) params.append('category', filters.category)
			if (filters.subcategory) params.append('subcategory', filters.subcategory)
			if (filters.size) params.append('size', filters.size)

			const url = `/products?${params.toString()}`
			const response = await apiClient.get(url, {
				signal: abortControllerRef.current.signal,
			})

			const data = response.data
			const newProducts = data.results || data.items || []
			const totalCount = data.count || data.total || newProducts.length

			setTotal(totalCount)
			const newHasMore = pageNum * PAGE_SIZE < totalCount
			setHasMore(newHasMore)

			if (append) {
				setProducts(prev => [...prev, ...newProducts])
			} else {
				setProducts(newProducts)
			}

			return newProducts
		} catch (err) {
			if (err.name !== 'AbortError' && err.code !== 'ERR_CANCELED') {
				console.error('Products fetch error:', err)
			}
			return []
		} finally {
			setLoading(false)
			setLoadingMore(false)
			busyRef.current = false
			abortControllerRef.current = null
		}
	}, [])

	useEffect(() => {
		setPage(1)
		setHasMore(true)
		setProducts([])
		loadProducts(1, filtersRef.current, false)
	}, [
		mainSearch,
		selectedCategory,
		selectedSubcategory,
		selectedSize,
		loadProducts,
	])

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
					loadProducts(nextPage, filtersRef.current, true)
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
	}, [loadProducts, loading, loadingMore])

	const clearFilters = () => {
		setMainSearch('')
		setSelectedCategory('')
		setSelectedSubcategory('')
		setSelectedSize('')
	}

	const hasActiveFilters =
		mainSearch || selectedCategory || selectedSubcategory || selectedSize

	return (
		<div className='min-h-screen flex flex-col bg-white overflow-hidden text-black'>
			<Navbar />

			<header className='relative pt-52 pb-20 px-6 bg-black overflow-hidden'>
				{/* ГРАДИЕНТНЫЙ ФОН */}
				<div
					className='absolute inset-0 z-0'
					style={{
						background:
							'linear-gradient(to left, rgba(226, 30, 38, 0.15) 0%, rgba(0, 0, 0, 1) 70%)',
					}}
				/>

				{/* Световое пятно справа */}
				<div className='absolute top-1/2 right-[-10%] -translate-y-1/2 w-[600px] h-[600px] bg-[#e21e26]/15 blur-[130px] rounded-full pointer-events-none' />

				{/* ФОНОВЫЙ ТЕКСТ (Watermark) */}
				<div className='absolute inset-0 opacity-[0.05] pointer-events-none select-none overflow-hidden'>
					<span
						className='absolute -bottom-10 -left-10 text-[8rem] md:text-[22rem] font-black uppercase leading-none text-transparent whitespace-nowrap'
						style={{ WebkitTextStroke: '2px white' }}
					>
						{t('search.bg_text')}
					</span>
				</div>

				<div className='max-w-[1200px] mx-auto relative z-10'>
					<motion.h1
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						className='text-6xl md:text-9xl font-[1000] uppercase tracking-tighter leading-none text-white italic mb-16'
					>
						{t('search.title')}{' '}
					</motion.h1>

					<div className='relative group'>
						<div className='absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none text-[#e21e26] pl-2'>
							<Search size={32} strokeWidth={2} />
						</div>
						<input
							type='text'
							placeholder={t('search.placeholder')}
							value={mainSearch}
							onChange={e => setMainSearch(e.target.value)}
							className='w-full text-2xl md:text-5xl font-light bg-transparent border-b border-white/20 pl-14 md:pl-20 py-8 focus:outline-none focus:border-[#e21e26] transition-all text-white placeholder:text-white/20'
						/>
					</div>
				</div>
			</header>

			<main className='flex-grow pb-20 px-6 pt-16'>
				<div className='max-w-[1200px] mx-auto'>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-16'>
						<SmartSelect
							label={t('search.filter_category')}
							options={categories}
							value={selectedCategory}
							onChange={setSelectedCategory}
							displayKey='name'
							valueKey='id'
							placeholder={t('search.select_placeholder')}
							noMatchesText={t('search.no_matches')}
						/>
						<SmartSelect
							label={t('search.filter_subcategory')}
							options={subcategories}
							value={selectedSubcategory}
							onChange={setSelectedSubcategory}
							displayKey='name'
							valueKey='id'
							disabled={!selectedCategory}
							placeholder={t('search.select_placeholder')}
							noMatchesText={t('search.no_matches')}
						/>
						<SmartSelect
							label={t('search.filter_size')}
							options={sizes}
							value={selectedSize}
							onChange={setSelectedSize}
							displayKey='name'
							valueKey='id'
							placeholder={t('search.select_placeholder')}
							noMatchesText={t('search.no_matches')}
						/>
					</div>

					{hasActiveFilters && (
						<div className='mb-8 flex flex-wrap gap-2 items-center'>
							<span className='text-[9px] font-black uppercase tracking-[0.15em] text-gray-400'>
								{t('search.active_filters')}:
							</span>
							{mainSearch && (
								<FilterChip
									label={`${t('search.chip_search')}: ${mainSearch}`}
									onRemove={() => setMainSearch('')}
								/>
							)}
							{selectedCategory && (
								<FilterChip
									label={`${t('search.chip_category')}: ${categories.find(c => String(c.id) === String(selectedCategory))?.name || selectedCategory}`}
									onRemove={() => setSelectedCategory('')}
								/>
							)}
							{selectedSubcategory && (
								<FilterChip
									label={`${t('search.chip_subcategory')}: ${subcategories.find(s => String(s.id) === String(selectedSubcategory))?.name || selectedSubcategory}`}
									onRemove={() => setSelectedSubcategory('')}
								/>
							)}
							{selectedSize && (
								<FilterChip
									label={`${t('search.chip_size')}: ${sizes.find(s => String(s.id) === String(selectedSize))?.name || selectedSize}`}
									onRemove={() => setSelectedSize('')}
								/>
							)}
							<button
								onClick={clearFilters}
								className='text-[9px] font-black uppercase tracking-[0.15em] text-gray-400 hover:text-[#e21e26] transition-colors ml-2'
							>
								{t('search.clear_all')}
							</button>
						</div>
					)}

					<div className='border-t border-black pt-12 min-h-[300px]'>
						{loading ? (
							<div className='flex flex-col items-center justify-center py-20 gap-4'>
								<Loader2
									className='animate-spin'
									style={{ color: brandRed }}
									size={34}
								/>
								<p className='text-[10px] font-black uppercase tracking-[0.3em] text-gray-400'>
									{t('search.loading')}
								</p>
							</div>
						) : products.length === 0 ? (
							<div className='flex flex-col items-center justify-center py-20 text-center'>
								<Search
									size={48}
									strokeWidth={1}
									className='mx-auto mb-4 opacity-30'
								/>
								<p className='text-[11px] uppercase tracking-[0.4em] text-gray-400'>
									{hasActiveFilters
										? t('search.no_products')
										: t('search.awaiting_params')}
								</p>
								{hasActiveFilters && (
									<button
										onClick={clearFilters}
										className='mt-6 px-6 py-3 bg-white border border-black/10 text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300 rounded-full'
									>
										{t('search.clear_filters_btn')}
									</button>
								)}
							</div>
						) : (
							<>
								<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
									{products.map(product => (
										<ProductCard key={product.id} product={product} />
									))}
								</div>

								<div
									ref={sentinelRef}
									className='h-2 mt-6'
									aria-hidden='true'
								/>

								{loadingMore && (
									<div className='flex items-center justify-center py-10 gap-3'>
										<Loader2
											className='animate-spin'
											style={{ color: brandRed }}
											size={22}
										/>
										<p className='text-[9px] font-black uppercase tracking-[0.3em] text-gray-400'>
											{t('search.loading_more')}
										</p>
									</div>
								)}

								{!hasMore && !loadingMore && products.length > 0 && (
									<div className='flex items-center gap-6 py-12'>
										<div className='flex-1 h-px bg-black/10' />
										<p className='text-[9px] font-black uppercase tracking-[0.3em] text-gray-400'>
											{t('search.all_loaded', { count: total })}
										</p>
										<div className='flex-1 h-px bg-black/10' />
									</div>
								)}
							</>
						)}
					</div>
				</div>
			</main>

			<Footer />
		</div>
	)
}

const SmartSelect = ({
	label,
	options,
	value,
	onChange,
	displayKey = 'name',
	valueKey = 'id',
	disabled = false,
	placeholder,
	noMatchesText,
}) => {
	const [isOpen, setIsOpen] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')
	const wrapperRef = useRef(null)

	useEffect(() => {
		const handleClickOutside = e => {
			if (wrapperRef.current && !wrapperRef.current.contains(e.target))
				setIsOpen(false)
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	const getDisplayValue = item =>
		typeof item === 'object' ? item[displayKey] : item
	const getOptionValue = item =>
		typeof item === 'object' ? String(item[valueKey]) : String(item)

	const filteredOptions = options.filter(opt =>
		getDisplayValue(opt).toLowerCase().includes(searchTerm.toLowerCase()),
	)

	const selectedLabel = value
		? options.find(opt => getOptionValue(opt) === String(value))
		: null

	return (
		<div
			className={`flex flex-col gap-2 group ${disabled ? 'opacity-50' : ''}`}
			ref={wrapperRef}
		>
			<label className='text-[10px] uppercase tracking-[0.2em] font-bold text-black/40 group-focus-within:text-[#e21e26] transition-colors'>
				{label}
			</label>

			<div
				className={`relative border transition-all duration-300 ${isOpen ? 'border-black shadow-2xl' : 'border-black'} ${disabled ? 'cursor-not-allowed bg-gray-50' : 'cursor-text'}`}
			>
				<div
					className='flex items-center justify-between px-4 py-4 bg-white'
					onClick={() => !disabled && setIsOpen(true)}
				>
					<input
						type='text'
						className='w-full bg-transparent focus:outline-none text-[13px] font-bold uppercase tracking-widest placeholder:text-black/50 cursor-pointer'
						placeholder={
							selectedLabel ? getDisplayValue(selectedLabel) : placeholder
						}
						value={searchTerm}
						onChange={e => {
							if (!disabled) {
								setSearchTerm(e.target.value)
								if (!isOpen) setIsOpen(true)
							}
						}}
						disabled={disabled}
						readOnly={disabled}
					/>
					<ChevronDown
						size={16}
						className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
					/>
				</div>

				{isOpen && !disabled && (
					<div className='absolute top-full left-[-1px] right-[-1px] bg-white border border-t-0 border-black z-[50] max-h-60 overflow-y-auto'>
						{filteredOptions.length > 0 ? (
							filteredOptions.map(opt => {
								const optionValue = getOptionValue(opt)
								const displayValue = getDisplayValue(opt)
								return (
									<div
										key={optionValue}
										onClick={() => {
											onChange(optionValue)
											setIsOpen(false)
											setSearchTerm('')
										}}
										className='flex items-center justify-between px-4 py-3 text-[12px] uppercase tracking-widest hover:bg-black hover:text-white cursor-pointer transition-colors'
									>
										{displayValue}
										{String(value) === optionValue && <Check size={12} />}
									</div>
								)
							})
						) : (
							<div className='px-4 py-3 text-[10px] uppercase text-black/40 text-center'>
								{noMatchesText}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	)
}

const FilterChip = ({ label, onRemove }) => (
	<div className='flex items-center gap-2 px-3 py-1.5 bg-white border border-black/10 rounded-full'>
		<span className='text-[10px] font-bold uppercase'>{label}</span>
		<button
			onClick={onRemove}
			className='hover:text-[#e21e26] transition-colors'
		>
			<X size={12} />
		</button>
	</div>
)

const ProductCard = ({ product }) => (
	<Link
		to={`/product/${product.id}`}
		className='group bg-white border border-black/10 hover:shadow-xl transition-all duration-300 overflow-hidden'
	>
		<div className='aspect-square overflow-hidden bg-gray-100'>
			<img
				src={product.poster || product.image || '/placeholder-image.jpg'}
				alt={product.name}
				className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
				loading='lazy'
				onError={e => {
					e.target.src = '/placeholder-image.jpg'
				}}
			/>
		</div>
		<div className='p-5'>
			<h3 className='text-base font-black uppercase tracking-tight mb-2 line-clamp-2'>
				{product.name}
			</h3>
			{product.price && (
				<p className='text-sm font-bold' style={{ color: brandRed }}>
					${product.price}
				</p>
			)}
			{product.category && (
				<p className='text-[9px] font-black uppercase tracking-wider text-gray-400 mt-2'>
					{product.category}
				</p>
			)}
		</div>
	</Link>
)

export default SearchPage

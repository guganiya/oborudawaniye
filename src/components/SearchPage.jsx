import React, { useState, useRef, useEffect, useCallback } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Search, ChevronDown, Check, Loader2, X } from 'lucide-react'
import apiClient from "../api/api.js"
import {Link} from "react-router-dom";

const PAGE_SIZE = 3
const brandRed = '#e21e26'

const SearchPage = () => {
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

	// Update filters ref
	filtersRef.current = {
		search: mainSearch,
		category: selectedCategory,
		subcategory: selectedSubcategory,
		size: selectedSize,
	}

	// Fetch categories on mount
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await apiClient("/get-product-categories")
				const data = await response.data
				setCategories(data)
			} catch (e) {
				console.error('Error fetching categories:', e)
			}
		}
		fetchCategories()
	}, [])

	// Fetch subcategories when category changes
	useEffect(() => {
		if (!selectedCategory) {
			setSubcategories([])
			setSelectedSubcategory('')
			return
		}

		const fetchSubcategories = async () => {
			try {
				const response = await apiClient.get(`/get-product-subcategories/${selectedCategory}`)
				const data = await response.data
				setSubcategories(data)
				setSelectedSubcategory('') // Reset subcategory when category changes
			} catch (e) {
				console.error('Error fetching subcategories:', e)
				setSubcategories([])
			}
		}
		fetchSubcategories()
	}, [selectedCategory])

	// Fetch sizes
	useEffect(() => {
		const fetchSizes = async () => {
			try {
				const response = await apiClient.get("/sizes")
				const data = await response.data
				setSizes(data)
			} catch (e) {
				console.error('Error fetching sizes:', e)
			}
		}
		fetchSizes()
	}, [])

	// Load products from API
	const loadProducts = useCallback(async (pageNum, filters, append = false) => {
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

			// Add filters
			if (filters.search) {
				params.append('name', filters.search)
			}
			if (filters.category) {
				params.append('category', filters.category)
			}
			if (filters.subcategory) {
				params.append('subcategory', filters.subcategory)
			}
			if (filters.size) {
				params.append('size', filters.size)
			}

			const url = `/products?${params.toString()}`


			const response = await apiClient.get(url, {
				signal: abortControllerRef.current.signal
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

	// Load products when filters change
	useEffect(() => {
		setPage(1)
		setHasMore(true)
		setProducts([])
		loadProducts(1, filtersRef.current, false)
	}, [mainSearch, selectedCategory, selectedSubcategory, selectedSize])

	// Setup infinite scroll observer
	useEffect(() => {
		if (observerRef.current) {
			observerRef.current.disconnect()
		}

		observerRef.current = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && hasMoreRef.current && !busyRef.current && !loading && !loadingMore) {
					const nextPage = pageRef.current + 1
					setPage(nextPage)
					loadProducts(nextPage, filtersRef.current, true)
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
	}, [loadProducts, loading, loadingMore])

	// Clear all filters
	const clearFilters = () => {
		setMainSearch('')
		setSelectedCategory('')
		setSelectedSubcategory('')
		setSelectedSize('')
	}

	// Check if any filters are active
	const hasActiveFilters = mainSearch || selectedCategory || selectedSubcategory || selectedSize

	return (
		<div className='min-h-screen flex flex-col bg-white overflow-hidden text-black'>
			<Navbar />

			<main className='flex-grow pt-32 md:pt-48 pb-20 px-6'>
				<div className='relative max-w-[1200px] mx-auto z-10'>
					{/* Header with background text */}
					<div className='relative mb-20 md:mb-32'>
						<div className='absolute -top-12 md:-top-24 right-0 md:right-0 opacity-[0.04] pointer-events-none -z-10'>
							<span className='text-[7rem] md:text-[22rem] font-black uppercase leading-none select-none whitespace-nowrap'>
								Search
							</span>
						</div>
						<h1 className='relative text-5xl md:text-8xl font-bold uppercase tracking-tighter'>
							Explore <span style={{ color: brandRed }}>.</span>
						</h1>
					</div>

					{/* Global Search */}
					<div className='relative mb-20 group'>
						<div className='absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none text-black'>
							<Search size={28} strokeWidth={1.5} />
						</div>
						<input
							type='text'
							placeholder='WHAT ARE YOU LOOKING FOR?'
							value={mainSearch}
							onChange={e => setMainSearch(e.target.value)}
							className='w-full text-2xl md:text-4xl font-light border-b-2 border-black pl-12 md:pl-16 py-6 focus:outline-none placeholder:text-[#e21e26]'
						/>
					</div>

					{/* Filter Grid */}
					<div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-16'>
						<SmartSelect
							label='01. Category'
							options={categories}
							value={selectedCategory}
							onChange={setSelectedCategory}
							displayKey="name"
							valueKey="id"
						/>
						<SmartSelect
							label='02. Subcategory'
							options={subcategories}
							value={selectedSubcategory}
							onChange={setSelectedSubcategory}
							displayKey="name"
							valueKey="id"
							disabled={!selectedCategory}
						/>
						<SmartSelect
							label='03. Size'
							options={sizes}
							value={selectedSize}
							onChange={setSelectedSize}
							displayKey="name"
							valueKey="id"
						/>
					</div>

					{/* Active Filters Display */}
					{hasActiveFilters && (
						<div className='mb-8 flex flex-wrap gap-2 items-center'>
							<span className='text-[9px] font-black uppercase tracking-[0.15em] text-gray-400'>
								Active filters:
							</span>
							{mainSearch && (
								<FilterChip
									label={`Search: ${mainSearch}`}
									onRemove={() => setMainSearch('')}
								/>
							)}
							{selectedCategory && (
								<FilterChip
									label={`Category: ${categories.find(c => String(c.id) === String(selectedCategory))?.name || selectedCategory}`}
									onRemove={() => setSelectedCategory('')}
								/>
							)}
							{selectedSubcategory && (
								<FilterChip
									label={`Subcategory: ${subcategories.find(s => String(s.id) === String(selectedSubcategory))?.name || selectedSubcategory}`}
									onRemove={() => setSelectedSubcategory('')}
								/>
							)}
							{selectedSize && (
								<FilterChip
									label={`Size: ${sizes.find(s => String(s.id) === String(selectedSize))?.name || selectedSize}`}
									onRemove={() => setSelectedSize('')}
								/>
							)}
							<button
								onClick={clearFilters}
								className='text-[9px] font-black uppercase tracking-[0.15em] text-gray-400 hover:text-[#e21e26] transition-colors ml-2'
							>
								Clear all
							</button>
						</div>
					)}

					{/* Results Section */}
					<div className='border-t border-black pt-12 min-h-[300px]'>
						{loading ? (
							<div className='flex flex-col items-center justify-center py-20 gap-4'>
								<Loader2 className='animate-spin' style={{ color: brandRed }} size={34} />
								<p className='text-[10px] font-black uppercase tracking-[0.3em] text-gray-400'>
									Loading products...
								</p>
							</div>
						) : products.length === 0 ? (
							<div className='flex flex-col items-center justify-center py-20 text-center'>
								<Search size={48} strokeWidth={1} className='mx-auto mb-4 opacity-30' />
								<p className='text-[11px] uppercase tracking-[0.4em] text-gray-400'>
									{hasActiveFilters ? 'No products found' : 'Awaiting specific parameters'}
								</p>
								{hasActiveFilters && (
									<button
										onClick={clearFilters}
										className='mt-6 px-6 py-3 bg-white border border-black/10 text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300 rounded-full'
									>
										Clear filters
									</button>
								)}
							</div>
						) : (
							<>
								{/* Products Grid */}
								<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
									{products.map((product) => (
										<ProductCard key={product.id} product={product} />
									))}
								</div>

								{/* Sentinel for infinite scroll */}
								<div ref={sentinelRef} className='h-2 mt-6' aria-hidden='true' />

								{loadingMore && (
									<div className='flex items-center justify-center py-10 gap-3'>
										<Loader2 className='animate-spin' style={{ color: brandRed }} size={22} />
										<p className='text-[9px] font-black uppercase tracking-[0.3em] text-gray-400'>
											Loading more...
										</p>
									</div>
								)}

								{!hasMore && !loadingMore && products.length > 0 && (
									<div className='flex items-center gap-6 py-12'>
										<div className='flex-1 h-px bg-black/10' />
										<p className='text-[9px] font-black uppercase tracking-[0.3em] text-gray-400'>
											All loaded ({total} products)
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

// SmartSelect Component
const SmartSelect = ({ label, options, value, onChange, displayKey = 'name', valueKey = 'id', disabled = false }) => {
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

	const getDisplayValue = (item) => {
		if (typeof item === 'object') {
			return item[displayKey]
		}
		return item
	}

	const getOptionValue = (item) => {
		if (typeof item === 'object') {
			return String(item[valueKey])
		}
		return String(item)
	}

	const filteredOptions = options.filter(opt =>
		getDisplayValue(opt).toLowerCase().includes(searchTerm.toLowerCase())
	)

	const selectedLabel = value ?
		options.find(opt => getOptionValue(opt) === String(value)) : null

	return (
		<div className={`flex flex-col gap-2 group ${disabled ? 'opacity-50' : ''}`} ref={wrapperRef}>
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
						placeholder={selectedLabel ? getDisplayValue(selectedLabel) : 'Select...'}
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
								No matches
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	)
}

// Filter Chip Component
const FilterChip = ({ label, onRemove }) => (
	<div className='flex items-center gap-2 px-3 py-1.5 bg-white border border-black/10 rounded-full'>
		<span className='text-[10px] font-bold uppercase'>{label}</span>
		<button onClick={onRemove} className='hover:text-[#e21e26] transition-colors'>
			<X size={12} />
		</button>
	</div>
)

// Product Card Component
const ProductCard = ({ product }) => (
	<Link to={`/product/${product.id}`} className='group bg-white border border-black/10 hover:shadow-xl transition-all duration-300 overflow-hidden'>
		<div className='aspect-square overflow-hidden bg-gray-100'>
			<img
				src={product.poster || product.image || '/placeholder-image.jpg'}
				alt={product.name}
				className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
				loading='lazy'
				onError={(e) => {
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
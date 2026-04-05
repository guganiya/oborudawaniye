import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Search, ArrowRight, Loader2 } from 'lucide-react'

// ─── Константы ────────────────────────────────────────────────────────────────
const PAGE_SIZE = 25
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

// ─── Тестовые данные ───────────────────────────────────────────
const ALL_MOCK_DATA = (() => {
	const titles = [
		'Robe iFORTE LTX & Anolis at Disney On Ice show in Paris',
		'Innovation in RoboSpot Systems: Technical Update 1.4',
		'Chameleon Touring Systems Invests in 50 iFORTE LTX Units',
		'Light + Building 2026: The Ultimate Lighting Exhibition Recap',
		'New Firmware Released for BMFL Series — Version 3.8',
		'Robe Steals the Show at Eurovision Song Contest 2026',
		'LEDBeam 350 Wins Best Product Award at PLASA 2025',
		'MegaPointe Enters Rider of Major European Arena Tours',
		'Robe Lighting at Coachella Valley Music and Arts Festival',
		'Strategic Partnership Signed with Rent-All International',
	]
	const descriptions = [
		'State-of-the-art lighting technology transforms live spectacle.',
		'New technical update improves stability and adds features.',
		'Leading rental company expands inventory with flagship units.',
		'Façade solutions redefining the boundaries of modern architecture.',
	]
	const products = [
		'iFORTE LTX',
		'RoboSpot',
		'Anolis',
		'BMFL',
		'MegaPointe',
		'LEDBeam',
		'Spiider',
		'T2',
	]
	const topics = [
		'Театр',
		'Техподдержка',
		'Закупки',
		'Выставки',
		'Концерты',
		'Архитектура',
		'Партнёрство',
	]
	const years = ['2024', '2025', '2026']
	const images = [
		'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000',
		'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=900',
		'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=900',
		'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1000',
	]

	return Array.from({ length: 100 }, (_, i) => ({
		id: i + 1,
		title: titles[i % titles.length],
		description: descriptions[i % descriptions.length],
		product: products[i % products.length],
		topic: topics[i % topics.length],
		year: years[i % years.length],
		image: (i + 1) % 5 === 0 ? null : images[i % images.length],
	}))
})()

// ─── Имитация API ──────────────────────────────────────────────────────────────
async function apiFetchNews({ page, size, filters }) {
	await new Promise(r => setTimeout(r, 700))
	const filtered = ALL_MOCK_DATA.filter(
		item =>
			(filters.product === 'Все продукты' ||
				item.product === filters.product) &&
			(filters.topic === 'Все темы' || item.topic === filters.topic) &&
			(filters.year === 'Все годы' || item.year === filters.year),
	)
	const start = (page - 1) * size
	return { items: filtered.slice(start, start + size), total: filtered.length }
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
				{item.topic}
			</div>

			<div className='p-6 flex flex-col h-full justify-between'>
				<div>
					<p className='text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 mb-3'>
						{item.year}
					</p>
					<span
						className='block font-black uppercase leading-none mb-3 tracking-tight'
						style={{ fontSize: span >= 5 ? '2rem' : '1.5rem', color: '#111' }}
					>
						{item.product}
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
					src={item.image}
					alt={item.title}
					loading='lazy'
					className='w-full h-full object-cover md:grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105'
				/>
				<div className='absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/25 to-transparent pointer-events-none' />
				<div
					className='absolute top-0 right-0 text-white px-4 py-1.5 text-[9px] font-black uppercase tracking-widest'
					style={{ backgroundColor: brandRed }}
				>
					{item.topic}
				</div>
			</div>

			<div className='p-5 flex-grow flex flex-col'>
				<span
					className='text-[10px] font-black uppercase tracking-[0.15em] mb-2 block'
					style={{ color: brandRed }}
				>
					{item.year} · {item.product}
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
						{item.description}
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
	item.image ? (
		<ImageCard item={item} span={span} delay={delay} />
	) : (
		<TextCard item={item} span={span} delay={delay} />
	)

const News = () => {
	const [items, setItems] = useState([])
	const [loading, setLoading] = useState(true)
	const [loadingMore, setLoadingMore] = useState(false)
	const [hasMore, setHasMore] = useState(true)
	const [total, setTotal] = useState(0)
	const [page, setPage] = useState(1)
	const [activeFilters, setActiveFilters] = useState({
		product: 'Все продукты',
		topic: 'Все темы',
		year: 'Все годы',
	})

	const sentinelRef = useRef(null)
	const observerRef = useRef(null)
	const pageRef = useRef(1)
	const filtersRef = useRef(activeFilters)
	const hasMoreRef = useRef(true)
	const busyRef = useRef(false)

	pageRef.current = page
	filtersRef.current = activeFilters
	hasMoreRef.current = hasMore

	const loadPage = useCallback(async (pageNum, filters, append) => {
		if (busyRef.current) return
		busyRef.current = true
		if (!append) setLoading(true)
		else setLoadingMore(true)
		try {
			const { items: newItems, total: newTotal } = await apiFetchNews({
				page: pageNum,
				size: PAGE_SIZE,
				filters,
			})
			setTotal(newTotal)
			setHasMore(pageNum * PAGE_SIZE < newTotal)
			if (append) setItems(prev => [...prev, ...newItems])
			else setItems(newItems)
		} catch (err) {
			console.error('News fetch error:', err)
		} finally {
			setLoading(false)
			setLoadingMore(false)
			busyRef.current = false
		}
	}, [])

	useEffect(() => {
		setPage(1)
		setHasMore(true)
		loadPage(1, activeFilters, false)
	}, [activeFilters, loadPage])

	useEffect(() => {
		observerRef.current?.disconnect()
		observerRef.current = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && hasMoreRef.current && !busyRef.current) {
					const next = pageRef.current + 1
					setPage(next)
					loadPage(next, filtersRef.current, true)
				}
			},
			{ rootMargin: '250px' },
		)
		if (sentinelRef.current) observerRef.current.observe(sentinelRef.current)
		return () => observerRef.current?.disconnect()
	}, [loadPage])

	const getSpan = index => GRID_PATTERN[index % GRID_PATTERN.length]

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
						{[
							{
								key: 'product',
								label: 'Продукты',
								defaultVal: 'Все продукты',
								options: [
									'iFORTE LTX',
									'RoboSpot',
									'Anolis',
									'BMFL',
									'MegaPointe',
									'LEDBeam',
								],
							},
							{
								key: 'topic',
								label: 'Тема',
								defaultVal: 'Все темы',
								options: [
									'Театр',
									'Техподдержка',
									'Закупки',
									'Выставки',
									'Концерты',
									'Архитектура',
								],
							},
							{
								key: 'year',
								label: 'Год',
								defaultVal: 'Все годы',
								options: ['2024', '2025', '2026'],
							},
						].map(({ key, label, defaultVal, options }) => (
							<div key={key} className='space-y-3'>
								<label className='text-[10px] font-black uppercase tracking-[0.2em] text-gray-400'>
									{label}
								</label>
								<div className='relative'>
									<select
										value={activeFilters[key]}
										onChange={e =>
											setActiveFilters(prev => ({
												...prev,
												[key]: e.target.value,
											}))
										}
										className='w-full bg-white border border-black/10 px-6 py-4 text-xs font-bold uppercase tracking-widest outline-none appearance-none cursor-pointer focus:border-black rounded-xl shadow-inner transition-colors'
									>
										<option value={defaultVal}>{defaultVal}</option>
										{options.map(o => (
											<option key={o} value={o}>
												{o}
											</option>
										))}
									</select>
									<Search
										size={14}
										className='absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400'
									/>
								</div>
							</div>
						))}
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
					<div className='flex items-center justify-center py-40'>
						<p className='text-[10px] font-black uppercase tracking-[0.3em] text-gray-400'>
							Ничего не найдено
						</p>
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
						{!hasMore && !loadingMore && (
							<div className='flex items-center gap-6 py-12'>
								<div className='flex-1 h-px bg-black/10' />
								<p className='text-[9px] font-black uppercase tracking-[0.3em] text-gray-400'>
									Все загружено
								</p>
								<div className='flex-1 h-px bg-black/10' />
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

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Search, X, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next' // Добавлено
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import apiClient from '../api/api'

const Products = () => {
	const { t, i18n } = useTranslation() // Добавлено
	const [items, setItems] = useState([])
	const [searchTerm, setSearchTerm] = useState('')
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	// Хелпер для получения имени категории на текущем языке
	const getCategoryName = item => {
		const lang = i18n.language
		if (lang === 'en' && item.name_en) return item.name_en
		if (lang === 'tk' && item.name_tk) return item.name_tk
		return item.name_ru || item.name
	}

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				setLoading(true)
				const response = await apiClient.get('/get-product-categories')
				setItems(response.data)
				setError(null)
			} catch (err) {
				console.error('Failed to fetch product categories:', err)
				setError(t('catalog_error_fetch'))
			} finally {
				setLoading(false)
			}
		}

		fetchCategories()
	}, [t])

	// Фильтрация теперь учитывает локализованное имя
	const filteredItems = items.filter(item =>
		getCategoryName(item).toLowerCase().includes(searchTerm.toLowerCase()),
	)

	return (
		<div className='bg-white min-h-screen font-sans selection:bg-[#e21e26] selection:text-white'>
			<Navbar />

			{/* Минималистичная шапка */}
			<header className='relative pt-52 pb-20 px-6 overflow-hidden bg-black'>
				{/* 1. ГРАДИЕНТНЫЙ ФОН */}
				<div
					className='absolute inset-0 z-0'
					style={{
						background:
							'linear-gradient(to left, rgba(226, 30, 38, 0.15) 0%, rgba(0, 0, 0, 1) 70%)',
					}}
				/>

				{/* 2. ДОБАВЬ ЭТОТ БЛОК (ФОНОВЫЙ ТЕКСТ) */}
				<div className='absolute inset-0 z-0 opacity-[0.05] pointer-events-none select-none overflow-hidden'>
					<span className='absolute -bottom-10 -left-10 text-[12rem] md:text-[20rem] font-black uppercase leading-none text-white italic'>
						{t('catalog_bg_text')}
					</span>
				</div>

				{/* 3. ДОПОЛНИТЕЛЬНОЕ СВЕЧЕНИЕ */}
				<div className='absolute top-1/2 right-[-10%] -translate-y-1/2 w-[600px] h-[600px] bg-[#e21e26]/20 blur-[150px] rounded-full pointer-events-none' />

				<div className='max-w-[1400px] mx-auto relative z-10 flex flex-col gap-6'>
					<motion.h1
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8 }}
						className='text-7xl md:text-[10rem] font-[1000] uppercase tracking-tighter leading-[0.85] text-white italic'
					>
						{t('catalog_title')}
					</motion.h1>

					<div className='flex flex-col md:flex-row md:items-center justify-between border-t border-white/10 pt-10 gap-8'>
						<div className='flex flex-col gap-2'>
							<p className='text-gray-400 text-sm font-bold uppercase tracking-widest'>
								{t('catalog_subtitle')}
							</p>
						</div>

						<div className='relative w-full md:w-1/2 lg:w-1/3 group'>
							<div className='absolute -inset-1 bg-gradient-to-r from-[#e21e26]/50 to-transparent rounded-full blur opacity-25 group-focus-within:opacity-100 transition duration-500' />

							<div className='relative'>
								<input
									type='text'
									className='w-full bg-white/5 border border-white/10 backdrop-blur-xl p-4 rounded-full text-white px-14 focus:border-[#e21e26] transition-all outline-none placeholder:text-gray-500'
									placeholder={t('catalog_search_placeholder')}
									value={searchTerm}
									onChange={e => setSearchTerm(e.target.value)}
								/>
								<Search
									className='absolute left-5 top-1/2 -translate-y-1/2 text-[#e21e26]'
									size={20}
								/>

								{searchTerm && (
									<X
										onClick={() => setSearchTerm('')}
										className='absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer transition-colors'
										size={18}
									/>
								)}
							</div>
						</div>
					</div>
				</div>

				<div className='absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent' />
			</header>
			<main className='max-w-[1400px] mx-auto px-6 pb-32'>
				<div className='h-[1px] w-full bg-gray-100 mb-20' />

				{loading ? (
					<div className='flex flex-col items-center justify-center py-20 gap-4'>
						<Loader2 className='animate-spin text-[#e21e26]' size={40} />
					</div>
				) : error ? (
					<div className='text-center py-20'>
						<p className='text-red-500 font-bold uppercase tracking-widest'>
							{error}
						</p>
					</div>
				) : (
					<>
						{filteredItems.length > 0 ? (
							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16'>
								<AnimatePresence mode='popLayout'>
									{filteredItems.map((category, index) => (
										<ProductCard
											key={category.id}
											category={category}
											index={index}
											getCategoryName={getCategoryName}
										/>
									))}
								</AnimatePresence>
							</div>
						) : (
							<div className='text-center py-40'>
								<p className='text-gray-300 text-[10px] font-black uppercase tracking-[0.4em]'>
									{t('catalog_no_results')} "{searchTerm}"
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

const ProductCard = ({ category, index, getCategoryName }) => {
	const { t } = useTranslation()
	return (
		<motion.div
			layout
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0, scale: 0.95 }}
			transition={{ duration: 0.4 }}
			className='group'
		>
			<Link to={`/subcategory/${category.id}`} className='block no-underline'>
				<div className='relative aspect-[3/4] overflow-hidden bg-[#f9f9f9] mb-6'>
					<img
						src={category.poster}
						alt={getCategoryName(category)}
						className='w-full h-full object-cover transition-all duration-700 md:grayscale group-hover:grayscale-0 group-hover:scale-105'
					/>
					<div className='absolute bottom-4 left-4'>
						<span className='bg-black text-white text-[7px] font-black uppercase px-2 py-1 tracking-widest'>
							{t('catalog_card_tag')}
						</span>
					</div>
				</div>

				<div className='flex flex-col'>
					<div className='flex justify-between items-start mb-2'>
						<h3 className='text-black text-lg font-black uppercase tracking-tighter leading-tight group-hover:text-[#e21e26] transition-colors duration-300'>
							{getCategoryName(category)}
						</h3>
						<ArrowRight
							size={16}
							className='opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#e21e26]'
						/>
					</div>
					<p className='text-gray-400 text-[11px] font-medium leading-relaxed'>
						{t('catalog_card_desc')}
					</p>
				</div>
			</Link>
		</motion.div>
	)
}

export default Products

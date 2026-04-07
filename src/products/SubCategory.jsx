import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, ChevronRight, Search, X } from 'lucide-react'
import { useTranslation } from 'react-i18next' // Добавлено
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import apiClient from '../api/api'

const SubCategory = () => {
	const { categoryId } = useParams()
	const navigate = useNavigate()
	const { t, i18n } = useTranslation() // Добавлено
	const [subcategories, setSubcategories] = useState([])
	const [searchTerm, setSearchTerm] = useState('')
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	// Хелпер для получения локализованного имени
	const getLocalizedName = (item, fieldBase = 'name') => {
		const lang = i18n.language
		if (lang === 'en' && item[`${fieldBase}_en`]) return item[`${fieldBase}_en`]
		if (lang === 'tk' && item[`${fieldBase}_tk`]) return item[`${fieldBase}_tk`]
		return item[`${fieldBase}_ru`] || item[fieldBase]
	}

	useEffect(() => {
		const fetchSubcategories = async () => {
			try {
				setLoading(true)
				const response = await apiClient.get(
					`/get-product-subcategories/${categoryId}`,
				)
				setSubcategories(response.data)
				setError(null)
			} catch (err) {
				console.error('Error fetching subcategories:', err)
				setError(t('subcat_error_fetch'))
			} finally {
				setLoading(false)
			}
		}

		if (categoryId) fetchSubcategories()
	}, [categoryId, t])

	const filteredItems = subcategories.filter(item =>
		getLocalizedName(item).toLowerCase().includes(searchTerm.toLowerCase()),
	)

	// Получаем имя родительской категории (учитывая локализацию поля category)
	// В Django обычно передается либо ID, либо строка. Если там объект или строка с переводами:
	const parentCategoryName =
		subcategories.length > 0
			? getLocalizedName(subcategories[0], 'category')
			: t('subcat_default_parent')

	return (
		<div className='bg-white min-h-screen font-sans selection:bg-[#e21e26] selection:text-white'>
			<Navbar />

			<main className='max-w-[1400px] mx-auto px-6 pt-44 pb-32'>
				<div className='flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 border-b border-gray-100 pb-8'>
					<nav className='flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400'>
						<Link to='/products' className='hover:text-black transition-colors'>
							{t('subcat_breadcrumb_catalog')}
						</Link>
						<ChevronRight size={12} />
						<span className='text-[#e21e26]'>{parentCategoryName}</span>
					</nav>

					<div className='flex flex-col md:flex-row items-center gap-6 md:gap-12'>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className='relative w-full md:w-80 group'
						>
							<input
								type='text'
								placeholder={t('subcat_search_placeholder')}
								value={searchTerm}
								onChange={e => setSearchTerm(e.target.value)}
								className='w-full bg-transparent border border-black p-3 pr-10 text-[11px] font-black uppercase tracking-widest focus:border-[#e21e26] transition-all outline-none placeholder:text-gray-300 rounded-2xl'
							/>
							<div className='absolute right-2 top-1/2 -translate-y-1/2 flex items-center'>
								{searchTerm ? (
									<X
										size={16}
										className='cursor-pointer text-gray-400 hover:text-black'
										onClick={() => setSearchTerm('')}
									/>
								) : (
									<Search
										size={16}
										className='text-gray-300 group-focus-within:text-[#e21e26]'
									/>
								)}
							</div>
						</motion.div>
					</div>
				</div>

				<div className='mb-20'>
					<motion.h1
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						className='text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-none'
					>
						{parentCategoryName}
						<span className='text-[#e21e26]'>.</span>
					</motion.h1>
					<p className='text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] mt-4'>
						{t('subcat_subtitle')}
					</p>
				</div>

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
									{filteredItems.map(sub => (
										<motion.div
											key={sub.id}
											layout
											initial={{ opacity: 0, scale: 0.9 }}
											animate={{ opacity: 1, scale: 1 }}
											exit={{ opacity: 0, scale: 0.9 }}
											transition={{ duration: 0.4 }}
											className='group'
										>
											<Link to={`/products/${sub.id}`} className='block'>
												<div className='relative aspect-[3/4] bg-[#f9f9f9] overflow-hidden mb-6'>
													<img
														src={sub.poster}
														className='w-full h-full object-cover md:grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700'
														alt={getLocalizedName(sub)}
													/>
													<div className='absolute bottom-4 left-4'>
														<span className='bg-black text-white text-[7px] font-black uppercase px-2 py-1 tracking-widest'>
															{t('subcat_card_tag')}
														</span>
													</div>
												</div>
												<h3 className='text-xl font-black uppercase tracking-tighter group-hover:text-[#e21e26] transition-colors'>
													{getLocalizedName(sub)}
												</h3>
												<p className='text-gray-400 text-[11px] font-medium mt-2 leading-relaxed'>
													{t('subcat_card_desc')} {getLocalizedName(sub)}
												</p>
											</Link>
										</motion.div>
									))}
								</AnimatePresence>
							</div>
						) : (
							<div className='text-center py-40 border-t border-gray-50'>
								<p className='text-gray-300 text-[10px] font-black uppercase tracking-[0.4em]'>
									{t('subcat_no_results')} "{searchTerm}"
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

export default SubCategory

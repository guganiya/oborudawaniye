import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, ArrowLeft, ChevronRight, Search, X } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const SubCategory = () => {
	const { categoryId } = useParams()
	const navigate = useNavigate()
	const [items, setItems] = useState([])
	const [searchTerm, setSearchTerm] = useState('')
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true)
			// Имитация загрузки данных подкатегории
			await new Promise(r => setTimeout(r, 600))
			setItems([
				{
					id: 1,
					title: 'FORTE® LTX',
					category: 'Moving Lights',
					image:
						'https://images.unsplash.com/photo-1545127398-14699f92334b?q=80&w=1000',
					desc: 'High performance LED Wash',
				},
				{
					id: 2,
					title: 'ESPRITE®',
					category: 'Moving Lights',
					image:
						'https://images.unsplash.com/photo-1514306191717-452ec28c7814?q=80&w=1000',
					desc: 'Transferable Engine technology',
				},
				{
					id: 3,
					title: 'PAINTE®',
					category: 'Moving Lights',
					image:
						'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000',
					desc: 'Compact profile solution',
				},
			])
			setLoading(false)
		}
		fetchData()
	}, [categoryId])

	// Фильтрация внутри подкатегории
	const filteredItems = items.filter(item =>
		item.title.toLowerCase().includes(searchTerm.toLowerCase()),
	)

	return (
		<div className='bg-white min-h-screen font-sans selection:bg-[#e21e26] selection:text-white'>
			<Navbar />

			<main className='max-w-[1400px] mx-auto px-6 pt-44 pb-32'>
				{/* ВЕРХНЯЯ ПАНЕЛЬ: Навигация + Поиск + Назад */}
				<div className='flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 border-b border-gray-100 pb-8'>
					{/* Левая часть: Хлебные крошки */}
					<nav className='flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400'>
						<Link to='/products' className='hover:text-black transition-colors'>
							Catalog
						</Link>
						<ChevronRight size={12} />
						<span className='text-[#e21e26]'>
							{categoryId?.replace('-', ' ')}
						</span>
					</nav>

					{/* Правая часть: Поиск и Кнопка */}
					<div className='flex flex-col md:flex-row items-center gap-6 md:gap-12'>
						{/* ПОИСК */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className='relative w-full md:w-80 group'
						>
							<input
								type='text'
								placeholder='Поиск по категории...'
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

				{/* ЗАГОЛОВОК */}
				<div className='mb-20'>
					<motion.h1
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						className='text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-none'
					>
						{categoryId?.replace('-', ' ')}
						<span className='text-[#e21e26]'>.</span>
					</motion.h1>
				</div>

				{/* СЕТКА ТОВАРОВ */}
				{loading ? (
					<div className='flex flex-col items-center justify-center py-20 gap-4'>
						<Loader2 className='animate-spin text-[#e21e26]' size={40} />
					</div>
				) : (
					<>
						{filteredItems.length > 0 ? (
							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16'>
								<AnimatePresence mode='popLayout'>
									{filteredItems.map((item, idx) => (
										<motion.div
											key={item.id}
											layout
											initial={{ opacity: 0, scale: 0.9 }}
											animate={{ opacity: 1, scale: 1 }}
											exit={{ opacity: 0, scale: 0.9 }}
											transition={{ duration: 0.4 }}
											className='group'
										>
											<Link to={`/products/${item.id}`} className='block'>
												<div className='relative aspect-[3/4] bg-[#f9f9f9] overflow-hidden mb-6'>
													<img
														src={item.image}
														className='w-full h-full object-cover md:grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700'
														alt={item.title}
													/>
												</div>
												<h3 className='text-xl font-black uppercase tracking-tighter group-hover:text-[#e21e26] transition-colors'>
													{item.title}
												</h3>
												<p className='text-gray-400 text-[11px] font-medium mt-2 leading-relaxed line-clamp-2'>
													{item.desc}
												</p>
											</Link>
										</motion.div>
									))}
								</AnimatePresence>
							</div>
						) : (
							<div className='text-center py-40 border-t border-gray-50'>
								<p className='text-gray-300 text-[10px] font-black uppercase tracking-[0.4em]'>
									Модель "{searchTerm}" не найдена в этой секции
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

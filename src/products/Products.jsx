import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Search, X, ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// ─── Тестовые данные ────────────────────────────────────────────────────────
const MOCK_PRODUCTS = [
	{
		id: 'i-forte-ltx',
		title: 'iFORTE® LTX',
		category: 'Moving Heads',
		image:
			'https://images.unsplash.com/photo-1545127398-14699f92334b?q=80&w=1000',
		description:
			'Самый мощный светодиодный прибор с подвижной головой для работы на больших дистанциях.',
	},
	{
		id: 't11-profile',
		title: 'T11 Profile™',
		category: 'Static Lights',
		image:
			'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1000',
		description:
			'Идеальное решение для театров и студий с уникальной системой смены линз MSL™.',
	},
	{
		id: 'ledbeam-350',
		title: 'LEDBeam 350™',
		category: 'Wash',
		image:
			'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000',
		description:
			'Компактный, быстрый и мощный прибор, ставший индустриальным стандартом.',
	},
	{
		id: 'esprite',
		title: 'ESPRITE®',
		category: 'Moving Heads',
		image:
			'https://images.unsplash.com/photo-1514306191717-452ec28c7814?q=80&w=1000',
		description:
			'Первый в мире прибор со сменным светодиодным модулем TE™ (Transferable Engine).',
	},
]

const Products = () => {
	const [items, setItems] = useState([])
	const [searchTerm, setSearchTerm] = useState('')
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true)
			await new Promise(r => setTimeout(r, 800))
			setItems(MOCK_PRODUCTS)
			setLoading(false)
		}
		fetchData()
	}, [])

	const filteredItems = items.filter(
		item =>
			item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			item.category.toLowerCase().includes(searchTerm.toLowerCase()),
	)

	return (
		<div className='bg-white min-h-screen font-sans selection:bg-[#e21e26] selection:text-white'>
			<Navbar />

			{/* Минималистичная шапка */}
			<header className='relative pt-44 pb-12 px-6 overflow-hidden'>
				<div className='absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden'>
					<span className='absolute -bottom-10 -left-10 text-[12rem] md:text-[20rem] font-black uppercase leading-none'>
						Catalog
					</span>
				</div>

				<div className='max-w-[1400px] mx-auto relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8'>
					<div className='max-w-2xl'>
						<motion.h1
							initial={{ opacity: 0, x: -30 }}
							animate={{ opacity: 1, x: 0 }}
							className='text-5xl md:text-8xl font-black uppercase tracking-[ -0.05em] leading-none mb-4 italic'
						>
							Каталог<span className='text-[#e21e26] '>.</span>
						</motion.h1>
						<motion.p
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.2 }}
							className='text-gray-400 text-xs font-bold uppercase tracking-[0.2em]'
						>
							Профессиональное световое оборудование
						</motion.p>
					</div>

					{/* ПОИСК ПЕРЕНЕСЕН СЮДА (Справа вверху контента) */}
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
			</header>

			<main className='max-w-[1400px] mx-auto px-6 pb-32'>
				<div className='h-[1px] w-full bg-gray-100 mb-20' />

				{loading ? (
					<div className='flex flex-col items-center justify-center py-20 gap-4'>
						<Loader2 className='animate-spin text-[#e21e26]' size={40} />
					</div>
				) : (
					<>
						{filteredItems.length > 0 ? (
							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16'>
								<AnimatePresence mode='popLayout'>
									{filteredItems.map((product, index) => (
										<ProductCard
											key={product.id}
											product={product}
											index={index}
										/>
									))}
								</AnimatePresence>
							</div>
						) : (
							<div className='text-center py-40'>
								<p className='text-gray-300 text-[10px] font-black uppercase tracking-[0.4em]'>
									Нет результатов для "{searchTerm}"
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

const ProductCard = ({ product, index }) => (
	<motion.div
		layout
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		exit={{ opacity: 0, scale: 0.95 }}
		transition={{ duration: 0.4 }}
		className='group'
	>
		<Link to={`/products/${product.id}`} className='block no-underline'>
			<div className='relative aspect-[3/4] overflow-hidden bg-[#f9f9f9] mb-6'>
				<img
					src={product.image}
					alt={product.title}
					className='w-full h-full object-cover transition-all duration-700 md:grayscale group-hover:grayscale-0 group-hover:scale-105'
				/>
				<div className='absolute bottom-4 left-4'>
					<span className='bg-black text-white text-[7px] font-black uppercase px-2 py-1 tracking-widest'>
						{product.category}
					</span>
				</div>
			</div>

			<div className='flex flex-col'>
				<div className='flex justify-between items-start mb-2'>
					<h3 className='text-black text-lg font-black uppercase tracking-tighter leading-tight group-hover:text-[#e21e26] transition-colors duration-300'>
						{product.title}
					</h3>
					<ArrowRight
						size={16}
						className='opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#e21e26]'
					/>
				</div>
				<p className='text-gray-400 text-[11px] font-medium leading-relaxed line-clamp-2'>
					{product.description}
				</p>
			</div>
		</Link>
	</motion.div>
)

export default Products

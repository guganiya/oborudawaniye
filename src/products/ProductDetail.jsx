import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
	Loader2,
	ArrowLeft,
	Download,
	Ruler,
	Zap,
	ShieldCheck,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const ProductDetail = () => {
	const { productId } = useParams()
	const navigate = useNavigate()
	const [product, setProduct] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchProduct = async () => {
			setLoading(true)
			// Имитация запроса к API
			await new Promise(r => setTimeout(r, 800))

			// Моковые данные одного товара
			const mockData = {
				id: productId,
				title: 'iFORTE® LTX',
				category: 'Moving Heads',
				image:
					'https://images.unsplash.com/photo-1545127398-14699f92334b?q=80&w=1000',
				description:
					'iFORTE® LTX WB — это самый мощный светодиодный прибор с подвижной головой на рынке, разработанный специально для работы на стадионах и аренах.',
				features: [
					{
						icon: <Zap size={20} />,
						label: 'Источник',
						value: '1000W White LED Engine',
					},
					{ icon: <Ruler size={20} />, label: 'Зум', value: '3.5° - 55°' },
					{
						icon: <ShieldCheck size={20} />,
						label: 'Защита',
						value: 'IP65 Rated',
					},
				],
				specs: {
					'Световой поток': '113.000 lm',
					Цветосмешение: 'CMY + CTO',
					Вес: '45 кг',
					Гобо: '2 колеса (6+6)',
				},
			}
			setProduct(mockData)
			setLoading(false)
		}
		fetchProduct()
	}, [productId])

	if (loading) {
		return (
			<div className='h-screen flex items-center justify-center bg-white'>
				<Loader2 className='animate-spin text-[#e21e26]' size={40} />
			</div>
		)
	}

	return (
		<div className='bg-white min-h-screen font-sans selection:bg-[#e21e26] selection:text-white'>
			<Navbar />

			<main className='max-w-[1400px] mx-auto px-6 pt-32 pb-32'>
				{/* Кнопка Назад */}
				<button
					onClick={() => navigate(-1)}
					className='flex items-center gap-3 text-[10px] font-black uppercase tracking-widest mb-12 group'
				>
					<div className='w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all'>
						<ArrowLeft size={16} />
					</div>
					Назад в каталог
				</button>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-start'>
					{/* ЛЕВАЯ КОЛОНКА: Изображение */}
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						className='relative aspect-[4/5] bg-[#f9f9f9] overflow-hidden group'
					>
						<img
							src={product.image}
							alt={product.title}
							className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000'
						/>
						<div className='absolute top-8 left-8'>
							<span className='bg-black text-white text-[10px] font-black uppercase px-4 py-2 tracking-widest'>
								{product.category}
							</span>
						</div>
					</motion.div>

					{/* ПРАВАЯ КОЛОНКА: Инфо */}
					<div className='flex flex-col'>
						<motion.h1
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							className='text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none mb-6'
						>
							{product.title}
							<span className='text-[#e21e26]'>.</span>
						</motion.h1>

						<p className='text-gray-500 text-lg leading-relaxed mb-12 font-medium'>
							{product.description}
						</p>

						{/* Иконки характеристик */}
						<div className='grid grid-cols-3 gap-4 mb-12'>
							{product.features.map((f, i) => (
								<div key={i} className='p-4 border border-gray-100 rounded-xl'>
									<div className='text-[#e21e26] mb-2'>{f.icon}</div>
									<div className='text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1'>
										{f.label}
									</div>
									<div className='text-xs font-bold uppercase'>{f.value}</div>
								</div>
							))}
						</div>

						{/* Таблица характеристик */}
						<div className='border-t border-gray-100 pt-8 mb-12'>
							<h3 className='text-sm font-black uppercase tracking-[0.2em] mb-6 text-black'>
								Технические параметры
							</h3>
							<div className='space-y-4'>
								{Object.entries(product.specs).map(([key, val]) => (
									<div
										key={key}
										className='flex justify-between items-center py-2 border-b border-gray-50'
									>
										<span className='text-[11px] font-bold uppercase text-gray-400'>
											{key}
										</span>
										<span className='text-[11px] font-black uppercase text-black'>
											{val}
										</span>
									</div>
								))}
							</div>
						</div>

						{/* Кнопка действия */}
						<div className='flex flex-wrap gap-4'>
							<button className='flex-1 bg-black text-white py-5 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#e21e26] transition-colors duration-300 flex items-center justify-center gap-3'>
								<Download size={16} /> Скачать спецификацию (PDF)
							</button>
						</div>
					</div>
				</div>

				{/* Секция "Особенности" - Широкий блок */}
				<section className='mt-32 pt-20 border-t border-gray-100'>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
						<div className='space-y-4'>
							<h4 className='text-2xl font-black uppercase italic'>
								Оптика<span className='text-[#e21e26]'>.</span>
							</h4>
							<p className='text-sm text-gray-500 leading-relaxed'>
								Уникальная система линз обеспечивает идеальную равномерность
								луча на всем диапазоне зумирования.
							</p>
						</div>
						<div className='space-y-4'>
							<h4 className='text-2xl font-black uppercase italic'>
								Цвет<span className='text-[#e21e26]'>.</span>
							</h4>
							<p className='text-sm text-gray-500 leading-relaxed'>
								Система CMY нового поколения позволяет добиваться максимально
								насыщенных цветов и мягких пастельных оттенков.
							</p>
						</div>
						<div className='space-y-4'>
							<h4 className='text-2xl font-black uppercase italic'>
								Модуль<span className='text-[#e21e26]'>.</span>
							</h4>
							<p className='text-sm text-gray-500 leading-relaxed'>
								Технология Transferable Engine (TE) позволяет заменять
								светодиодный модуль за считанные минуты.
							</p>
						</div>
					</div>
				</section>
			</main>

			<Footer />
		</div>
	)
}

export default ProductDetail

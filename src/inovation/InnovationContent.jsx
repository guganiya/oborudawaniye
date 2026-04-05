import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import apiClient from '../api/api'

const InnovationContent = () => {
	const { id } = useParams()
	const [innovation, setInnovation] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		const fetchInnovation = async () => {
			setLoading(true)
			setError(null)
			try {
				const response = await apiClient.get(`/innovations/${id}`)
				const data = response.data
				setInnovation(data)
				console.log('Innovation data:', data)
			} catch (err) {
				console.error('Error fetching innovation:', err)
				setError(err.response?.data?.message || 'Не удалось загрузить инновацию')
			} finally {
				setLoading(false)
			}
		}

		if (id) {
			fetchInnovation()
		}

		// Scroll to top on mount
		window.scrollTo(0, 0)
	}, [id])

	if (loading) {
		return (
			<div className='bg-white min-h-screen font-sans'>
				<Navbar />
				<div className='flex flex-col items-center justify-center min-h-[60vh] gap-4'>
					<Loader2 className='animate-spin text-[#e21e26]' size={40} />
					<p className='text-[10px] font-black uppercase tracking-[0.3em] text-gray-400'>
						Загрузка инновации...
					</p>
				</div>
				<Footer />
			</div>
		)
	}

	if (error || !innovation) {
		return (
			<div className='bg-white min-h-screen font-sans'>
				<Navbar />
				<div className='flex flex-col items-center justify-center min-h-[60vh] gap-4 px-6'>
					<p className='text-red-500 text-sm font-medium'>{error || 'Инновация не найдена'}</p>
					<Link
						to='/innovation'
						className='inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#e21e26] transition-colors'
					>
						<ArrowLeft size={14} className='transition-transform' />
						Вернуться к инновациям
					</Link>
				</div>
				<Footer />
			</div>
		)
	}

	return (
		<div className='bg-white min-h-screen font-sans selection:bg-[#e21e26] selection:text-white'>
			<Navbar />

			<main className='pt-32 md:pt-44 pb-20'>
				<div className='max-w-[1200px] mx-auto px-6'>
					{/* Кнопка Назад */}
					<Link
						to='/innovation'
						className='inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#e21e26] transition-colors mb-12 group'
					>
						<ArrowLeft
							size={14}
							className='group-hover:-translate-x-1 transition-transform'
						/>
						Назад к инновациям
					</Link>

					{/* Заголовок и Текст */}
					<div className='text-center max-w-4xl mx-auto mb-16'>
						<motion.h1
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className='text-3xl md:text-6xl font-black uppercase tracking-tighter mb-8'
						>
							{innovation.name || innovation.title}
						</motion.h1>
						<motion.p
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.2 }}
							className='text-gray-500 text-sm md:text-base leading-relaxed font-medium'
						>
							{innovation.description || innovation.short_description}
						</motion.p>
					</div>

					{/* Главное изображение (Hero Image) */}
					<motion.div
						initial={{ opacity: 0, scale: 0.98 }}
						animate={{ opacity: 1, scale: 1 }}
						className='relative aspect-video md:aspect-[21/9] overflow-hidden bg-gray-100 mb-24 shadow-sm border border-gray-100'
					>
						<img
							src={innovation.image || innovation.poster}
							className='w-full h-full object-cover'
							alt={innovation.name || innovation.title}
							onError={(e) => {
								e.target.src = '/placeholder-image.jpg'
							}}
						/>
						<div className='absolute top-6 right-6 text-white text-[10px] font-black uppercase tracking-widest opacity-40'>
							Robe Innovation
						</div>
					</motion.div>



					{/* Блок "Реализовано в" - Products that use this innovation */}
					{innovation.products && innovation.products.length > 0 && (
						<section className='border-t border-gray-100 pt-20'>
							<h2 className='text-center text-[16px] font-black uppercase tracking-[0.4em] text-black mb-16'>
								Связанные продукты
							</h2>

							<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-8 sm:px-0'>
								{innovation.products.map((product, index) => (
									<motion.div
										key={product.id}
										initial={{ opacity: 0, y: 20 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true }}
										transition={{ delay: index * 0.1 }}
									>
										<Link
											to={`/products/${product.id}`}
											className='group flex flex-col items-center text-center no-underline'
										>
											<div className='relative w-full max-w-[260px] sm:max-w-none aspect-square bg-[#f9f9f9] mb-6 p-8 sm:p-12 overflow-hidden flex items-center justify-center transition-shadow duration-500 group-hover:shadow-lg'>
												<img
													src={product.poster || product.image}
													alt={product.name}
													className='max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-700'
													onError={(e) => {
														e.target.src = '/placeholder-image.jpg'
													}}
												/>
												{/* Optional: Show "New" badge if needed */}
												{/* <div className='absolute top-0 right-0 bg-[#e21e26] text-white text-[8px] font-bold px-2 py-1 uppercase tracking-tighter'>
													New
												</div> */}
											</div>

											<h4 className='text-[13px] font-black uppercase tracking-widest text-black group-hover:text-[#e21e26] transition-colors'>
												{product.name}
											</h4>
											<div className='mt-3 w-4 h-[1px] bg-gray-200 group-hover:w-10 group-hover:bg-[#e21e26] transition-all duration-500' />
										</Link>
									</motion.div>
								))}
							</div>
						</section>
					)}

					{/* If no products, show message */}
					{(!innovation.products || innovation.products.length === 0) && (
						<section className='border-t border-gray-100 pt-20'>
							<div className='text-center'>
								<p className='text-gray-400 text-[11px] font-black uppercase tracking-[0.3em]'>
									Продукты с этой технологией появятся скоро
								</p>
							</div>
						</section>
					)}
				</div>
			</main>

			<Footer />
		</div>
	)
}

export default InnovationContent
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react'

// Данные инноваций с описанием и картинкой для попапа
const INNOVATIONS_DATA = [
	{
		id: 'te',
		label: 'TE',
		icon: '/icons/te-logo.png', // Путь к маленькой иконке (логотипу)
		name: 'Transferable Engine',
		img: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=500', // Большая фотка для попапа
		description: 'Cpulse™ is a PWM (Pulse Width Modulation) control system...',
	},
	{
		id: 'cpulse',
		label: 'CPULSE',
		icon: '/icons/cpulse-logo.png',
		name: 'Cpulse™ Control',
		img: 'https://images.unsplash.com/photo-1534991715367-0c33403b3827?q=80&w=500',
		description: 'Ensure no flicker will be visible on any camera system...',
	},
	// ... и так далее
]

const ProductDetail = () => {
	const { productId } = useParams()
	const navigate = useNavigate()
	const [product, setProduct] = useState(null)
	const [loading, setLoading] = useState(true)

	const [isExpanded, setIsExpanded] = useState(false)
	const [activeInno, setActiveInno] = useState(null) // Храним объект активной инновации

	useEffect(() => {
		const fetchProduct = async () => {
			setLoading(true)
			await new Promise(r => setTimeout(r, 600))
			setProduct({
				id: productId,
				title: 'iFORTE® LTX',
				category: 'Moving Heads',
				image:
					'https://images.unsplash.com/photo-1545127398-14699f92334b?q=80&w=1000',
				description:
					'iFORTE® LTX WB — это самый мощный светодиодный прибор с подвижной головой на рынке, разработанный специально для работы на стадионах и аренах. Он сочетает в себе передовые технологии управления светом и беспрецедентную яркость.',
			})
			setLoading(false)
		}
		fetchProduct()
	}, [productId])

	if (loading)
		return (
			<div className='h-screen flex items-center justify-center'>
				<Loader2 className='animate-spin text-[#e21e26]' size={40} />
			</div>
		)

	return (
		<main className='max-w-[1400px] mx-auto px-6 pt-44 pb-32'>
			<button
				onClick={() => navigate(-1)}
				className='flex items-center gap-3 text-[10px] font-black uppercase tracking-widest mb-12 group'
			>
				<div className='w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all'>
					<ArrowLeft size={16} />
				</div>
				Назад
			</button>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-20 items-start'>
				{/* ФОТО ТОВАРА */}
				<div className='lg:sticky lg:top-44'>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className='relative aspect-[4/5] bg-[#f9f9f9] overflow-hidden'
					>
						<img
							src={product.image}
							alt=''
							className='w-full h-full object-cover  transition-all duration-1000'
						/>
					</motion.div>
				</div>

				{/* ИНФО + ИННОВАЦИИ */}
				<div className='flex flex-col'>
					<h1 className='text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-none mb-8'>
						{product.title}
						<span className='text-[#e21e26]'>.</span>
					</h1>

					<div className='relative mb-12'>
						<motion.div
							animate={{ height: isExpanded ? 'auto' : '100px' }}
							className='overflow-hidden relative'
						>
							<p className='text-gray-500 text-lg leading-relaxed font-medium'>
								{product.description}
							</p>
							{!isExpanded && (
								<div className='absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent' />
							)}
						</motion.div>
						<button
							onClick={() => setIsExpanded(!isExpanded)}
							className='mt-4 flex items-center gap-2 text-[#e21e26] text-[10px] font-black uppercase tracking-widest hover:text-black transition-colors'
						>
							{isExpanded ? (
								<>
									<ChevronUp size={14} /> Скрыть
								</>
							) : (
								<>
									<ChevronDown size={14} /> Read More
								</>
							)}
						</button>
					</div>

					{/* БЛОК ИННОВАЦИЙ */}
					<div className='pt-12 border-t border-gray-100 relative'>
						<h3 className='text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 mb-8'>
							Innovations
						</h3>

						<div className='grid grid-cols-4 md:grid-cols-5 gap-4 relative'>
							{INNOVATIONS_DATA.map(inno => (
								<div
									key={inno.id}
									className='relative'
									onMouseEnter={() => setActiveInno(inno)}
									onMouseLeave={() => setActiveInno(null)}
								>
									<Link
										to={`/innovation/${inno.id}`}
										className='aspect-square border border-gray-100 flex items-center justify-center p-2 hover:border-[#e21e26] hover:shadow-lg transition-all duration-300 bg-white group relative z-20'
									>
										{/* ТЕПЕРЬ ТУТ ФОТО-ИКОНКА */}
										<img
											src={inno.icon}
											alt={inno.label}
											className='w-full h-full object-contain filter group-hover:brightness-110 transition-all'
										/>
									</Link>

									{/* ПРЕВЬЮ КАРТОЧКА (Всплывает при наведении) */}
									<AnimatePresence>
										{activeInno?.id === inno.id && (
											<motion.div
												initial={{ opacity: 0, y: 10, scale: 0.95 }}
												animate={{ opacity: 1, y: 0, scale: 1 }}
												exit={{ opacity: 0, y: 10, scale: 0.95 }}
												className='absolute z-[100] left-0 top-full mt-4 w-[320px] bg-white shadow-2xl border border-gray-100 pointer-events-none'
											>
												{/* Большая фотография технологии */}
												<div className='h-48 overflow-hidden bg-black'>
													<img
														src={inno.img}
														className='w-full h-full object-cover opacity-90'
														alt={inno.name}
													/>
												</div>

												<div className='p-6'>
													<h4 className='text-[#e21e26] font-black uppercase text-sm mb-3 italic'>
														{inno.name}
													</h4>
													<p className='text-gray-500 text-[11px] leading-relaxed font-medium uppercase tracking-tight'>
														{inno.description}
													</p>
												</div>

												{/* Треугольник-указатель */}
												<div className='absolute -top-2 left-10 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-100' />
											</motion.div>
										)}
									</AnimatePresence>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</main>
	)
}

export default ProductDetail

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// ─── Тестовые данные ────────────────────────────────────────────────────────
const MOCK_INNOVATIONS = [
	{
		id: 'echo2',
		title: 'ECHO2™',
		image:
			'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=1000',
		description:
			'Для повышения светоотдачи в компактном T10 мощностью 200 Вт без перегрузки светодиодов разработана технология ECHO2™ (Enhanced Colour Homogenisation and Output).',
	},
	{
		id: 'firm',
		title: 'FIRM™',
		image:
			'https://images.unsplash.com/photo-1548512198-d1a1b18d2d64?q=80&w=1000',
		description:
			'Запатентованное встроенное устройство FIRM™ (Frost Insert Ring Mechanism) позволяет добиться идеальной диффузии поворотом колеса.',
	},
	{
		id: 'xrle',
		title: 'XRLE™',
		image:
			'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1000',
		description:
			'XRLE™ (XR Light Enhancer) сужает луч для увеличения интенсивности светового потока iFORTE LTX на 15 % в режиме Long-Throw.',
	},
]

const Innovations = () => {
	const [items, setItems] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true)
			await new Promise(r => setTimeout(r, 800))
			setItems(MOCK_INNOVATIONS)
			setLoading(false)
		}
		fetchData()
	}, [])

	return (
		<div className='bg-white min-h-screen font-sans selection:bg-[#e21e26] selection:text-white'>
			<Navbar />

			{/* Шапка страницы с фоновым текстом */}
			<header className='relative pt-44 pb-20 px-6 border-b border-gray-50 overflow-hidden'>
				{/* ФОНОВЫЙ ТЕКСТ (Watermark) */}
				<div className='absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden'>
					<span className='absolute bottom-2 md:-bottom-10 -left-10 text-[6rem] md:text-[18rem] font-black uppercase leading-none'>
						Innovations
					</span>
				</div>

				<div className='max-w-4xl mx-auto text-center relative z-10'>
					<motion.h1
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						className='text-4xl md:text-6xl font-black uppercase tracking-tighter italic mb-8'
					>
						Инновации<span className='text-[#e21e26]'>.</span>
					</motion.h1>
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2 }}
						className='text-gray-500 text-sm md:text-base leading-relaxed font-medium px-4'
					>
						Robe разработали несколько запатентованных технологических решений
						для обеспечения превосходного качества и работы приборов. Патенты и
						торговые марки © Robe lighting s.r.o
					</motion.p>
				</div>
			</header>

			<main className='max-w-[1400px] mx-auto px-6 py-20'>
				{loading ? (
					<div className='flex flex-col items-center justify-center py-40 gap-4'>
						<Loader2 className='animate-spin text-[#e21e26]' size={40} />
						<p className='text-[10px] font-black uppercase tracking-[0.3em] text-gray-400'>
							Загрузка технологий...
						</p>
					</div>
				) : (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20'>
						<AnimatePresence>
							{items.map((item, index) => (
								<InnovationCard key={item.id} item={item} index={index} />
							))}
						</AnimatePresence>
					</div>
				)}
			</main>

			<Footer />
		</div>
	)
}

const InnovationCard = ({ item, index }) => (
	<motion.div
		initial={{ opacity: 0, y: 30 }}
		whileInView={{ opacity: 1, y: 0 }}
		viewport={{ once: true }}
		transition={{ duration: 0.5, delay: index * 0.1 }}
		className='group'
	>
		<Link
			to={`/innovations/${item.id}`}
			className='flex flex-col h-full no-underline'
		>
			<div className='relative aspect-[16/9] overflow-hidden bg-gray-100 mb-8'>
				<img
					src={item.image}
					alt={item.title}
					className='w-full h-full object-cover transition-all duration-1000 md:grayscale group-hover:grayscale-0 group-hover:scale-105'
				/>
				<div className='absolute top-4 right-4 text-white text-[9px] font-black uppercase tracking-widest opacity-30'>
					Robe
				</div>
			</div>

			<div className='flex flex-col items-center text-center px-4'>
				<h3 className='text-black text-lg font-black uppercase tracking-widest mb-4 group-hover:text-[#e21e26] transition-colors duration-300'>
					{item.title}
				</h3>
				<p className='text-gray-500 text-[13px] leading-relaxed font-medium line-clamp-4'>
					{item.description}
				</p>
				<div className='mt-8 flex justify-center'>
					<div className='w-6 h-[2px] bg-gray-200 group-hover:w-12 group-hover:bg-[#e21e26] transition-all duration-500' />
				</div>
			</div>
		</Link>
	</motion.div>
)

export default Innovations

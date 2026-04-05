import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// ─── ДАННЫЕ ОБЪЕКТА ──────────────────────────────────────────────────────────
const INNOVATIONS_DATA = {
	firm: {
		title: 'FIRM™',
		description:
			'При работе с T10 больше не придется беспокоиться о забытых аксессуарах. Запатентованное встроенное устройство FIRM™ (Frost Insert Ring Mechanism) позволяет добиться идеальной диффузии поворотом колеса. Можно выбрать 1° или установить сменный вариант 5°.',
		mainImage:
			'https://images.unsplash.com/photo-1548512198-d1a1b18d2d64?q=80&w=1200',
		implementedIn: [
			{
				id: 1,
				name: 'T10 Fresnel™',
				img: 'https://www.robe.cz/fileadmin/_processed_/7/0/csm_T10_Fresnel_01_8a8e1e7e4e.png',
			},
			{
				id: 2,
				name: 'T10 Profile™',
				img: 'https://www.robe.cz/fileadmin/_processed_/a/b/csm_T10_Profile_01_b1b6e4e5e4.png',
			},
			{
				id: 3,
				name: 'T10 PC™',
				img: 'https://www.robe.cz/fileadmin/_processed_/5/6/csm_T10_PC_01_5e5e5e5e5e.png',
			},
		],
	},
	// Здесь можно добавлять другие технологии (hcf, rlm и т.д.)
}

const InnovationContent = () => {
	const { id } = useParams()

	// Поиск данных по ID или возврат к дефолтному 'firm'
	const data = INNOVATIONS_DATA[id] || INNOVATIONS_DATA['firm']

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
							{data.title}
						</motion.h1>
						<motion.p
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.2 }}
							className='text-gray-500 text-sm md:text-base leading-relaxed font-medium'
						>
							{data.description}
						</motion.p>
					</div>

					{/* Главное изображение (Hero Image) */}
					<motion.div
						initial={{ opacity: 0, scale: 0.98 }}
						animate={{ opacity: 1, scale: 1 }}
						className='relative aspect-video md:aspect-[21/9] overflow-hidden bg-gray-100 mb-24 shadow-sm border border-gray-100'
					>
						<img
							src={data.mainImage}
							className='w-full h-full object-cover'
							alt={data.title}
						/>
						<div className='absolute top-6 right-6 text-white text-[10px] font-black uppercase tracking-widest opacity-40'>
							Robe Innovation
						</div>
					</motion.div>

					{/* Блок "Реализовано в" */}
					<section className='border-t border-gray-100 pt-20'>
						<h2 className='text-center text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 mb-16'>
							Реализовано в
						</h2>

						{/* Сетка карточек: на мобилках px-12 чтобы сузить карточки */}
						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-8 sm:px-0'>
							{data.implementedIn.map((product, index) => (
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
										{/* Контейнер прибора: max-w-xs ограничивает размер на мобилке */}
										<div className='relative w-full max-w-[260px] sm:max-w-none aspect-square bg-[#f9f9f9] mb-6 p-8 sm:p-12 overflow-hidden flex items-center justify-center transition-shadow duration-500 group-hover:shadow-lg'>
											<img
												src={product.img}
												alt={product.name}
												className='max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-700'
											/>
											<div className='absolute top-0 right-0 bg-[#e21e26] text-white text-[8px] font-bold px-2 py-1 uppercase tracking-tighter'>
												New
											</div>
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
				</div>
			</main>

			<Footer />
		</div>
	)
}

export default InnovationContent

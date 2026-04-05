import React, { useEffect, useRef, useState } from 'react'
import {
	motion,
	useMotionValue,
	useTransform,
	animate,
	useInView,
	useMotionValueEvent,
} from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Award, Globe, Users, Zap, Quote } from 'lucide-react'

// Исправленный компонент для анимации цифр
const AnimatedNumber = ({ value }) => {
	const ref = useRef(null)
	const isInView = useInView(ref, { once: true, margin: '-100px' })

	// Создаем стейт для отображения числа, так как MotionValue нельзя рендерить напрямую
	const [displayValue, setDisplayValue] = useState(0)

	const count = useMotionValue(0)
	const rounded = useTransform(count, latest => Math.round(latest))

	// Слушаем изменения анимированного значения и обновляем стейт
	useMotionValueEvent(rounded, 'change', latest => {
		setDisplayValue(latest)
	})

	useEffect(() => {
		if (isInView) {
			const numericValue = parseInt(value)
			animate(count, numericValue, {
				duration: 2,
				ease: 'easeOut',
				delay: 0.5,
			})
		}
	}, [isInView, count, value])

	return (
		<span
			ref={ref}
			className='text-3xl md:text-5xl font-black text-black italic leading-none'
		>
			{displayValue}
			<span>{value.includes('+') ? '+' : ''}</span>
		</span>
	)
}

const AboutUs = () => {
	return (
		<div className='bg-white min-h-screen font-sans selection:bg-[#e21e26] selection:text-white'>
			<Navbar />

			{/* Hero Section */}
			<section className='relative pt-44 pb-20 px-6 overflow-hidden border-b border-gray-50'>
				<div className='absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden'>
					<span className='absolute bottom-0 left-0 md:-bottom-10 md:-left-10 text-[8rem] sm:text-[12rem] md:text-[22rem] font-black uppercase leading-[0.8]'>
						About
					</span>
				</div>

				<div className='max-w-[1400px] mx-auto relative z-10'>
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className='text-5xl md:text-8xl font-black uppercase tracking-tighter italic mb-12'
					>
						О нас<span className='text-[#e21e26]'>.</span>
					</motion.h1>

					<div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-end'>
						<motion.p
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.2 }}
							className='text-gray-500 text-lg md:text-xl leading-relaxed font-medium max-w-2xl'
						>
							Мы создаем световые решения, которые превращают обычные
							пространства в незабываемые визуальные впечатления. Инновации —
							это наше ДНК.
						</motion.p>

						<div className='flex flex-wrap gap-8 lg:justify-end'>
							<StatItem label='Лет опыта' value='30+' />
							<StatItem label='Патентов' value='150+' />
							<StatItem label='Стран' value='100+' />
						</div>
					</div>
				</div>
			</section>

			<main className='max-w-[1400px] mx-auto px-6 py-24'>
				{/* Секция с фото (без фильтров и эффектов наведения) */}
				<section className='grid grid-cols-1 lg:grid-cols-12 gap-16 mb-32 items-center'>
					<div className='lg:col-span-7'>
						<motion.div
							initial={{ opacity: 0, x: -30 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							className='aspect-video bg-gray-100 overflow-hidden shadow-2xl rounded-sm'
						>
							<img
								src='https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1400'
								alt='Production'
								className='w-full h-full object-cover grayscale-0 hover:grayscale-0'
							/>
						</motion.div>
					</div>
					<div className='lg:col-span-5 space-y-8'>
						<h2 className='text-3xl font-black uppercase tracking-tight'>
							Наше видение
						</h2>
						<p className='text-gray-500 leading-relaxed font-medium'>
							Основанная в сердце Европы, компания прошла путь от небольшой
							мастерской до мирового лидера в производстве интеллектуального
							светового оборудования. Мы верим, что свет — это не просто
							инструмент, а способ коммуникации.
						</p>
						<div className='h-[2px] w-12 bg-[#e21e26]' />
					</div>
				</section>

				{/* СЕКЦИЯ: О Директоре */}
				<section className='mb-32 py-20 bg-[#fafafa] -mx-6 px-6 overflow-hidden'>
					<div className='max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							whileInView={{ opacity: 1, scale: 1 }}
							viewport={{ once: true }}
							className='relative'
						>
							<div className='aspect-[4/5] overflow-hidden rounded-sm grayscale shadow-xl'>
								<img
									src='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800'
									alt='Director'
									className='w-full h-full object-cover'
								/>
							</div>
							<div className='absolute -bottom-6 -right-6 bg-[#e21e26] p-6 text-white hidden md:block shadow-lg'>
								<Quote size={40} fill='white' />
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: 30 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.2 }}
							className='space-y-6'
						>
							<span className='text-[#e21e26] text-[10px] font-black uppercase tracking-[0.3em]'>
								CEO & Founder
							</span>
							<h2 className='text-4xl font-black uppercase tracking-tighter leading-none italic text-black'>
								Иозеф Вальдман<span className='text-[#e21e26]'>.</span>
							</h2>
							<p className='text-xl text-gray-700 font-medium italic leading-relaxed'>
								"Мы не просто продаем приборы. Мы создаем инструменты для
								художников света, которые позволяют им рисовать на холсте
								ночного неба или театральной сцены."
							</p>
							<div className='pt-4'>
								<img
									src='https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Signature_of_Zuzana_Čaputová.svg/1200px-Signature_of_Zuzana_Čaputová.svg.png'
									className='h-12 opacity-20 invert grayscale'
									alt='signature'
								/>
							</div>
						</motion.div>
					</div>
				</section>

				{/* Сетка ценностей */}
				<section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
					<ValueCard
						icon={<Zap size={32} />}
						title='Технологии'
						text='Постоянный поиск новых способов управления светом и цветом.'
					/>
					<ValueCard
						icon={<Award size={32} />}
						title='Качество'
						text='Каждый прибор проходит 48-часовое тестирование перед отправкой.'
					/>
					<ValueCard
						icon={<Globe size={32} />}
						title='Экология'
						text='Лидерство в разработке энергоэффективных LED-технологий.'
					/>
					<ValueCard
						icon={<Users size={32} />}
						title='Поддержка'
						text='Глобальная сеть сервисных центров по всему миру 24/7.'
					/>
				</section>
			</main>

			<Footer />
		</div>
	)
}

const StatItem = ({ label, value }) => (
	<div className='flex flex-col'>
		<AnimatedNumber value={value} />
		<span className='text-[10px] font-black uppercase tracking-widest text-[#e21e26] mt-2'>
			{label}
		</span>
	</div>
)

const ValueCard = ({ icon, title, text }) => (
	<motion.div
		whileHover={{ y: -10 }}
		className='p-10 border border-gray-100 hover:border-black transition-all duration-500 flex flex-col items-center text-center group bg-white'
	>
		<div className='text-gray-300 group-hover:text-[#e21e26] transition-colors duration-500 mb-6'>
			{icon}
		</div>
		<h3 className='text-[14px] font-black uppercase tracking-widest mb-4 text-black'>
			{title}
		</h3>
		<p className='text-[12px] text-gray-500 leading-relaxed font-medium'>
			{text}
		</p>
	</motion.div>
)

export default AboutUs

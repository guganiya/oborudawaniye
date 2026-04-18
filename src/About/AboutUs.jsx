import React, { useEffect, useRef, useState } from 'react'
import {
	motion,
	useMotionValue,
	useTransform,
	animate,
	useInView,
	useMotionValueEvent,
} from 'framer-motion'
import { useTranslation } from 'react-i18next' // Добавлено
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {
	Award,
	Globe,
	Users,
	Zap,
	Quote,
	Linkedin,
	Mail,
	ChevronLeft,
	ChevronRight,
} from 'lucide-react'
import apiClient from '../api/api.js'

const AnimatedNumber = ({ value }) => {
	const ref = useRef(null)
	const isInView = useInView(ref, { once: true, margin: '-100px' })
	const [displayValue, setDisplayValue] = useState(0)
	const count = useMotionValue(0)
	const rounded = useTransform(count, latest => Math.round(latest))

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
			className='text-3xl md:text-5xl font-black text-white leading-none'
		>
			{displayValue}
			<span>{value.includes('+') ? '+' : ''}</span>
		</span>
	)
}

const TeamCard = ({ member, index }) => {
	const [isHovered, setIsHovered] = useState(false)

	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.5, delay: index * 0.1 }}
			className='group relative'
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div className='relative overflow-hidden bg-gray-100 mb-6 rounded-sm'>
				<div className='aspect-[4/5] overflow-hidden'>
					<img
						src={member.image}
						alt={member.full_name}
						className='w-full h-full object-cover transition-all duration-700 group-hover:scale-110'
						onError={e => {
							e.target.src = '/placeholder-avatar.jpg'
						}}
					/>
				</div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: isHovered ? 1 : 0 }}
					transition={{ duration: 0.3 }}
					className='absolute inset-0 bg-black/70 flex items-center justify-center gap-4'
				>
					{member.email && (
						<a
							href={`mailto:${member.email}`}
							className='w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#e21e26] transition-all duration-300 transform hover:scale-110'
						>
							<Mail size={18} />
						</a>
					)}
					{member.linkedin && (
						<a
							href={member.linkedin}
							target='_blank'
							rel='noopener noreferrer'
							className='w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#e21e26] transition-all duration-300 transform hover:scale-110'
						>
							<Linkedin size={18} />
						</a>
					)}
				</motion.div>
			</div>

			<div className='text-center'>
				<h3 className='text-lg font-black uppercase tracking-wider mb-1 text-black'>
					{member.full_name}
				</h3>
				<p className='text-[11px] font-bold uppercase tracking-wider text-[#e21e26] mb-3'>
					{member.job}
				</p>
				{member.phrase && (
					<div className='relative'>
						<Quote
							size={14}
							className='absolute -top-2 -left-2 text-gray-300'
						/>
						<p className='text-[12px] text-gray-500 leading-relaxed px-4'>
							{member.phrase}
						</p>
					</div>
				)}
			</div>
		</motion.div>
	)
}

const CompanyStats = () => {
	const { t } = useTranslation()
	const stats = [
		{ label: t('stats_years'), value: '30+' },
		{ label: t('stats_patents'), value: '150+' },
		{ label: t('stats_countries'), value: '100+' },
		{ label: t('stats_clients'), value: '5000+' },
	]

	return (
		<div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
			{stats.map((stat, index) => (
				<motion.div
					key={stat.label}
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ delay: index * 0.1 }}
					className='text-center'
				>
					<AnimatedNumber value={stat.value} />
					<span className='block text-[10px] font-black uppercase tracking-widest text-[#e21e26] mt-2'>
						{stat.label}
					</span>
				</motion.div>
			))}
		</div>
	)
}

const ValueCard = ({ icon, title, text, delay }) => (
	<motion.div
		initial={{ opacity: 0, y: 30 }}
		whileInView={{ opacity: 1, y: 0 }}
		viewport={{ once: true }}
		transition={{ delay }}
		whileHover={{ y: -10 }}
		className='p-8 border border-gray-100 hover:border-black transition-all duration-500 flex flex-col items-center text-center group bg-white shadow-sm hover:shadow-xl'
	>
		<img
			className='text-gray-300 group-hover:text-[#e21e26] transition-colors duration-500 mb-6 transform group-hover:scale-110'
			src={icon}
			alt=''
		/>
		<h3 className='text-[14px] font-black uppercase tracking-widest mb-4 text-black'>
			{title}
		</h3>
		<p className='text-[12px] text-gray-500 leading-relaxed font-medium'>
			{text}
		</p>
	</motion.div>
)

const AboutUs = () => {
	const { t } = useTranslation()
	const [teams, setTeams] = useState([])
	const [ourValues, setOurValues] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		const fetchTeams = async () => {
			setLoading(true)
			setError(null)
			try {
				const response = await apiClient.get('/get-teams')
				const teamsData = response.data.teams
				const valuesData = response.data.values
				setTeams(teamsData)
				setOurValues(valuesData)
			} catch (err) {
				console.error('Error fetching teams:', err)
				setError(err.response?.data?.message || t('about_error_load'))
			} finally {
				setLoading(false)
			}
		}

		fetchTeams()
	}, [t])

	return (
		<div className='bg-white min-h-screen font-sans selection:bg-[#e21e26] selection:text-white'>
			<Navbar />

			<section className='relative pt-52 pb-24 px-6 bg-black overflow-hidden border-b border-white/10'>
				{/* ГРАДИЕНТНЫЙ ФОН */}
				<div
					className='absolute inset-0 z-0'
					style={{
						background:
							'linear-gradient(to left, rgba(226, 30, 38, 0.15) 0%, rgba(0, 0, 0, 1) 70%)',
					}}
				/>

				{/* ФОНОВЫЙ ТЕКСТ (Watermark) */}
				<div className='absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden z-0'>
					<span className='absolute bottom-0 left-0 md:-bottom-10 md:-left-10 text-[8rem] sm:text-[12rem] md:text-[22rem] font-black uppercase leading-[0.8] whitespace-nowrap text-white'>
						{t('about_hero_bg')}
					</span>
				</div>

				<div className='max-w-[1400px] mx-auto relative z-10'>
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className='text-6xl md:text-9xl font-[1000] uppercase tracking-tighter mb-12 text-white'
					>
						{t('about_title')}
					</motion.h1>

					<div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-end'>
						<motion.p
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.2 }}
							className='text-gray-400 text-lg md:text-xl leading-relaxed font-medium max-w-2xl'
						>
							{t('about_description')}
						</motion.p>

						{/* Здесь будет компонент статистики, убедись что в нем белые/серые тексты */}
						<CompanyStats />
					</div>
				</div>
			</section>
			<main className='max-w-[1400px] mx-auto px-6 py-24'>
				<section className='grid grid-cols-1 lg:grid-cols-12 gap-16 mb-32 items-center'>
					<div className='lg:col-span-7'>
						<motion.div
							initial={{ opacity: 0, x: -30 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							className='relative aspect-video bg-gray-100 overflow-hidden shadow-2xl rounded-sm'
						>
							<img
								src='https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1400'
								alt='Production'
								className='w-full h-full object-cover'
							/>
							<div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent' />
						</motion.div>
					</div>
					<div className='lg:col-span-5 space-y-6'>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
						>
							<span className='text-[10px] font-black uppercase tracking-[0.3em] text-[#e21e26]'>
								{t('about_mission_label')}
							</span>
							<h2 className='text-3xl md:text-4xl font-black uppercase tracking-tight mt-4 mb-6'>
								{t('about_mission_title')}
							</h2>
							<p className='text-gray-500 leading-relaxed font-medium mb-6'>
								{t('about_mission_text')}
							</p>
							<div className='h-[2px] w-12 bg-[#e21e26]' />
						</motion.div>
					</div>
				</section>

				<section>
					<div className='text-center mb-16'>
						<motion.span
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							viewport={{ once: true }}
							className='text-[10px] font-black uppercase tracking-[0.3em] text-[#e21e26]'
						>
							{t('about_team_label')}
						</motion.span>
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className='text-3xl md:text-4xl font-black uppercase tracking-tighter mt-4 mb-6'
						>
							{t('about_team_title')}
						</motion.h2>
						<motion.p
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							viewport={{ once: true }}
							className='text-gray-500 max-w-2xl mx-auto'
						>
							{t('about_team_subtitle')}
						</motion.p>
					</div>

					{loading ? (
						<div className='flex flex-col items-center justify-center py-20 gap-4'>
							<div className='w-12 h-12 border-2 border-[#e21e26] border-t-transparent rounded-full animate-spin' />
							<p className='text-[10px] font-black uppercase tracking-[0.3em] text-gray-400'>
								{t('about_loading_team')}
							</p>
						</div>
					) : error ? (
						<div className='flex flex-col items-center justify-center py-20 gap-4'>
							<p className='text-red-500 text-sm'>{error}</p>
							<button
								onClick={() => window.location.reload()}
								className='px-6 py-2 bg-[#e21e26] text-white text-xs font-black uppercase tracking-wider rounded-sm hover:bg-black transition-colors'
							>
								{t('modal_btn_retry')}
							</button>
						</div>
					) : teams.length === 0 ? (
						<div className='flex items-center justify-center py-20'>
							<p className='text-[10px] font-black uppercase tracking-[0.3em] text-gray-400'>
								{t('about_team_empty')}
							</p>
						</div>
					) : (
						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
							{teams.map((member, index) => (
								<TeamCard
									key={member.id || index}
									member={member}
									index={index}
								/>
							))}
						</div>
					)}
				</section>

				<section className='mb-20 mt-20 '>
					<div className='text-center mb-16'>
						<motion.span
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							viewport={{ once: true }}
							className='text-[10px] font-black uppercase tracking-[0.3em] text-[#e21e26]'
						>
							{t('about_values_label')}
						</motion.span>
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className='text-3xl md:text-4xl font-black uppercase tracking-tighter mt-4'
						>
							{t('about_values_title')}
						</motion.h2>
					</div>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
						{ourValues.map((value, index) => (
							<ValueCard
								key={index}
								text={value.description}
								title={value.title}
								icon={value.icon}
							/>
						))}
					</div>
				</section>
			</main>

			<Footer />
		</div>
	)
}

export default AboutUs

import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Mail, Phone, MapPin, Clock, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

const Contacts = () => {
	const brandRed = '#e21e26'

	const fadeInUp = {
		initial: { opacity: 0, y: 20 },
		animate: { opacity: 1, y: 0 },
		transition: { duration: 0.6 },
	}

	return (
		<div className='bg-white min-h-screen text-black selection:bg-[#e21e26] selection:text-white font-sans'>
			<Navbar />

			{/* Заголовок страницы */}
			<section className='pt-32 md:pt-40 pb-12 md:pb-20 border-b border-black/5 bg-[#fafafa] relative overflow-hidden'>
				<div className='absolute inset-0 opacity-[0.03] pointer-events-none'>
					{/* Исправлено: уменьшен размер текста для мобилок, чтобы не было горизонтального скролла */}
					<span className='absolute -bottom-5 md:-bottom-10 -left-5 md:-left-10 text-[6rem] md:text-[20rem] font-black uppercase leading-none select-none'>
						Contact
					</span>
				</div>

				<div className='max-w-[1500px] mx-auto px-6 md:px-12 relative z-10'>
					<motion.div {...fadeInUp}>
						{/* Адаптивный размер шрифта: text-5xl для мобилок, text-[8rem] для десктопа */}
						<h1 className='text-5xl md:text-[7rem] font-black uppercase tracking-tighter leading-[0.9] md:leading-[0.85]'>
							Get in <br className='hidden md:block' />
							<span style={{ color: brandRed }} className='italic'>
								Touch.
							</span>
						</h1>
						<p className='mt-6 md:mt-8 text-gray-400 text-[10px] md:text-sm uppercase tracking-[0.2em] md:tracking-[0.4em] font-bold max-w-xl leading-relaxed'>
							Have a project in mind? Our global support network is ready to
							bring your vision to life with professional lighting solutions.
						</p>
					</motion.div>
				</div>
			</section>

			<main className='max-w-[1500px] mx-auto px-6 md:px-12 py-16 md:py-32'>
				<div className='grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-20'>
					{/* ЛЕВАЯ КОЛОНКА: ИНФОРМАЦИЯ */}
					<div className='lg:col-span-5 space-y-12 md:y-20'>
						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-10 md:gap-12'>
							{[
								{
									icon: Mail,
									label: 'Email Us',
									value: 'pro-sales@lumina.com',
									href: 'mailto:pro-sales@lumina.com',
								},
								{
									icon: Phone,
									label: 'Call Us',
									value: '+420 123 456 789',
									href: 'tel:+420123456789',
								},
								{
									icon: MapPin,
									label: 'Office',
									value: 'Hazlov 541, Czech Republic',
									href: '#',
								},
								{
									icon: Clock,
									label: 'Hours',
									value: 'Mon - Fri: 08:00 - 17:00',
									href: null,
								},
							].map((item, idx) => (
								<motion.div
									key={idx}
									initial={{ opacity: 0, x: -20 }}
									whileInView={{ opacity: 1, x: 0 }}
									transition={{ delay: idx * 0.1 }}
									viewport={{ once: true }}
									className='group'
								>
									<div className='flex items-center gap-3 md:gap-4 text-gray-400 mb-2 md:mb-4'>
										<item.icon
											size={14}
											md:size={16}
											strokeWidth={3}
											style={{ color: brandRed }}
										/>
										<span className='text-[9px] md:text-[10px] font-black uppercase tracking-widest'>
											{item.label}
										</span>
									</div>
									{item.href ? (
										<a
											href={item.href}
											className='text-base md:text-lg font-bold uppercase hover:text-[#e21e26] md:hover:translate-x-2 transition-all block w-fit'
										>
											{item.value}
										</a>
									) : (
										<p className='text-base md:text-lg font-bold uppercase'>
											{item.value}
										</p>
									)}
								</motion.div>
							))}
						</div>
					</div>

					{/* ПРАВАЯ КОЛОНКА: ФОРМА */}
					<div className='lg:col-span-7'>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
							viewport={{ once: true }}
							className='bg-[#111] p-8 md:p-16 rounded-[1.5rem] md:rounded-[2rem] text-white shadow-2xl relative overflow-hidden'
						>
							<div className='relative z-10'>
								<h3 className='text-2xl md:text-3xl font-black uppercase tracking-tighter mb-2'>
									Send a <span style={{ color: brandRed }}>Message</span>
								</h3>
								<p className='text-gray-500 text-xs md:text-sm mb-8 md:mb-12 font-medium'>
									We typically respond within 24 hours.
								</p>

								<form className='space-y-6 md:space-y-8'>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8'>
										{/* Поле Имени */}
										<div className='relative'>
											<input
												type='text'
												required
												placeholder=' '
												className='w-full bg-transparent border-b border-white/10 py-3 md:py-4 text-sm font-bold uppercase tracking-widest outline-none focus:border-[#e21e26] transition-colors peer'
											/>
											<label className='absolute left-0 top-3 md:top-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-600 pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-[#e21e26] peer-not-placeholder-shown:-top-4'>
												Full Name
											</label>
										</div>

										{/* Поле Email */}
										<div className='relative'>
											<input
												type='email'
												required
												placeholder=' '
												className='w-full bg-transparent border-b border-white/10 py-3 md:py-4 text-sm font-bold uppercase tracking-widest outline-none focus:border-[#e21e26] transition-colors peer'
											/>
											<label className='absolute left-0 top-3 md:top-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-600 pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-[#e21e26] peer-not-placeholder-shown:-top-4'>
												Email Address
											</label>
										</div>
									</div>

									{/* Поле Сообщения */}
									<div className='relative'>
										<textarea
											rows='3'
											required
											placeholder=' '
											className='w-full bg-transparent border-b border-white/10 py-3 md:py-4 text-sm font-bold uppercase tracking-widest outline-none focus:border-[#e21e26] transition-colors peer resize-none'
										></textarea>
										<label className='absolute left-0 top-3 md:top-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-600 pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-[#e21e26] peer-not-placeholder-shown:-top-4'>
											Message
										</label>
									</div>

									<button
										type='submit'
										className='group relative w-full py-5 md:py-6 bg-white text-black overflow-hidden rounded-full transition-all hover:bg-[#e21e26] hover:text-white cursor-pointer active:scale-95'
									>
										<span className='relative z-10 flex items-center justify-center gap-3 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] md:tracking-[0.3em]'>
											Send Request{' '}
											<ArrowRight
												size={14}
												className='group-hover:translate-x-2 transition-transform'
											/>
										</span>
									</button>
								</form>
							</div>
						</motion.div>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	)
}

export default Contacts

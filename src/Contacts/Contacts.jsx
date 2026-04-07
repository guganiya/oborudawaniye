import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {
	Mail,
	Phone,
	MapPin,
	Clock,
	ArrowRight,
	Loader2,
	CheckCircle,
	XCircle,
	X,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next' // Импорт
import apiClient from '../api/api.js'

const Contacts = () => {
	const { t } = useTranslation() // Инициализация
	const brandRed = '#e21e26'
	const [full_name, setFullName] = useState('')
	const [email, setEmail] = useState('')
	const [message, setMessage] = useState('')
	const [loading, setLoading] = useState(false)
	const [modal, setModal] = useState({ isOpen: false, type: '', message: '' })

	const fadeInUp = {
		initial: { opacity: 0, y: 20 },
		animate: { opacity: 1, y: 0 },
		transition: { duration: 0.6 },
	}

	const handleSubmit = async e => {
		e.preventDefault()

		if (!full_name.trim() || !email.trim() || !message.trim()) {
			setModal({
				isOpen: true,
				type: 'error',
				message: t('contacts_err_fill_all'),
			})
			return
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(email)) {
			setModal({
				isOpen: true,
				type: 'error',
				message: t('contacts_err_email_invalid'),
			})
			return
		}

		setLoading(true)

		const formData = new FormData()
		formData.append('full_name', full_name)
		formData.append('email', email)
		formData.append('message', message)

		try {
			await apiClient.post('/post-feedback', formData)

			setModal({
				isOpen: true,
				type: 'success',
				message: t('contacts_success_msg'),
			})

			setFullName('')
			setEmail('')
			setMessage('')
		} catch (err) {
			console.log(err)
			const errorMessage =
				err.response?.data?.message || t('contacts_err_generic')
			setModal({
				isOpen: true,
				type: 'error',
				message: errorMessage,
			})
		} finally {
			setLoading(false)
		}
	}

	const closeModal = () => {
		setModal({ isOpen: false, type: '', message: '' })
	}

	useEffect(() => {
		const handleEsc = e => {
			if (e.key === 'Escape' && modal.isOpen) {
				closeModal()
			}
		}
		window.addEventListener('keydown', handleEsc)
		return () => window.removeEventListener('keydown', handleEsc)
	}, [modal.isOpen])

	return (
		<div className='bg-white min-h-screen text-black selection:bg-[#e21e26] selection:text-white font-sans'>
			<Navbar />

			<AnimatePresence>
				{modal.isOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className='fixed inset-0 z-50 flex items-center justify-center px-4'
					>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className='absolute inset-0 bg-black/50 backdrop-blur-sm'
							onClick={closeModal}
						/>

						<motion.div
							initial={{ scale: 0.9, opacity: 0, y: 20 }}
							animate={{ scale: 1, opacity: 1, y: 0 }}
							exit={{ scale: 0.9, opacity: 0, y: 20 }}
							className='relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8'
						>
							<button
								onClick={closeModal}
								className='absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors'
							>
								<X size={20} />
							</button>

							<div className='flex justify-center mb-4'>
								{modal.type === 'success' ? (
									<div className='w-16 h-16 rounded-full bg-green-100 flex items-center justify-center'>
										<CheckCircle className='w-10 h-10 text-green-500' />
									</div>
								) : (
									<div className='w-16 h-16 rounded-full bg-red-100 flex items-center justify-center'>
										<XCircle className='w-10 h-10 text-red-500' />
									</div>
								)}
							</div>

							<h3 className='text-xl font-bold text-center mb-2'>
								{modal.type === 'success'
									? t('contacts_modal_success_title')
									: t('contacts_modal_error_title')}
							</h3>

							<p className='text-gray-600 text-center mb-6'>{modal.message}</p>

							<button
								onClick={closeModal}
								style={{
									backgroundColor:
										modal.type === 'success' ? '#10b981' : brandRed,
								}}
								className='w-full py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity'
							>
								{modal.type === 'success'
									? t('contacts_modal_btn_continue')
									: t('contacts_modal_btn_retry')}
							</button>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			<section className='pt-32 md:pt-40 pb-12 md:pb-20 border-b border-black/5 bg-[#fafafa] relative overflow-hidden'>
				<div className='absolute inset-0 opacity-[0.03] pointer-events-none'>
					<span className='absolute -bottom-5 md:-bottom-10 -left-5 md:-left-10 text-[6rem] md:text-[20rem] font-black uppercase leading-none select-none'>
						{t('contacts_bg_text')}
					</span>
				</div>

				<div className='max-w-[1500px] mx-auto px-6 md:px-12 relative z-10'>
					<motion.div {...fadeInUp}>
						<h1 className='text-5xl md:text-[7rem] font-black uppercase tracking-tighter leading-[0.9] md:leading-[0.85]'>
							{t('contacts_hero_title_1')} <br className='hidden md:block' />
							<span style={{ color: brandRed }} className='italic'>
								{t('contacts_hero_title_2')}
							</span>
						</h1>
						<p className='mt-6 md:mt-8 text-gray-400 text-[10px] md:text-sm uppercase tracking-[0.2em] md:tracking-[0.4em] font-bold max-w-xl leading-relaxed'>
							{t('contacts_hero_desc')}
						</p>
					</motion.div>
				</div>
			</section>

			<main className='max-w-[1500px] mx-auto px-6 md:px-12 py-16 md:py-32'>
				<div className='grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-20'>
					<div className='lg:col-span-5 space-y-12 md:y-20'>
						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-10 md:gap-12'>
							{[
								{
									icon: Mail,
									label: t('contacts_label_email'),
									value: 'pro-sales@lumina.com',
									href: 'mailto:pro-sales@lumina.com',
								},
								{
									icon: Phone,
									label: t('contacts_label_call'),
									value: '+420 123 456 789',
									href: 'tel:+420123456789',
								},
								{
									icon: MapPin,
									label: t('contacts_label_office'),
									value: 'Hazlov 541, Czech Republic',
									href: '#',
								},
								{
									icon: Clock,
									label: t('contacts_label_hours'),
									value: t('contacts_value_hours'),
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
									{t('contacts_form_title')}{' '}
									<span style={{ color: brandRed }}>
										{t('contacts_form_title_accent')}
									</span>
								</h3>
								<p className='text-gray-500 text-xs md:text-sm mb-8 md:mb-12 font-medium'>
									{t('contacts_form_subtitle')}
								</p>

								<form
									onSubmit={handleSubmit}
									className='space-y-6 md:space-y-8'
								>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8'>
										<div className='relative'>
											<input
												type='text'
												value={full_name}
												onChange={e => setFullName(e.target.value)}
												required
												className='w-full bg-transparent border-b border-white/10 py-3 md:py-4 text-sm font-bold uppercase tracking-widest outline-none focus:border-[#e21e26] transition-colors peer'
											/>
											<label className='absolute left-0 top-3 md:top-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-600 pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-[#e21e26] peer-valid:-top-4'>
												{t('contacts_input_name')}
											</label>
										</div>

										<div className='relative'>
											<input
												type='email'
												value={email}
												onChange={e => setEmail(e.target.value)}
												required
												className='w-full bg-transparent border-b border-white/10 py-3 md:py-4 text-sm font-bold uppercase tracking-widest outline-none focus:border-[#e21e26] transition-colors peer'
											/>
											<label className='absolute left-0 top-3 md:top-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-600 pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-[#e21e26] peer-valid:-top-4'>
												{t('contacts_input_email')}
											</label>
										</div>
									</div>

									<div className='relative'>
										<textarea
											rows='4'
											value={message}
											onChange={e => setMessage(e.target.value)}
											required
											className='w-full bg-transparent border-b border-white/10 py-3 md:py-4 text-sm font-bold uppercase tracking-widest outline-none focus:border-[#e21e26] transition-colors peer resize-none'
										></textarea>
										<label className='absolute left-0 top-3 md:top-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-600 pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-[#e21e26] peer-valid:-top-4'>
											{t('contacts_input_message')}
										</label>
									</div>

									<button
										type='submit'
										disabled={loading}
										className='group relative w-full py-5 md:py-6 bg-white text-black overflow-hidden rounded-full transition-all hover:bg-[#e21e26] hover:text-white cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
									>
										<span className='relative z-10 flex items-center justify-center gap-3 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] md:tracking-[0.3em]'>
											{loading ? (
												<>
													<Loader2 size={16} className='animate-spin' />
													{t('contacts_btn_sending')}
												</>
											) : (
												<>
													{t('contacts_btn_send')}{' '}
													<ArrowRight
														size={14}
														className='group-hover:translate-x-2 transition-transform'
													/>
												</>
											)}
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

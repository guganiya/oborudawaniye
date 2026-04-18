import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Loader2, CheckCircle, XCircle, X } from 'lucide-react'
import { useTranslation } from 'react-i18next' // Добавлено
import apiClient from '../api/api.js'

const Signup = () => {
	const { t } = useTranslation() // Добавлено
	const brandRed = '#e21e26'
	const [full_name, setFullName] = useState('')
	const [email, setEmail] = useState('')
	const [loading, setLoading] = useState(false)
	const [modal, setModal] = useState({ isOpen: false, type: '', message: '' })
	const navigate = useNavigate()

	const handleSubmit = async e => {
		e.preventDefault()

		// Basic validation
		if (!full_name.trim() || !email.trim()) {
			setModal({
				isOpen: true,
				type: 'error',
				message: t('auth_error_fill_fields'),
			})
			return
		}

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(email)) {
			setModal({
				isOpen: true,
				type: 'error',
				message: t('auth_error_invalid_email'),
			})
			return
		}

		setLoading(true)

		const formData = new FormData()
		formData.append('email', email)
		formData.append('full_name', full_name)

		try {
			const response = await apiClient.post('/post-user-credential', formData)

			// Success
			setModal({
				isOpen: true,
				type: 'success',
				message: t('auth_success_signup'),
			})

			setTimeout(() => {
				navigate('/')
			}, 2000)

			setFullName('')
			setEmail('')
		} catch (err) {
			console.log(err)
			const errorMessage =
				err.response?.data?.message || t('auth_error_general')
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
		<div className='min-h-screen bg-[#fafafa] flex items-center justify-center px-6 py-24 font-sans'>
			<motion.div
				initial={{ opacity: 0, scale: 0.98 }}
				animate={{ opacity: 1, scale: 1 }}
				className='w-full max-w-[450px] bg-white p-10 md:p-14 border border-black/5 shadow-sm'
			>
				<h1 className='text-3xl font-black uppercase tracking-tighter mb-2  text-center'>
					{t('auth_signup_title')}
					<span style={{ color: brandRed }}>.</span>
				</h1>
				<p className='text-center text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-10'>
					{t('auth_signup_subtitle')}
				</p>

				<form onSubmit={handleSubmit} className='space-y-8'>
					<div className='relative'>
						<input
							type='text'
							value={full_name}
							onChange={e => setFullName(e.target.value)}
							required
							className='w-full bg-transparent border-b border-gray-200 py-3 text-xs font-bold uppercase tracking-widest outline-none focus:border-[#e21e26] transition-colors peer'
						/>
						<label className='absolute left-0 top-3 text-[9px] font-black uppercase tracking-widest text-gray-400 pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-[#e21e26] peer-valid:-top-4'>
							{t('auth_field_fullname')}
						</label>
					</div>

					<div className='relative'>
						<input
							type='email'
							value={email}
							onChange={e => setEmail(e.target.value)}
							required
							className='w-full bg-transparent border-b border-gray-200 py-3 text-xs font-bold uppercase tracking-widest outline-none focus:border-[#e21e26] transition-colors peer'
						/>
						<label className='absolute left-0 top-3 text-[9px] font-black uppercase tracking-widest text-gray-400 pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-[#e21e26] peer-valid:-top-4'>
							{t('auth_field_email')}
						</label>
					</div>

					<button
						type='submit'
						disabled={loading}
						style={{ backgroundColor: brandRed }}
						className='w-full py-5 text-white flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.3em] hover:opacity-90 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
					>
						{loading ? (
							<>
								<Loader2 size={16} className='animate-spin' />
								{t('auth_btn_processing')}
							</>
						) : (
							<>
								{t('auth_btn_register')} <ArrowRight size={16} />
							</>
						)}
					</button>
				</form>
			</motion.div>

			{/* Modal Component */}
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
									? t('modal_success_title')
									: t('modal_error_title')}
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
									? t('modal_btn_continue')
									: t('modal_btn_retry')}
							</button>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

export default Signup

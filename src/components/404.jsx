import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MoveLeft, Home } from 'lucide-react'
import { useTranslation } from 'react-i18next' // Импорт
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const NotFound = () => {
	const { t } = useTranslation() // Инициализация

	return (
		<div className='bg-white min-h-screen font-sans selection:bg-[#e21e26] selection:text-white flex flex-col'>
			<Navbar />

			<main className='flex-grow relative flex items-center justify-center px-6 overflow-hidden pt-20 mt-30 mb-30'>
				{/* Background Watermark */}
				<div className='absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden flex items-center justify-center'>
					<span className='text-[20rem] md:text-[40rem] font-black uppercase leading-none'>
						404
					</span>
				</div>

				<div className='max-w-[1400px] mx-auto relative z-10 text-center'>
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<span className='text-[#e21e26] text-xs font-black uppercase tracking-[0.5em] mb-4 block'>
							{t('404_error_found')}
						</span>

						<h1 className='text-7xl md:text-9xl font-black uppercase tracking-[-0.05em] leading-none mb-8 italic'>
							{t('404_title_part1')}
							<span className='text-[#e21e26]'>{t('404_title_dot')}</span>
						</h1>

						<p className='text-gray-400 text-sm md:text-base font-medium max-w-md mx-auto mb-12 uppercase tracking-widest leading-relaxed'>
							{t('404_description')}
						</p>

						<div className='flex flex-col md:flex-row items-center justify-center gap-6'>
							<Link
								to='/'
								className='group flex items-center gap-3 bg-black text-white px-8 py-4 rounded-2xl hover:bg-[#e21e26] transition-all duration-300'
							>
								<Home size={18} />
								<span className='text-[11px] font-black uppercase tracking-widest'>
									{t('404_btn_home')}
								</span>
							</Link>

							<button
								onClick={() => window.history.back()}
								className='group flex items-center gap-3 border border-black px-8 py-4 rounded-2xl hover:border-[#e21e26] hover:text-[#e21e26] transition-all duration-300'
							>
								<MoveLeft
									size={18}
									className='group-hover:-translate-x-1 transition-transform'
								/>
								<span className='text-[11px] font-black uppercase tracking-widest'>
									{t('404_btn_back')}
								</span>
							</button>
						</div>
					</motion.div>
				</div>
			</main>

			<div className='max-w-[1400px] mx-auto w-full px-6'>
				<div className='h-[1px] w-full bg-gray-100' />
			</div>

			<Footer />
		</div>
	)
}

export default NotFound

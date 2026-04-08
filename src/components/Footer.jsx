import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
	Facebook,
	Instagram,
	Twitter,
	Youtube,
	ArrowUp,
	Phone,
	MessageSquare,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import apiClient from '../api/api'

const Footer = () => {
	const { t } = useTranslation()
	const [categories, setCategories] = useState([])

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	useEffect(() => {
		const getCategories = async () => {
			try {
				const response = await apiClient.get('/get-news-categories')
				setCategories(response.data.slice(0, 5))
			} catch (error) {
				console.error('Ошибка при загрузке категорий:', error)
			}
		}
		getCategories()
	}, [])

	const sections = [
		{
			title: t('footer_sec_products'),
			links: categories.map(cat => ({
				name: cat.name,
				path: `/news?category_id=${cat.id}`,
			})),
		},
		{
			title: t('footer_sec_company'),
			links: [
				{ name: t('footer_link_about'), path: '/about-us' },
				{ name: t('footer_link_sustainability'), path: '/products' },
				{ name: t('footer_link_innovation'), path: '/innovation' },
				{ name: t('footer_link_careers'), path: '/news' },
			],
		},
	]

	return (
		<footer className='relative z-10 bg-[#080808] py-20 border-t border-white/5 text-white font-sans'>
			<div className='max-w-[1500px] mx-auto px-6 md:px-12'>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20'>
					<div className='lg:col-span-2 space-y-8'>
						<Link to='/'>
							<img
								src='/logo/LOGO-ALYX-WIHT.png'
								alt={t('footer_logo_alt')}
								className='h-25 w-auto object-contain'
							/>
						</Link>

						<p className='text-white/60 font-medium text-sm max-w-sm leading-relaxed uppercase tracking-widest'>
							{t('footer_description')}
						</p>

						<div className='flex gap-5 pt-4'>
							{[Facebook, Instagram, Twitter, Youtube].map((Icon, idx) => (
								<a
									key={idx}
									href='#'
									className='text-white transition-all duration-300 hover:scale-110 hover:text-[#e21e26]'
								>
									<Icon size={22} />
								</a>
							))}
						</div>
					</div>

					{sections.map(section => (
						<div key={section.title} className='space-y-6'>
							<h4 className='text-[12px] font-black uppercase tracking-[0.3em] text-white'>
								{section.title}
							</h4>
							<ul className='space-y-4'>
								{section.links.map((link, idx) => (
									<li key={idx}>
										<Link
											to={link.path}
											className='text-[12px] font-bold uppercase tracking-widest text-white/70 transition-colors duration-300 hover:text-[#e21e26]'
										>
											{link.name}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}

					{/* КОЛОНКА РАЗРАБОТЧИКОВ */}
					<div className='space-y-6'>
						<h4 className='text-[12px] font-black uppercase tracking-[0.3em] text-[#e21e26]'>
							Developers
						</h4>
						<div className='space-y-4'>
							<a
								href='tel:+79991234567'
								className='flex items-center gap-3 text-[11px] font-bold text-white/60 hover:text-white transition-colors'
							>
								<Phone size={14} /> +7 (999) 123-45-67
							</a>
							<div className='flex gap-4'>
								<a
									href='https://instagram.com/dev_handle'
									target='_blank'
									rel='noreferrer'
									className='text-white/60 hover:text-[#e21e26] transition-all'
								>
									<Instagram size={18} />
								</a>
								<a
									href='https://tiktok.com/@dev_handle'
									target='_blank'
									rel='noreferrer'
									className='text-white/60 hover:text-[#e21e26] transition-all'
								>
									<MessageSquare size={18} />{' '}
									{/* Заменил на иконку мессенджера/тикток */}
								</a>
							</div>
						</div>
					</div>
				</div>

				{/* НИЖНЯЯ ЧАСТЬ */}
				<div className='pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6'>
					<div className='text-[11px] text-white/40 font-bold uppercase tracking-widest'>
						{t('footer_copyright')}
					</div>

					{/* Дополнительная подпись в самом низу */}
					<div className='text-[10px] text-white/20 uppercase tracking-widest font-medium'>
						Handcrafted by{' '}
						<span className='text-white/40 group-hover:text-[#e21e26] transition-colors'>
							Dev Name
						</span>
					</div>

					<button
						onClick={scrollToTop}
						className='group flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:text-[#e21e26]'
					>
						{t('footer_back_to_top')}
						<div className='p-2 border border-white/20 group-hover:border-[#e21e26] transition-colors'>
							<ArrowUp size={16} />
						</div>
					</button>
				</div>
			</div>
		</footer>
	)
}

export default Footer

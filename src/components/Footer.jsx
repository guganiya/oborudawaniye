import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter, Youtube, ArrowUp } from 'lucide-react'
import { FaTiktok, FaInstagram, FaPhoneAlt } from 'react-icons/fa' // Импорт иконок
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

	const devAndContactLinks = [
		{
			icon: <FaTiktok />,
			path: 'https://www.tiktok.com/@kadyr.muhammedow2',
			label: 'TikTok',
		},
		{
			icon: <FaInstagram />,
			path: 'https://www.instagram.com/codeassasinking',
			label: 'Instagram',
		},
		{
			icon: <FaPhoneAlt />,
			path: 'tel:+99361862535',
			label: '+993 61 86 25 35',
		},
		{
			icon: <FaPhoneAlt />,
			path: 'tel:+99361068912',
			label: '+993 61 06 89 12',
		},
	]

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
				{/* ВЕРХНЯЯ ЧАСТЬ */}
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
				</div>

				{/* НИЖНЯЯ ЧАСТЬ (Copyright + Developers + Back to top) */}
				<div className='pt-10 border-t border-white/10 flex flex-col lg:flex-row justify-between items-center gap-10'>
					{/* Copyright */}
					<div className='text-[11px] text-white/40 font-bold uppercase tracking-widest whitespace-nowrap order-3 lg:order-1'>
						{t('footer_copyright')}
					</div>

					{/* DEVELOPERS BLOCK */}
					<div className='flex flex-wrap items-center justify-center gap-x-8 gap-y-4 order-1 lg:order-2'>
						<div className='text-white/30 text-[10px] uppercase font-black tracking-[0.2em]'>
							Developed by:
						</div>
						<div className='flex flex-wrap items-center justify-center gap-x-6 gap-y-3'>
							{devAndContactLinks.map((item, idx) => (
								<a
									key={idx}
									href={item.path}
									target={item.path.startsWith('tel:') ? '_self' : '_blank'}
									rel='noopener noreferrer'
									className='text-white/50 hover:text-[#e21e26] transition-all duration-300 flex items-center gap-2 group'
								>
									<span className='text-base group-hover:scale-110 transition-transform'>
										{item.icon}
									</span>
									{item.path.startsWith('tel:') && (
										<span className='text-[11px] font-mono whitespace-nowrap tracking-tighter'>
											{item.label}
										</span>
									)}
								</a>
							))}
						</div>
					</div>

					{/* Back to Top */}
					<button
						onClick={scrollToTop}
						className='group flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:text-[#e21e26] order-2 lg:order-3'
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

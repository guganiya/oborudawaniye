import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter, Youtube, ArrowUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import apiClient from '../api/api'

const Footer = () => {
	const { t } = useTranslation()
	const [categories, setCategories] = useState([]) // Состояние для категорий из API

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	// Эффект для получения категорий, как в компоненте New
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

	// Формируем секции. Колонку "Products" теперь строим динамически на основе категорий
	const sections = [
		{
			title: t('footer_sec_products'),
			// Здесь мы мапим данные из API в формат ссылок
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

					{/* Динамические колонки */}
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

				{/* НИЖНЯЯ ЧАСТЬ */}
				<div className='pt-9 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6'>
					<div className='text-[11px] text-white/40 font-bold uppercase tracking-widest'>
						{t('footer_copyright')}
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

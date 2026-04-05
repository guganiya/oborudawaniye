import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter, Youtube, ArrowUp } from 'lucide-react'

const Footer = () => {
	const brandRed = '#e21e26'

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	const sections = [
		{
			title: 'Products',
			links: [
				'Moving Lights',
				'Static Lights',
				'Digital Lighting',
				'Controllers',
			],
		},
		{
			title: 'Company',
			links: ['About Us', 'Sustainability', 'Innovation', 'Careers'],
		},
		{
			title: 'Support',
			links: ['Service & Repair', 'Manuals', 'Training', 'Contact Us'],
		},
	]

	return (
		// 1. Фон изменен на черный (#080808), текст по умолчанию белый
		<footer className='relative z-10 bg-[#080808] py-20 border-t border-white/5 text-white font-sans'>
			<div className='max-w-[1500px] mx-auto px-6 md:px-12'>
				{/* ВЕРХНЯЯ ЧАСТЬ */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20'>
					<div className='lg:col-span-2 space-y-8'>
						{/* 2. Вместо компонента Logo теперь обычный тег img */}
						<Link to='/'>
							<img
								src='/logo/LOGO-ALYX-WIHT.png' // Укажите путь к вашему логотипу
								alt='Lumina Logo'
								className='h-25 w-auto object-contain'
							/>
						</Link>

						<p className='text-white/60 font-medium text-sm max-w-sm leading-relaxed uppercase tracking-widest'>
							World leader in moving light technology. High-quality products for
							concerts, theaters, and television.
						</p>

						{/* Соцсети: белые, при наведении красные */}
						<div className='flex gap-5 pt-4'>
							{[Facebook, Instagram, Twitter, Youtube].map((Icon, idx) => (
								<a
									key={idx}
									href='#'
									className='text-white transition-all duration-300 hover:scale-110'
									style={{ transitionColor: '0.3s' }}
									onMouseEnter={e => (e.currentTarget.style.color = brandRed)}
									onMouseLeave={e => (e.currentTarget.style.color = 'white')}
								>
									<Icon size={22} />
								</a>
							))}
						</div>
					</div>

					{/* Колонки со ссылками */}
					{sections.map(section => (
						<div key={section.title} className='space-y-6'>
							<h4 className='text-[12px] font-black uppercase tracking-[0.3em] text-white'>
								{section.title}
							</h4>
							<ul className='space-y-4'>
								{section.links.map(link => (
									<li key={link}>
										<Link
											to='/'
											className='text-[12px] font-bold uppercase tracking-widest text-white/70 transition-colors duration-300 hover:text-[#e21e26]'
											onMouseEnter={e => (e.target.style.color = brandRed)}
											onMouseLeave={e =>
												(e.target.style.color = 'rgba(255, 255, 255, 0.7)')
											}
										>
											{link}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				{/* НИЖНЯЯ ЧАСТЬ */}
				<div className='pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6'>
					<div className='text-[11px] text-white/40 font-bold uppercase tracking-widest'>
						© 2026 LUMINA LIGHTING PRO. ALL RIGHTS RESERVED.
					</div>

					<div className='flex gap-8 text-[11px] text-white/40 font-bold uppercase tracking-widest'>
						<a href='#' className='hover:text-[#e21e26] transition-colors'>
							Privacy Policy
						</a>
						<a href='#' className='hover:text-[#e21e26] transition-colors'>
							Cookies
						</a>
					</div>

					<button
						onClick={scrollToTop}
						className='group flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:text-[#e21e26]'
					>
						Back to Top
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

import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter, Youtube, ArrowUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const Footer = () => {
	const { t } = useTranslation()
	const brandRed = '#e21e26'

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	const sections = [
		{
			title: t('footer_sec_products'),
			links: [
				{ name: t('footer_link_moving_lights'), path: '/' },
				{ name: t('footer_link_static_lights'), path: '/' },
				{ name: t('footer_link_digital_lighting'), path: '/' },
				{ name: t('footer_link_controllers'), path: '/' },
			],
		},
		{
			title: t('footer_sec_company'),
			links: [
				{ name: t('footer_link_about'), path: '/' },
				{ name: t('footer_link_sustainability'), path: '/' },
				{ name: t('footer_link_innovation'), path: '/' },
				{ name: t('footer_link_careers'), path: '/' },
			],
		},
		{
			title: t('footer_sec_support'),
			links: [
				{ name: t('footer_link_service'), path: '/' },
				{ name: t('footer_link_manuals'), path: '/' },
				{ name: t('footer_link_training'), path: '/' },
				{ name: t('footer_link_contact'), path: '/' },
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

						{/* Соцсети */}
						<div className='flex gap-5 pt-4'>
							{[Facebook, Instagram, Twitter, Youtube].map((Icon, idx) => (
								<a
									key={idx}
									href='#'
									className='text-white transition-all duration-300 hover:scale-110 hover:text-[#e21e26]'
									style={{ transition: '0.3s' }}
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
									<li key={link.name}>
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
				<div className='pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6'>
					<div className='text-[11px] text-white/40 font-bold uppercase tracking-widest'>
						{t('footer_copyright')}
					</div>

					<div className='flex gap-8 text-[11px] text-white/40 font-bold uppercase tracking-widest'>
						<a href='#' className='hover:text-[#e21e26] transition-colors'>
							{t('footer_privacy')}
						</a>
						<a href='#' className='hover:text-[#e21e26] transition-colors'>
							{t('footer_cookies')}
						</a>
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

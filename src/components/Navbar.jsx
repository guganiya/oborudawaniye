import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Search, ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false)
	const [isLangOpen, setIsLangOpen] = useState(false)
	const { t, i18n } = useTranslation()
	const location = useLocation()
	const langMenuRef = useRef(null)

	const brandRed = '#e21e26'

	// Обновленный объект: замените пути в src на ваши реальные файлы
	const languages = {
		en: {
			name: t('lang_en'),
			// Временная ссылка на флаг США
			flag: '/flag/us.png',
			code: 'EN',
		},
		ru: {
			name: t('lang_ru'),
			// Временная ссылка на флаг РФ
			flag: '/flag/ru.png',
			code: 'RU',
		},
		// tk: {
		// 	name: t('lang_tk'),
		// 	flag: '/flag/tm.png',
		// 	code: 'TK',
		// },
	}

	const currentLang = languages[i18n.language] || languages.en

	const navItems = [
		{ name: t('nav_home'), path: '/' },
		{ name: t('nav_products'), path: '/products' },
		{ name: t('nav_innovation'), path: '/innovation' },
		{ name: t('nav_support'), path: '/support' },
		{ name: t('nav_news'), path: '/news' },
		{ name: t('nav_about'), path: '/about-us' },
		{ name: t('nav_contacts'), path: '/contacts' },
	]

	useEffect(() => {
		const handleClickOutside = event => {
			if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
				setIsLangOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	useEffect(() => {
		setIsOpen(false)
	}, [location])

	const changeLanguage = lng => {
		i18n.changeLanguage(lng)
		setIsLangOpen(false)
	}

	return (
		<nav className='fixed top-0 left-0 w-full z-[100] bg-white/60 backdrop-blur-xl border-b border-black/5'>
			<div className='max-w-[1500px] mx-auto px-6 md:px-8 h-40 md:h-30 flex items-center justify-between'>
				{/* Логотип */}
				<Link to='/' className='z-[110]'>
					<img
						src='/logo/LOGO-ALYX-BLACK.png'
						alt={t('nav_logo_alt')}
						className='h-20 lg:35 md:h-30 sm:h-25 w-auto object-contain'
					/>
				</Link>

				{/* Десктопное меню */}
				<div className='hidden xl:flex items-center gap-8'>
					{navItems.map(item => (
						<Link
							key={item.path}
							to={item.path}
							className='relative group text-[14px] font-bold uppercase tracking-[0.15em] text-black transition-colors duration-300'
						>
							<span className='group-hover:text-[#e21e26] transition-colors'>
								{item.name}
							</span>
							<span
								className={`absolute -bottom-2 left-0 h-[2px] transition-all duration-300 bg-[#e21e26] ${
									location.pathname === item.path
										? 'w-full'
										: 'w-0 group-hover:w-full'
								}`}
							></span>
						</Link>
					))}
				</div>

				{/* Правая часть */}
				<div className='hidden xl:flex items-center gap-6'>
					<div className='relative' ref={langMenuRef}>
						<button
							onClick={() => setIsLangOpen(!isLangOpen)}
							className='flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-black/5 transition-all'
						>
							{/* Флаг текущего языка */}
							<img
								src={currentLang.flag}
								alt={currentLang.code}
								className='w-5 h-auto object-contain rounded-sm'
							/>
							<span className='text-[14px] font-bold tracking-tighter'>
								{currentLang.code}
							</span>
							<ChevronDown
								className={`w-3 h-3 transition-transform ${isLangOpen ? 'rotate-180' : ''}`}
							/>
						</button>

						{isLangOpen && (
							<div className='absolute right-0 mt-3 w-44 bg-white shadow-2xl border border-black/5 rounded-xl py-2 overflow-hidden'>
								{Object.keys(languages).map(lng => (
									<button
										key={lng}
										onClick={() => {
											changeLanguage(lng)
											window.location.reload()
										}}
										className='w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors'
									>
										<div className='flex items-center gap-3'>
											<img
												src={languages[lng].flag}
												alt={languages[lng].code}
												className='w-5 h-auto object-contain rounded-sm'
											/>
											<span
												className={`text-[14px] font-bold uppercase tracking-wider ${i18n.language === lng ? 'text-[#e21e26]' : 'text-black'}`}
											>
												{languages[lng].name}
											</span>
										</div>
									</button>
								))}
							</div>
						)}
					</div>

					<Link
						to='/search'
						className='text-black hover:text-[#e21e26] transition-colors p-2'
					>
						<Search size={20} strokeWidth={2.5} />
					</Link>

					<Link
						to='/signup'
						className='text-[11px] font-bold uppercase tracking-[0.2em] border border-black px-8 py-3.5 hover:bg-black hover:text-white transition-all duration-300'
					>
						{t('nav_signup')}
					</Link>
				</div>

				{/* Бургер */}
				<div className='flex xl:hidden items-center z-[110]'>
					<button onClick={() => setIsOpen(!isOpen)} className='p-2 text-black'>
						{isOpen ? <X size={32} /> : <Menu size={32} />}
					</button>
				</div>

				{/* Мобильный Overlay */}
				<div
					className={`fixed top-0 left-0 w-full h-screen bg-white transition-all duration-500 ${isOpen ? 'translate-y-0' : '-translate-y-full'} xl:hidden`}
				>
					<div className='flex flex-col items-center justify-center h-full gap-6'>
						{navItems.map(item => (
							<Link
								key={item.path}
								to={item.path}
								onClick={() => setIsOpen(false)}
								className='text-2xl font-bold uppercase tracking-widest'
							>
								{item.name}
							</Link>
						))}
						<div className='flex gap-8 mt-10 pt-10 border-t border-black/5'>
							{Object.keys(languages).map(lng => (
								<button
									key={lng}
									onClick={() => {
										changeLanguage(lng)
										window.location.reload()
										setIsOpen(false)
									}}
									className='flex flex-col items-center gap-2'
								>
									<img
										src={languages[lng].flag}
										alt={languages[lng].code}
										className='w-8 h-auto object-contain rounded-sm'
									/>
									<span
										className={`text-[10px] font-bold ${i18n.language === lng ? 'text-[#e21e26]' : 'text-gray-400'}`}
									>
										{languages[lng].code}
									</span>
								</button>
							))}
						</div>
					</div>
				</div>
			</div>
		</nav>
	)
}

export default Navbar

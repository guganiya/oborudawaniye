import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false)
	const location = useLocation()
	const brandRed = '#e21e26'

	const navItems = [
		'Home',
		'Products',
		'Innovation',
		'Support',
		'News',
		'About Us',
		'Contacts',
	]

	useEffect(() => {
		setIsOpen(false)
	}, [location])

	return (
		// 1. Убрал bg-black, добавил bg-white/40 и backdrop-blur для эффекта стекла
		<nav className='fixed top-0 left-0 w-full z-[100] bg-white/40 backdrop-blur-xl border-b border-black/5'>
			<div className='max-w-[1500px] mx-auto px-6 md:px-8 h-20 md:h-24 flex items-center justify-between'>
				{/* Логотип (убедись, что в Logo.jsx текст теперь черный или передай класс) */}
				<Link to='/' className=' z-[110]'>
					<img
						src='/logo/LOGO-ALYX-BLACK.png' // Укажите путь к вашему логотипу
						alt='Lumina Logo'
						className='h-25 w-auto object-contain'
					/>{' '}
				</Link>

				{/* Десктопная навигация */}
				<div className='hidden xl:flex items-center gap-8'>
					{navItems.map(item => (
						<Link
							key={item}
							to={
								item === 'Home'
									? '/'
									: `/${item.toLowerCase().replace(/\s+/g, '-')}`
							}
							// 2. Текст теперь черный (text-black), при наведении остается черным или чуть ярче
							className='relative group text-[13px] font-bold uppercase tracking-widest text-black transition-colors duration-300'
						>
							<span className='transition-colors duration-300'>{item}</span>
							{/* Красная линия при наведении */}
							<span
								className='absolute -bottom-2 left-1/2 w-0 h-[2px] -translate-x-1/2 transition-all duration-300 group-hover:w-full'
								style={{ backgroundColor: brandRed }}
							></span>
						</Link>
					))}
				</div>

				{/* Правая кнопка в темном стиле для контраста */}
				<Link
					to='/signup'
					className='hidden xl:block text-[11px]  uppercase tracking-[0.2em] border border-black/15 px-7 py-3 text-black hover:bg-black hover:text-white transition-all duration-500 text-center'
				>
					Sign up
				</Link>

				{/* Кнопка Бургера (черная для светлого фона) */}
				<button
					onClick={() => setIsOpen(!isOpen)}
					className='xl:hidden z-[110] text-black p-2 transition-transform active:scale-90'
				>
					{isOpen ? <X size={32} /> : <Menu size={32} />}
				</button>

				{/* Мобильное Меню (Светлый Overlay) */}
				<div
					className={`
          fixed top-0 left-0 w-full h-screen bg-white/95 backdrop-blur-2xl transition-all duration-500 ease-in-out flex flex-col items-center justify-center gap-6
          ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
          xl:hidden
        `}
				>
					{navItems.map((item, index) => (
						<Link
							key={item}
							to={
								item === 'Home'
									? '/'
									: `/${item.toLowerCase().replace(/\s+/g, '-')}`
							}
							onClick={() => setIsOpen(false)}
							// Текст в мобильном меню тоже черный
							className='relative group text-2xl font-bold uppercase tracking-widest text-black'
							style={{ transitionDelay: `${index * 50}ms` }}
						>
							{item}
							<span
								className='absolute -bottom-2 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full'
								style={{ backgroundColor: brandRed }}
							></span>
						</Link>
					))}

					<Link
						to='/signup'
						onClick={() => setIsOpen(false)} // Закрываем меню при клике
						className='mt-8 text-[13px]  uppercase tracking-[0.2em] border border-black/20 px-10 py-4 text-black hover:bg-black hover:text-white transition-all text-center'
					>
						Sign up
					</Link>
				</div>
			</div>
		</nav>
	)
}

export default Navbar

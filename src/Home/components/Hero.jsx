import React, { useState, useEffect, useCallback } from 'react' // Добавили хуки
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { data, Link } from 'react-router-dom'
import apiClient from '../../api/api'
import {useLoader} from "../../LoaderContext.jsx";

const Hero = () => {
	const brandRed = '#e21e26'
	const {showLoader, hideLoader} = useLoader()

	const [items, setItems] = useState([])
	const [loading, setLoading] = useState(false)
	useEffect(() => {
		const getBanners = async () => {
			setLoading(true)
			showLoader()
			try {
				const response = await apiClient.get('/get-banners')
				const data = await response.data
				setItems(data)
				console.log(data)
			} catch (error) {
				console.log(error)
			} finally {
				setLoading(false)
				hideLoader()
			}
		}
		getBanners()
	}, [])

	// Используем useCallback, чтобы функцию можно было безопасно использовать в useEffect
	const handleNext = useCallback(() => {
		setItems(prev => {
			const [first, ...rest] = prev
			return [...rest, first]
		})
	}, [])

	const handlePrev = useCallback(() => {
		setItems(prev => {
			const last = prev[prev.length - 1]
			const rest = prev.slice(0, -1)
			return [last, ...rest]
		})
	}, [])

	// Автоплей каждые 3 секунды
	useEffect(() => {
		const timer = setInterval(() => {
			handleNext()
		}, 5000)

		// Очистка таймера при кликах или размонтировании
		return () => clearInterval(timer)
	}, [handleNext, items]) // items в зависимостях, чтобы таймер сбрасывался при смене слайда

	return (
		<main className='relative w-full h-[85vh] overflow-hidden bg-black mt-23'>
			<ul className='slider'>
				{!loading
					? items.map(item => (
							<li
								key={item.id}
								className='hero-item'
								style={{ backgroundImage: `url(${item.banner_image})` }}
							>
								<div className='active-slide-overlay absolute inset-0 bg-black/20 z-10 hidden' />
								<div className='hero-content'>
									<h2 className='text-2xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-4 text-white max-w-[260px] md:max-w-4xl break-words'>
										{item.title.split(' ')[0]} <br />
										<span style={{ color: brandRed }}>
											{item.title.split(' ').slice(1).join(' ')}
										</span>
									</h2>

									<p className='text-gray-200 text-[9px] md:text-xs uppercase tracking-[0.2em] leading-relaxed mb-6 md:mb-10 opacity-80 font-bold max-w-[160px] md:max-w-sm'>
										{item.short_description}
									</p>

									<a
										href={item.url}
										className='inline-block px-6 py-3 md:px-10 md:py-4 border-2 border-white text-white text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 hover:bg-[#e21e26] hover:border-[#e21e26]'
									>
										Read More
									</a>
								</div>
							</li>
						))
					: ''}
			</ul>

			<nav className='absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-4 select-none'>
				<button
					onClick={handlePrev}
					className='p-4 rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all duration-300 hover:bg-[#e21e26] hover:border-[#e21e26] hover:text-white active:scale-90 cursor-pointer'
				>
					<ArrowLeft size={20} />
				</button>
				<button
					onClick={handleNext}
					className='p-4 rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all duration-300 hover:bg-[#e21e26] hover:border-[#e21e26] hover:text-white active:scale-90 cursor-pointer'
				>
					<ArrowRight size={20} />
				</button>
			</nav>
		</main>
	)
}

export default Hero

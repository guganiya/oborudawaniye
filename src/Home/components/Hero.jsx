import React, { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import apiClient from '../../api/api'
import { useLoader } from '../../LoaderContext.jsx'
import { useTranslation } from 'react-i18next'

const Hero = () => {
	const { t } = useTranslation()
	const brandRed = '#ff0000'
	const brandYellow = '#ff0000'
	const { showLoader, hideLoader } = useLoader()

	const [items, setItems] = useState([])
	const [loading, setLoading] = useState(false)
	const [currentIndex, setCurrentIndex] = useState(0)

	// Fetch Banners
	useEffect(() => {
		const getBanners = async () => {
			setLoading(true)
			showLoader()
			try {
				const response = await apiClient.get('/get-banners')
				// Assuming response.data is an array of banner objects
				setItems(response.data)
			} catch (error) {
				console.error("Error fetching banners:", error)
			} finally {
				setLoading(false)
				hideLoader()
			}
		}
		getBanners()
	}, [showLoader, hideLoader])

	const handleNext = useCallback(() => {
		setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1))
	}, [items.length])

	const handlePrev = useCallback(() => {
		setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1))
	}, [items.length])

	// Autoplay every 5 seconds
	useEffect(() => {
		if (items.length <= 1) return
		const timer = setInterval(handleNext, 5000)
		return () => clearInterval(timer)
	}, [handleNext, items.length])

	if (loading || items.length === 0) {
		return <main className='w-full h-[85vh] bg-black mt-23' />
	}

	const currentSlide = items[currentIndex]

	return (
		<main className='relative w-full h-[85vh] overflow-hidden bg-black mt-23 font-sans'>
			{/* Background Layer */}
			<div
				className='absolute inset-0 bg-contain bg-no-repeat bg-center transition-opacity duration-1000'
				style={{ backgroundImage: `url(${currentSlide.banner_image})` }}
			>
				{/* Subtle dark overlay to match the photo depth */}
				<div className='absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10' />
			</div>

			{/* Main Content */}
			<div className='relative z-20 h-full flex flex-col justify-center px-6 md:px-24'>
				<div className='max-w-4xl'>
					{/* Multi-color Title Logic */}
					<h2 className='text-4xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-4 text-white'>
						{currentSlide.title.split(' ')[0]} <br />
						<span style={{ color: brandRed }}>
                            {currentSlide.title.split(' ').slice(1).join(' ')}
                        </span>
					</h2>

					<p className='text-gray-200 text-[10px] md:text-sm uppercase tracking-[0.2em] leading-relaxed mb-8 opacity-90 font-bold max-w-lg'>
						{currentSlide.short_description}
					</p>

					{/* The Yellow Button from the photo */}
					<a
						href={currentSlide.url}
						style={{ backgroundColor: brandYellow }}
						className='inline-block px-8 py-3 md:px-12 md:py-4 text-white text-[10px] md:text-xs font-black uppercase tracking-widest transition-transform hover:scale-105 active:scale-95'
					>
						{t('hero_btn_more') || 'Discover More'}
					</a>
				</div>
			</div>

			{/* Dashboard / Stepper Indicators (Bottom Center) */}
			<div className='absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3'>
				{items.map((_, index) => (
					<button
						key={index}
						onClick={() => setCurrentIndex(index)}
						className={`h-[2px] transition-all duration-300 ${
							index === currentIndex ? 'w-12 bg-white' : 'w-6 bg-white/30 hover:bg-white/60'
						}`}
					/>
				))}
			</div>

			{/* Navigation Arrows (Sides) */}
			<nav className='absolute inset-y-0 w-full flex items-center justify-between px-6 z-30 pointer-events-none'>
				<button
					onClick={handlePrev}
					className='pointer-events-auto p-2 text-white/40 hover:text-white transition-colors cursor-pointer'
				>
					<ArrowLeft size={32} strokeWidth={1.5} />
				</button>
				<button
					onClick={handleNext}
					className='pointer-events-auto p-2 text-white/40 hover:text-white transition-colors cursor-pointer'
				>
					<ArrowRight size={32} strokeWidth={1.5} />
				</button>
			</nav>
		</main>
	)
}

export default Hero
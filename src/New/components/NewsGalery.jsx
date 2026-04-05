import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const NewsGalery = ({ gallery, galery }) => {
	// Accept both prop names and use whichever is provided
	const initialData = gallery || galery || []
	const [newsData, setNewsData] = useState(initialData)
	const [currentIndex, setCurrentIndex] = useState(0)
	const [isSliding, setIsSliding] = useState(false)
	const [direction, setDirection] = useState('next')

	// Update newsData when gallery prop changes
	useEffect(() => {
		const newData = gallery || galery || []
		setNewsData(newData)
		setCurrentIndex(0) // Reset index when gallery changes
	}, [gallery, galery])

	// Handle empty or undefined gallery
	if (!newsData || newsData.length === 0) {
		return (
			<section className='py-8 md:py-12 px-4 md:px-6'>
				<div className='max-w-[1100px] mx-auto text-center text-gray-500'>
					No images available
				</div>
			</section>
		)
	}

	const handleNext = () => {
		if (isSliding) return
		setDirection('next')
		setIsSliding(true)
		setTimeout(() => {
			setCurrentIndex(prev => (prev + 1) % newsData.length)
			setIsSliding(false)
		}, 300)
	}

	const handlePrev = () => {
		if (isSliding) return
		setDirection('prev')
		setIsSliding(true)
		setTimeout(() => {
			setCurrentIndex(prev => (prev - 1 + newsData.length) % newsData.length)
			setIsSliding(false)
		}, 300)
	}

	const mainNews = newsData[currentIndex]
	const nextIndex = (currentIndex + 1) % newsData.length
	const sideNews = newsData[nextIndex]

	const getSlideAnimation = () => {
		if (!isSliding) return 'opacity-100 scale-100 translate-x-0'
		if (direction === 'next') {
			return 'opacity-0 -translate-x-full scale-95'
		} else {
			return 'opacity-0 translate-x-full scale-95'
		}
	}

	const getSideSlideAnimation = () => {
		if (!isSliding) return 'opacity-100 scale-100 translate-x-0'
		if (direction === 'next') {
			return 'opacity-0 translate-x-full scale-95'
		} else {
			return 'opacity-0 -translate-x-full scale-95'
		}
	}

	return (
		<section className='py-8 md:py-12 px-4 md:px-6'>
			<div className='max-w-[1100px] mx-auto'>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch'>
					{/* MAIN CARD */}
					<div className='md:col-span-2 relative h-[220px] md:h-[400px] overflow-hidden rounded-[1.5rem] bg-gray-900 shadow-xl'>
						<div
							className={`absolute inset-0 transition-all duration-300 ease-in-out ${getSlideAnimation()}`}
						>
							<img
								src={mainNews?.image || mainNews?.poster || '/placeholder-image.jpg'}
								className='w-full h-full object-cover opacity-80'
								alt={mainNews?.name || mainNews?.title || 'News image'}
								onError={(e) => {
									e.target.src = '/placeholder-image.jpg'
								}}
							/>
							<div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent' />
							<div className='absolute bottom-6 left-6 md:left-8 text-white z-10'>
								<h3 className='font-black text-lg md:text-3xl tracking-tighter uppercase italic leading-tight max-w-[90%]'>
									{mainNews?.name || mainNews?.name_ru || mainNews?.title || 'Untitled'}
								</h3>
							</div>
						</div>
					</div>

					{/* RIGHT COLUMN */}
					<div className='flex flex-col gap-4'>
						{/* SMALL CARD */}
						<div className='relative h-[220px] md:flex-1 overflow-hidden rounded-[1.5rem] bg-gray-900 shadow-lg'>
							<div
								className={`absolute inset-0 transition-all duration-300 ease-in-out ${getSideSlideAnimation()}`}
							>
								<img
									src={sideNews?.image || sideNews?.poster || '/placeholder-image.jpg'}
									className='w-full h-full object-cover opacity-60'
									alt={sideNews?.name || sideNews?.title || 'News image'}
									onError={(e) => {
										e.target.src = '/placeholder-image.jpg'
									}}
								/>
								<div className='absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/80 via-black/30 to-transparent'>
									<p className='text-lg font-black tracking-tighter uppercase text-white italic leading-tight'>
										{sideNews?.name || sideNews?.name_ru || sideNews?.title || 'Untitled'}
									</p>
								</div>
							</div>
						</div>

						{/* NAVIGATION */}
						<div className='mt-auto flex justify-between items-center p-1.5 bg-white rounded-2xl border border-gray-200 shadow-sm'>
							<button
								onClick={handlePrev}
								disabled={isSliding}
								className='group flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
							>
								<div className='relative w-9 h-9 md:w-10 md:h-10 flex items-center justify-center overflow-hidden rounded-xl bg-gray-100 text-black transition-colors group-hover:bg-[#e21e26] group-hover:text-white shrink-0'>
									<ChevronLeft
										size={16}
										strokeWidth={3}
										className='absolute transition-all duration-300 group-hover:-translate-x-10'
									/>
									<ChevronLeft
										size={16}
										strokeWidth={3}
										className='absolute translate-x-10 transition-all duration-300 group-hover:translate-x-0'
									/>
								</div>
								<span className='text-[9px] font-black uppercase tracking-tighter text-gray-400 transition-colors group-hover:text-[#e21e26] pr-1'>
									назад
								</span>
							</button>

							<div className='w-[1px] h-5 bg-gray-200' />

							<button
								onClick={handleNext}
								disabled={isSliding}
								className='group flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
							>
								<span className='text-[9px] font-black uppercase tracking-tighter text-gray-400 transition-colors group-hover:text-[#e21e26] pl-1'>
									далее
								</span>
								<div className='relative w-9 h-9 md:w-10 md:h-10 flex items-center justify-center overflow-hidden rounded-xl bg-gray-100 text-black transition-colors group-hover:bg-[#e21e26] group-hover:text-white shrink-0'>
									<ChevronRight
										size={16}
										strokeWidth={3}
										className='absolute transition-all duration-300 group-hover:translate-x-10'
									/>
									<ChevronRight
										size={16}
										strokeWidth={3}
										className='absolute -translate-x-10 transition-all duration-300 group-hover:translate-x-0'
									/>
								</div>
							</button>
						</div>

						{/* Dots indicator */}
						<div className='flex justify-center gap-2 mt-2'>
							{newsData.map((_, idx) => (
								<button
									key={idx}
									onClick={() => {
										if (!isSliding && idx !== currentIndex) {
											setDirection(idx > currentIndex ? 'next' : 'prev')
											setIsSliding(true)
											setTimeout(() => {
												setCurrentIndex(idx)
												setIsSliding(false)
											}, 300)
										}
									}}
									disabled={isSliding}
									className={`h-1.5 rounded-full transition-all duration-300 ${
										idx === currentIndex
											? 'w-6 bg-[#e21e26]'
											: 'w-1.5 bg-gray-300 hover:bg-gray-400'
									}`}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default NewsGalery
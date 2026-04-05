import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const OtherNews = ({ currentId }) => {
	const newsData = [
		{
			id: 1,
			brand: 'ROBE',
			product: 'LedPOINTE Launch',
			imageUrl:
				'https://images.unsplash.com/photo-1548512198-d1a1b18d2d64?q=80&w=2070',
		},
		{
			id: 2,
			brand: 'ANOLIS',
			product: 'Ambience Lighting',
			imageUrl:
				'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=2070',
		},
		{
			id: 3,
			brand: 'ROBE',
			product: 'iFORTE LTX FS',
			imageUrl:
				'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070',
		},
		{
			id: 4,
			brand: 'ROBE',
			product: 'T11 Profile',
			imageUrl:
				'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070',
		},
	].filter(item => item.id !== parseInt(currentId))

	const [currentIndex, setCurrentIndex] = useState(0)
	const [isSliding, setIsSliding] = useState(false)

	const handleNext = () => {
		if (isSliding) return
		setIsSliding(true)
		setTimeout(() => {
			setCurrentIndex(prev => (prev + 1) % newsData.length)
			setIsSliding(false)
		}, 500)
	}

	const handlePrev = () => {
		if (isSliding) return
		setIsSliding(true)
		setTimeout(() => {
			setCurrentIndex(prev => (prev - 1 + newsData.length) % newsData.length)
			setIsSliding(false)
		}, 500)
	}

	const mainNews = newsData[currentIndex]
	const sideNews = newsData[(currentIndex + 1) % newsData.length]

	return (
		<section className='py-8 md:py-12 px-4 md:px-6'>
			<div className='max-w-[1100px] mx-auto'>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch'>
					{/* ГЛАВНАЯ КАРТОЧКА (Теперь на мобилке h-220 как у маленькой) */}
					<div className='md:col-span-2 relative h-[220px] md:h-[400px] overflow-hidden rounded-[1.5rem] bg-gray-900 shadow-xl'>
						<div
							className={`absolute inset-0 transition-all duration-500 ease-in-out ${
								isSliding ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
							}`}
						>
							<img
								src={mainNews.imageUrl}
								className='w-full h-full object-cover opacity-80'
								alt={mainNews.product}
							/>
							<div className='absolute bottom-6 left-6 md:left-8 text-white'>
								<p className='text-[8px] md:text-[9px] tracking-[0.4em] font-black opacity-70 mb-1 uppercase'>
									{mainNews.brand}
								</p>
								<h3 className='font-black text-lg md:text-3xl tracking-tighter uppercase italic leading-tight'>
									{mainNews.product}
								</h3>
							</div>
						</div>
					</div>

					{/* ПРАВАЯ КОЛОНКА */}
					<div className='flex flex-col gap-4'>
						{/* МАЛАЯ КАРТОЧКА */}
						<div className='relative h-[220px] md:flex-1 overflow-hidden rounded-[1.5rem] bg-gray-900 shadow-lg'>
							<div
								className={`absolute inset-0 transition-all duration-500 ease-in-out ${
									isSliding ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
								}`}
							>
								<img
									src={sideNews.imageUrl}
									className='w-full h-full object-cover opacity-60'
									alt={sideNews.product}
								/>
								<div className='absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/60 to-transparent'>
									<p className='text-[8px] font-black tracking-widest opacity-70 uppercase text-white'>
										{sideNews.brand}
									</p>
									<p className='text-lg font-black tracking-tighter uppercase text-white italic leading-tight'>
										{sideNews.product}
									</p>
								</div>
							</div>
						</div>

						{/* НАВИГАЦИЯ */}
						<div className='mt-auto flex justify-between items-center p-1.5 bg-white rounded-2xl border border-gray-200 shadow-sm'>
							<button
								onClick={handlePrev}
								className='group flex items-center gap-2 transition-all cursor-pointer'
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
								className='group flex items-center gap-2 transition-all cursor-pointer'
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
					</div>
				</div>
			</div>
		</section>
	)
}

export default OtherNews

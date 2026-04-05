import React, { useState, useRef } from 'react'
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react'

const ProductsVideo = ({ videos }) => {
	const [videoData, setVideoData] = useState(videos || [])
	const [selectedVideo, setSelectedVideo] = useState(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [currentIndex, setCurrentIndex] = useState(0)
	const [isSliding, setIsSliding] = useState(false)

	const videoRef = useRef(null)

	// Навигация
	const handleNext = () => {
		if (isSliding || videoData.length <= 1) return
		setIsSliding(true)
		setTimeout(() => {
			setCurrentIndex(prev => (prev + 1) % videoData.length)
			setIsSliding(false)
		}, 500)
	}

	const handlePrev = () => {
		if (isSliding || videoData.length <= 1) return
		setIsSliding(true)
		setTimeout(() => {
			setCurrentIndex(prev => (prev - 1 + videoData.length) % videoData.length)
			setIsSliding(false)
		}, 500)
	}

	// Модальное окно
	const handlePlayVideo = video => {
		if (!video) return
		setSelectedVideo(video)
		setIsModalOpen(true)
	}

	const closeModal = () => {
		setIsModalOpen(false)
		setSelectedVideo(null)
	}

	if (videoData || videoData.length === 0) {
		return (
			<div className='min-h-[400px] flex items-center justify-center'>
				<div className='text-black font-black uppercase tracking-widest'>
					Нету видео...
				</div>
			</div>
		)
	}

	const currentVideo = videoData[currentIndex]
	const nextVideoData = videoData[(currentIndex + 1) % videoData.length]

	return (
		<section className='bg-white py-16 md:py-24 px-4 md:px-6 overflow-hidden'>
			<div className='max-w-[1300px] mx-auto'>
				{/* Заголовок */}
				<div className='flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4'>
					<h2 className='text-black text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none'>
						Продукты <br /> <span className='text-[#e21e26]'>в кадре</span>
					</h2>
					<p className='text-gray-500 max-w-xs text-sm font-medium uppercase tracking-wider'>
						Посмотрите наши товары в действии и оцените качество исполнения.
					</p>
				</div>

				{/* Сетка видео */}
				<div className='grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch'>
					{/* Основное видео (Текущее) */}
					<div className='md:col-span-2 relative h-[400px] md:h-[600px] overflow-hidden rounded-[2.5rem] bg-black group cursor-pointer'>
						<div
							onClick={() => handlePlayVideo(currentVideo)}
							className={`absolute inset-0 transition-all duration-500 ease-in-out ${
								isSliding
									? '-translate-x-full opacity-0'
									: 'translate-x-0 opacity-100'
							}`}
						>
							<img
								src={currentVideo.poster}
								className='w-full h-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-105'
								alt={currentVideo.title}
							/>

							<div className='absolute inset-0 flex items-center justify-center'>
								<div className='w-20 h-20 md:w-28 md:h-28 rounded-full bg-[#e21e26] flex items-center justify-center text-white shadow-2xl transition-transform duration-300 group-hover:scale-110'>
									<Play fill='currentColor' size={32} className='ml-1' />
								</div>
							</div>

							<div className='absolute bottom-10 left-10 text-white'>
								<span className='bg-[#e21e26] px-3 py-1 text-[10px] font-black uppercase tracking-widest mb-4 inline-block'>
									New Collection
								</span>
								<h3 className='font-black text-4xl md:text-7xl tracking-tighter uppercase italic leading-none'>
									{currentVideo.product || currentVideo.title}
								</h3>
							</div>
						</div>
					</div>

					{/* Правая колонка: Следующее видео + Навигация */}
					<div className='flex flex-col gap-6 md:gap-8'>
						<div className='relative flex-1 min-h-[300px] overflow-hidden rounded-[2.5rem] bg-gray-100 group cursor-pointer'>
							<div
								onClick={() => handlePlayVideo(nextVideoData)}
								className={`absolute inset-0 transition-all duration-500 ease-in-out ${
									isSliding
										? '-translate-x-full opacity-0'
										: 'translate-x-0 opacity-100'
								}`}
							>
								<img
									src={nextVideoData.poster}
									className='w-full h-full object-cover opacity-40 transition-transform duration-700 group-hover:scale-110'
									alt='Next video'
								/>
								<div className='absolute inset-0 flex flex-col items-center justify-center text-center p-6'>
									<p className='text-[10px] font-black tracking-[0.3em] uppercase text-black/40 mb-2'>
										Следующее
									</p>
									<p className='text-2xl font-black tracking-tighter uppercase text-black italic'>
										{nextVideoData.product || nextVideoData.title}
									</p>
								</div>
							</div>
						</div>

						{/* Панель управления */}
						<div className='flex justify-between items-center p-3 bg-[#f8f8f8] rounded-full border border-black/5'>
							<button
								onClick={handlePrev}
								className='group flex items-center gap-3 transition-all'
							>
								<div className='w-12 h-12 flex items-center justify-center rounded-full bg-white text-black shadow-sm group-hover:bg-black group-hover:text-white transition-all'>
									<ChevronLeft size={24} />
								</div>
								<span className='hidden sm:block text-[11px] font-black uppercase tracking-tighter'>
									Назад
								</span>
							</button>

							<div className='text-[12px] font-bold font-mono'>
								{String(currentIndex + 1).padStart(2, '0')} /{' '}
								{String(videoData.length).padStart(2, '0')}
							</div>

							<button
								onClick={handleNext}
								className='group flex items-center gap-3 transition-all'
							>
								<span className='hidden sm:block text-[11px] font-black uppercase tracking-tighter'>
									Далее
								</span>
								<div className='w-12 h-12 flex items-center justify-center rounded-full bg-white text-black shadow-sm group-hover:bg-[#e21e26] group-hover:text-white transition-all'>
									<ChevronRight size={24} />
								</div>
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Модальное окно */}
			{isModalOpen && selectedVideo && (
				<div
					className='fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 transition-all'
					onClick={closeModal}
				>
					<div
						className='relative w-full max-w-6xl aspect-video bg-black rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]'
						onClick={e => e.stopPropagation()}
					>
						<button
							onClick={closeModal}
							className='absolute top-6 right-6 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-[#e21e26] text-white flex items-center justify-center transition-all'
						>
							<X size={28} />
						</button>

						<video
							ref={videoRef}
							className='w-full h-full object-contain'
							controls
							autoPlay
							playsInline
							key={selectedVideo.id}
						>
							<source src={selectedVideo.file} type='video/mp4' />
							<source src={selectedVideo.file} type='video/webm' />
						</video>
					</div>
				</div>
			)}
		</section>
	)
}

export default ProductsVideo

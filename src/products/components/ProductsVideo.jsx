import React, { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Play, X, Pause } from 'lucide-react'

const ProductsVideo = ({ productVideos }) => {
	const [videoData, setVideoData] = useState([])
	const [selectedVideo, setSelectedVideo] = useState(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [currentIndex, setCurrentIndex] = useState(0)
	const [isSliding, setIsSliding] = useState(false)
	const [isPlaying, setIsPlaying] = useState(false)

	const videoRef = useRef(null)
	const autoPlayInterval = useRef(null)

	useEffect(() => {
		// Initialize video data from props
		if (productVideos && Array.isArray(productVideos) && productVideos.length > 0) {
			const formattedVideos = productVideos.map(video => ({
				id: video.id,
				title: video.title || video.title_ru,
				titleEn: video.title_en,
				titleRu: video.title_ru,
				titleTk: video.title_tk,
				file: video.file,
				poster: video.poster,
				date: video.date
			}))
			setVideoData(formattedVideos)
		}
	}, [productVideos])

	// Auto-slide every 8 seconds
	useEffect(() => {
		if (videoData.length > 1 && !isModalOpen) {
			autoPlayInterval.current = setInterval(() => {
				handleNext()
			}, 8000)
		}
		return () => {
			if (autoPlayInterval.current) {
				clearInterval(autoPlayInterval.current)
			}
		}
	}, [videoData.length, isModalOpen, currentIndex])

	// Navigation functions
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

	// Modal handlers
	const handlePlayVideo = (video) => {
		if (!video) return
		setSelectedVideo(video)
		setIsModalOpen(true)
	}

	const closeModal = () => {
		setIsModalOpen(false)
		setSelectedVideo(null)
		if (videoRef.current) {
			videoRef.current.pause()
		}
	}

	// Handle keyboard navigation
	useEffect(() => {
		const handleKeyPress = (e) => {
			if (isModalOpen) {
				if (e.key === 'Escape') closeModal()
			} else {
				if (e.key === 'ArrowLeft') handlePrev()
				if (e.key === 'ArrowRight') handleNext()
			}
		}
		window.addEventListener('keydown', handleKeyPress)
		return () => window.removeEventListener('keydown', handleKeyPress)
	}, [isModalOpen, currentIndex])

	if (!videoData || videoData.length === 0) {
		return (
			<div className='min-h-[400px] flex items-center justify-center bg-gray-50 rounded-3xl'>
				<div className='text-center'>
					<div className='text-gray-400 font-black uppercase tracking-widest text-sm mb-2'>
						Нет видео
					</div>
					<p className='text-gray-300 text-xs'>Видео материалы скоро появятся</p>
				</div>
			</div>
		)
	}

	const currentVideo = videoData[currentIndex]
	const nextVideoData = videoData[(currentIndex + 1) % videoData.length]

	return (
		<section className='bg-white py-16 md:py-24 px-4 md:px-6 overflow-hidden'>
			<div className='max-w-[1400px] mx-auto'>
				{/* Header Section */}
				<div className='flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-4'>
					<div>
						<h2 className='text-black text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-none'>
							Продукты <br />
							<span className='text-[#e21e26]'>в кадре</span>
						</h2>
						<div className='w-20 h-1 bg-[#e21e26] mt-4'></div>
					</div>
					<p className='text-gray-500 max-w-xs text-sm font-medium uppercase tracking-wider leading-relaxed'>
						Посмотрите наши товары в действии и оцените качество исполнения.
					</p>
				</div>

				{/* Video Grid */}
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-stretch'>

					{/* Main Video (Current) */}
					<div className='lg:col-span-2 relative h-[450px] md:h-[550px] lg:h-[650px] overflow-hidden rounded-3xl bg-black group cursor-pointer'>
						<div
							onClick={() => handlePlayVideo(currentVideo)}
							className={`absolute inset-0 transition-all duration-500 ease-in-out ${
								isSliding
									? '-translate-x-full opacity-0'
									: 'translate-x-0 opacity-100'
							}`}
						>
							{/* Video Poster */}
							<img
								src={currentVideo.poster}
								className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
								alt={currentVideo.title}
								onError={(e) => {
									e.target.src = 'https://via.placeholder.com/1200x800?text=No+Preview'
								}}
							/>

							{/* Gradient Overlay */}
							<div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent' />

							{/* Play Button */}
							<div className='absolute inset-0 flex items-center justify-center'>
								<div className='w-20 h-20 md:w-28 md:h-28 rounded-full bg-[#e21e26] flex items-center justify-center text-white shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(226,30,38,0.5)]'>
									<Play fill='currentColor' size={32} className='ml-1' />
								</div>
							</div>

							{/* Video Info */}
							<div className='absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white'>
								<div className='flex items-center gap-2 mb-3'>
									<span className='bg-[#e21e26] px-3 py-1 text-[9px] font-black uppercase tracking-widest'>
										Featured
									</span>
									<span className='bg-black/50 backdrop-blur-sm px-3 py-1 text-[9px] font-black uppercase tracking-widest'>
										{new Date(currentVideo.date).getFullYear()}
									</span>
								</div>
								<h3 className='font-black text-3xl md:text-5xl lg:text-6xl tracking-tighter uppercase italic leading-tight'>
									{currentVideo.title}
								</h3>
								{currentVideo.titleEn && (
									<p className='text-white/60 text-sm mt-2 font-medium'>
										{currentVideo.titleEn}
									</p>
								)}
							</div>
						</div>
					</div>

					{/* Right Column: Next Video + Controls */}
					<div className='flex flex-col gap-6'>

						{/* Next Video Preview */}
						<div className='relative flex-1 min-h-[280px] md:min-h-[350px] overflow-hidden rounded-3xl bg-gray-100 group cursor-pointer'>
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
									className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
									alt={nextVideoData.title}
									onError={(e) => {
										e.target.src = 'https://via.placeholder.com/600x400?text=Next+Video'
									}}
								/>

								{/* Gradient Overlay */}
								<div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />

								{/* Content */}
								<div className='absolute inset-0 flex flex-col items-center justify-center text-center p-6'>
									<p className='text-[10px] font-black tracking-[0.3em] uppercase text-white/60 mb-3'>
										Следующее видео
									</p>
									<p className='text-xl md:text-2xl font-black tracking-tighter uppercase text-white italic leading-tight'>
										{nextVideoData.title}
									</p>
									<div className='mt-4 w-12 h-12 rounded-full bg-[#e21e26]/90 flex items-center justify-center text-white transition-all group-hover:scale-110'>
										<Play fill='currentColor' size={20} className='ml-1' />
									</div>
								</div>
							</div>
						</div>

						{/* Navigation Controls */}
						<div className='flex justify-between items-center p-2 bg-[#f8f8f8] rounded-full border border-gray-100 shadow-sm'>
							<button
								onClick={handlePrev}
								className='group flex items-center gap-3 transition-all px-2'
							>
								<div className='w-12 h-12 flex items-center justify-center rounded-full bg-white text-black shadow-sm hover:bg-black hover:text-white transition-all duration-300'>
									<ChevronLeft size={22} />
								</div>
								<span className='hidden sm:block text-[10px] font-black uppercase tracking-wider group-hover:text-[#e21e26] transition-colors'>
									Назад
								</span>
							</button>

							<div className='flex flex-col items-center'>
								<div className='text-[14px] font-bold font-mono tracking-wider'>
									<span className='text-[#e21e26]'>{String(currentIndex + 1).padStart(2, '0')}</span>
									<span className='text-gray-400'> / {String(videoData.length).padStart(2, '0')}</span>
								</div>
								<div className='w-12 h-0.5 bg-gray-200 mt-1 rounded-full overflow-hidden'>
									<div
										className='h-full bg-[#e21e26] transition-all duration-300'
										style={{ width: `${((currentIndex + 1) / videoData.length) * 100}%` }}
									/>
								</div>
							</div>

							<button
								onClick={handleNext}
								className='group flex items-center gap-3 transition-all px-2'
							>
								<span className='hidden sm:block text-[10px] font-black uppercase tracking-wider group-hover:text-[#e21e26] transition-colors'>
									Далее
								</span>
								<div className='w-12 h-12 flex items-center justify-center rounded-full bg-white text-black shadow-sm hover:bg-[#e21e26] hover:text-white transition-all duration-300'>
									<ChevronRight size={22} />
								</div>
							</button>
						</div>

						{/* Video List Preview */}
						<div className='hidden lg:flex gap-2 mt-2'>
							{videoData.slice(0, 3).map((video, idx) => (
								<button
									key={video.id}
									onClick={() => {
										setCurrentIndex(idx)
										setIsSliding(true)
										setTimeout(() => setIsSliding(false), 500)
									}}
									className={`flex-1 aspect-square rounded-xl overflow-hidden transition-all ${
										currentIndex === idx
											? 'ring-2 ring-[#e21e26] scale-95'
											: 'opacity-60 hover:opacity-100'
									}`}
								>
									<img
										src={video.poster}
										alt={video.title}
										className='w-full h-full object-cover'
									/>
								</button>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Modal Video Player */}
			{isModalOpen && selectedVideo && (
				<div
					className='fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 transition-all duration-300'
					onClick={closeModal}
				>
					<div
						className='relative w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl'
						onClick={e => e.stopPropagation()}
					>
						{/* Close Button */}
						<button
							onClick={closeModal}
							className='absolute top-4 right-4 z-20 w-12 h-12 rounded-full bg-black/50 hover:bg-[#e21e26] text-white flex items-center justify-center transition-all duration-300 backdrop-blur-sm'
						>
							<X size={24} />
						</button>

						{/* Video Title */}
						<div className='absolute top-4 left-4 z-20 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full'>
							<h3 className='text-white text-sm font-bold uppercase tracking-wider'>
								{selectedVideo.title}
							</h3>
						</div>

						{/* Video Player */}
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
							Your browser does not support the video tag.
						</video>
					</div>
				</div>
			)}
		</section>
	)
}

export default ProductsVideo
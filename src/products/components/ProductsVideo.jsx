import React, { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react'
import { useTranslation } from 'react-i18next' // Добавлено

const ProductsVideo = ({ productVideos }) => {
	const { t, i18n } = useTranslation() // Добавлено
	const [videoData, setVideoData] = useState([])
	const [selectedVideo, setSelectedVideo] = useState(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [currentIndex, setCurrentIndex] = useState(0)
	const [isSliding, setIsSliding] = useState(false)

	const videoRef = useRef(null)
	const autoPlayInterval = useRef(null)

	// Функция для получения заголовка на нужном языке
	const getVideoTitle = video => {
		const lang = i18n.language
		if (lang === 'en' && video.titleEn) return video.titleEn
		if (lang === 'tk' && video.titleTk) return video.titleTk
		return video.titleRu || video.title
	}

	useEffect(() => {
		if (
			productVideos &&
			Array.isArray(productVideos) &&
			productVideos.length > 0
		) {
			const formattedVideos = productVideos.map(video => ({
				id: video.id,
				title: video.title,
				titleEn: video.title_en,
				titleRu: video.title_ru,
				titleTk: video.title_tk,
				file: video.file,
				poster: video.poster,
				date: video.date,
			}))
			setVideoData(formattedVideos)
		}
	}, [productVideos])

	useEffect(() => {
		if (videoData.length > 1 && !isModalOpen) {
			autoPlayInterval.current = setInterval(() => {
				handleNext()
			}, 8000)
		}
		return () => {
			if (autoPlayInterval.current) clearInterval(autoPlayInterval.current)
		}
	}, [videoData.length, isModalOpen, currentIndex])

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

	const handlePlayVideo = video => {
		if (!video) return
		setSelectedVideo(video)
		setIsModalOpen(true)
	}

	const closeModal = () => {
		setIsModalOpen(false)
		setSelectedVideo(null)
		if (videoRef.current) videoRef.current.pause()
	}

	useEffect(() => {
		const handleKeyPress = e => {
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
						{t('video_no_video')}
					</div>
					<p className='text-gray-300 text-xs'>{t('video_coming_soon')}</p>
				</div>
			</div>
		)
	}

	const currentVideo = videoData[currentIndex]
	const nextVideoData = videoData[(currentIndex + 1) % videoData.length]

	return (
		<section className='bg-white py-16 md:py-24 px-4 md:px-6 overflow-hidden'>
			<div className='max-w-[1400px] mx-auto'>
				<div className='flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-4'>
					<div>
						<h2 className='text-black text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-none'>
							{t('video_title_1')} <br />
							<span className='text-[#e21e26]'>{t('video_title_2')}</span>
						</h2>
						<div className='w-20 h-1 bg-[#e21e26] mt-4'></div>
					</div>
					<p className='text-gray-500 max-w-xs text-sm font-medium uppercase tracking-wider leading-relaxed'>
						{t('video_subtitle')}
					</p>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-stretch'>
					<div className='lg:col-span-2 relative h-[450px] md:h-[550px] lg:h-[650px] overflow-hidden rounded-3xl bg-black group cursor-pointer'>
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
								className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
								alt={getVideoTitle(currentVideo)}
							/>
							<div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent' />
							<div className='absolute inset-0 flex items-center justify-center'>
								<div className='w-20 h-20 md:w-28 md:h-28 rounded-full bg-[#e21e26] flex items-center justify-center text-white shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(226,30,38,0.5)]'>
									<Play fill='currentColor' size={32} className='ml-1' />
								</div>
							</div>
							<div className='absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white'>
								<div className='flex items-center gap-2 mb-3'>
									<span className='bg-[#e21e26] px-3 py-1 text-[9px] font-black uppercase tracking-widest'>
										{t('video_tag_featured')}
									</span>
									<span className='bg-black/50 backdrop-blur-sm px-3 py-1 text-[9px] font-black uppercase tracking-widest'>
										{new Date(currentVideo.date).getFullYear()}
									</span>
								</div>
								<h3 className='font-black text-3xl md:text-5xl lg:text-6xl tracking-tighter uppercase italic leading-tight'>
									{getVideoTitle(currentVideo)}
								</h3>
							</div>
						</div>
					</div>

					<div className='flex flex-col gap-6'>
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
									alt={getVideoTitle(nextVideoData)}
								/>
								<div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
								<div className='absolute inset-0 flex flex-col items-center justify-center text-center p-6'>
									<p className='text-[10px] font-black tracking-[0.3em] uppercase text-white/60 mb-3'>
										{t('video_next')}
									</p>
									<p className='text-xl md:text-2xl font-black tracking-tighter uppercase text-white italic leading-tight'>
										{getVideoTitle(nextVideoData)}
									</p>
									<div className='mt-4 w-12 h-12 rounded-full bg-[#e21e26]/90 flex items-center justify-center text-white transition-all group-hover:scale-110'>
										<Play fill='currentColor' size={20} className='ml-1' />
									</div>
								</div>
							</div>
						</div>

						<div className='flex justify-between items-center p-2 bg-[#f8f8f8] rounded-full border border-gray-100 shadow-sm'>
							<button
								onClick={handlePrev}
								className='group flex items-center gap-3 transition-all px-2'
							>
								<div className='w-12 h-12 flex items-center justify-center rounded-full bg-white text-black shadow-sm hover:bg-black hover:text-white transition-all duration-300'>
									<ChevronLeft size={22} />
								</div>
								<span className='hidden sm:block text-[10px] font-black uppercase tracking-wider group-hover:text-[#e21e26] transition-colors'>
									{t('product_back')}
								</span>
							</button>
							<div className='flex flex-col items-center'>
								<div className='text-[14px] font-bold font-mono tracking-wider'>
									<span className='text-[#e21e26]'>
										{String(currentIndex + 1).padStart(2, '0')}
									</span>
									<span className='text-gray-400'>
										{' '}
										/ {String(videoData.length).padStart(2, '0')}
									</span>
								</div>
								<div className='w-12 h-0.5 bg-gray-200 mt-1 rounded-full overflow-hidden'>
									<div
										className='h-full bg-[#e21e26] transition-all duration-300'
										style={{
											width: `${((currentIndex + 1) / videoData.length) * 100}%`,
										}}
									/>
								</div>
							</div>
							<button
								onClick={handleNext}
								className='group flex items-center gap-3 transition-all px-2'
							>
								<span className='hidden sm:block text-[10px] font-black uppercase tracking-wider group-hover:text-[#e21e26] transition-colors'>
									{t('video_next_btn')}
								</span>
								<div className='w-12 h-12 flex items-center justify-center rounded-full bg-white text-black shadow-sm hover:bg-[#e21e26] hover:text-white transition-all duration-300'>
									<ChevronRight size={22} />
								</div>
							</button>
						</div>
					</div>
				</div>
			</div>

			{isModalOpen && selectedVideo && (
				<div
					className='fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 transition-all duration-300'
					onClick={closeModal}
				>
					<div
						className='relative w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl'
						onClick={e => e.stopPropagation()}
					>
						<button
							onClick={closeModal}
							className='absolute top-4 right-4 z-20 w-12 h-12 rounded-full bg-black/50 hover:bg-[#e21e26] text-white flex items-center justify-center transition-all duration-300 backdrop-blur-sm'
						>
							<X size={24} />
						</button>
						<div className='absolute top-4 left-4 z-20 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full'>
							<h3 className='text-white text-sm font-bold uppercase tracking-wider'>
								{getVideoTitle(selectedVideo)}
							</h3>
						</div>
						<video
							ref={videoRef}
							className='w-full h-full object-contain'
							controls
							autoPlay
							playsInline
							key={selectedVideo.id}
						>
							<source src={selectedVideo.file} type='video/mp4' />
							Your browser does not support the video tag.
						</video>
					</div>
				</div>
			)}
		</section>
	)
}

export default ProductsVideo

import React, { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react'
import apiClient from '../../api/api'
import { useLoader } from '../../LoaderContext.jsx'

const VideoSection = () => {
	const [videoData, setVideoData] = useState([])
	const [loading, setLoading] = useState(true)
	const [selectedVideo, setSelectedVideo] = useState(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const videoRef = useRef(null)
	const { showLoader, hideLoader } = useLoader()

	useEffect(() => {
		const getVideos = async () => {
			setLoading(true)
			showLoader()
			try {
				const response = await apiClient.get('/videos')
				const data = await response.data
				setVideoData(data.results)
				console.log(data.results)
			} catch (error) {
				console.log(error)
			} finally {
				setLoading(false)
				hideLoader()
			}
		}
		getVideos()
	}, [])

	const [currentIndex, setCurrentIndex] = useState(0)
	const [isSliding, setIsSliding] = useState(false)

	const handleNext = () => {
		if (isSliding || videoData.length === 0) return
		setIsSliding(true)
		setTimeout(() => {
			setCurrentIndex(prev => (prev + 1) % videoData.length)
			setIsSliding(false)
		}, 500)
	}

	const handlePrev = () => {
		if (isSliding || videoData.length === 0) return
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
		if (videoRef.current) {
			videoRef.current.pause()
		}
	}

	// Check if data is loaded and has videos
	if (loading) {
		return (
			<div className='min-h-screen bg-white flex items-center justify-center'>
				<div className='text-black text-xl'>Загрузка...</div>
			</div>
		)
	}

	if (!videoData || videoData.length === 0) {
		return (
			<div className='min-h-screen bg-white flex items-center justify-center'>
				<div className='text-black text-xl'>Нет видео</div>
			</div>
		)
	}

	const currentVideo = videoData[currentIndex]
	const nextVideoData = videoData[(currentIndex + 1) % videoData.length]

	return (
		<>
			<div className='min-h-screen bg-white py-12 md:py-24 px-4 md:px-6 flex flex-col items-center font-sans overflow-hidden'>
				<h2 className='text-black text-4xl md:text-5xl font-black mb-12 md:mb-16 uppercase tracking-tighter text-center'>
					видео
				</h2>

				<div className='grid max-w-[1300px] w-full grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch mb-20'>
					<div className='md:col-span-2 relative h-[350px] md:h-[550px] overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-black group cursor-pointer'>
						<div
							onClick={() => handlePlayVideo(currentVideo)}
							className={`absolute inset-0 block transition-all duration-500 ease-in-out ${
								isSliding
									? '-translate-x-full opacity-0'
									: 'translate-x-0 opacity-100'
							}`}
						>
							{currentVideo && (
								<>
									<img
										src={currentVideo.poster}
										className='w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105'
										alt={currentVideo.product || currentVideo.title}
									/>

									<div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
										<div className='w-16 h-16 md:w-24 md:h-24 rounded-full bg-[#e21e26] flex items-center justify-center text-white shadow-2xl transition-transform duration-300 group-hover:scale-110'>
											<div className='relative flex items-center justify-center w-full h-full'>
												<Play
													fill='currentColor'
													size={28}
													className='ml-[0%] md:ml-[0%] md:size-10'
												/>
											</div>
										</div>
									</div>

									<div className='absolute top-8 md:top-12 left-0 w-full text-center text-white p-4'>
										<p className='text-[10px] md:text-[11px] tracking-[0.4em] md:tracking-[0.5em] font-black opacity-60 mb-1 md:mb-2 uppercase'>
											{currentVideo.brand || ''}
										</p>
										<h3 className='font-black text-3xl md:text-6xl tracking-tighter uppercase italic'>
											{currentVideo.product || currentVideo.title}
										</h3>
									</div>
								</>
							)}
						</div>
					</div>

					<div className='flex flex-col gap-6 md:gap-8'>
						<div className='relative h-[350px] overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-black shadow-lg group cursor-pointer'>
							<div
								onClick={() => handlePlayVideo(nextVideoData)}
								className={`absolute inset-0 block transition-all duration-500 ease-in-out ${
									isSliding
										? '-translate-x-full opacity-0'
										: 'translate-x-0 opacity-100'
								}`}
							>
								{nextVideoData && (
									<>
										<img
											src={nextVideoData.poster}
											className='w-full h-full object-cover opacity-40 transition-transform duration-700 group-hover:scale-110'
											alt={nextVideoData.product || nextVideoData.title}
										/>
										<div className='absolute inset-0 flex flex-col items-center justify-center text-center p-6'>
											<div className='w-14 h-14 rounded-full bg-[#e21e26] flex items-center justify-center text-white mb-4 shadow-xl transition-transform duration-300 group-hover:scale-110'>
												<div className='relative flex items-center justify-center w-full h-full'>
													<Play
														fill='currentColor'
														size={20}
														className='ml-[0%] size-5'
													/>
												</div>
											</div>
											<p className='text-[10px] font-black tracking-widest opacity-60 uppercase text-white mb-1'>
												{nextVideoData.brand || ''}
											</p>
											<p className='text-3xl font-black tracking-tighter uppercase text-white italic'>
												{nextVideoData.product || nextVideoData.title}
											</p>
										</div>
									</>
								)}
							</div>
						</div>

						<div className='mt-auto flex justify-between items-center p-2 md:p-4 bg-[#f1f1f1] rounded-full border border-black/5'>
							<button
								onClick={handlePrev}
								className='group flex items-center gap-2 md:gap-3 transition-all cursor-pointer'
								disabled={videoData.length === 0}
							>
								<div className='relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center overflow-hidden rounded-full bg-white text-black transition-colors group-hover:bg-[#e21e26] group-hover:text-white shrink-0 shadow-sm'>
									<ChevronLeft
										size={20}
										className='absolute transition-all duration-300 group-hover:-translate-x-10'
									/>
									<ChevronLeft
										size={20}
										className='absolute translate-x-10 transition-all duration-300 group-hover:translate-x-0'
									/>
								</div>
								<span className='text-[10px] md:text-[11px] font-black uppercase tracking-tighter text-black transition-colors group-hover:text-[#e21e26]'>
									предыдущее
								</span>
							</button>

							<div className='w-[1px] h-6 md:h-8 bg-black/10' />

							<button
								onClick={handleNext}
								className='group flex items-center gap-2 md:gap-3 transition-all cursor-pointer'
								disabled={videoData.length === 0}
							>
								<span className='text-[10px] md:text-[11px] font-black uppercase tracking-tighter text-black transition-colors group-hover:text-[#e21e26]'>
									следующее
								</span>
								<div className='relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center overflow-hidden rounded-full bg-white text-black transition-colors group-hover:bg-[#e21e26] group-hover:text-white shrink-0 shadow-sm'>
									<ChevronRight
										size={20}
										className='absolute transition-all duration-300 group-hover:translate-x-10'
									/>
									<ChevronRight
										size={20}
										className='absolute -translate-x-10 transition-all duration-300 group-hover:translate-x-0'
									/>
								</div>
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Video Modal */}
			{isModalOpen && selectedVideo && (
				<div
					className='fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-300'
					onClick={closeModal}
				>
					<div
						className='relative w-full max-w-5xl mx-4 bg-black rounded-2xl overflow-hidden shadow-2xl'
						onClick={e => e.stopPropagation()}
					>
						<button
							onClick={closeModal}
							className='absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-[#e21e26] text-white flex items-center justify-center transition-all duration-300 hover:scale-110'
						>
							<X size={24} />
						</button>

						<div className='absolute top-4 left-4 z-10 text-white bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg'>
							<p className='text-xs tracking-[0.2em] font-black opacity-80 uppercase'>
								{selectedVideo.brand || ''}
							</p>
							<h3 className='font-black text-xl tracking-tighter uppercase italic'>
								{selectedVideo.product || selectedVideo.title}
							</h3>
						</div>

						<video
							ref={videoRef}
							className='w-full h-auto max-h-[80vh]'
							controls
							autoPlay
							playsInline
							key={selectedVideo.id}
						>
							<source src={selectedVideo.file} type='video/webm' />
							<source src={selectedVideo.file} type='video/mp4' />
							Your browser does not support the video tag.
						</video>
					</div>
				</div>
			)}

			<style>{`
				@keyframes fade-in {
					from {
						opacity: 0;
					}
					to {
						opacity: 1;
					}
				}
				.animate-in {
					animation: fade-in 0.3s ease-out;
				}
			`}</style>
		</>
	)
}

export default VideoSection

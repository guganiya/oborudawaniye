import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import apiClient from '../../api/api'
import { useLoader } from '../../LoaderContext.jsx'
import { useTranslation } from 'react-i18next'

// Swiper Imports
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'

// Swiper Styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

const Tag = ({ text }) => (
	<Link
		to={`/news?category_id=${text.id}`}
		className='px-4 py-2 border border-white/20 bg-black/40 backdrop-blur-md text-white text-sm font-medium hover:bg-white hover:text-black transition-all duration-300 rounded-[5px]'
	>
		{text.name}
	</Link>
)

const Card = ({ title, imageUrl, to = '#' }) => {
	return (
		<Link
			to={to}
			className="group relative block overflow-hidden rounded-[5px] bg-[#121212] border border-white/5 text-white transition-all duration-500 hover:border-white/20 h-[450px] w-full"
		>
			<div className='absolute inset-0 z-0'>
				<img
					src={imageUrl}
					alt={title}
					className='w-full h-full object-cover opacity-60 transition-all duration-700 ease-out group-hover:scale-110 group-hover:opacity-80'
				/>
				<div className='absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent' />
			</div>

			<div className='relative z-10 p-8 flex justify-end'>
				<div className='flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 transition-all duration-300 group-hover:bg-white group-hover:text-black'>
					<svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5'>
						<line x1='7' y1='17' x2='17' y2='7'></line>
						<polyline points='7 7 17 7 17 17'></polyline>
					</svg>
				</div>
			</div>

			<div className='relative z-10 p-8 mt-auto'>
				<h3 className="text-2xl md:text-3xl font-bold leading-[1.1] tracking-tight">
					{title}
				</h3>
			</div>
		</Link>
	)
}

const New = () => {
	const { t } = useTranslation()
	const [categories, setCategories] = useState([])
	const { showLoader, hideLoader } = useLoader()
	const [news, setNews] = useState([])

	useEffect(() => {
		const fetchData = async () => {
			showLoader()
			try {
				const [catRes, newsRes] = await Promise.all([
					apiClient.get('/get-news-categories'),
					apiClient.get('/main-news')
				])
				setCategories(catRes.data || [])
				setNews(newsRes.data || [])
			} catch (error) {
				console.error("Error fetching data:", error)
			} finally {
				hideLoader()
			}
		}
		fetchData()
	}, [])

	const mainBg = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072'

	// Logic to prevent the Swiper Loop Warning
	// Loop only if slides > 5 (for 2.5 slidesPerView)
	const shouldLoop = news.length > 5;

	return (
		<div
			className='min-h-screen py-16 flex flex-col items-center font-sans bg-fixed bg-cover bg-center relative overflow-hidden'
			style={{
				backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.9)), url(${mainBg})`,
			}}
		>
			<h2 className='relative z-10 text-white text-4xl md:text-5xl font-black mb-12 uppercase tracking-tighter px-6 text-center'>
				{t('news_main_title')}
			</h2>

			{/* Categories */}
			<div className='relative z-10 flex flex-wrap justify-center gap-3 max-w-5xl mb-16 px-6'>
				{categories.map((cat, index) => (
					<Tag key={index} text={cat} />
				))}
			</div>

			{/* Slider Container */}
			<div className='relative z-10 w-full mb-16'>
				{news.length > 0 && (
					<Swiper
						modules={[Autoplay, Pagination, Navigation]}
						spaceBetween={30}
						centeredSlides={true}
						// Force loop even with 5 slides
						loop={true}
						loopedSlides={5}
						// Set to 3000ms (3 seconds) as requested
						autoplay={{
							delay: 3000,
							disableOnInteraction: false,
							pauseOnMouseEnter: true
						}}
						pagination={{ clickable: true }}
						navigation={true}
						breakpoints={{
							320: { slidesPerView: 1.1, spaceBetween: 20 },
							768: { slidesPerView: 2, spaceBetween: 30 },
							1024: { slidesPerView: 2.5, spaceBetween: 40 },
						}}
						className="news-swiper !pb-14 !px-4"
					>
						{news.map((item) => (
							<SwiperSlide key={item.id}>
								{({ isActive }) => (
									<div className={`transition-all duration-500 ${isActive ? 'scale-100 opacity-100' : 'scale-90 opacity-40'}`}>
										<Card
											to={`news-content/${item.id}`}
											title={item.title}
											imageUrl={item.poster}
										/>
									</div>
								)}
							</SwiperSlide>
						))}
					</Swiper>
				)}
			</div>

			<Link
				to='/news'
				className='group relative px-10 py-4 bg-transparent border border-white/20 text-white font-bold uppercase tracking-widest overflow-hidden transition-all duration-300 hover:border-white rounded-[5px]'
			>
				<span className='relative z-10 text-sm'>{t('news_btn_more')}</span>
				<div className='absolute inset-0 bg-white translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300'></div>
			</Link>

			<style dangerouslySetInnerHTML={{ __html: `
             .news-swiper .swiper-pagination-bullet { background: white; opacity: 0.3; }
             .news-swiper .swiper-pagination-bullet-active { background: white; opacity: 1; }
             .news-swiper .swiper-button-next, .news-swiper .swiper-button-prev { color: white; transform: scale(0.7); }
             .group:hover span { color: black !important; transition: color 0.3s; }
          `}} />
		</div>
	)
}

export default New
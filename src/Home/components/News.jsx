import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MoveRight } from 'lucide-react' // Updated to match the arrow in the photo
import apiClient from '../../api/api'
import { useLoader } from '../../LoaderContext.jsx'
import { useTranslation } from 'react-i18next'

const News = () => {
	const { t } = useTranslation()
	const { showLoader, hideLoader } = useLoader()
	const [news, setNews] = useState([])

	useEffect(() => {
		const fetchNews = async () => {
			showLoader()
			try {
				const response = await apiClient.get('/main-news')
				// Take only first 4 items to match the photo grid
				setNews(response.data?.slice(0, 4) || [])
			} catch (error) {
				console.error("Error fetching news:", error)
			} finally {
				hideLoader()
			}
		}
		fetchNews()
	}, [showLoader, hideLoader])

	return (
		<section className='bg-white py-12 px-6 md:px-20 font-sans'>
			{/* Header Section */}
			<div className='flex justify-between items-end mb-10 border-b border-gray-100 pb-6'>
				<h2 className='text-3xl md:text-4xl font-extrabold text-[#222] tracking-tight'>
					{t('news_main_title') || 'News'}
				</h2>
				<Link
					to='/news'
					className='flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-800 hover:opacity-70 transition-opacity'
				>
					{t('view_all') || 'View All'}
					<MoveRight size={16} />
				</Link>
			</div>

			{/* News Grid */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
				{news.map((item) => (
					<Link
						key={item.id}
						to={`/news-content/${item.id}`}
						className='group flex flex-col'
					>
						{/* Image Wrapper */}
						<div className='aspect-[16/9] overflow-hidden mb-4 bg-gray-100'>
							<img
								src={item.poster}
								alt={item.title}
								className='w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105'
							/>
						</div>

						{/* Date */}
						<span className='text-[11px] text-gray-400 font-medium mb-2 uppercase'>
                            {item.date}
                        </span>

						{/* Title */}
						<h3 className='text-[17px] font-bold leading-tight text-[#1a1a1a] mb-3 group-hover:text-red-600 transition-colors line-clamp-2'>
							{item.title}
						</h3>

						{/* Short Description */}
						<p className='text-[13px] text-gray-600 leading-relaxed line-clamp-3'>
							{item.short_description || item.description}
						</p>
					</Link>
				))}
			</div>
		</section>
	)
}

export default News
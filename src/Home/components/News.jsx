import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import apiClient from '../../api/api'
import { useLoader } from '../../LoaderContext.jsx'
import { useTranslation } from 'react-i18next' // Только это добавлено

const Tag = ({ text }) => (
	<Link
		to={`/news?category_id=${text.id}`}
		className='px-4 py-2 border border-white/20 bg-black/40 backdrop-blur-md text-white text-sm font-medium hover:bg-white hover:text-black transition-all duration-300 rounded-sm'
	>
		{text.name}
	</Link>
)

const Card = ({ title, imageUrl, size = 'small', to = '#' }) => {
	const isLarge = size === 'large'

	return (
		<Link
			to={to}
			className={`group relative block overflow-hidden rounded-[2rem] bg-[#121212] border border-white/5 text-white transition-all duration-500 hover:border-white/20 ${
				isLarge
					? 'h-full flex flex-col justify-between'
					: 'h-[250px] flex flex-col justify-between'
			}`}
		>
			{/* Фото внутри карточки */}
			<div className='absolute inset-0 z-0'>
				<img
					src={imageUrl}
					alt={title}
					className='w-full h-full object-cover opacity-60 transition-all duration-700 ease-out group-hover:scale-110 group-hover:opacity-80'
				/>
				<div className='absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent' />
			</div>

			{/* Контейнер стрелки (смотрит в правый верхний угол) */}
			<div className='relative z-10 p-8 flex justify-end'>
				<div className='flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 transition-all duration-300 group-hover:bg-white group-hover:text-black group-hover:translate-x-1 group-hover:-translate-y-1'>
					<svg
						width='20'
						height='20'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth='2.5'
						strokeLinecap='round'
						strokeLinejoin='round'
					>
						{/* Диагональная стрелка */}
						<line x1='7' y1='17' x2='17' y2='7'></line>
						<polyline points='7 7 17 7 17 17'></polyline>
					</svg>
				</div>
			</div>

			{/* Заголовок */}
			<div className='relative z-10 p-8'>
				<h3
					className={`${isLarge ? 'text-4xl' : 'text-2xl'} font-bold leading-[1.1] tracking-tight max-w-[90%]`}
				>
					{title}
				</h3>
			</div>
		</Link>
	)
}

const New = () => {
	const { t } = useTranslation() // Добавлено
	const [categories, setCategories] = useState([])
	const { showLoader, hideLoader } = useLoader()
	const [loading, setLoading] = useState(false)
	const [news, setNews] = useState([])
	const [lastNews, setLastNews] = useState([])
	useEffect(() => {
		const getCategories = async () => {
			setLoading(true)
			showLoader()
			try {
				const response = await apiClient.get('/get-news-categories')
				const data = await response.data
				setCategories(data)
				console.log(data)
			} catch (error) {
				console.log(error)
			} finally {
				setLoading(false)
				hideLoader()
			}
		}

		const getNews = async () => {
			setLoading(true)
			try {
				const response = await apiClient.get('/main-news')
				const data = await response.data
				setNews(data)
				setLastNews(data.slice(1, 3))
				console.log('News:', data)
			} catch (error) {
				console.log(error)
			} finally {
				setLoading(false)
			}
		}
		getNews()

		getCategories()
	}, [])

	const mainBg =
		'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072'

	return (
		<div
			className='min-h-screen py-16 px-6 flex flex-col items-center font-sans bg-fixed bg-cover bg-center relative'
			style={{
				backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.9)), url(${mainBg})`,
			}}
		>
			<h2 className='relative z-10 text-white text-4xl md:text-5xl font-black mb-12 uppercase tracking-tighter'>
				{t('news_main_title')}
			</h2>

			<div className='relative z-10 flex flex-wrap justify-center gap-3 max-w-5xl mb-16'>
				{categories.map((cat, index) => (
					<Tag key={index} text={cat} />
				))}
			</div>

			<div className='relative z-10 grid max-w-6xl w-full grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[500px] mb-12'>
				<div className='md:col-span-2'>
					{
						<Card
							to={`news-content/${news[0]?.id}`}
							size='large'
							title={news[0]?.title}
							imageUrl={news[0]?.poster}
						/>
					}
				</div>

				<div className='flex flex-col gap-6'>
					{lastNews.map(news => (
						<Card
							to={`news-content/${news.id}`}
							title={news.title}
							imageUrl={news.poster}
						/>
					))}
				</div>
			</div>

			<Link
				to='/news'
				className='group relative px-10 py-4 bg-transparent border border-white/20 text-white font-bold uppercase tracking-widest overflow-hidden transition-all duration-300 hover:border-white'
			>
				<span className='relative z-10 text-sm'>{t('news_btn_more')}</span>
				<div className='absolute inset-0 bg-white translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300'></div>
				<style
					dangerouslySetInnerHTML={{
						__html: `
          .group:hover span { color: black; transition: color 0.3s; }
        `,
					}}
				/>
			</Link>
		</div>
	)
}

export default New

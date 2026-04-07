import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next' // Добавлено

const ProductCard = ({ item, isHovered, onHoverChange }) => {
	const { i18n } = useTranslation() // Добавлено для получения текущего языка

	return (
		<Link to={`/news-content/${item.id}`}>
			<div
				className={`relative bg-white w-full shadow-[0_15px_40px_rgba(0,0,0,0.04)] rounded-sm overflow-hidden transition-all duration-500 ease-in-out cursor-pointer group ${
					isHovered
						? 'scale-[1.03] shadow-[0_25px_50px_rgba(0,0,0,0.12)]'
						: 'scale-100'
				}`}
				onMouseEnter={() => onHoverChange(true)}
				onMouseLeave={() => onHoverChange(false)}
			>
				{/* Изображение */}
				<div className='relative aspect-square overflow-hidden'>
					<img
						src={item.poster}
						alt={item.title}
						className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
						loading='lazy'
					/>
					{/* Метка категории */}
					<div className='absolute top-4 right-4 bg-[#4a4a4a] text-white text-[10px] font-black px-3 py-1 uppercase tracking-[0.1em]'>
						{item.category}
					</div>
				</div>

				{/* Текстовый контент */}
				<div className='p-6 flex flex-col gap-2 relative bg-white'>
					<span className='text-gray-400 text-[11px] font-bold tracking-widest'>
						{new Date(item.created_at || item.date).toLocaleDateString(
							i18n.language === 'tk' ? 'tr-TR' : i18n.language,
							{
								year: 'numeric',
								month: 'long',
								day: 'numeric',
							},
						)}
					</span>

					<h3
						className={`text-xl md:text-2xl font-black uppercase tracking-tighter leading-tight transition-colors duration-300 ${
							isHovered ? 'text-[#e21e26]' : 'text-black'
						}`}
					>
						{item.title}
					</h3>

					<p className='text-gray-500 text-sm font-medium leading-relaxed mb-4 line-clamp-3'>
						{item.short_description}
					</p>

					{/* Красная горизонтальная линия снизу */}
					<div className='relative h-[1.5px] w-full bg-gray-100 overflow-hidden'>
						<div
							className={`absolute inset-0 bg-[#e21e26] transition-transform duration-500 origin-left ${
								isHovered ? 'translate-x-0' : '-translate-x-full'
							}`}
						/>
					</div>
				</div>
			</div>
		</Link>
	)
}

const ProductNew = ({ productNews = [] }) => {
	const { t } = useTranslation() // Добавлено
	const [hoveredStates, setHoveredStates] = useState({})

	const handleHoverChange = (index, isHovered) => {
		setHoveredStates(prev => ({ ...prev, [index]: isHovered }))
	}

	if (!productNews || productNews.length === 0) {
		return null
	}

	return (
		<div className='min-h-screen bg-white py-20 px-6 font-sans'>
			<div className='max-w-[1200px] mx-auto'>
				{/* Заголовок секции */}
				<h2 className='text-2xl md:text-3xl font-black uppercase tracking-tighter mb-10 italic'>
					{t('news_related_title')} <span className='text-[#e21e26]'>.</span>
				</h2>

				{/* Сетка карточек */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
					{productNews.map((item, index) => (
						<ProductCard
							key={item.id}
							item={item}
							isHovered={hoveredStates[index] || false}
							onHoverChange={isHovered => handleHoverChange(index, isHovered)}
						/>
					))}
				</div>

				{/* Кнопка снизу */}
				<div className='flex justify-center mt-16'>
					<Link
						to='/news'
						className='inline-block bg-[#e21e26] text-white px-12 py-4 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-lg shadow-red-500/20 active:scale-95 no-underline'
					>
						{t('news_all_btn')}
					</Link>
				</div>
			</div>
		</div>
	)
}

export default ProductNew

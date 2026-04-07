import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next' // Добавлено
const NewsGridCard = ({ item }) => {
	const { t } = useTranslation() // Добавлено
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			whileHover={{ y: -8 }}
			className='bg-white group h-full flex flex-col shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-all duration-500'
		>
			<Link
				to={`/news-content/${item.id}`}
				className='flex flex-col h-full no-underline'
			>
				{/* Изображение и Категория - уменьшили высоту на мобилках через aspect */}
				<div className='relative aspect-[16/10] md:aspect-[4/3] overflow-hidden bg-gray-100'>
					<img
						src={item.image}
						alt={item.title}
						className='w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700'
					/>
					{/* Серая плашка категории - чуть меньше на мобилках */}
					<div className='absolute top-0 right-0 bg-[#555] text-white text-[8px] md:text-[10px] font-black uppercase tracking-[0.15em] px-3 py-1 md:px-4 md:py-1.5 z-10'>
						{item.topic || t('news_category_default')}
					</div>
				</div>

				{/* Текстовый контент - уменьшили padding на мобилках p-4 вместо p-6 */}
				<div className='p-4 md:p-6 flex flex-col flex-grow border-x border-b border-gray-50'>
					<span className='text-gray-400 text-[9px] md:text-[11px] font-bold mb-2 md:mb-3 tracking-wider'>
						{item.year}
					</span>

					{/* Заголовок - уменьшили шрифт на мобилках text-[14px] */}
					<h3 className='text-black text-[14px] md:text-[17px] font-black uppercase leading-[1.2] mb-3 md:mb-4 tracking-tighter group-hover:text-[#e21e26] transition-colors duration-300'>
						{item.title}
					</h3>

					{/* Описание - уменьшили шрифт и ограничили 2 строками на мобилках */}
					<p className='text-gray-500 text-[11px] md:text-[13px] leading-[1.5] line-clamp-2 md:line-clamp-3 font-medium'>
						{item.description}
					</p>

					{/* Декоративная линия - чуть меньше отступ */}
					<div className='mt-auto pt-4 md:pt-6'>
						<div className='w-6 md:w-8 h-[2px] bg-gray-100 group-hover:w-full group-hover:bg-[#e21e26] transition-all duration-500' />
					</div>
				</div>
			</Link>
		</motion.div>
	)
}

export default NewsGridCard

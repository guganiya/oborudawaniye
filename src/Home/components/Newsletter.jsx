import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next' // Добавлено

const Newsletter = () => {
	const { t } = useTranslation() // Добавлено

	return (
		<section className='w-full bg-white py-24 px-6 flex flex-col items-center text-center font-sans'>
			{/* Заголовок с красной точкой */}
			<h2 className='text-[#1a1a1a] text-4xl md:text-5xl font-bold mb-6 tracking-tight'>
				{t('newsletter_title')}
			</h2>

			{/* Подзаголовок */}
			<p className='text-[#4a4a4a] text-lg md:text-xl max-w-2xl mb-12 leading-relaxed font-normal'>
				{t('newsletter_subtitle')}
			</p>

			{/* Кнопка Link */}
			<Link
				to='/signup'
				className='relative inline-block bg-[#e21e26] text-white px-12 py-5 font-bold text-[13px] uppercase tracking-[0.2em] transition-all duration-300 hover:bg-[#b8181e] active:scale-95 shadow-lg shadow-red-600/10'
			>
				{t('newsletter_btn_signup')}
			</Link>
		</section>
	)
}

export default Newsletter

import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'

const ProductCard = ({ item }) => {
	const [isHovered, setIsHovered] = useState(false)

	return (
		<div
			className={`relative bg-white w-full shadow-[0_15px_40px_rgba(0,0,0,0.04)] rounded-sm overflow-hidden transition-all duration-500 ease-in-out cursor-pointer group ${
				isHovered
					? 'scale-[1.03] shadow-[0_25px_50px_rgba(0,0,0,0.12)]'
					: 'scale-100'
			}`}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{/* 1. Красная вертикальная полоса слева (Скрин 2) */}

			{/* Изображение */}
			<div className='relative aspect-square overflow-hidden'>
				<img
					src={item.img}
					alt={item.title}
					className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
				/>
				{/* Метка категории */}
				<div className='absolute top-4 right-4 bg-[#4a4a4a] text-white text-[10px] font-black px-3 py-1 uppercase tracking-[0.1em]'>
					{item.category}
				</div>
			</div>

			{/* Текстовый контент */}
			<div className='p-6 flex flex-col gap-2 relative bg-white'>
				<span className='text-gray-400 text-[11px] font-bold tracking-widest'>
					{item.date}
				</span>

				{/* 2. Заголовок (краснеет при наведении - Скрин 2) */}
				<h3
					className={`text-xl md:text-2xl font-black uppercase tracking-tighter leading-tight transition-colors duration-300 ${
						isHovered ? 'text-[#e21e26]' : 'text-black'
					}`}
				>
					{item.title}
				</h3>

				<p className='text-gray-500 text-sm font-medium leading-relaxed mb-4'>
					{item.desc}
				</p>

				{/* 3. Красная горизонтальная линия снизу (Скрин 2) */}
				<div className='relative h-[1.5px] w-full bg-gray-100 overflow-hidden'>
					<div
						className={`absolute inset-0 bg-[#e21e26] transition-transform duration-500 origin-left ${
							isHovered ? 'translate-x-0' : '-translate-x-full'
						}`}
					/>
				</div>
			</div>
		</div>
	)
}

const ProductNew = () => {
	// Статичные данные для примера
	const mockData = [
		{
			id: 1,
			img: 'https://images.unsplash.com/photo-1555850585-2e4ee225f584?q=80&w=500&auto=format&fit=crop',
			category: 'Здоровье',
			date: '2026-04-05',
			title: 'СУМАСШЕДШАЯ',
			desc: 'цыкаывамвыапвуыка',
		},
		{
			id: 2,
			img: 'https://images.unsplash.com/photo-1530121123921-f382d44746d0?q=80&w=500&auto=format&fit=crop',
			category: 'ЗОЖ',
			date: '2026-04-06',
			title: 'ЭНЕРГИЯ',
			desc: 'описание второй карточки для примера',
		},
		{
			id: 3,
			img: 'https://images.unsplash.com/photo-1544145945-f904253db0ad?q=80&w=500&auto=format&fit=crop',
			category: 'Питание',
			date: '2026-04-07',
			title: 'РАЦИОН',
			desc: 'описание третьей карточки для примера',
		},
	]

	return (
		<div className='min-h-screen bg-white py-20 px-6 font-sans'>
			<div className='max-w-[1200px] mx-auto'>
				{/* Заголовок секции */}
				<h2 className='text-2xl md:text-3xl font-black uppercase tracking-tighter mb-10 italic'>
					Связанные <span className='text-[#e21e26]'>новости.</span>
				</h2>

				{/* Сетка карточек */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
					{mockData.map(item => (
						<ProductCard key={item.id} item={item} />
					))}
				</div>

				{/* Кнопка снизу */}
				<div className='flex justify-center mt-16'>
					<Link
						to='/news'
						className='inline-block bg-[#e21e26] text-white px-12 py-4 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-lg shadow-red-500/20 active:scale-95 no-underline'
					>
						Развернуть
					</Link>
				</div>
			</div>
		</div>
	)
}

export default ProductNew

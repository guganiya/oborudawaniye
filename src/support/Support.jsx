import React, { useState, useRef, useEffect } from 'react'
import { Search, ChevronDown, X } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Support = () => {
	const [searchTerm, setSearchTerm] = useState('')
	const [isOpen, setIsOpen] = useState(false)
	const wrapperRef = useRef(null)

	const data = [
		{ id: 1, name: 'Как оформить заказ', product: 'Доставка' },
		{ id: 2, name: 'Возврат товара', product: 'Логистика' },
		{ id: 3, name: 'Оплата картой', product: 'Финансы' },
		{ id: 4, name: 'Статус посылки', product: 'Доставка' },
		{ id: 5, name: 'Техническая поддержка', product: 'IT' },
	]

	// Фильтрация списка для выпадающего меню
	const filteredResults = data.filter(
		item =>
			item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			item.product.toLowerCase().includes(searchTerm.toLowerCase()),
	)

	// Закрытие при клике вне
	useEffect(() => {
		const handleClickOutside = e => {
			if (wrapperRef.current && !wrapperRef.current.contains(e.target))
				setIsOpen(false)
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	return (
		<div className='flex flex-col min-h-screen bg-white'>
			<Navbar />

			<main className='flex-grow pt-10 mt-20'>
				<div className='max-w-6xl mx-auto p-6 pt-12'>
					<h1 className='text-3xl font-bold text-gray-900 mb-8'>
						Центр поддержки
					</h1>

					{/* КОНТЕЙНЕР COMBOBOX (ОДИН БЛОК) */}
					<div className='relative' ref={wrapperRef}>
						<div className='relative flex items-stretch border border-gray-300 shadow-sm focus-within:ring-1 focus-within:ring-[#e21e26] focus-within:border-[#e21e26] transition-all'>
							{/* Иконка и Инпут */}
							<div className='relative flex-grow flex items-center'>
								<div className='absolute left-4 pointer-events-none'>
									<Search className='h-5 w-5 text-gray-400' />
								</div>
								<input
									type='text'
									className='w-full pl-11 pr-10 py-4 bg-white focus:outline-none text-gray-700'
									placeholder='Поиск по базе знаний...'
									value={searchTerm}
									onFocus={() => setIsOpen(true)}
									onChange={e => {
										setSearchTerm(e.target.value)
										setIsOpen(true)
									}}
								/>

								{/* Стрелочка/Крестик */}
								<div className='absolute right-3 flex items-center gap-2'>
									{searchTerm && (
										<X
											className='h-4 w-4 text-gray-400 cursor-pointer hover:text-black'
											onClick={() => setSearchTerm('')}
										/>
									)}
									<ChevronDown
										className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
									/>
								</div>
							</div>

							<button className='bg-[#e21e26] text-white font-bold px-10 py-4 uppercase tracking-wider text-sm'>
								Найти
							</button>
						</div>

						{/* САМ DROPDOWN С ПОИСКОМ */}
						{isOpen && (
							<div className='absolute z-50 w-full mt-1 bg-white border border-gray-200 shadow-xl max-h-64 overflow-y-auto'>
								{filteredResults.length > 0 ? (
									filteredResults.map(item => (
										<div
											key={item.id}
											onClick={() => {
												setSearchTerm(item.name)
												setIsOpen(false)
											}}
											className='p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0'
										>
											<div className='font-semibold text-gray-900'>
												{item.name}
											</div>
											<div className='text-xs text-[#e21e26] font-bold uppercase'>
												{item.product}
											</div>
										</div>
									))
								) : (
									<div className='p-6 text-center text-gray-400'>
										Ничего не найдено
									</div>
								)}
							</div>
						)}
					</div>

					{/* Результаты снизу (как в твоем оригинале) */}
					<div className='mt-10 mb-12'>
						{searchTerm !== '' && (
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								{filteredResults.map(item => (
									<div
										key={item.id}
										className='p-5 border border-gray-100 bg-gray-50 rounded-sm hover:border-red-200 transition-all'
									>
										<div className='font-semibold text-gray-900'>
											{item.name}
										</div>
										<div className='text-sm text-red-600 mt-1 uppercase font-medium'>
											{item.product}
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</main>

			<Footer />
		</div>
	)
}

export default Support

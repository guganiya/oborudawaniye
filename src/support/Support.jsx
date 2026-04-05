import React, { useState } from 'react'
import { Search } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Support = () => {
	const [searchTerm, setSearchTerm] = useState('')

	// Данные для поиска (можно заменить на данные из API или пропсов)
	const data = [
		{ id: 1, name: 'Как оформить заказ', product: 'Доставка' },
		{ id: 2, name: 'Возврат товара', product: 'Логистика' },
		{ id: 3, name: 'Оплата картой', product: 'Финансы' },
		{ id: 4, name: 'Статус посылки', product: 'Доставка' },
		{ id: 5, name: 'Техническая поддержка', product: 'IT' },
	]

	const filteredResults = data.filter(
		item =>
			item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			item.product.toLowerCase().includes(searchTerm.toLowerCase()),
	)

	return (
		<div className='flex flex-col min-h-screen bg-white'>
			{/* Шапка сайта */}
			<Navbar />

			{/* Основной контент (Support Section) */}
			<main className='flex-grow'>
				<div className='max-w-6xl mx-auto p-6 pt-12'>
					{/* Заголовок секции (опционально) */}
					<h1 className='text-3xl font-bold text-gray-900 mb-8'>
						Центр поддержки
					</h1>

					{/* Контейнер поиска */}
					<div className='relative flex items-stretch shadow-sm hover:shadow-md transition-shadow duration-300'>
						<div className='relative flex-grow'>
							<div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
								<Search className='h-5 w-5 text-gray-400' />
							</div>
							<input
								type='text'
								className='block w-full pl-11 pr-4 py-4 border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#e21e26] transition-all text-gray-700'
								placeholder='Введите поисковый запрос (название или продукт)...'
								value={searchTerm}
								onChange={e => setSearchTerm(e.target.value)}
							/>
						</div>
						<button className='bg-[#e21e26] hover:bg-[#e21e26] text-white font-bold px-10 py-4 transition-colors duration-200 uppercase tracking-wider text-sm'>
							Поиск
						</button>
					</div>

					{/* Отображение результатов */}
					<div className='mt-10 mb-12'>
						{searchTerm === '' ? (
							<p className='text-gray-500'>
								Начните вводить текст для поиска по базе знаний.
							</p>
						) : (
							<>
								<h3 className='text-lg font-semibold mb-6 text-gray-800 border-b pb-2'>
									Результаты ({filteredResults.length})
								</h3>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									{filteredResults.length > 0 ? (
										filteredResults.map(item => (
											<div
												key={item.id}
												className='p-5 border border-gray-100 rounded-sm bg-gray-50 hover:border-red-200 hover:shadow-sm transition-all cursor-pointer'
											>
												<div className='font-semibold text-gray-900'>
													{item.name}
												</div>
												<div className='text-sm text-red-600 mt-1 uppercase tracking-tighter font-medium'>
													{item.product}
												</div>
											</div>
										))
									) : (
										<div className='col-span-full py-10 text-center text-gray-400 border-2 border-dashed rounded-lg'>
											По вашему запросу ничего не найдено
										</div>
									)}
								</div>
							</>
						)}
					</div>
				</div>
			</main>

			{/* Подвал сайта */}
			<Footer />
		</div>
	)
}

export default Support

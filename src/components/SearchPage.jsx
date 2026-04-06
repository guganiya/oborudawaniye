import React, { useState, useRef, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Search, ChevronDown, Check } from 'lucide-react'

const SearchPage = () => {
	const brandRed = '#e21e26'
	const [mainSearch, setMainSearch] = useState('')
	const [selectedCategory, setSelectedCategory] = useState('')
	const [selectedType, setSelectedType] = useState('')
	const [selectedSort, setSelectedSort] = useState('Newest First')

	const CATEGORIES = [
		'Electronics',
		'Industrial Components',
		'Software Solutions',
		'Audio Systems',
		'Visual Displays',
	]
	const TYPES = [
		'Pro Series',
		'Enterprise Edition',
		'Consumer Grade',
		'Legacy Support',
	]
	const SORT_MODES = ['Newest First', 'Oldest First', 'A - Z']

	return (
		<div className='min-h-screen flex flex-col bg-white overflow-hidden text-black'>
			<Navbar />

			<main className='flex-grow pt-32 md:pt-48 pb-20 px-6'>
				<div className='relative max-w-[1200px] mx-auto z-10'>
					{/* ОБЕРТКА ЗАГОЛОВКА И ФОНОВОГО ТЕКСТА */}
					<div className='relative mb-20 md:mb-32'>
						{/* ФОНОВЫЙ ТЕКСТ (теперь привязан к заголовку) */}
						<div className='absolute -top-12 md:-top-24 right-25 md:right-25 opacity-[0.04] pointer-events-none -z-10'>
							<span className='text-[7rem] md:text-[22rem] font-black uppercase leading-none select-none whitespace-nowrap'>
								Search
							</span>
						</div>

						{/* ОСНОВНОЙ ЗАГОЛОВОК */}
						<h1 className='relative text-5xl md:text-8xl font-bold uppercase tracking-tighter'>
							Explore <span style={{ color: brandRed }}>.</span>
						</h1>
					</div>

					{/* ГЛОБАЛЬНЫЙ ПОИСК (С ИКОНКОЙ) */}
					<div className='relative mb-20 group'>
						{/* ИКОНКА ПОИСКА */}
						<div className='absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none text-black '>
							<Search size={28} strokeWidth={1.5} />
						</div>

						{/* ПОЛЕ ВВОДА (добавлен pl-12 для отступа от иконки) */}
						<input
							type='text'
							placeholder='WHAT ARE YOU LOOKING FOR?'
							value={mainSearch}
							onChange={e => setMainSearch(e.target.value)}
							className='w-full text-2xl md:text-4xl font-light border-b-2 border-black pl-12 md:pl-16 py-6 focus:outline-none placeholder:text-[#e21e26]'
						/>
					</div>

					{/* СЕТКА УМНЫХ КОМБОБОКСОВ */}
					<div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-16'>
						<SmartSelect
							label='01. Category'
							options={CATEGORIES}
							value={selectedCategory}
							onChange={setSelectedCategory}
						/>
						<SmartSelect
							label='02. Product Type'
							options={TYPES}
							value={selectedType}
							onChange={setSelectedType}
						/>
						<SmartSelect
							label='03. Sorting'
							options={SORT_MODES}
							value={selectedSort}
							onChange={setSelectedSort}
						/>
					</div>

					{/* СЕКЦИЯ РЕЗУЛЬТАТОВ */}
					<div className='border-t border-black pt-12 min-h-[300px] flex items-center justify-center text-black'>
						<div className='text-center'>
							<Search size={48} strokeWidth={1} className='mx-auto mb-4' />
							<p className='text-[11px] uppercase tracking-[0.4em]'>
								Awaiting specific parameters
							</p>
						</div>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	)
}

// Компонент SmartSelect (без изменений, с поиском внутри)
const SmartSelect = ({ label, options, value, onChange }) => {
	const [isOpen, setIsOpen] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')
	const wrapperRef = useRef(null)

	useEffect(() => {
		const handleClickOutside = e => {
			if (wrapperRef.current && !wrapperRef.current.contains(e.target))
				setIsOpen(false)
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	const filteredOptions = options.filter(opt =>
		opt.toLowerCase().includes(searchTerm.toLowerCase()),
	)

	return (
		<div className='flex flex-col gap-2 group' ref={wrapperRef}>
			<label className='text-[10px] uppercase tracking-[0.2em] font-bold text-black/40 group-focus-within:text-[#e21e26] transition-colors'>
				{label}
			</label>

			<div
				className={`relative border transition-all duration-300 ${isOpen ? 'border-black shadow-2xl' : 'border-black'}`}
			>
				<div
					className='flex items-center justify-between px-4 py-4 cursor-text bg-white'
					onClick={() => setIsOpen(true)}
				>
					<input
						type='text'
						className='w-full bg-transparent focus:outline-none text-[13px] font-bold uppercase tracking-widest placeholder:text-black/50'
						placeholder={value || 'Select...'}
						value={searchTerm}
						onChange={e => {
							setSearchTerm(e.target.value)
							if (!isOpen) setIsOpen(true)
						}}
					/>
					<ChevronDown
						size={16}
						className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
					/>
				</div>

				{isOpen && (
					<div className='absolute top-full left-[-1px] right-[-1px] bg-white border border-t-0 border-black z-[50] max-h-60 overflow-y-auto'>
						{filteredOptions.length > 0 ? (
							filteredOptions.map(opt => (
								<div
									key={opt}
									onClick={() => {
										onChange(opt)
										setIsOpen(false)
										setSearchTerm('')
									}}
									className='flex items-center justify-between px-4 py-3 text-[12px] uppercase tracking-widest hover:bg-black hover:text-white cursor-pointer transition-colors'
								>
									{opt}
									{value === opt && <Check size={12} />}
								</div>
							))
						) : (
							<div className='px-4 py-3 text-[10px] uppercase text-black/40 text-center'>
								No matches
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	)
}

export default SearchPage

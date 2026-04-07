import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next' // Добавлено
import {
	Search,
	ChevronDown,
	X,
	FileText,
	Download,
	FolderOpen,
	Loader2,
	FileImage,
	FileArchive,
	File,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import apiClient from '../api/api'

const Support = () => {
	const { t, i18n } = useTranslation() // Инициализация
	const [searchTerm, setSearchTerm] = useState('')
	const [isOpen, setIsOpen] = useState(false)
	const [suggestions, setSuggestions] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [isDownloading, setIsDownloading] = useState(false)
	const [error, setError] = useState(null)
	const wrapperRef = useRef(null)
	const searchTimeoutRef = useRef(null)

	// Хелпер для выбора локализованного поля из объекта файла
	const getLoc = (item, field) => {
		if (!item) return ''
		const lang = i18n.language // 'ru', 'en', или 'tk'
		return item[`${field}_${lang}`] || item[`${field}_ru`] || item[field]
	}

	const fetchFileSuggestions = async query => {
		if (!query.trim()) {
			setSuggestions([])
			return
		}

		setIsLoading(true)
		setError(null)

		try {
			const response = await apiClient.get('/get-files/', {
				params: { search: query },
			})

			let files = []
			if (Array.isArray(response.data)) files = response.data
			else if (response.data.results) files = response.data.results
			else if (response.data.data) files = response.data.data

			setSuggestions(files.slice(0, 10))
		} catch (error) {
			console.error('Error fetching file suggestions:', error)
			setError(t('support_error_fetch')) // Используем перевод
			setSuggestions([])
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
		searchTimeoutRef.current = setTimeout(() => {
			if (searchTerm && searchTerm.trim().length > 0) {
				fetchFileSuggestions(searchTerm)
			} else {
				setSuggestions([])
			}
		}, 500)
		return () => clearTimeout(searchTimeoutRef.current)
	}, [searchTerm])

	const handleFileDownload = async (fileId, fileName, fileExtension) => {
		if (!fileId) return
		setIsDownloading(true)
		try {
			const response = await apiClient.get(`/download-file/${fileId}/`, {
				responseType: 'blob',
			})

			const contentDisposition = response.headers['content-disposition']
			let downloadedFileName = fileName || `document_${fileId}`

			if (contentDisposition) {
				const filenameMatch = contentDisposition.match(
					/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
				)
				if (filenameMatch && filenameMatch[1]) {
					downloadedFileName = filenameMatch[1].replace(/['"]/g, '')
				}
			} else if (
				fileExtension &&
				!downloadedFileName.toLowerCase().endsWith(fileExtension)
			) {
				downloadedFileName += fileExtension
			}

			const blob = new Blob([response.data])
			const url = window.URL.createObjectURL(blob)
			const link = document.createElement('a')
			link.href = url
			link.setAttribute('download', downloadedFileName)
			document.body.appendChild(link)
			link.click()
			link.remove()
			window.URL.revokeObjectURL(url)
		} catch (error) {
			setError(t('support_error_download'))
			setTimeout(() => setError(null), 3000)
		} finally {
			setIsDownloading(false)
		}
	}

	const getFileIcon = extension => {
		const ext = extension?.toLowerCase()
		if (ext === '.pdf') return <FileText className='h-4 w-4 text-red-500' />
		if (['.zip', '.rar', '.7z'].includes(ext))
			return <FileArchive className='h-4 w-4 text-yellow-500' />
		if (['.jpg', '.png', '.webp'].includes(ext))
			return <FileImage className='h-4 w-4 text-blue-500' />
		return <File className='h-4 w-4 text-[#e21e26]' />
	}

	// Форматирование даты в зависимости от языка
	const formatDate = dateString => {
		if (!dateString) return ''
		const localeMap = { ru: 'ru-RU', en: 'en-US', tk: 'tr-TR' }
		return new Date(dateString).toLocaleDateString(
			localeMap[i18n.language] || 'ru-RU',
			{
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
			},
		)
	}

	return (
		<div className='flex flex-col min-h-screen bg-white'>
			<Navbar />
			<main className='flex-grow pt-10'>
				<div className='max-w-6xl mx-auto p-6 pt-12'>
					<h1 className='text-3xl font-bold text-gray-900 mb-8'>
						{t('support_title')}
					</h1>

					<form
						onSubmit={e => {
							e.preventDefault()
							setIsOpen(false)
						}}
					>
						<div className='relative' ref={wrapperRef}>
							<div className='relative flex items-stretch border border-gray-300 shadow-sm focus-within:ring-1 focus-within:ring-[#e21e26] transition-all'>
								<div className='relative flex-grow flex items-center'>
									<div className='absolute left-4'>
										<Search className='h-5 w-5 text-gray-400' />
									</div>
									<input
										type='text'
										className='w-full pl-11 pr-10 py-4 bg-white focus:outline-none text-gray-700'
										placeholder={t('support_search_placeholder')}
										value={searchTerm}
										onFocus={() => setIsOpen(true)}
										onChange={e => setSearchTerm(e.target.value)}
									/>
									{/* ... кнопки X и Chevron ... */}
								</div>
								<button
									type='submit'
									className='bg-[#e21e26] text-white font-bold px-10 py-4 uppercase tracking-wider text-sm hover:bg-red-700 transition-colors'
								>
									{isLoading ? (
										<Loader2 className='h-4 w-4 animate-spin' />
									) : (
										t('support_search_btn')
									)}
								</button>
							</div>

							{isOpen && (
								<div className='absolute z-50 w-full mt-1 bg-white border border-gray-200 shadow-xl rounded-md max-h-96 overflow-y-auto'>
									{isLoading ? (
										<div className='p-8 text-center'>
											<Loader2 className='h-6 w-6 animate-spin text-[#e21e26] mx-auto mb-2' />
											<p className='text-gray-500 text-sm'>
												{t('support_loading')}
											</p>
										</div>
									) : suggestions.length > 0 ? (
										<div>
											<div className='px-4 py-2 bg-gray-50 border-b border-gray-200'>
												<p className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>
													{t('support_found_count')}: {suggestions.length}
												</p>
											</div>
											{suggestions.map(file => (
												<div
													key={file.id}
													onClick={() => {
														setSearchTerm(getLoc(file, 'name'))
														setIsOpen(false)
													}}
													className='p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors group'
												>
													<div className='flex items-start justify-between'>
														<div className='flex-1'>
															<div className='flex items-center gap-2 mb-1'>
																{getFileIcon(file.file_extension)}
																<div className='font-semibold text-gray-900'>
																	{getLoc(file, 'name')}
																</div>
															</div>
															<p className='text-sm text-gray-500 mt-1 line-clamp-2'>
																{getLoc(file, 'description')}
															</p>
															<div className='flex items-center gap-3 mt-2 text-xs text-gray-400'>
																<span>{formatFileSize(file.file_size)}</span>
																<span>{formatDate(file.created_at)}</span>
															</div>
														</div>
														<button
															onClick={e => {
																e.stopPropagation()
																handleFileDownload(
																	file.id,
																	getLoc(file, 'name'),
																	file.file_extension,
																)
															}}
															className='ml-4 p-2 text-gray-400 hover:text-[#e21e26]'
														>
															<Download className='h-5 w-5' />
														</button>
													</div>
												</div>
											))}
										</div>
									) : (
										<div className='p-8 text-center text-gray-500'>
											{searchTerm
												? t('support_no_results')
												: t('support_start_typing')}
										</div>
									)}
								</div>
							)}
						</div>
					</form>

					{/* Секция результатов под поиском (аналогично обновляем getLoc и t) */}
					{suggestions.length > 0 && searchTerm && (
						<div className='mt-10 mb-12'>
							<h2 className='text-xl font-semibold text-gray-900 mb-4'>
								{t('support_results_title')}
							</h2>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								{suggestions.map(file => (
									<div
										key={file.id}
										className='p-5 border border-gray-100 bg-gray-50 rounded-lg hover:border-red-200 transition-all'
									>
										<div className='flex items-start justify-between'>
											<div className='flex-1'>
												<div className='flex items-center gap-2 mb-2'>
													{getFileIcon(file.file_extension)}
													<span className='font-semibold text-gray-900'>
														{getLoc(file, 'name')}
													</span>
												</div>
												<p className='text-sm text-gray-600'>
													{getLoc(file, 'description')}
												</p>
												<div className='flex items-center gap-3 mt-3 text-xs text-gray-500'>
													<span>{formatFileSize(file.file_size)}</span>
													<span>{formatDate(file.created_at)}</span>
												</div>
											</div>
											<button
												onClick={() =>
													handleFileDownload(
														file.id,
														getLoc(file, 'name'),
														file.file_extension,
													)
												}
												className='ml-4 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-[#e21e26] hover:text-white transition-all flex items-center gap-2'
											>
												<Download className='h-4 w-4' />
												<span className='text-sm'>
													{t('support_download_btn')}
												</span>
											</button>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</main>
			<Footer />
		</div>
	)
}

const formatFileSize = bytes => {
	if (!bytes || bytes === 0) return '0 B'
	const k = 1024
	const sizes = ['B', 'KB', 'MB', 'GB']
	const i = Math.floor(Math.log(bytes) / Math.log(k))
	return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

export default Support

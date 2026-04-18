import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next' // Добавлено
import {
	FileText,
	Box,
	BookOpen,
	Award,
	BarChart3,
	Database,
	Disc,
	Target,
	RefreshCw,
	HelpCircle,
	Volume2,
	ArrowRight,
	Download,
	File,
	FileSpreadsheet,
	FileImage,
	FileArchive,
	FileCode,
	CheckCircle,
	AlertCircle,
} from 'lucide-react'

const ProductDownloads = ({ productFiles, productDocumentations }) => {
	const { t } = useTranslation() // Добавлено
	const [downloadItems, setDownloadItems] = useState([])
	const [downloading, setDownloading] = useState(null)
	const [showNotification, setShowNotification] = useState(false)
	const [notificationMessage, setNotificationMessage] = useState('')

	const getFileIcon = (fileName, fileType) => {
		const extension = fileName?.split('.').pop()?.toLowerCase() || ''
		const name = fileName?.toLowerCase() || ''

		if (extension === 'pdf') return <FileText size={20} />
		if (extension === 'xlsx' || extension === 'xls')
			return <FileSpreadsheet size={20} />
		if (
			extension === 'jpg' ||
			extension === 'png' ||
			extension === 'jpeg' ||
			extension === 'gif'
		)
			return <FileImage size={20} />
		if (extension === 'zip' || extension === 'rar' || extension === '7z')
			return <FileArchive size={20} />
		if (extension === 'dwg' || extension === 'dxf') return <Box size={20} />
		if (extension === 'exe' || extension === 'msi')
			return <RefreshCw size={20} />
		if (extension === 'txt' || extension === 'doc' || extension === 'docx')
			return <File size={20} />
		if (extension === 'xml' || extension === 'gdtf')
			return <FileCode size={20} />

		if (name.includes('datasheet')) return <FileText size={20} />
		if (name.includes('catalog')) return <BookOpen size={20} />
		if (name.includes('certificate')) return <Award size={20} />
		if (name.includes('dmx')) return <BarChart3 size={20} />
		if (name.includes('gdtf') || name.includes('library'))
			return <Database size={20} />
		if (name.includes('gobo')) return <Disc size={20} />
		if (name.includes('photo') || name.includes('photometric'))
			return <Target size={20} />
		if (name.includes('manual')) return <HelpCircle size={20} />
		if (name.includes('noise')) return <Volume2 size={20} />

		return <File size={20} />
	}

	const getFileCategory = (fileName, itemName) => {
		const name = (itemName || fileName)?.toLowerCase() || ''
		const extension = fileName?.split('.').pop()?.toLowerCase() || ''

		if (name.includes('datasheet') || name.includes('spec')) return 'Technical'
		if (
			name.includes('catalog') ||
			name.includes('brochure') ||
			name.includes('leaflet')
		)
			return 'Marketing'
		if (name.includes('certificate') || name.includes('declaration'))
			return 'Certificates'
		if (name.includes('manual') || name.includes('guide'))
			return 'Documentation'
		if (
			name.includes('software') ||
			name.includes('update') ||
			extension === 'exe' ||
			extension === 'msi'
		)
			return 'Software'
		if (
			name.includes('cad') ||
			name.includes('drawing') ||
			extension === 'dwg' ||
			extension === 'dxf'
		)
			return 'CAD Files'
		if (name.includes('gdtf') || name.includes('library')) return 'Libraries'
		if (name.includes('dmx')) return 'DMX Charts'
		if (name.includes('gobo')) return 'Gobos'
		if (name.includes('photo') || name.includes('photometric'))
			return 'Photometrics'
		if (name.includes('noise')) return 'Measurements'

		return 'Documents'
	}

	const handleDownload = async (item, index) => {
		try {
			setDownloading(index)
			const link = document.createElement('a')
			link.href = item.file
			link.download =
				item.fileName || `${item.title}.${item.file?.split('.').pop()}`
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)

			setNotificationMessage(`${item.title} ${t('dl_success_msg')}`)
			setShowNotification(true)
			setTimeout(() => setShowNotification(false), 3000)
		} catch (error) {
			setNotificationMessage(`${t('dl_fail_msg')} ${item.title}`)
			setShowNotification(true)
			setTimeout(() => setShowNotification(false), 3000)
		} finally {
			setTimeout(() => setDownloading(null), 500)
		}
	}

	useEffect(() => {
		const items = []
		if (productDocumentations && Array.isArray(productDocumentations)) {
			productDocumentations.forEach(doc => {
				const fileName = doc.file?.split('/').pop() || ''
				const fileExtension = fileName.split('.').pop() || ''
				items.push({
					id: doc.id,
					title: doc.name || 'Document',
					file: doc.file,
					fileName: fileName,
					fileExtension: fileExtension,
					category: getFileCategory(fileName, doc.name),
					icon: getFileIcon(fileName, doc.name),
					date: doc.date,
					type: 'documentation',
				})
			})
		}
		if (productFiles && Array.isArray(productFiles)) {
			productFiles.forEach(file => {
				const fileName = file.file?.split('/').pop() || file.name || ''
				items.push({
					id: file.id || `file-${items.length}`,
					title: file.name || 'File',
					file: file.file,
					fileName: fileName,
					fileExtension: fileName.split('.').pop(),
					category: getFileCategory(fileName, file.name),
					icon: getFileIcon(fileName, file.name),
					date: file.date,
					type: 'file',
				})
			})
		}

		const sortedItems = items.sort((a, b) => {
			if (a.category !== b.category) return a.category.localeCompare(b.category)
			return a.title.localeCompare(b.title)
		})
		setDownloadItems(sortedItems)
	}, [productDocumentations, productFiles])

	const groupedItems = downloadItems.reduce((groups, item) => {
		const category = item.category
		if (!groups[category]) groups[category] = []
		groups[category].push(item)
		return groups
	}, {})

	if (downloadItems.length === 0) {
		return (
			<section className='mt-32 border-t border-gray-100 pt-16 px-5 md:px-12'>
				<div className='flex flex-col items-center justify-center mb-16'>
					<h2 className='text-4xl md:text-5xl font-black uppercase  tracking-tighter mb-4'>
						{t('dl_title')}
						<span className='text-[#e21e26]'>.</span>
					</h2>
					<p className='text-center text-gray-500 text-lg font-medium max-w-2xl'>
						{t('dl_empty_msg')}
					</p>
				</div>
				<div className='flex justify-center pb-5'>
					<Link
						to='/support'
						className='group flex items-center gap-4 bg-black text-white px-10 py-5 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-[#e21e26] transition-all duration-300'
					>
						{t('dl_support_btn')}
						<ArrowRight
							size={16}
							className='group-hover:translate-x-2 transition-transform'
						/>
					</Link>
				</div>
			</section>
		)
	}

	return (
		<section className='mt-32 border-t border-gray-100 pt-16 px-5 md:px-12'>
			<AnimatePresence>
				{showNotification && (
					<motion.div
						initial={{ opacity: 0, y: -50 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -50 }}
						className='fixed top-24 right-6 z-50 bg-black text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3'
					>
						<CheckCircle size={18} className='text-green-400' />
						<span className='text-sm font-medium'>{notificationMessage}</span>
					</motion.div>
				)}
			</AnimatePresence>

			<div className='flex flex-col items-center justify-center mb-16'>
				<h2 className='text-4xl md:text-5xl font-black uppercase  tracking-tighter mb-4'>
					{t('dl_title')}
					<span className='text-[#e21e26]'>.</span>
				</h2>
				<p className='text-center text-gray-500 text-lg font-medium max-w-2xl'>
					{t('dl_subtitle')}
				</p>
				<div className='flex gap-2 mt-4'>
					<span className='bg-[#e21e26]/10 text-[#e21e26] px-3 py-1 rounded-full text-xs font-bold'>
						{downloadItems.length} {t('dl_count_label')}
					</span>
				</div>
			</div>

			{Object.entries(groupedItems).map(([category, items]) => (
				<div key={category} className='mb-12'>
					<h3 className='text-sm font-black uppercase tracking-[0.2em] text-gray-400 mb-6 pb-2 border-b border-gray-100'>
						{t(
							`dl_cat_${category.toLowerCase().replace(/\s+/g, '_')}`,
							category,
						)}
					</h3>
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
						{items.map((item, index) => (
							<motion.div
								key={item.id || index}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.05 }}
								className='group relative'
							>
								<button
									onClick={() => handleDownload(item, `${category}-${index}`)}
									disabled={downloading === `${category}-${index}`}
									className='w-full flex flex-col items-center justify-center p-6 bg-white border border-gray-100  transition-all duration-300 hover:border-[#e21e26] hover:shadow-xl group text-center cursor-pointer'
								>
									<div className='relative'>
										<div className='w-14 h-14 rounded-full bg-[#e21e26]/10 flex items-center justify-center text-[#e21e26] mb-5 group-hover:scale-110 transition-transform duration-300 group-hover:bg-[#e21e26] group-hover:text-white'>
											{item.icon}
										</div>
										{downloading === `${category}-${index}` && (
											<div className='absolute inset-0 flex items-center justify-center'>
												<div className='w-8 h-8 border-2 border-[#e21e26] border-t-transparent rounded-full animate-spin' />
											</div>
										)}
									</div>

									<span className='text-sm font-black uppercase tracking-tight text-gray-900 leading-tight mb-2'>
										{item.title}
									</span>

									{item.fileExtension && (
										<span className='text-[9px] font-mono uppercase text-gray-400 bg-gray-50 px-2 py-0.5'>
											.{item.fileExtension}
										</span>
									)}

									<div className='absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity'>
										<Download size={16} className='text-[#e21e26]' />
									</div>
								</button>

								<div className='absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black text-white px-3 py-1 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10'>
									{t('dl_tooltip')}
									<div className='absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black rotate-45'></div>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			))}

			<div className='mt-20 flex justify-center pb-5 mb-20'>
				<Link
					to='/support'
					className='group flex items-center gap-4 bg-black text-white px-10 py-5 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-[#e21e26] transition-all duration-300 rounded-full'
				>
					{t('dl_support_label')}
					<ArrowRight
						size={16}
						className='group-hover:translate-x-2 transition-transform'
					/>
				</Link>
			</div>
		</section>
	)
}

export default ProductDownloads

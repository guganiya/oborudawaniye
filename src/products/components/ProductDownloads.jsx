import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
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
} from 'lucide-react'

const ProductDownloads = () => {
	// Данные для секции загрузок
	const downloadItems = [
		{
			title: 'Data Sheet',
			icon: <FileText size={20} />,
			link: '/files/datasheet.pdf',
		},
		{
			title: 'CAD Symbols & Exterior Dimensions',
			icon: <Box size={20} />,
			link: '/files/cad.zip',
		},
		{
			title: 'Catalogues & Leaflets',
			icon: <BookOpen size={20} />,
			link: '/files/catalog.pdf',
		},
		{
			title: 'Certificates & Declarations',
			icon: <Award size={20} />,
			link: '/files/certs.pdf',
		},
		{
			title: 'DMX Charts',
			icon: <BarChart3 size={20} />,
			link: '/files/dmx.pdf',
		},
		{
			title: 'GDTF & Libraries',
			icon: <Database size={20} />,
			link: '/files/gdtf.zip',
		},
		{
			title: 'Gobos & Filters',
			icon: <Disc size={20} />,
			link: '/files/gobos.pdf',
		},
		{
			title: 'Photometrics',
			icon: <Target size={20} />,
			link: '/files/photo.pdf',
		},
		{
			title: 'Software Updates',
			icon: <RefreshCw size={20} />,
			link: '/files/update.exe',
		},
		{
			title: 'Manuals',
			icon: <HelpCircle size={20} />,
			link: '/files/manual.pdf',
		},
		{
			title: 'Noise Measurements',
			icon: <Volume2 size={20} />,
			link: '/files/noise.pdf',
		},
	]

	return (
		<section className='mt-32 border-t border-gray-100 pt-16 px-5 md:px-50'>
			{/* Заголовок секции */}
			<div className='flex flex-col items-center justify-center mb-16'>
				<h2 className='text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-4'>
					Downloads<span className='text-[#e21e26]'>.</span>
				</h2>
				<p className='text-center text-gray-500 text-lg font-medium max-w-2xl'>
					Find and download all technical and marketing documents related to
					this product.
				</p>
			</div>

			{/* Сетка элементов (теперь всегда видна) */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
				{downloadItems.map((item, index) => (
					<motion.a
						key={index}
						href={item.link}
						download
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: index * 0.05 }}
						className='flex flex-col items-center justify-center p-8 bg-white border border-gray-100 transition-all duration-300 hover:border-[#e21e26] hover:shadow-xl group text-center'
					>
						<div className='w-12 h-12 rounded-full bg-[#e21e26] flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform'>
							{item.icon}
						</div>
						<span className='text-sm font-black uppercase tracking-tight text-gray-900 leading-tight'>
							{item.title}
						</span>
					</motion.a>
				))}
			</div>

			{/* Финальная кнопка Link */}
			<div className='mt-20 flex justify-center pb-5'>
				<Link
					to='/support'
					className='group flex items-center gap-4 bg-black text-white px-10 py-5 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-[#e21e26] transition-all duration-300'
				>
					Go to Support Center
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

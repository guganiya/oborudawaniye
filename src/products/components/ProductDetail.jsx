import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
	Loader2,
	ArrowLeft,
	ChevronDown,
	ChevronUp,
	ChevronLeft,
	ChevronRight,
} from 'lucide-react'
import { useTranslation } from 'react-i18next' // Добавлено

const ProductDetail = ({ productDetails }) => {
	const { t } = useTranslation() // Добавлено
	const { productId } = useParams()
	const navigate = useNavigate()
	const [product, setProduct] = useState(null)
	const [loading, setLoading] = useState(true)
	const [isExpanded, setIsExpanded] = useState(false)
	const [activeInno, setActiveInno] = useState(null)
	const [currentImageIndex, setCurrentImageIndex] = useState(0)
	const [touchStart, setTouchStart] = useState(0)
	const [touchEnd, setTouchEnd] = useState(0)

	useEffect(() => {
		const loadProduct = async () => {
			setLoading(true)

			if (productDetails && productDetails.id) {
				const transformedInnovations =
					productDetails.innovations?.map(innovation => ({
						id: innovation.id,
						label: innovation.name?.substring(0, 6).toUpperCase() || 'INNO',
						icon: innovation.image || null,
						name: innovation.name,
						img: innovation.product_description_image || innovation.image,
						description: innovation.description,
						date: innovation.date,
					})) || []

				let galleryImages = []
				if (productDetails.gallery && Array.isArray(productDetails.gallery)) {
					galleryImages = productDetails.gallery.map(img => ({
						id: img.id,
						url: img.image || img.url || img.poster,
						alt: img.alt || productDetails.name,
					}))
				} else if (productDetails.poster) {
					galleryImages = [
						{
							id: 1,
							url: productDetails.poster,
							alt: productDetails.name,
						},
					]
				}

				setProduct({
					id: productDetails.id,
					title: productDetails.name,
					category: 'Moving Heads',
					image: productDetails.poster,
					description:
						productDetails.description ||
						productDetails.shortDescription ||
						t('product_no_description'),
					shortDescription: productDetails.shortDescription,
					size: productDetails.size,
					date: productDetails.date,
					innovations: transformedInnovations,
					gallery: galleryImages,
				})
			} else {
				setLoading(false)
				setProduct(null)
				return
			}

			setLoading(false)
		}

		loadProduct()
	}, [productDetails, t])

	const nextImage = () => {
		if (product?.gallery) {
			setCurrentImageIndex(prevIndex =>
				prevIndex === product.gallery.length - 1 ? 0 : prevIndex + 1,
			)
		}
	}

	const prevImage = () => {
		if (product?.gallery) {
			setCurrentImageIndex(prevIndex =>
				prevIndex === 0 ? product.gallery.length - 1 : prevIndex - 1,
			)
		}
	}

	const handleTouchStart = e => {
		setTouchStart(e.targetTouches[0].clientX)
	}

	const handleTouchMove = e => {
		setTouchEnd(e.targetTouches[0].clientX)
	}

	const handleTouchEnd = () => {
		if (touchStart - touchEnd > 75) {
			nextImage()
		}
		if (touchStart - touchEnd < -75) {
			prevImage()
		}
		setTouchStart(0)
		setTouchEnd(0)
	}

	if (loading) {
		return (
			<div className='h-screen flex items-center justify-center'>
				<Loader2 className='animate-spin text-[#e21e26]' size={40} />
			</div>
		)
	}

	if (!product) {
		return (
			<div className='h-screen flex flex-col items-center justify-center'>
				<p className='text-gray-500 mb-4'>{t('product_not_found')}</p>
				<button
					onClick={() => navigate('/')}
					className='text-[#e21e26] hover:text-black transition-colors'
				>
					{t('product_back_home')}
				</button>
			</div>
		)
	}

	return (
		<main className='max-w-[1400px] mx-auto px-6 pt-44 pb-32'>
			<button
				onClick={() => navigate(-1)}
				className='flex items-center gap-3 text-[10px] font-black uppercase tracking-widest mb-12 group'
			>
				<div className='w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all'>
					<ArrowLeft size={16} />
				</div>
				{t('product_back')}
			</button>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-20 items-start'>
				<div className='lg:sticky lg:top-44'>
					<div
						className='relative aspect-[4/5] bg-[#f9f9f9] overflow-hidden group'
						onTouchStart={handleTouchStart}
						onTouchMove={handleTouchMove}
						onTouchEnd={handleTouchEnd}
					>
						<motion.div
							key={currentImageIndex}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className='relative w-full h-full'
						>
							<img
								src={product.gallery[currentImageIndex]?.url || product.image}
								alt={product.gallery[currentImageIndex]?.alt || product.title}
								className='w-full h-full object-cover transition-all duration-1000'
							/>
						</motion.div>

						{product.gallery.length > 1 && (
							<>
								<button
									onClick={prevImage}
									className='absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 duration-300 shadow-lg'
								>
									<ChevronLeft size={20} className='text-gray-800' />
								</button>
								<button
									onClick={nextImage}
									className='absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 duration-300 shadow-lg'
								>
									<ChevronRight size={20} className='text-gray-800' />
								</button>

								<div className='absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full'>
									{currentImageIndex + 1} / {product.gallery.length}
								</div>
							</>
						)}
					</div>

					{product.gallery.length > 1 && (
						<div className='mt-4'>
							<div className='grid grid-cols-5 gap-2'>
								{product.gallery.map((image, idx) => (
									<button
										key={image.id || idx}
										onClick={() => setCurrentImageIndex(idx)}
										className={`relative aspect-square overflow-hidden rounded-lg transition-all duration-300 ${
											currentImageIndex === idx
												? 'ring-2 ring-[#e21e26] ring-offset-2 scale-95'
												: 'opacity-70 hover:opacity-100'
										}`}
									>
										<img
											src={image.url}
											alt={`Thumbnail ${idx + 1}`}
											className='w-full h-full object-cover'
										/>
									</button>
								))}
							</div>
						</div>
					)}

					{(product.size || product.date || product.shortDescription) && (
						<div className='mt-6 pt-6 border-t border-gray-100'>
							<div className='space-y-4'>
								{product.shortDescription && (
									<div>
										<span className='text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-2'>
											{t('product_short_desc')}
										</span>
										<div className='text-gray-600 text-sm leading-relaxed' dangerouslySetInnerHTML={{ __html: product.shortDescription }} />
									</div>
								)}
								<div className='grid grid-cols-2 gap-4 text-sm'>
									{product.size && (
										<div>
											<span className='text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-1'>
												{t('product_size')}
											</span>
											<span className='text-gray-600 font-medium'>
												{product.size}
											</span>
										</div>
									)}
									{product.date && (
										<div>
											<span className='text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-1'>
												{t('product_date')}
											</span>
											<span className='text-gray-600 font-medium'>
												{new Date(product.date).toLocaleDateString()}
											</span>
										</div>
									)}
								</div>
							</div>
						</div>
					)}
				</div>

				<div className='flex flex-col'>
					<h1 className='text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-8'>
						{product.title}

					</h1>

					<div className='relative mb-12'>
						<motion.div
							animate={{ height: isExpanded ? 'auto' : '100px' }}
							className='overflow-hidden relative'
						>
							<div className='text-gray-500 text-lg leading-relaxed font-medium' dangerouslySetInnerHTML={{ __html: product.description }} />

							{!isExpanded && (
								<div className='absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent' />
							)}
						</motion.div>
						<button
							onClick={() => setIsExpanded(!isExpanded)}
							className='mt-4 flex items-center gap-2 text-[#e21e26] text-[10px] font-black uppercase tracking-widest hover:text-black transition-colors'
						>
							{isExpanded ? (
								<>
									<ChevronUp size={14} /> {t('product_hide')}
								</>
							) : (
								<>
									<ChevronDown size={14} /> {t('product_read_more')}
								</>
							)}
						</button>
					</div>

					{product.innovations && product.innovations.length > 0 && (
						<div className='pt-12 border-t border-gray-100 relative'>
							<h3 className='text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 mb-8'>
								{t('product_innovations')} ({product.innovations.length})
							</h3>

							<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 relative'>
								{product.innovations.map((inno, index) => (
									<div
										key={inno.id || index}
										className='relative'
										onMouseEnter={() => setActiveInno(inno)}
										onMouseLeave={() => setActiveInno(null)}
									>
										<Link
											to={`/innovations/${inno.id}`}
											className='aspect-square border border-gray-100 flex items-center justify-center p-2 hover:border-[#e21e26] hover:shadow-lg transition-all duration-300 bg-white group relative z-20'
										>
											{inno.icon ? (
												<img
													src={inno.icon}
													alt={inno.label || inno.name}
													className='w-full h-full object-contain filter group-hover:brightness-110 transition-all'
												/>
											) : (
												<div className='w-full h-full flex items-center justify-center bg-gray-50'>
													<span className='text-xs font-bold text-gray-400'>
														{inno.label ||
															inno.name?.substring(0, 2).toUpperCase()}
													</span>
												</div>
											)}
										</Link>

										<AnimatePresence>
											{activeInno?.id === inno.id && (
												<motion.div
													initial={{ opacity: 0, y: 10, scale: 0.95 }}
													animate={{ opacity: 1, y: 0, scale: 1 }}
													exit={{ opacity: 0, y: 10, scale: 0.95 }}
													className='absolute z-[100] left-0 top-full mt-4 w-[320px] bg-white shadow-2xl border border-gray-100 pointer-events-none'
												>
													{inno.img && (
														<div className='h-48 overflow-hidden bg-black'>
															<img
																src={inno.img}
																className='w-full h-full object-cover opacity-90'
																alt={inno.name}
															/>
														</div>
													)}

													<div className='p-6'>
														<h4 className='text-[#e21e26] font-black uppercase text-sm mb-3 italic'>
															{inno.name}
														</h4>
														{inno.description && (
															<p className='text-gray-500 text-[11px] leading-relaxed font-medium mb-3'>
																{inno.description}
															</p>
														)}
														{inno.date && (
															<div className='text-[9px] text-gray-400 uppercase tracking-wider font-bold'>
																{t('product_added')}:{' '}
																{new Date(inno.date).toLocaleDateString()}
															</div>
														)}
													</div>
													<div className='absolute -top-2 left-10 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-100' />
												</motion.div>
											)}
										</AnimatePresence>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</main>
	)
}

export default ProductDetail

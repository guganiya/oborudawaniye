import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Loader2,
  ChevronRight,
  Search,
  X,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import apiClient from '../api/api'

const SubCategoryProducts = () => {
  const { subId } = useParams()
  const { t, i18n } = useTranslation()

  // Data states
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [subcategoryName, setSubcategoryName] = useState('')

  // UI states
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [page, setPage] = useState(1)

  // Refs for infinite scroll
  const sentinelRef = useRef(null)
  const busyRef = useRef(false)

  // Localization helper
  const getLoc = (item, field) => {
    if (!item) return ''
    const lang = i18n.language
    if (lang === 'en' && item[`${field}_en`]) return item[`${field}_en`]
    if (lang === 'tk' && item[`${field}_tk`] ) return item[`${field}_tk`]
    return item[`${field}_ru`] || item[field]
  }

  // Spotlight items (Slider)
  const spotlightItems = useMemo(() => items.slice(0, 5), [items])

  useEffect(() => {
    if (spotlightItems.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % spotlightItems.length)
      }, 8000)
      return () => clearInterval(timer)
    }
  }, [spotlightItems])

  // Fetch logic
  const loadProducts = useCallback(
      async (pageNum, isAppend = false) => {
        if (busyRef.current) return
        busyRef.current = true

        if (!isAppend) setLoading(true)
        else setLoadingMore(true)

        try {
          const response = await apiClient.get('/products', {
            params: { subcategory: subId, page: pageNum },
          })

          const { results, next, count } = response.data
          setTotal(count || 0)
          setHasMore(next !== null)

          if (isAppend) {
            setItems(prev => [...prev, ...results])
          } else {
            setItems(results)
            if (results.length > 0) {
              setSubcategoryName(getLoc(results[0], 'subcategory'))
            }
          }
        } catch (err) {
          console.error('Fetch error:', err)
          setHasMore(false)
        } finally {
          setLoading(false)
          setLoadingMore(false)
          busyRef.current = false
        }
      },
      [subId, i18n.language]
  )

  useEffect(() => {
    setPage(1)
    setItems([])
    setHasMore(true)
    loadProducts(1, false)
  }, [subId, loadProducts])

  // Infinite scroll observer
  useEffect(() => {
    if (!hasMore || searchTerm !== '' || loading) return

    const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !busyRef.current && hasMore) {
            setPage(prev => {
              const nextPage = prev + 1
              loadProducts(nextPage, true)
              return nextPage
            })
          }
        },
        { rootMargin: '400px' }
    )

    if (sentinelRef.current) observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [hasMore, searchTerm, loadProducts, loading])

  const filteredItems = useMemo(() => {
    return items.filter(product => {
      const name = getLoc(product, 'name').toLowerCase()
      const desc = (getLoc(product, 'short_description') || '').toLowerCase()
      const query = searchTerm.toLowerCase()
      return name.includes(query) || desc.includes(query)
    })
  }, [items, searchTerm, i18n.language])

  return (
      <div className='bg-white min-h-screen font-sans selection:bg-[#e21e26] selection:text-white'>
        <Navbar />

        {/* --- SPOTLIGHT HEADER --- */}
        <section className='relative h-[75vh] min-h-[500px] bg-black overflow-hidden mt-20'>
          <AnimatePresence mode='wait'>
            {spotlightItems.length > 0 ? (
                <motion.div
                    key={spotlightItems[currentSlide]?.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className='absolute inset-0'
                >
                  <img
                      src={spotlightItems[currentSlide]?.poster}
                      className='w-full h-full object-contain opacity-60 grayscale-[0.3]'
                      alt='Banner'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent' />

                  <div className='absolute inset-0 flex items-center px-6 md:px-20'>
                    <div className='max-w-[1400px] mx-auto w-full'>
                      <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className='text-[#e21e26] text-[11px] font-black uppercase tracking-[0.4em] mb-4 flex items-center gap-3'
                      >
                        <div className='w-10 h-[2px] bg-[#e21e26]' /> {t('new_collection')}
                      </motion.div>
                      <motion.h1
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          className='text-white text-5xl md:text-8xl font-black uppercase leading-tight tracking-tighter mb-8'
                      >
                        {getLoc(spotlightItems[currentSlide], 'name')}
                      </motion.h1>
                      <Link
                          to={`/product/${spotlightItems[currentSlide]?.id}`}
                          className='inline-flex items-center gap-4 bg-white text-black px-10 py-5 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-[#e21e26] hover:text-white transition-all duration-300 shadow-2xl'
                      >
                        {t('view_details')} <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
            ) : !loading && (
                <div className='flex h-full items-center justify-center text-white/20 uppercase tracking-[0.5em] text-sm'>
                  Empty Collection
                </div>
            )}
          </AnimatePresence>

          {spotlightItems.length > 1 && (
              <div className='absolute bottom-12 right-6 md:right-20 flex items-center gap-6 z-20'>
                <div className='flex gap-2'>
                  {spotlightItems.map((_, i) => (
                      <button
                          key={i}
                          onClick={() => setCurrentSlide(i)}
                          className={`h-[2px] transition-all duration-500 ${i === currentSlide ? 'w-12 bg-[#e21e26]' : 'w-4 bg-white/30'}`}
                      />
                  ))}
                </div>
              </div>
          )}
        </section>

        {/* --- STICKY NAV BAR --- */}
        <div className='sticky top-0 z-[100] bg-white/90 backdrop-blur-xl border-b border-gray-100 py-4 px-6'>
          <div className='max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4'>
            <nav className='flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-400'>
              <Link to='/catalog' className='hover:text-black transition-colors'>{t('catalog')}</Link>
              <ChevronRight size={12} />
              <span className='text-[#e21e26]'>{subcategoryName || t('products')} ({total})</span>
            </nav>

            <div className='relative w-full md:w-96'>
              <Search className='absolute left-5 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
              <input
                  type='text'
                  placeholder={t('search_placeholder')}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='w-full bg-gray-50 border-none py-4 pl-14 pr-12 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-black transition-all'
              />
              {searchTerm && <X onClick={() => setSearchTerm('')} className='absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-[#e21e26]' size={16} />}
            </div>
          </div>
        </div>

        {/* --- GRID --- */}
        <main className='max-w-[1400px] mx-auto px-6 py-20'>
          {loading && items.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-40 gap-4'>
                <Loader2 className='animate-spin text-[#e21e26]' size={48} />
                <span className='text-[10px] font-black uppercase tracking-widest text-gray-400'>{t('loading')}</span>
              </div>
          ) : (
              <>
                {/* Updated Grid to match the Swiper proportions but in a static grid */}
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
                  <AnimatePresence mode='popLayout'>
                    {filteredItems.map(product => (
                        <ProductCard key={product.id} product={product} getLoc={getLoc} t={t} />
                    ))}
                  </AnimatePresence>
                </div>

                {searchTerm === '' && (
                    <div ref={sentinelRef} className='mt-20 flex justify-center'>
                      {hasMore ? (
                          <div className='flex flex-col items-center gap-2'>
                            <Loader2 className='animate-spin text-[#e21e26]' size={24} />
                            <span className='text-[9px] font-black uppercase tracking-[0.3em] text-gray-300'>Syncing...</span>
                          </div>
                      ) : (
                          <div className='text-gray-300 text-[10px] font-black uppercase tracking-widest border-t border-gray-50 pt-10 w-full text-center'>
                            End of Collection
                          </div>
                      )}
                    </div>
                )}
              </>
          )}
        </main>

        <Footer />
      </div>
  )
}

/* --- UPDATED PRODUCT CARD COMPONENT (Matches Highlights Style) --- */
const ProductCard = ({ product, getLoc, t }) => {
  return (
      <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='h-full'
      >
        <Link
            to={`/product/${product.id}`}
            className='group block bg-white border border-gray-100 p-4 h-full transition-shadow hover:shadow-xl relative'
        >
          {/* NEW Tag - Styled exactly like Highlights */}
          <span className='absolute top-4 right-4 text-[#ff0000] text-[10px] font-black uppercase tracking-tighter z-10'>

              {product.size || 'Standard'}

          </span>

          {/* Product Image Container - Aspect Square like Highlights */}
          <div className='aspect-square flex items-center justify-center mb-6 mt-6 overflow-hidden'>
            <img
                src={product.poster}
                alt={getLoc(product, 'name')}
                className='max-h-full object-contain transition-transform duration-500 group-hover:scale-110'
            />
          </div>

          {/* Info Section - Styled exactly like Highlights */}
          <div className='mt-auto'>
            <h3 className='text-sm md:text-[15px] font-bold text-[#1a1a1a] mb-1 group-hover:text-[#ff0000] transition-colors line-clamp-1'>
              {getLoc(product, 'name')}
            </h3>
            <p className='text-[11px] text-gray-500 uppercase font-medium mb-1'>
              {getLoc(product, 'subcategory') || getLoc(product, 'category')}
            </p>

          </div>
        </Link>
      </motion.div>
  )
}

export default SubCategoryProducts;
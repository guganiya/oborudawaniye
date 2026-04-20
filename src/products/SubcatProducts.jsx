import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Loader2,
  ChevronRight,
  Search,
  X,
  ArrowRight,
  ArrowLeft,
  Home
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import apiClient from '../api/api'

const SubCategoryProducts = () => {
  const { subId } = useParams()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

  const [items, setItems] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [total, setTotal] = useState(0)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [page, setPage] = useState(1)

  const sentinelRef = useRef(null)
  const observerRef = useRef(null)
  const busyRef = useRef(false)

  const getLoc = (item, field) => {
    if (!item) return ''
    const lang = i18n.language
    if (lang === 'en' && item[`${field}_en`]) return item[`${field}_en`]
    if (lang === 'tk' && item[`${field}_tk`]) return item[`${field}_tk`]
    return item[`${field}_ru`] || item[field]
  }

  const spotlightItems = useMemo(() => items.slice(0, 5), [items])

  useEffect(() => {
    if (spotlightItems.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % spotlightItems.length)
      }, 7000)
      return () => clearInterval(timer)
    }
  }, [spotlightItems])

  const loadProducts = useCallback(
      async (pageNum, append = false) => {
        if (busyRef.current) return
        busyRef.current = true

        if (!append) setLoading(true)
        else setLoadingMore(true)

        try {
          const response = await apiClient.get('/products', {
            params: { subcategory: subId, page: pageNum },
          })
          const data = response.data
          const newItems = data.results || []

          setTotal(data.count || 0)
          setHasMore(data.next !== null)

          if (append) {
            setItems(prev => [...prev, ...newItems])
          } else {
            setItems(newItems)
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
      [subId],
  )

  // Reset when subId changes
  useEffect(() => {
    setPage(1)
    setItems([])
    setHasMore(true)
    loadProducts(1, false)
  }, [subId, loadProducts])

  // INFINITE SCROLL LOGIC
  useEffect(() => {
    if (!hasMore || searchTerm !== '' || loading) return

    if (observerRef.current) observerRef.current.disconnect()

    observerRef.current = new IntersectionObserver(
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

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current)
    }

    return () => observerRef.current?.disconnect()
  }, [hasMore, searchTerm, loadProducts, loading])

  const filteredItems = items.filter(product => {
    const name = getLoc(product, 'name').toLowerCase()
    const desc = getLoc(product, 'short_description').toLowerCase()
    const query = searchTerm.toLowerCase()
    return name.includes(query) || desc.includes(query)
  })

  const subcategoryName = items.length > 0 ? getLoc(items[0], 'subcategory') : t('products_loading')

  return (
      <div className='bg-white min-h-screen font-sans selection:bg-[#e21e26] selection:text-white text-black'>
        <Navbar />

        {/* --- SPOTLIGHT --- */}
        <header className='relative h-[80vh] min-h-[600px] bg-black overflow-hidden'>
          <AnimatePresence mode='wait'>
            {spotlightItems.length > 0 ? (
                <motion.div
                    key={spotlightItems[currentSlide].id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className='absolute inset-0'
                >
                  <motion.img
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 8 }}
                      src={spotlightItems[currentSlide].poster}
                      className='w-full h-full object-cover opacity-50'
                      alt='Spotlight'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent' />

                  <div className='absolute inset-0 flex items-center px-6 md:px-20'>
                    <div className='max-w-[1400px] w-full mx-auto space-y-6'>
                      <motion.h1
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          className='text-white text-6xl md:text-8xl font-black uppercase leading-tight tracking-tighter'
                      >
                        {getLoc(spotlightItems[currentSlide], 'name')}
                      </motion.h1>
                      <Link
                          to={`/product/${spotlightItems[currentSlide].id}`}
                          className='inline-flex items-center gap-4 bg-[#e21e26] text-white px-8 py-4 rounded-full font-bold uppercase text-[12px] tracking-widest hover:bg-white hover:text-black transition-all'
                      >
                        {t('products_view_details')} <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
            ) : (
                <div className='flex h-full items-center justify-center'><Loader2 className='animate-spin text-white' /></div>
            )}
          </AnimatePresence>
        </header>

        {/* --- BREADCRUMBS & SEARCH --- */}
        <div className='sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 py-4 px-6'>
          <div className='max-w-[1400px] mx-auto flex flex-col md:row justify-between items-center gap-4'>
            <nav className='flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-400'>
              <Link to="/" className="flex items-center gap-1 hover:text-[#e21e26]">
                <Home size={14} /> {t('dashboard')}
              </Link>
              <ChevronRight size={12} />
              <Link to='/products' className='hover:text-black'>{t('catalog')}</Link>
              <ChevronRight size={12} />
              <span className='text-[#e21e26]'>{subcategoryName}</span>
            </nav>

            <div className='relative w-full md:w-80'>
              <Search className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={16} />
              <input
                  type='text'
                  placeholder={t('search')}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='w-full bg-gray-100 border-none py-3 pl-12 pr-10 rounded-full text-xs font-bold uppercase outline-none focus:ring-2 focus:ring-[#e21e26]'
              />
              {searchTerm && <X onClick={() => setSearchTerm('')} className='absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer' size={16} />}
            </div>
          </div>
        </div>

        {/* --- MAIN GRID --- */}
        <main className='max-w-[1400px] mx-auto px-6 py-20 min-h-screen'>
          {loading && items.length === 0 ? (
              <div className='flex justify-center py-20'><Loader2 className='animate-spin text-[#e21e26]' size={40} /></div>
          ) : (
              <>
                <div className='grid grid-cols-2 lg:grid-cols-4 gap-10'>
                  {filteredItems.map(product => (
                      <ProductCard key={product.id} product={product} getLoc={getLoc} />
                  ))}
                </div>

                {/* Sentinel for Infinite Scroll */}
                {searchTerm === '' && hasMore && (
                    <div ref={sentinelRef} className='flex justify-center py-20'>
                      <Loader2 className='animate-spin text-[#e21e26]' size={32} />
                    </div>
                )}
              </>
          )}
        </main>

        <Footer />
      </div>
  )
}

const ProductCard = ({ product, getLoc }) => (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='group'>
      <Link to={`/product/${product.id}`}>
        <div className='relative aspect-[3/4] overflow-hidden bg-gray-100 rounded-2xl mb-4'>
          <img
              src={product.poster}
              className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0'
              alt={product.name}
          />
          <div className='absolute bottom-4 left-4'>
                    <span className='bg-black text-white text-[10px] font-black px-3 py-1 rounded-md uppercase'>
                        {product.size}
                    </span>
          </div>
        </div>
        <h3 className='text-lg font-black uppercase tracking-tight group-hover:text-[#e21e26] transition-colors'>
          {getLoc(product, 'name')}
        </h3>
        <p className='text-gray-400 text-xs mt-1 uppercase font-bold truncate'>
          {getLoc(product, 'short_description')}
        </p>
      </Link>
    </motion.div>
)

export default SubCategoryProducts
import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Hero from './components/Hero'
import New from './components/News'
import Newsletter from './components/Newsletter'
import VideoSection from './components/VideoSection'

const Home = () => {
	return (
		<div className='bg-white min-h-screen text-black selection:bg-[#e21e26] selection:text-white'>
			<Navbar />

			<Hero />
			<VideoSection />
			<New />
			<Newsletter />

			<Footer />
		</div>
	)
}

export default Home

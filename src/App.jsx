import { Routes, Route } from 'react-router-dom'
import Home from './Home/Home'
import Contacts from './Contacts/Contacts'
import Signup from './auth/Signup'
import News from './New/News'
import NewsContent from './New/NewsContent'
import Innovations from './inovation/Innovations'
import InnovationContent from './inovation/InnovationContent'
import AboutUs from './About/AboutUs'
function App() {
	return (
		<Routes>
			<Route path='/' element={<Home />} />
			<Route path='/contacts' element={<Contacts />} />
			<Route path='/signup' element={<Signup />} />
			<Route path='/news' element={<News />} />
			<Route path='/news-content/:id' element={<NewsContent />} />
			<Route path='/innovation' element={<Innovations />} />
			<Route path='/innovation-content' element={<InnovationContent />} />
			<Route path='/about-us' element={<AboutUs />} />
		</Routes>
	)
}

export default App

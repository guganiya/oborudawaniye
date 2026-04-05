import { Routes, Route } from 'react-router-dom'
import Home from './Home/Home'
import Contacts from './Contacts/Contacts'
import Signup from './auth/Signup'
import News from './New/News'
import NewsContent from './New/NewsContent'
import Innovations from './inovation/Innovations'
import InnovationContent from './inovation/InnovationContent'
import AboutUs from './About/AboutUs'
import { LoaderProvider } from './LoaderContext.jsx'
import Products from './products/Products.jsx'
import SubCategory from './products/SubCategory.jsx'
import ProductDetail from './products/ProductDetail.jsx'

function App() {
	return (
		<>
			<LoaderProvider>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/contacts' element={<Contacts />} />
					<Route path='/signup' element={<Signup />} />
					<Route path='/news' element={<News />} />
					<Route path='/news-content/:id' element={<NewsContent />} />
					<Route path='/innovation' element={<Innovations />} />
					<Route path='/innovations/:id' element={<InnovationContent />} />
					<Route path='/about-us' element={<AboutUs />} />
					<Route path='/products' element={<Products />} />
					<Route path='/subcategory' element={<SubCategory />} />
					<Route path='/product' element={<ProductDetail />} />
				</Routes>
			</LoaderProvider>
		</>
	)
}

export default App

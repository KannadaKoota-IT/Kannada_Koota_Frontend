import '../src/App.css'
import '../Reactbits/Carousel/Carousel.css'
import '../Reactbits/InfiniteScroll/InfiniteScroll.css'
import '../Reactbits/Particles/Particles.css'
import '../Reactbits/ScrollFloat/ScrollFloat.css'
import '../Reactbits/ScrollReveal/ScrollReveal.css'
import '../Reactbits/SplashCursor/SplashCursor.css'
import '../Reactbits/CircularGallery/CircularGallery.css'
import '../src/components/styles/ScrollToTop.css'
import '../src/components/homepage/ContactUs.css'
import Navbar from '../src/components/Navbar'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/router'

export default function App({ Component, pageProps }) {
  const router = useRouter()
  const isAdminPage = router.pathname.startsWith('/admin')

  return (
    <>
      {!isAdminPage && <Navbar />}
      <Component {...pageProps} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  )
}

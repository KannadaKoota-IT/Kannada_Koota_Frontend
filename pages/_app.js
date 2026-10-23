import '../src/App.css';
import Navbar from '../src/components/Navbar';
import ScrollToTop from '../src/components/ScrollToTop';
import MembershipModal from '../src/components/modals/MembershipModal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { LanguageProvider } from '../src/context/LanguageContext';
import { MembershipProvider } from '../src/context/MembershipContext';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isAdminPage = router.pathname.startsWith('/admin');

  return (
    <LanguageProvider>
      <MembershipProvider>
        {!isAdminPage && <Navbar />}
        <Component {...pageProps} />
        {!isAdminPage && <ScrollToTop />}
        <MembershipModal />
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
          theme="light"
        />
      </MembershipProvider>
    </LanguageProvider>
  );
}

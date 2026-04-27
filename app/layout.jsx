import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CartToast from '@/components/CartToast'

export const metadata = {
  title:       'R-R-Organic — Fresh Organic Farm Produce',
  description: 'Farm-fresh certified organic vegetables, fruits, grains and dairy delivered in 24 hours. Grown on our family farm in Amravati, Maharashtra.',
  keywords:    'organic vegetables, fresh produce, farm delivery, Amravati, Maharashtra',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ display:'flex', flexDirection:'column', minHeight:'100vh' }}>
        <Navbar />
        <main style={{ flex:1 }}>
          {children}
        </main>
        <CartToast />
        <Footer />
      </body>
    </html>
  )
}

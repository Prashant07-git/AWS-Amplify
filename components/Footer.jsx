import Link from 'next/link'

export default function Footer() {
  const shopLinks = [['All Products','/products'],['Vegetables','/products?cat=vegetables'],['Fruits','/products?cat=fruits'],['Seasonal Box','/products?cat=seasonal-box']]
  const helpLinks = [['My Orders','/orders'],['Shipping Info','/#shipping'],['Returns','/#returns'],['Contact Us','/contact']]

  return (
    <footer style={{ background:'#2d5016', marginTop:'auto' }}>
      <div className="footer-grid" style={{ padding:'40px 28px 24px', display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:32 }}>
        <div>
          <div style={{ fontFamily:'Playfair Display,serif', fontSize:22, fontWeight:700, color:'#fff', marginBottom:10 }}>
            R-R-<span style={{ color:'#c8a96e' }}>Organic</span>
          </div>
          <p style={{ fontSize:13, color:'rgba(255,255,255,0.6)', lineHeight:1.7, maxWidth:260 }}>
            Three generations of honest farming. No chemicals, no shortcuts — just the goodness of rich Vidarbha black soil.
          </p>
          <p style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:12 }}>Amravati, Maharashtra · India</p>
        </div>
        <div>
          <div style={{ fontSize:11, fontWeight:600, letterSpacing:'0.1em', color:'#c8a96e', textTransform:'uppercase', marginBottom:14 }}>Shop</div>
          {shopLinks.map(([l, h]) => <Link key={l} href={h} className="footer-link">{l}</Link>)}
        </div>
        <div>
          <div style={{ fontSize:11, fontWeight:600, letterSpacing:'0.1em', color:'#c8a96e', textTransform:'uppercase', marginBottom:14 }}>Help</div>
          {helpLinks.map(([l, h]) => <Link key={l} href={h} className="footer-link">{l}</Link>)}
        </div>
      </div>
      <div className="footer-bottom" style={{ borderTop:'1px solid rgba(255,255,255,0.1)', padding:'16px 28px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ fontSize:12, color:'rgba(255,255,255,0.35)' }}>© 2025 R-R-Organic. All rights reserved.</span>
        <span style={{ fontSize:12, color:'rgba(255,255,255,0.35)' }}>Made with love for honest food</span>
      </div>
    </footer>
  )
}

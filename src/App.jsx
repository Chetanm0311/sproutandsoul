import { useEffect, useMemo, useState } from 'react'
import {
  WHATSAPP_NUMBER, INSTAGRAM_HANDLE, INSTAGRAM_URL,
  TRIAL_BOX_PRICE, TRIPLE_PRICE, PRODUCTS, PLANS, FAQS, PHOTO_CREDITS,
} from './config.js'

const waLink = (text) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
const rupee = (n) => `₹${n}`

function useCart() {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sns-cart')) || {} } catch { return {} }
  })
  useEffect(() => { localStorage.setItem('sns-cart', JSON.stringify(cart)) }, [cart])
  const add = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }))
  const dec = (id) => setCart((c) => {
    const n = (c[id] || 0) - 1
    const { [id]: _, ...rest } = c
    return n > 0 ? { ...rest, [id]: n } : rest
  })
  const clear = () => setCart({})
  const items = useMemo(
    () => PRODUCTS.filter((p) => cart[p.id]).map((p) => ({ ...p, qty: cart[p.id] })),
    [cart],
  )
  const count = items.reduce((s, i) => s + i.qty, 0)
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0)
  const { discount, offers } = useMemo(() => calcOffers(items), [items])
  return { cart, items, count, subtotal, discount, offers, total: subtotal - discount, add, dec, clear }
}

// Poster offers: all 5 varieties = TRIAL_BOX_PRICE, any 3 different varieties = TRIPLE_PRICE.
function calcOffers(items) {
  const left = Object.fromEntries(items.map((i) => [i.id, i.qty]))
  const regular = (n) => n * PRODUCTS[0].price
  let discount = 0
  const offers = []
  if (items.length === PRODUCTS.length) {
    const n = Math.min(...Object.values(left))
    if (n > 0) {
      for (const k in left) left[k] -= n
      discount += n * (regular(5) - TRIAL_BOX_PRICE)
      offers.push(`All 5 Trial Box x ${n}`)
    }
  }
  let triples = 0
  for (;;) {
    const top = Object.entries(left).filter(([, q]) => q > 0).sort((a, b) => b[1] - a[1]).slice(0, 3)
    if (top.length < 3) break
    top.forEach(([k]) => { left[k] -= 1 })
    triples += 1
  }
  if (triples) {
    discount += triples * (regular(3) - TRIPLE_PRICE)
    offers.push(`Any 3 Microgreens x ${triples}`)
  }
  return { discount, offers }
}

function Nav({ count, openCart }) {
  const [open, setOpen] = useState(false)
  const links = [['Shop', '#shop'], ['Why us', '#why'], ['Subscribe', '#plans'], ['FAQ', '#faq']]
  return (
    <header className="nav">
      <a href="#top" className="logo">🌱 Sprout <span>&</span> Soul</a>
      <nav className={open ? 'open' : ''}>
        {links.map(([l, h]) => <a key={h} href={h} onClick={() => setOpen(false)}>{l}</a>)}
        <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">Instagram</a>
      </nav>
      <div className="nav-actions">
        <button className="cart-btn" onClick={openCart} aria-label="Open cart">
          🛒 {count > 0 && <b>{count}</b>}
        </button>
        <button className="burger" onClick={() => setOpen(!open)} aria-label="Menu">☰</button>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="blob b1" /><div className="blob b2" /><div className="blob b3" />
      <div className="hero-inner">
        <p className="pill">🌿 Grown in Bangalore · Harvested the morning you order</p>
        <h1>Tiny greens.<br /><em>Big</em> flavour.</h1>
        <p className="lead">
          Fresh, organic microgreens grown in Bangalore and delivered farm to home. Add them to
          salads, smoothies, omelettes, and rotis.
        </p>
        <div className="cta">
          <a className="btn primary" href="#shop">Shop microgreens</a>
          <a className="btn wa" href={waLink('Hi Sprout & Soul! I would like to order microgreens.')} target="_blank" rel="noreferrer">
            💬 Order on WhatsApp
          </a>
        </div>
        <ul className="stats">
          <li><b>100%</b>organic and chemical-free</li>
          <li><b>5</b>fresh varieties</li>
          <li><b>Harvested</b>on order</li>
        </ul>
      </div>
      <div className="hero-art" aria-hidden="true">
        <span style={{ '--d': '0s' }}>🌱</span>
        <span style={{ '--d': '.6s' }}>🌿</span>
        <span style={{ '--d': '1.2s' }}>🍃</span>
        <span style={{ '--d': '1.8s' }}>🌻</span>
      </div>
    </section>
  )
}

function Marquee() {
  const words = ['Fresh', 'Live', 'Chemical-free', 'Nutrient-dense', 'Locally grown', 'Delivered in Bangalore']
  return (
    <div className="marquee"><div className="track">
      {[...words, ...words, ...words].map((w, i) => <span key={i}>✦ {w}</span>)}
    </div></div>
  )
}

function ProductCard({ p, qty, add, dec }) {
  return (
    <article className="card" style={{ '--c': p.color }}>
      <div className="photo">
        <img src={p.image} alt={`${p.name} microgreens`} loading="lazy" />
        <span className="tag">{p.tag}</span>
      </div>
      <h3>{p.name}</h3>
      <p className="muted">{p.taste}</p>
      <p className="benefit">✓ {p.benefit}</p>
      <div className="card-bottom">
        <div><b className="price">{rupee(p.price)}</b><small> / {p.unit}</small></div>
        {qty ? (
          <div className="qty">
            <button onClick={() => dec(p.id)} aria-label={`Remove one ${p.name}`}>−</button>
            <span>{qty}</span>
            <button onClick={() => add(p.id)} aria-label={`Add one ${p.name}`}>+</button>
          </div>
        ) : (
          <button className="btn small" onClick={() => add(p.id)}>Add</button>
        )}
      </div>
    </article>
  )
}

function Shop({ cart, add, dec }) {
  return (
    <section className="section" id="shop">
      <h2>Pick your greens</h2>
      <p className="sub">Harvested fresh on order. Delivery across Bangalore.</p>
      <div className="grid">
        {PRODUCTS.map((p) => <ProductCard key={p.id} p={p} qty={cart[p.id]} add={add} dec={dec} />)}
      </div>
    </section>
  )
}

function Why() {
  const f = [
    ['🚚', 'Farm to home', 'Delivered across Bangalore.'],
    ['🧪', 'Chemical-free', 'Grown organically in Bangalore, with no chemicals.'],
    ['✂️', 'Harvested on order', 'Cut fresh when you order, so it reaches you live.'],
    ['🌍', 'Sustainable', 'Grown locally with care for the planet.'],
  ]
  return (
    <section className="section dark" id="why">
      <h2>Why Sprout &amp; Soul</h2>
      <div className="features">
        {f.map(([e, t, d]) => (
          <div className="feature" key={t}><span>{e}</span><h3>{t}</h3><p>{d}</p></div>
        ))}
      </div>
    </section>
  )
}

function Steps() {
  const s = ['Pick your greens', 'Order here or on WhatsApp', 'We harvest fresh', 'Enjoy at your door']
  return (
    <section className="section">
      <h2>How it works</h2>
      <ol className="steps">
        {s.map((t, i) => <li key={t}><b>{i + 1}</b>{t}</li>)}
      </ol>
    </section>
  )
}

function Plans() {
  return (
    <section className="section tint" id="plans">
      <h2>Combo offers</h2>
      <p className="sub">Limited time. Save more when you mix and match.</p>
      <div className="plans">
        {PLANS.map((p) => (
          <div key={p.id} className={`plan ${p.featured ? 'featured' : ''}`}>
            {p.featured && <span className="ribbon">Best value</span>}
            <h3>{p.name}</h3>
            <p className="plan-price">{rupee(p.price)}<small> <s>{rupee(p.was)}</s> / {p.per}</small></p>
            <ul>{p.points.map((x) => <li key={x}>✓ {x}</li>)}</ul>
            <a className="btn primary" target="_blank" rel="noreferrer"
              href={waLink(`Hi Sprout & Soul! I want the "${p.name}" offer (${rupee(p.price)}).`)}>
              Order on WhatsApp
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}

function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <section className="section narrow" id="faq">
      <h2>Questions, answered</h2>
      {FAQS.map(([q, a], i) => (
        <div key={q} className={`faq ${open === i ? 'open' : ''}`}>
          <button onClick={() => setOpen(open === i ? -1 : i)}>{q}<span>{open === i ? '−' : '+'}</span></button>
          {open === i && <p>{a}</p>}
        </div>
      ))}
    </section>
  )
}

function Insta() {
  return (
    <section className="section insta">
      <h2>Follow the growth 📸</h2>
      <p className="sub">Daily harvests, recipes, and behind-the-scenes on Instagram.</p>
      <a className="btn insta-btn" href={INSTAGRAM_URL} target="_blank" rel="noreferrer">@{INSTAGRAM_HANDLE}</a>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div>
        <div className="logo light">🌱 Sprout <span>&</span> Soul</div>
        <p>Fresh microgreens, grown with care in Bangalore.</p>
      </div>
      <div className="foot-links">
        <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">Instagram</a>
        <a href={waLink('Hi Sprout & Soul!')} target="_blank" rel="noreferrer">WhatsApp</a>
      </div>
      <small className="credits">
        Photos: {PHOTO_CREDITS.map(([n, who, lic]) => `${n} by ${who} (${lic})`).join(' · ')}, via Wikimedia Commons.
      </small>
      <small>© {new Date().getFullYear()} Sprout &amp; Soul. All rights reserved.</small>
    </footer>
  )
}

function CartDrawer({ c, open, close }) {
  const [step, setStep] = useState('cart')
  const [f, setF] = useState({ name: '', phone: '', address: '', pincode: '', slot: 'Morning (7-10 AM)', pay: 'UPI', notes: '' })
  const [err, setErr] = useState('')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  useEffect(() => { if (!open) { setStep('cart'); setErr('') } }, [open])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const place = (e) => {
    e.preventDefault()
    if (!/^\d{10}$/.test(f.phone.replace(/\s/g, ''))) return setErr('Enter a valid 10-digit phone number.')
    if (!/^\d{6}$/.test(f.pincode)) return setErr('Enter a valid 6-digit pincode.')
    const lines = c.items.map((i) => `• ${i.name} (${i.unit}) x ${i.qty} = ${rupee(i.qty * i.price)}`)
    const msg = [
      'New order for Sprout & Soul 🌱', '', ...lines, '',
      `Subtotal: ${rupee(c.subtotal)}`,
      c.discount ? `Offer savings: -${rupee(c.discount)} (${c.offers.join(', ')})` : null,
      `Total: ${rupee(c.total)}`, '',
      `Name: ${f.name}`, `Phone: ${f.phone}`,
      `Address: ${f.address}, Bangalore ${f.pincode}`,
      `Slot: ${f.slot}`, `Payment: ${f.pay}`,
      f.notes ? `Notes: ${f.notes}` : null,
    ].filter((l) => l !== null).join('\n')
    window.open(waLink(msg), '_blank')
    setStep('done')
    c.clear()
  }

  return (
    <>
      <div className={`overlay ${open ? 'show' : ''}`} onClick={close} />
      <aside className={`drawer ${open ? 'show' : ''}`} aria-hidden={!open}>
        <div className="drawer-head">
          <h3>{step === 'checkout' ? 'Delivery details' : 'Your basket'}</h3>
          <button onClick={close} aria-label="Close">✕</button>
        </div>

        {step === 'done' && (
          <div className="empty">
            <div className="big">🎉</div>
            <h3>Almost done!</h3>
            <p>Your order opened in WhatsApp. Press send there and we will confirm your slot and payment.</p>
            <button className="btn primary" onClick={close}>Back to shop</button>
          </div>
        )}

        {step === 'cart' && (c.items.length === 0 ? (
          <div className="empty">
            <div className="big">🧺</div>
            <p>Your basket is empty.</p>
            <button className="btn primary" onClick={close}>Browse greens</button>
          </div>
        ) : (
          <>
            <ul className="lines">
              {c.items.map((i) => (
                <li key={i.id}>
                  <img className="thumb" src={i.image} alt="" />
                  <div><b>{i.name}</b><small>{i.unit} · {rupee(i.price)}</small></div>
                  <div className="qty">
                    <button onClick={() => c.dec(i.id)}>−</button><span>{i.qty}</span><button onClick={() => c.add(i.id)}>+</button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="totals">
              <div className="row"><span>Subtotal</span><span>{rupee(c.subtotal)}</span></div>
              {c.discount > 0 && (
                <div className="row offer"><span>🎉 {c.offers.join(', ')}</span><span>−{rupee(c.discount)}</span></div>
              )}
              <p className="hint">Mix 3 different varieties for ₹500, or all 5 for ₹850. Savings apply automatically.</p>
              <div className="row total"><span>Total</span><span>{rupee(c.total)}</span></div>
              <button className="btn primary full" onClick={() => setStep('checkout')}>Checkout</button>
            </div>
          </>
        ))}

        {step === 'checkout' && (
          <form className="form" onSubmit={place}>
            <label>Name<input required value={f.name} onChange={set('name')} autoComplete="name" /></label>
            <label>Phone<input required inputMode="numeric" value={f.phone} onChange={set('phone')} autoComplete="tel" placeholder="10-digit mobile" /></label>
            <label>Address<textarea required rows="2" value={f.address} onChange={set('address')} placeholder="Flat, street, area" /></label>
            <label>Pincode<input required inputMode="numeric" maxLength="6" value={f.pincode} onChange={set('pincode')} /></label>
            <label>Delivery slot
              <select value={f.slot} onChange={set('slot')}>
                <option>Morning (7-10 AM)</option><option>Afternoon (12-3 PM)</option><option>Evening (5-8 PM)</option>
              </select>
            </label>
            <label>Payment
              <select value={f.pay} onChange={set('pay')}>
                <option value="UPI">UPI (we share details on WhatsApp)</option>
                <option value="Cash on delivery">Cash on delivery</option>
              </select>
            </label>
            <label>Notes (optional)<input value={f.notes} onChange={set('notes')} /></label>
            {err && <p className="err">{err}</p>}
            <div className="row total"><span>Total</span><span>{rupee(c.total)}</span></div>
            <button className="btn wa full" type="submit">💬 Place order via WhatsApp</button>
            <button type="button" className="link" onClick={() => setStep('cart')}>← Back to basket</button>
          </form>
        )}
      </aside>
    </>
  )
}

export default function App() {
  const c = useCart()
  const [open, setOpen] = useState(false)
  return (
    <>
      <Nav count={c.count} openCart={() => setOpen(true)} />
      <Hero />
      <Marquee />
      <Shop cart={c.cart} add={c.add} dec={c.dec} />
      <Why />
      <Steps />
      <Plans />
      <Faq />
      <Insta />
      <Footer />

      {c.count > 0 && !open && (
        <button className="float-cart" onClick={() => setOpen(true)}>
          🛒 {c.count} item{c.count > 1 ? 's' : ''} · {rupee(c.total)} <span>View basket →</span>
        </button>
      )}
      <a className="float-wa" href={waLink('Hi Sprout & Soul! I have a question.')} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">💬</a>
      <CartDrawer c={c} open={open} close={() => setOpen(false)} />
    </>
  )
}

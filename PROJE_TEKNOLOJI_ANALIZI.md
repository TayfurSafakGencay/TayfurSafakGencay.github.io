# Proje Teknoloji Analizi

Bu dokuman, projedeki gercek kullanimlari dosya bazli olarak ozetler. Ozellikle Cloudinary kullanim durumu ayri olarak dogrulanmistir.

## 1) Mimari Ozet

- Yapi: Statik, tek sayfa (SPA benzeri) portfolio
- Sayfa birlestirme: `js/module-loader.js` ile section HTML dosyalari runtime'da `fetch` ile yukleniyor
- Ana giris: `index.html`
- Stil: Tek dosya `style.css`
- Davranis/animasyonlar: `script.js`

## 2) Dogrulanmis Teknolojiler (Kodda Gercekten Kullanilan)

### Temel Web
- HTML5 (`index.html` + `sections/*.html`)
- CSS3 (`style.css`)
- Vanilla JavaScript (`script.js`, `js/module-loader.js`)

### Browser API'leri
- `fetch` (section yukleme) -> `js/module-loader.js`
- `CustomEvent` (`sectionsLoaded`) -> `js/module-loader.js`
- `IntersectionObserver` (skill/scroll/reveal animasyonlari) -> `script.js`
- `FormData` (iletisim formu) -> `script.js`
- `requestAnimationFrame` (cursor trail) -> `script.js`

### UI/UX Teknikleri
- Responsive tasarim (`@media`) -> `style.css`
- 3D carousel ve modal -> `sections/testimonials.html` + `script.js` + `style.css`
- Smooth scroll, mobil menu, aktif link, parallax, sayaç animasyonu -> `script.js`

## 3) Cloudinary Durumu (Detayli)

### Dogrulanmis Kullanim
- Cloudinary CDN URL ile gorsel servisi kullaniliyor:
  - `sections/hero.html` -> profil resmi `res.cloudinary.com/.../Profile_risjpq.jpg`
  - `sections/projects.html` -> proje gorseli `res.cloudinary.com/.../Polity_lytpll.png`

### NPM Bagimliligi Olarak
- `cloudinary` paketi bagimliliklarda var:
  - `package.json` -> `"cloudinary": "^2.7.0"`
  - `package-lock.json` -> cloudinary + transitif olarak `lodash`, `q`

### Kod Tarafi Notu
- `script.js` icinde `require('cloudinary').v2` ve `cloudinary.config(...)` kullanimi var.
- Ancak bu dosya `index.html` icinde dogrudan browser'da calistiriliyor (bundler gorunmuyor).
- Bu nedenle `require(...)` satiri browser ortaminda hata uretmeye adaydir. Cloudinary'nin bu kullaniminin ya build adimiyla bundle edilmesi ya da sunucu tarafina alinmasi gerekir.

## 4) NPM Bagimliliklari

Dogrudan bagimliliklar (`package.json`):
- `cloudinary@^2.7.0`
- `dotenv@^17.2.3`

Transitif bagimliliklar (`package-lock.json`):
- `lodash@4.17.21` (cloudinary uzerinden)
- `q@1.5.1` (cloudinary uzerinden, deprecated notu var)

## 5) Icerikte Gecen Ama Runtime'da Dogrulanmayan Teknolojiler

Asagidaki teknolojiler projede metin/etiket olarak geciyor; bu repoda aktif kod/kurulum olarak dogrulanmadi:
- React, Vue, Next.js, Angular
- Node.js/Express backend
- MongoDB/PostgreSQL/MySQL/Redis
- AWS, Docker, Firebase, Stripe vb.

Bu ifadeler agirlikla `sections/projects.html` ve `script.js` icindeki testimonial veri iceriginde vitrin metni olarak yer aliyor.

## 6) Cikis/Calistirma Modeli

- `README.md` yerel HTTP server oneriyor (dogru yaklasim): cunku section yukleme `fetch` ile yapiliyor.
- Proje statik servisle acilabiliyor; API/backend entegrasyonu fiilen yok.

## 7) Kisa Sonuc

- Proje gercekte modern, moduler bir statik portfolio yapisinda.
- Cloudinary kesin olarak kullaniliyor (CDN URL + NPM bagimliligi).
- Mevcut durumda Cloudinary Node SDK kodu (`require`) browser script'inde oldugu icin teknik uyumsuzluk riski var.
- Bunun disinda JS/CSS tarafinda zengin animasyon ve etkilesim ozellikleri bulunuyor.


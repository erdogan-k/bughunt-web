# BugHunt Web 🐛⚡

**BugHunt Web**, kullanıcıların herhangi bir kurulum yapmadan doğrudan tarayıcı üzerinden JavaScript hatalarını bulup düzeltebildiği, koyu terminal estetiğine sahip etkileşimli bir hata ayıklama (debugging) oyunudur.

---

## ✨ Özellikler

- **14 Hazır JavaScript Görevi:** `Diziler & Döngüler`, `Nesne & Referans`, `Asenkron & Promise`, `Kapsam & Closure`, `Tip & Mantık` ve `String & Veri İşleme` konularında **Kolay**, **Orta** ve **Zor** seviyelerde gerçekçi hata senaryoları.
- **Monaco Editör Entegrasyonu:** VS Code tabanlı sözdizimi renklendirme, satır numaraları, `Ctrl + Enter` ile hızlı test çalıştırma ve çevrimdışı/hızlı metin editörü yedeği.
- **İzole Web Worker Test Ortamı:**
  - Kullanıcı kodu ana JavaScript bağlamında (`window` / DOM üzerinde) `eval` veya `Function` ile **çalıştırılmaz**.
  - Her test çalıştırması için kısa ömürlü bir **Web Worker** oluşturulur.
  - Worker içerisinde dış ağ ve depolama API'leri (`fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `importScripts`, `indexedDB`, `caches`, `BroadcastChannel`) devre dışı bırakılır.
  - Sonsuz döngülere (`while(true){}`) karşı **2000ms (2 saniye)** zaman aşımı koruması (`worker.terminate()`) bulunur.
  - *Güvenlik Notu:* Tarayıcı Web Worker yapısı ana thread, DOM ve `localStorage` izolasyonu sağlar ancak işletim sistemi seviyesinde tam sanal makine izolasyonu değildir. Kodlar hiçbir sunucuya gönderilmez, tamamen istemci tarafında çalışır.
- **Seviye, XP ve Rozet Sistemi:** Görevleri tamamladıkça XP kazanma, seviye atlama ve 6 farklı başarı rozetinin kilidini açma.
- **Öğretici Açıklamalar & İpuçları:** Her görevde kademeli ipucu, referans çözüm ve hata kök nedenini anlatan detaylı öğretici açıklama.
- **Kalıcı İlerleme (`localStorage`):** Çözülen görevler, kazanılan XP, rozetler ve editörde yazılan kod taslakları tarayıcıda saklanır.
- **Tam Responsive Tasarım:** Masaüstünde yan yana (Editör + Test Sonuçları), mobil ve tablet cihazlarda dikey yerleşim.

---

## 🛠️ Teknoloji Yığını

- **React 18 + TypeScript + Vite**
- **Tailwind CSS v4**
- **Monaco Editor (`@monaco-editor/react`)**
- **Lucide React** (İkon seti)
- **Vitest + React Testing Library** (Birim ve bileşen testleri)

---

## 🚀 Yerel Geliştirme Kurulumu

### Gereksinimler
- **Node.js** `v18+` (önerilen `v20+` veya `v22+`)
- **npm** `v9+`

### Adımlar

1. **Depoyu klonlayın ve proje dizinine girin:**
   ```bash
   git clone https://github.com/erdogan-k/bughunt-web.git
   cd bughunt-web
   ```

2. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

3. **Geliştirme sunucusunu başlatın:**
   ```bash
   npm run dev
   ```
   Tarayıcınızda `http://localhost:5173` adresini açarak uygulamayı görüntüleyebilirsiniz.

---

## 🧪 Test ve Doğrulama Komutları

Birim testlerini, tüm 14 görevin hatalı/çözümlü kod doğrulamalarını ve Worker güvenlik testlerini çalıştırmak için:

```bash
# Tüm testleri tek seferlik çalıştır
npm test

# İzleme (watch) modunda testleri çalıştır
npm run test:watch

# TypeScript tip kontrolü
npm run lint

# Production (üretim) derlemesi oluştur
npm run build

# Üretim derlemesini yerel olarak önizle
npm run preview
```

---

## 🌐 Yayınlama (Deployment) Talimatları

BugHunt Web tamamen statik, istemci taraflı (SPA) bir web uygulamasıdır; herhangi bir backend veya veritabanı gerektirmez. `npm run build` komutu sonucunda oluşan `dist/` klasörü doğrudan yayınlanabilir.

### 1. Vercel ile Yayınlama
1. GitHub deponuzu [Vercel](https://vercel.com/) hesabınıza bağlayın.
2. **Framework Preset:** `Vite`
3. **Build Command:** `npm run build`
4. **Output Directory:** `dist`
5. **Deploy** butonuna tıklayın.

### 2. Netlify ile Yayınlama
1. [Netlify](https://www.netlify.com/) üzerinde **Add new site > Import an existing project** seçeneğini seçin.
2. **Build command:** `npm run build`
3. **Publish directory:** `dist`
4. Siteyi yayınlayın.

### 3. GitHub Pages ile Yayınlama
1. `vite.config.ts` içerisine depo adınıza göre `base: '/bughunt-web/'` ekleyin (kök alan adı kullanmıyorsanız).
2. `npm run build` çalıştırın ve `dist/` klasörünü `gh-pages` dalına veya GitHub Actions static pages iş akışına yönlendirin.

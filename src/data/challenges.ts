import type { Challenge } from '../types/challenge';

export const CHALLENGES: Challenge[] = [
  {
    id: 'challenge-1',
    title: 'Dizi Toplamında Sınır Hatası (Off-by-One)',
    slug: 'dizi-toplaminda-sinir-hatasi',
    difficulty: 'Kolay',
    category: 'Diziler & Döngüler',
    xpReward: 100,
    functionName: 'sumArray',
    shortDescription: 'Dizideki sayıların toplamını hesaplayan fonksiyon her zaman NaN döndürüyor.',
    problemDescription:
      '`sumArray(numbers)` fonksiyonu bir sayı dizisi alır ve tüm elemanların toplamını döndürmelidir. Ancak döngü koşulundaki küçük bir sınır hatası (off-by-one error) yüzünden fonksiyon `NaN` üretiyor.',
    expectedBehavior:
      '`sumArray([10, 20, 30])` çağrıldığında `60`, boş dizi `[]` verildiğinde `0` döndürmelidir.',
    hint: 'Döngüdeki `i <= numbers.length` koşuluna dikkat edin. 3 elemanlı bir dizinin son indeksi kaçtır?',
    buggyCode: `function sumArray(numbers) {
  let total = 0;
  for (let i = 0; i <= numbers.length; i++) {
    total += numbers[i];
  }
  return total;
}`,
    solutionCode: `function sumArray(numbers) {
  let total = 0;
  for (let i = 0; i < numbers.length; i++) {
    total += numbers[i];
  }
  return total;
}`,
    explanation:
      'JavaScript dizileri 0 tabanlı indekslenir; yani son elemanın indeksi `numbers.length - 1` değerindedir. Döngü koşulu `i <= numbers.length` olduğunda son adımda `numbers[numbers.length]` okunur ve bu değer `undefined` döner. Bir sayıya `undefined` eklemek (`total + undefined`) sonucu `NaN` (Not a Number) yapar. Koşulu `i < numbers.length` olarak değiştirmek hatayı çözer.',
    testCases: [
      {
        id: 'tc-1-1',
        description: 'Pozitif tam sayıların toplamını döndürmeli',
        input: [[10, 20, 30]],
        expected: 60,
      },
      {
        id: 'tc-1-2',
        description: 'Negatif ve pozitif sayıları doğru toplamalı',
        input: [[-5, 15, -10, 25]],
        expected: 25,
      },
      {
        id: 'tc-1-3',
        description: 'Boş dizi verildiğinde 0 döndürmeli',
        input: [[]],
        expected: 0,
      },
    ],
  },
  {
    id: 'challenge-2',
    title: 'Referans Kopyalama Tuzağı (Shallow Mutation)',
    slug: 'referans-kopyalama-tuzagi',
    difficulty: 'Orta',
    category: 'Nesne & Referans',
    xpReward: 150,
    functionName: 'applyDiscount',
    shortDescription:
      'İndirimli ürün oluşturan fonksiyon, orijinal ürün nesnesinin fiyatını da yanlışlıkla değiştiriyor.',
    problemDescription:
      '`applyDiscount(product, discountPercent)` fonksiyonu, verilen `product` nesnesini değiştirmeden (immutable kalarak) indirim uygulanmış yeni bir ürün nesnesi döndürmelidir. Ayrıca fonksiyonda hem orijinal nesne mutasyona uğruyor hem de indirim yüzdesi hesaplamasında mantık hatası var.',
    expectedBehavior:
      '`applyDiscount({ name: "Klavye", price: 1000 }, 20)` çağrıldığında `{ originalPrice: 1000, discountedProduct: { name: "Klavye", price: 800 } }` döndürmelidir.',
    hint: '`const updated = product;` satırı yeni bir nesne oluşturmaz, sadece referansı kopyalar. Nesneyi kopyalamak için `{ ...product }` kullanın ve indirim tutarını ana fiyattan çıkarın.',
    buggyCode: `function applyDiscount(product, discountPercent) {
  const updated = product;
  updated.price = product.price * (discountPercent / 100);
  return {
    originalPrice: product.price,
    discountedProduct: updated
  };
}`,
    solutionCode: `function applyDiscount(product, discountPercent) {
  const updated = {
    ...product,
    price: product.price - product.price * (discountPercent / 100)
  };
  return {
    originalPrice: product.price,
    discountedProduct: updated
  };
}`,
    explanation:
      'JavaScript\'te nesneler referans tiplidir. `const updated = product` ataması yeni bir nesne yaratmaz; her iki değişken de bellekteki aynı nesneyi gösterir. Bu yüzden `updated.price` değiştirildiğinde `product.price` da değişir. Ayrıca yüzde 20 indirim uygulamak, fiyatı `0.20` ile çarpmak değil, fiyattan `%20` düşmektir (`price - price * (discountPercent / 100)`). `{ ...product }` spread operatörü ile yüzeysel kopya oluşturularak orijinal nesne korunur.',
    testCases: [
      {
        id: 'tc-2-1',
        description: '%20 indirim uygularken orijinal fiyatı korumalı',
        input: [{ name: 'Mekanik Klavye', price: 1000 }, 20],
        expected: {
          originalPrice: 1000,
          discountedProduct: { name: 'Mekanik Klavye', price: 800 },
        },
      },
      {
        id: 'tc-2-2',
        description: '%50 indirimde yarı fiyat hesaplamalı',
        input: [{ name: 'Oyuncu Mouse', price: 600 }, 50],
        expected: {
          originalPrice: 600,
          discountedProduct: { name: 'Oyuncu Mouse', price: 300 },
        },
      },
      {
        id: 'tc-2-3',
        description: '%0 indirimde fiyat aynı kalmalı',
        input: [{ name: 'USB Kablo', price: 150 }, 0],
        expected: {
          originalPrice: 150,
          discountedProduct: { name: 'USB Kablo', price: 150 },
        },
      },
    ],
  },
  {
    id: 'challenge-3',
    title: 'Asenkron Veri Filtrelemede Kayıp Await',
    slug: 'asenkron-veri-filtrelemede-kayip-await',
    difficulty: 'Orta',
    category: 'Asenkron & Promise',
    xpReward: 175,
    functionName: 'getActiveUsernames',
    shortDescription:
      'Asenkron olarak kullanıcı listesini çeken fonksiyon Promise üzerinde .filter() çağırdığı için çöküyor.',
    problemDescription:
      '`getActiveUsernames(users)` asenkron fonksiyonu, `Promise.resolve(users)` ile simüle edilen asenkron veri kaynağından aktif (`isActive: true`) kullanıcıların sadece `username` alanlarını içeren bir dizi döndürmelidir. Ancak `await` eksikliği nedeniyle `rawUsers.filter is not a function` hatası fırlatılıyor.',
    expectedBehavior:
      'Aktif olan kullanıcıların `username` değerlerini sırasıyla bir dizi içinde döndürmelidir.',
    hint: '`fetchUsers(users)` bir `Promise` döndürür. Dizi metotlarını (`filter`, `map`) kullanmadan önce `Promise` sonucunu `await` ile çözümlemeniz gerekir.',
    buggyCode: `async function fetchUsers(users) {
  return Promise.resolve(users);
}

async function getActiveUsernames(users) {
  const rawUsers = fetchUsers(users);
  return rawUsers
    .filter((u) => u.isActive)
    .map((u) => u.username);
}`,
    solutionCode: `async function fetchUsers(users) {
  return Promise.resolve(users);
}

async function getActiveUsernames(users) {
  const rawUsers = await fetchUsers(users);
  return rawUsers
    .filter((u) => u.isActive)
    .map((u) => u.username);
}`,
    explanation:
      '`async` olarak tanımlanmış bir fonksiyon her zaman bir `Promise` döndürür. `fetchUsers(users)` çağrısının önüne `await` yazılmadığında `rawUsers` değişkeni kullanıcı dizisi değil, henüz çözülmemiş bir `Promise` nesnesi olur. `Promise` prototipinde `.filter()` metodu bulunmadığı için çalışma zamanında `TypeError: rawUsers.filter is not a function` hatası alınır.',
    testCases: [
      {
        id: 'tc-3-1',
        description: 'Sadece aktif kullanıcıların kullanıcı adlarını döndürmeli',
        input: [
          [
            { username: 'ada', isActive: true },
            { username: 'linus', isActive: false },
            { username: 'grace', isActive: true },
          ],
        ],
        expected: ['ada', 'grace'],
      },
      {
        id: 'tc-3-2',
        description: 'Hiç aktif kullanıcı yoksa boş dizi döndürmeli',
        input: [
          [
            { username: 'bot1', isActive: false },
            { username: 'bot2', isActive: false },
          ],
        ],
        expected: [],
      },
      {
        id: 'tc-3-3',
        description: 'Tüm kullanıcılar aktifse hepsini döndürmeli',
        input: [[{ username: 'turing', isActive: true }]],
        expected: ['turing'],
      },
    ],
  },
  {
    id: 'challenge-4',
    title: 'Sayısal Sıralama Tuzağı (Array.sort)',
    slug: 'sayisal-siralama-tuzagi',
    difficulty: 'Kolay',
    category: 'Diziler & Döngüler',
    xpReward: 100,
    functionName: 'sortScoresAscending',
    shortDescription:
      'Skorları küçükten büyüğe sıralaması gereken fonksiyon 100 sayısını 20 sayısından küçük sanıyor.',
    problemDescription:
      '`sortScoresAscending(scores)` fonksiyonu verilen sayı dizisini küçükten büyüğe sıralamalıdır. Ancak JavaScript\'in varsayılan `.sort()` metodu elemanları string\'e çevirip alfabetik (UTF-16 kod birimi) sıraya göre dizdiği için `[100, 20, 5]` dizisini `[100, 20, 5]` olarak yanlış sıralıyor.',
    expectedBehavior:
      '`sortScoresAscending([100, 20, 5, 42])` çağrıldığında `[5, 20, 42, 100]` döndürmelidir.',
    hint: '`Array.prototype.sort()` metoduna sayısal karşılaştırma fonksiyonu `(a, b) => a - b` parametre olarak geçilmelidir.',
    buggyCode: `function sortScoresAscending(scores) {
  return [...scores].sort();
}`,
    solutionCode: `function sortScoresAscending(scores) {
  return [...scores].sort((a, b) => a - b);
}`,
    explanation:
      'JavaScript\'te `Array.prototype.sort()` karşılaştırma fonksiyonu verilmezse tüm elemanları string\'e dönüştürür ve sözlük sırasına göre karşılaştırır (`"100" < "20"` çünkü `"1"` karakteri `"2"` karakterinden önce gelir). Sayısal sıralama için `(a, b) => a - b` karşılaştırıcısı kullanılmalıdır.',
    testCases: [
      {
        id: 'tc-4-1',
        description: 'Farklı basamaklı pozitif sayıları doğru sıralamalı',
        input: [[100, 20, 5, 42, 8]],
        expected: [5, 8, 20, 42, 100],
      },
      {
        id: 'tc-4-2',
        description: 'Negatif ve pozitif sayıları küçükten büyüğe sıralamalı',
        input: [[10, -3, 0, -25, 4]],
        expected: [-25, -3, 0, 4, 10],
      },
      {
        id: 'tc-4-3',
        description: 'Boş dizide boş dizi döndürmeli',
        input: [[]],
        expected: [],
      },
    ],
  },
  {
    id: 'challenge-5',
    title: 'Falsy Değer Tuzağı: 0 Puanlı Oyuncular Kayboluyor',
    slug: 'falsy-deger-tuzagi-nullish',
    difficulty: 'Kolay',
    category: 'Tip & Mantık',
    xpReward: 100,
    functionName: 'getPlayerScore',
    shortDescription:
      'Oyuncunun puanı 0 olduğunda fonksiyon bunu "puan yok" sanıp varsayılan 100 puanı atıyor.',
    problemDescription:
      '`getPlayerScore(player)` fonksiyonu oyuncunun `score` değeri tanımlıysa o değeri, eğer `null` veya `undefined` ise varsayılan olarak `100` başlangıç puanını döndürmelidir. Ancak mantıksal VEYA (`||`) operatörü `0` değerini de `falsy` kabul ettiği için `score: 0` olan oyunculara yanlışlıkla `100` veriyor.',
    expectedBehavior:
      '`{ name: "Efe", score: 0 }` için `0`, `{ name: "Can" }` veya `{ name: "Can", score: null }` için `100` döndürmelidir.',
    hint: 'Tüm falsy değerleri yakalayan `||` yerine sadece `null` ve `undefined` değerlerini yakalayan Nullish Coalescing (`??`) operatörünü kullanın.',
    buggyCode: `function getPlayerScore(player) {
  return player.score || 100;
}`,
    solutionCode: `function getPlayerScore(player) {
  return player.score ?? 100;
}`,
    explanation:
      'JavaScript\'te `0`, `""` (boş string) ve `false` değerleri `falsy` olarak değerlendirilir. `player.score || 100` ifadesinde sol taraf `0` olduğunda `||` operatörü sağ taraftaki `100` değerine geçer. Sadece `null` veya `undefined` durumlarında varsayılan değer kullanmak için ES2020 ile gelen Nullish Coalescing (`??`) operatörü kullanılmalıdır.',
    testCases: [
      {
        id: 'tc-5-1',
        description: 'Puan 0 olduğunda 0 döndürmeli (100 değil)',
        input: [{ name: 'Efe', score: 0 }],
        expected: 0,
      },
      {
        id: 'tc-5-2',
        description: 'Puan undefined olduğunda varsayılan 100 döndürmeli',
        input: [{ name: 'Zeynep' }],
        expected: 100,
      },
      {
        id: 'tc-5-3',
        description: 'Puan null olduğunda varsayılan 100 döndürmeli',
        input: [{ name: 'Mert', score: null }],
        expected: 100,
      },
      {
        id: 'tc-5-4',
        description: 'Normal pozitif puanı olduğu gibi döndürmeli',
        input: [{ name: 'Ayşe', score: 250 }],
        expected: 250,
      },
    ],
  },
  {
    id: 'challenge-6',
    title: 'Palindrom Kontrolünde Harf Duyarlılığı ve Boşluklar',
    slug: 'palindrom-kontrolunde-harf-duyarliligi',
    difficulty: 'Kolay',
    category: 'String & Veri İşleme',
    xpReward: 120,
    functionName: 'isPalindrome',
    shortDescription:
      'Büyük harf veya boşluk içeren palindrom kelimeler yanlışlıkla false döndürüyor.',
    problemDescription:
      '`isPalindrome(text)` fonksiyonu verilen metnin tersten okunuşunun da aynı olup olmadığını kontrol etmelidir (boşlukları ve büyük/küçük harf farkını yok sayarak). Mevcut kod doğrudan `text` üzerinde ters çevirme yaptığı için `"Kabak"` veya `"Ey Edip Adana da pide ye"` gibi ifadelerde `false` döndürüyor.',
    expectedBehavior:
      'Büyük/küçük harf ve boşluklar temizlendikten sonra metin palindrom ise `true`, değilse `false` döndürmelidir.',
    hint: 'Karşılaştırma yapmadan önce metni `.toLowerCase()` ile küçük harfe çevirin ve `.replace(/\\s+/g, "")` ile tüm boşlukları kaldırın.',
    buggyCode: `function isPalindrome(text) {
  const reversed = text.split("").reverse().join("");
  return text === reversed;
}`,
    solutionCode: `function isPalindrome(text) {
  const cleaned = text.toLowerCase().replace(/\\s+/g, "");
  const reversed = cleaned.split("").reverse().join("");
  return cleaned === reversed;
}`,
    explanation:
      'Palindrom kontrolünde `"K"` ve `"k"` karakterleri ASCII/Unicode tablosunda farklı değerlere sahiptir (`"K" !== "k"`). Ayrıca cümle içindeki boşluklar simetriyi bozar. Bu nedenle önce metin normalize edilmeli (`toLowerCase()` ve boşlukların silinmesi), ardından ters çevrilmiş haliyle karşılaştırılmalıdır.',
    testCases: [
      {
        id: 'tc-6-1',
        description: 'Baş harfi büyük "Kabak" kelimesi için true döndürmeli',
        input: ['Kabak'],
        expected: true,
      },
      {
        id: 'tc-6-2',
        description: 'Boşluklu palindrom cümleler için true döndürmeli',
        input: ['Ey Edip Adana da pide ye'],
        expected: true,
      },
      {
        id: 'tc-6-3',
        description: 'Palindrom olmayan metin için false döndürmeli',
        input: ['JavaScript'],
        expected: false,
      },
    ],
  },
  {
    id: 'challenge-7',
    title: 'URL Slug Oluşturucuda Tekil Değiştirme Hatası',
    slug: 'url-slug-tekil-degistirme-hatasi',
    difficulty: 'Kolay',
    category: 'String & Veri İşleme',
    xpReward: 120,
    functionName: 'createSlug',
    shortDescription:
      'Başlıktan URL slug üreten fonksiyon sadece ilk boşluğu tire (-) ile değiştiriyor.',
    problemDescription:
      '`createSlug(title)` fonksiyonu verilen başlığı küçük harfe çevirmeli, başındaki/sonundaki boşlukları temizlemeli (`trim`) ve kelimeler arasındaki tüm boşlukları (birden fazla ardışık boşluk dahil) tek bir tire (`-`) karakterine dönüştürmelidir. Mevcut kod `.replace(" ", "-")` kullandığı için yalnızca ilk boşluğu değiştiriyor.',
    expectedBehavior:
      '`createSlug("  JavaScript   Hata Ayiklama Rehberi ")` çağrıldığında `"javascript-hata-ayiklama-rehberi"` döndürmelidir.',
    hint: '`.trim()` kullandıktan sonra `.replace(/\\s+/g, "-")` düzenli ifadesini (regex) kullanarak bir veya daha fazla boşluğu tek tireye dönüştürebilirsiniz.',
    buggyCode: `function createSlug(title) {
  return title.toLowerCase().replace(" ", "-");
}`,
    solutionCode: `function createSlug(title) {
  return title.trim().toLowerCase().replace(/\\s+/g, "-");
}`,
    explanation:
      '`String.prototype.replace(" ", "-")` metodu ilk argüman olarak düz string aldığında yalnızca ilk eşleşmeyi değiştirir. Ayrıca kelimeler arasında birden fazla boşluk olabileceği ve kenarlarda boşluk kalabileceği için `.trim()` sonrasında global bayraklı `/\\s+/g` regex deseni kullanmak en güvenli çözümdür.',
    testCases: [
      {
        id: 'tc-7-1',
        description: 'Çok kelimeli başlığı tirelerle birleştirmeli',
        input: ['JavaScript Hata Ayiklama Oyunu'],
        expected: 'javascript-hata-ayiklama-oyunu',
      },
      {
        id: 'tc-7-2',
        description: 'Kenar boşluklarını ve çoklu boşlukları normalize etmeli',
        input: ['  React   ve   TypeScript  '],
        expected: 'react-ve-typescript',
      },
      {
        id: 'tc-7-3',
        description: 'Tek kelimeli başlığı küçük harfe çevirmeli',
        input: ['Terminal'],
        expected: 'terminal',
      },
    ],
  },
  {
    id: 'challenge-8',
    title: 'Diziden Eleman Silerken İndeks Kayması (Splice in Loop)',
    slug: 'diziden-eleman-silerken-indeks-kaymasi',
    difficulty: 'Orta',
    category: 'Diziler & Döngüler',
    xpReward: 160,
    functionName: 'removeEvenNumbers',
    shortDescription:
      'Çift sayıları silen döngü, yan yana iki çift sayı geldiğinde ikincisini atlıyor.',
    problemDescription:
      '`removeEvenNumbers(nums)` fonksiyonu dizideki tüm çift sayıları çıkarıp sadece tek sayıları içeren yeni bir dizi döndürmelidir. Ancak ileri doğru (`i++`) dönen bir döngü içinde `splice(i, 1)` kullanıldığında, silinen elemanın sağındaki elemanlar sola kayar ve bir sonraki eleman kontrol edilmeden atlanır.',
    expectedBehavior:
      '`removeEvenNumbers([2, 4, 5, 6, 8, 9])` çağrıldığında `[5, 9]` döndürmelidir.',
    hint: '`splice` ile yerinde silme yapmak yerine `nums.filter((n) => n % 2 !== 0)` kullanabilir veya döngüyü sondan başa doğru kurabilirsiniz.',
    buggyCode: `function removeEvenNumbers(nums) {
  const result = [...nums];
  for (let i = 0; i < result.length; i++) {
    if (result[i] % 2 === 0) {
      result.splice(i, 1);
    }
  }
  return result;
}`,
    solutionCode: `function removeEvenNumbers(nums) {
  return nums.filter((n) => n % 2 !== 0);
}`,
    explanation:
      'Bir dizi üzerinde baştan sona (`i++`) ilerlerken `result.splice(i, 1)` çağrıldığında, `i + 1` indeksindeki eleman `i` indeksine kayar. Döngünün sonraki adımında `i` bir artırıldığı için yeni `i` indeksine kayan eleman hiç kontrol edilmeden atlanır. Örneğin `[2, 4, 5]` dizisinde `2` silinince `4` sıfırıncı indekse geçer, `i` ise `1` olur ve `4` dizide unutulur. `.filter()` metodu bu hatayı tamamen önler.',
    testCases: [
      {
        id: 'tc-8-1',
        description: 'Ardışık çift sayıları eksiksiz filtrelemeli',
        input: [[2, 4, 5, 6, 8, 9]],
        expected: [5, 9],
      },
      {
        id: 'tc-8-2',
        description: 'Tümü çift olan diziden boş dizi döndürmeli',
        input: [[10, 20, 30, 40]],
        expected: [],
      },
      {
        id: 'tc-8-3',
        description: 'Negatif tek sayıları da korumalı',
        input: [[-4, -3, -2, 1, 2]],
        expected: [-3, 1],
      },
    ],
  },
  {
    id: 'challenge-9',
    title: 'Döngü İçinde Closure ve var Kapsam Hatası',
    slug: 'dongu-icinde-closure-ve-var-hatasi',
    difficulty: 'Orta',
    category: 'Kapsam & Closure',
    xpReward: 175,
    functionName: 'runMultiplierPipeline',
    shortDescription:
      'Döngüyle oluşturulan çarpan fonksiyonlarının hepsi beklenmedik şekilde aynı sayıyla çarpım yapıyor.',
    problemDescription:
      '`runMultiplierPipeline(factors, value)` fonksiyonu, `factors` dizisindeki her çarpan için bir fonksiyon oluşturup ardından bu fonksiyonları `value` ile çalıştırarak sonuç dizisini döndürmelidir. Ancak döngüde `var` kullanıldığı için tüm closure fonksiyonları döngü sonundaki aynı `i` değerini paylaşıyor.',
    expectedBehavior:
      '`runMultiplierPipeline([2, 3, 5], 10)` çağrıldığında `[20, 30, 50]` döndürmelidir.',
    hint: '`var` fonksiyon kapsamlıdır (function-scoped), blok kapsamlı değildir. Döngü değişkenini `let` ile tanımlayarak her iterasyonda ayrı bir bağlam (lexical binding) oluşturun.',
    buggyCode: `function runMultiplierPipeline(factors, value) {
  const callbacks = [];
  for (var i = 0; i < factors.length; i++) {
    callbacks.push(function (x) {
      return x * factors[i];
    });
  }
  return callbacks.map((fn) => fn(value));
}`,
    solutionCode: `function runMultiplierPipeline(factors, value) {
  const callbacks = [];
  for (let i = 0; i < factors.length; i++) {
    callbacks.push(function (x) {
      return x * factors[i];
    });
  }
  return callbacks.map((fn) => fn(value));
}`,
    explanation:
      '`for (var i = 0; ...)` kullanıldığında `i` değişkeni tüm döngü boyunca tek bir fonksiyon kapsamında paylaşılır. Döngü bittiğinde `i` değeri `factors.length` olur. Sonradan çağrılan `callbacks` fonksiyonları `factors[factors.length]` (`undefined`) değerini okur ve `x * undefined` sonucu `[NaN, NaN, NaN]` üretir. `let i` kullanıldığında her döngü adımında yeni bir blok kapsamı oluşturulur.',
    testCases: [
      {
        id: 'tc-9-1',
        description: 'Her çarpan fonksiyonu kendi indeksindeki çarpanı kullanmalı',
        input: [[2, 3, 5], 10],
        expected: [20, 30, 50],
      },
      {
        id: 'tc-9-2',
        description: 'Sıfır ve negatif çarpanlarla doğru çalışmalı',
        input: [[0, -2, 4], 7],
        expected: [0, -14, 28],
      },
      {
        id: 'tc-9-3',
        description: 'Boş çarpan dizisinde boş dizi döndürmeli',
        input: [[], 100],
        expected: [],
      },
    ],
  },
  {
    id: 'challenge-10',
    title: 'Sepet Hesabında Tip Zorlama (String Concatenation) Hatası',
    slug: 'sepet-hesabinda-tip-zorlama-hatasi',
    difficulty: 'Orta',
    category: 'Tip & Mantık',
    xpReward: 160,
    functionName: 'calculateCartTotal',
    shortDescription:
      'Fiyatların bazıları form girdisinden string olarak geldiği için toplama işlemi sayıları yan yana yapıştırıyor.',
    problemDescription:
      '`calculateCartTotal(items)` fonksiyonu sepetteki ürünlerin `price * quantity` değerlerini toplayıp virgülden sonra en fazla 2 basamaklı bir **sayı (number)** döndürmelidir. Ancak bazı ürünlerin `price` alanı `"19.99"` gibi string geldiğinde ve sonunda `.toFixed(2)` doğrudan döndürüldüğünde sonuç string tipinde kalıyor.',
    expectedBehavior:
      '`calculateCartTotal([{ price: "10.5", quantity: 2 }, { price: 5.25, quantity: 1 }])` çağrıldığında sayı olarak `26.25` döndürmelidir.',
    hint: 'Toplama yaparken `Number(item.price) * Number(item.quantity)` kullanın ve `.toFixed(2)` sonucunu `Number(...)` ile tekrar sayıya çevirin.',
    buggyCode: `function calculateCartTotal(items) {
  let sum = 0;
  for (const item of items) {
    sum += item.price + item.quantity;
  }
  return sum.toFixed(2);
}`,
    solutionCode: `function calculateCartTotal(items) {
  let sum = 0;
  for (const item of items) {
    sum += Number(item.price) * Number(item.quantity);
  }
  return Number(sum.toFixed(2));
}`,
    explanation:
      'Hatalı kodda iki problem vardır: Birincisi, `item.price + item.quantity` ifadesi çarpma yerine toplama yapmakta ve `price` string olduğunda `"10.5" + 2` işlemini `"10.52"` şeklinde string birleştirmeye dönüştürmektedir. İkincisi, `Number.prototype.toFixed(2)` her zaman `string` döndürür; sayısal dönüş için `Number(sum.toFixed(2))` veya `Math.round(sum * 100) / 100` kullanılmalıdır.',
    testCases: [
      {
        id: 'tc-10-1',
        description: 'String ve number karışık fiyatları çarpıp sayı olarak toplamalı',
        input: [
          [
            { price: '10.50', quantity: 2 },
            { price: 5.25, quantity: 1 },
          ],
        ],
        expected: 26.25,
      },
      {
        id: 'tc-10-2',
        description: 'IEEE 754 ondalık toplama sapmasını (0.1 + 0.2) yuvarlamalı',
        input: [
          [
            { price: 0.1, quantity: 1 },
            { price: 0.2, quantity: 1 },
          ],
        ],
        expected: 0.3,
      },
      {
        id: 'tc-10-3',
        description: 'Boş sepette sayı olarak 0 döndürmeli',
        input: [[]],
        expected: 0,
      },
    ],
  },
  {
    id: 'challenge-11',
    title: 'Derin Nesne Klonlamada İç İçe Referans Sızıntısı',
    slug: 'derin-nesne-klonlamada-referans-sizintisi',
    difficulty: 'Zor',
    category: 'Nesne & Referans',
    xpReward: 220,
    functionName: 'updateUserTheme',
    shortDescription:
      'Kullanıcı temasını güncelleyen fonksiyon spread (...) kullanmasına rağmen orijinal nesnenin iç ayarlarını bozuyor.',
    problemDescription:
      '`updateUserTheme(user, newTheme)` fonksiyonu orijinal `user` nesnesini hiç değiştirmeden `user.preferences.theme` alanını `newTheme` yapan yeni bir kopya döndürmelidir. Test ortamı hem orijinal `user.preferences.theme` değerinin korunduğunu hem de yeni nesnenin güncellendiğini doğrular. Ancak `{ ...user }` sadece birinci seviyeyi (shallow copy) kopyalar!',
    expectedBehavior:
      'Orijinal `user.preferences.theme` eski değerinde kalmalı, dönen `{ previousTheme, updatedUser }` içinde `previousTheme` eski temayı, `updatedUser.preferences.theme` ise yeni temayı içermelidir.',
    hint: 'İç içe (nested) nesnelerde sadece `{ ...user }` yetmez; `preferences` alt nesnesini de `{ ...user, preferences: { ...user.preferences, theme: newTheme } }` şeklinde kopyalamanız gerekir.',
    buggyCode: `function updateUserTheme(user, newTheme) {
  const copy = { ...user };
  copy.preferences.theme = newTheme;
  return {
    previousTheme: user.preferences.theme,
    updatedUser: copy
  };
}`,
    solutionCode: `function updateUserTheme(user, newTheme) {
  const copy = {
    ...user,
    preferences: {
      ...user.preferences,
      theme: newTheme
    }
  };
  return {
    previousTheme: user.preferences.theme,
    updatedUser: copy
  };
}`,
    explanation:
      'Object spread (`{ ...user }`) yüzeysel (shallow) bir kopyalama yapar. Üst seviyedeki özellikler yeni nesneye kopyalanır ancak `user.preferences` bir alt nesne olduğu için bellekteki referansı olduğu gibi `copy.preferences` içine aktarılır. Dolayısıyla `copy.preferences.theme = newTheme` yazıldığında `user.preferences.theme` de değişir. İç içe nesnelerde güncellenen her katmanın kendi spread kopyası oluşturulmalıdır.',
    testCases: [
      {
        id: 'tc-11-1',
        description: 'Alt nesneyi güncellerken orijinal preferences.theme değerini korumalı',
        input: [
          {
            id: 1,
            name: 'Deniz',
            preferences: { theme: 'light', notifications: true },
          },
          'dark',
        ],
        expected: {
          previousTheme: 'light',
          updatedUser: {
            id: 1,
            name: 'Deniz',
            preferences: { theme: 'dark', notifications: true },
          },
        },
      },
      {
        id: 'tc-11-2',
        description: 'Diğer alt özellikleri (notifications) kaybetmeden temayı değiştirmeli',
        input: [
          {
            id: 2,
            name: 'Selin',
            preferences: { theme: 'dark', notifications: false },
          },
          'matrix-green',
        ],
        expected: {
          previousTheme: 'dark',
          updatedUser: {
            id: 2,
            name: 'Selin',
            preferences: { theme: 'matrix-green', notifications: false },
          },
        },
      },
    ],
  },
  {
    id: 'challenge-12',
    title: 'forEach İçinde async/await Tuzağı',
    slug: 'foreach-icinde-async-await-tuzagi',
    difficulty: 'Zor',
    category: 'Asenkron & Promise',
    xpReward: 250,
    functionName: 'sumAsyncPrices',
    shortDescription:
      'Asenkron fiyat hesaplayan fonksiyon, işlemlerin bitmesini beklemeden her zaman 0 döndürüyor.',
    problemDescription:
      '`sumAsyncPrices(prices, taxRate)` asenkron fonksiyonu, her fiyat için asenkron `calculateWithTax(price, taxRate)` yardımcı fonksiyonunu çağırıp vergili toplamı döndürmelidir. Ancak `Array.prototype.forEach` asenkron callback\'lerin döndürdüğü Promise\'leri beklemez (`await` etmez); bu yüzden `return total` satırı Promise\'ler çözülmeden önce çalışır ve `0` döndürür.',
    expectedBehavior:
      '`sumAsyncPrices([100, 200], 0.1)` çağrıldığında `330` döndürmelidir.',
    hint: '`prices.forEach(async ...)` yerine klasik `for (const price of prices)` döngüsü veya `Promise.all(prices.map(...))` kullanın.',
    buggyCode: `async function calculateWithTax(price, taxRate) {
  return Promise.resolve(price + price * taxRate);
}

async function sumAsyncPrices(prices, taxRate) {
  let total = 0;
  prices.forEach(async (price) => {
    const withTax = await calculateWithTax(price, taxRate);
    total += withTax;
  });
  return total;
}`,
    solutionCode: `async function calculateWithTax(price, taxRate) {
  return Promise.resolve(price + price * taxRate);
}

async function sumAsyncPrices(prices, taxRate) {
  let total = 0;
  for (const price of prices) {
    const withTax = await calculateWithTax(price, taxRate);
    total += withTax;
  }
  return total;
}`,
    explanation:
      '`Array.prototype.forEach` senkron bir döngü mekanizmasıdır; kendisine verilen callback fonksiyonunu her eleman için çağırır ancak dönen `Promise` nesnelerini takip etmez veya beklemez. Bu nedenle `forEach` satırı anında biter ve `total` henüz `0` iken döndürülür. Asenkron işlemleri sırayla beklemek için `for...of` döngüsü, paralel beklemek için `await Promise.all(...)` kullanılmalıdır.',
    testCases: [
      {
        id: 'tc-12-1',
        description: '%10 vergi ile asenkron fiyatların toplamını bekleyip döndürmeli',
        input: [[100, 200], 0.1],
        expected: 330,
      },
      {
        id: 'tc-12-2',
        description: '%20 vergi ile tek elemanlı diziyi doğru hesaplamalı',
        input: [[50], 0.2],
        expected: 60,
      },
      {
        id: 'tc-12-3',
        description: 'Boş fiyat dizisinde 0 döndürmeli',
        input: [[], 0.18],
        expected: 0,
      },
    ],
  },
  {
    id: 'challenge-13',
    title: 'Metot Çıkarımında Kaybolan "this" Bağlamı',
    slug: 'metot-cikariminda-kaybolan-this-baglami',
    difficulty: 'Zor',
    category: 'Kapsam & Closure',
    xpReward: 230,
    functionName: 'runCounterSteps',
    shortDescription:
      'Nesne metodunu başka bir değişkene atayıp çağıran kod Strict Mode altında TypeError fırlatıyor.',
    problemDescription:
      '`runCounterSteps(initialValue, steps)` fonksiyonu bir sayaç nesnesi oluşturur ve `stepFn` referansını `steps` kez çağırarak son sayıyı döndürmek ister. Ancak `const stepFn = counter.increment;` şeklinde metot nesneden koparıldığında `this` bağlamı `undefined` olur ve `this.count` erişimi çökmesine yol açar.',
    expectedBehavior:
      '`runCounterSteps(10, 3)` çağrıldığında `13` döndürmelidir.',
    hint: 'Metodu koparırken `counter.increment.bind(counter)` kullanabilir veya doğrudan `counter.increment()` / ok fonksiyonu `() => counter.increment()` çağırabilirsiniz.',
    buggyCode: `function runCounterSteps(initialValue, steps) {
  const counter = {
    count: initialValue,
    increment() {
      this.count += 1;
    }
  };

  const stepFn = counter.increment;
  for (let i = 0; i < steps; i++) {
    stepFn();
  }

  return counter.count;
}`,
    solutionCode: `function runCounterSteps(initialValue, steps) {
  const counter = {
    count: initialValue,
    increment() {
      this.count += 1;
    }
  };

  const stepFn = counter.increment.bind(counter);
  for (let i = 0; i < steps; i++) {
    stepFn();
  }

  return counter.count;
}`,
    explanation:
      'JavaScript\'te bir fonksiyonun içindeki `this` değeri, fonksiyonun nerede tanımlandığına değil **nasıl çağrıldığına** bağlıdır. `counter.increment()` şeklinde çağrıldığında `this` değeri `counter` nesnesidir. Ancak `const stepFn = counter.increment; stepFn();` yapıldığında fonksiyon yalın halde çağrılır ve Strict Mode altında `this` değeri `undefined` olur. `.bind(counter)` metodu `this` bağlamını kalıcı olarak `counter` nesnesine sabitler.',
    testCases: [
      {
        id: 'tc-13-1',
        description: 'Başlangıç değerini belirtilen adım sayısı kadar artırmalı',
        input: [10, 3],
        expected: 13,
      },
      {
        id: 'tc-13-2',
        description: '0 adımda başlangıç değerini korumalı',
        input: [42, 0],
        expected: 42,
      },
      {
        id: 'tc-13-3',
        description: 'Negatif başlangıç değerinden itibaren doğru saymalı',
        input: [-5, 5],
        expected: 0,
      },
    ],
  },
  {
    id: 'challenge-14',
    title: 'İç İçe Dizileri Düzleştirirken Derinlik Sınırı (Deep Flatten)',
    slug: 'ic-ice-dizileri-duzlestirirken-derinlik-siniri',
    difficulty: 'Zor',
    category: 'Diziler & Döngüler',
    xpReward: 240,
    functionName: 'flattenDeep',
    shortDescription:
      'Çok katmanlı diziyi tek boyuta indirmesi gereken fonksiyon sadece ilk katmanı açıp iç dizileri olduğu gibi bırakıyor.',
    problemDescription:
      '`flattenDeep(nestedArray)` fonksiyonu, derinliği ne olursa olsun (`[1, [2, [3, [4]]]]` gibi) tüm iç içe dizileri açarak tek boyutlu düz bir dizi döndürmelidir. Mevcut kod `nestedArray.flat()` çağırıyor ancak parametresiz `.flat()` varsayılan olarak sadece `1` seviye derinliği düzleştirir.',
    expectedBehavior:
      '`flattenDeep([1, [2, [3, [4]], 5]])` çağrıldığında `[1, 2, 3, 4, 5]` döndürmelidir.',
    hint: '`nestedArray.flat(Infinity)` kullanabilir veya `Array.isArray(item)` kontrolüyle özyinelemeli (recursive) bir fonksiyon yazabilirsiniz.',
    buggyCode: `function flattenDeep(nestedArray) {
  return nestedArray.flat();
}`,
    solutionCode: `function flattenDeep(nestedArray) {
  return nestedArray.flat(Infinity);
}`,
    explanation:
      '`Array.prototype.flat(depth)` metodu varsayılan olarak `depth = 1` değerini kullanır ve yalnızca birinci seviyedeki alt dizileri açar. Derinliği önceden bilinmeyen çok katmanlı dizileri tamamen düzleştirmek için `nestedArray.flat(Infinity)` kullanmak veya `reduce` + `Array.isArray` ile özyinelemeli (recursive) bir çözüm uygulamak gerekir.',
    testCases: [
      {
        id: 'tc-14-1',
        description: '4 katmanlı iç içe diziyi tamamen düzleştirmeli',
        input: [[1, [2, [3, [4]], 5]]],
        expected: [1, 2, 3, 4, 5],
      },
      {
        id: 'tc-14-2',
        description: 'Boş alt dizileri yok sayarak elemanları çıkarmalı',
        input: [[[], [1, [], [2, [3]]]]],
        expected: [1, 2, 3],
      },
      {
        id: 'tc-14-3',
        description: 'Zaten düz olan diziyi değiştirmeden döndürmeli',
        input: [[10, 20, 30]],
        expected: [10, 20, 30],
      },
    ],
  },
];

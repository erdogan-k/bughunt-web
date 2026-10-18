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
    shortDescription: 'Dizideki sayıların toplamını hesaplayan fonksiyon 항상 NaN döndürüyor.',
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
      '`applyDiscount({ name: "Klavye", price: 1000 }, 20)` çağrıldığında `{ name: "Klavye", price: 800 }` dönmeli ve eğer aynı nesne tekrar kontrol edilirse orijinal fiyat bozulmamış olmalıdır. Fonksiyon `{ originalPrice, discountedProduct }` formatında çıktı vermelidir.',
    hint: '`const updated = product;` satırı yeni bir nesne oluşturmaz, sadece referansı kopyalar. Nesneyi kopyalamak için `{ ...product }` (spread) kullanabilirsiniz.',
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
      'JavaScript\'te nesneler referans tiplidir. `const updated = product` ataması yeni bir nesne yaratmaz; her iki değişken de bellekteki aynı nesneyi gösterir. Bu yüzden `updated.price` değiştirildiğinde `product.price` da değişir. Ayrıca yüzde 20 indirim uygulamak, fiyatı `0.20` ile çarpmak değil, fiyattan `%20` düşmektir (`price * (1 - discountPercent / 100)`). `{ ...product }` spread operatörü ile yüzeysel kopya oluşturularak orijinal nesne korunur.',
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
];

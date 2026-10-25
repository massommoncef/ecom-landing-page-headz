export const LANGS = { fr: 'Français', ar: 'العربية', en: 'English' };

const D = {
  fr: {
    title: 'HEADZ — Bonnets Under Armour & Kalenji | 2100 DA, livraison gratuite',
    unit: 'DA',
    r1: '🚚 Livraison gratuite · 58 wilayas', r2: '💵 Paiement à la livraison', r3: '🔥 2100 DA seulement', r4: '🧢 Under Armour & Kalenji', r5: '⚡ Commande en 30 secondes',
    eyebrow: 'Premium Headwear · Alger',
    h1: 'Bonnet <em>Under&nbsp;Armour</em><br>&amp; Kalenji',
    lead: 'La meilleure qualité, au meilleur prix. Parfait pour le sport, la rue et le froid.',
    price: '2100&nbsp;DA', free: 'Livraison gratuite',
    c1: 'Qualité supérieure — Under Armour &amp; Kalenji', c2: 'Paiement à la réception — tu paies seulement si tu es satisfait', c3: 'Livraison dans les 58 wilayas',
    cta: 'Je commande maintenant', watch: '▶ Voir la vidéo sur Instagram',
    orderH: 'Commande en 30 secondes', sub: "Remplis le formulaire, on s'occupe du reste. Pas besoin de nous écrire sur Instagram, TikTok ou Facebook.",
    perPiece: '2100 DA / pièce', lName: 'Nom complet', pName: 'Ex : Mohamed Benali', lPhone: 'Numéro de téléphone', lWilaya: 'Wilaya', choose: 'Choisir…',
    lCommune: 'Commune', pCommune: 'Ta commune', lNote: 'Remarque', optional: '(optionnel)', pNote: 'Adresse précise, horaire de livraison…',
    sQty: 'Articles', sDel: 'Livraison', sFree: 'Gratuite', sTotal: 'Total à payer à la livraison',
    submit: 'Confirmer ma commande', submitTotal: 'Confirmer ma commande — {total}', sending: 'Envoi en cours…', privacy: '🔒 Tes informations servent uniquement à la livraison.',
    okH: 'Commande confirmée !', thanks: 'Merci !', okMsg: 'Merci <b>{name}</b>, ta commande est bien enregistrée.', okNo: 'N° de commande', okTot: 'Total à la livraison',
    okCall: "Notre équipe t'appellera <b>uniquement pour fixer la livraison</b>. Garde ton téléphone à portée de main 📞", okVideo: 'Revoir le produit en vidéo',
    videoH: 'Vois-le en vidéo', videoBtn: 'Regarder sur Instagram',
    stepsH: 'Comment ça marche', s1: 'Tu remplis le formulaire', s1p: 'Nom, téléphone, wilaya. C\'est tout.', s2: 'On confirme et on expédie', s2p: "Un appel rapide pour valider l'adresse.", s3: 'Tu reçois et tu paies', s3p: 'Paiement en espèces au livreur, livraison offerte.',
    foot: 'HEADZ · Premium Headwear · Alger, DZ', foot2: '© 2026 HEADZ. Marques citées à titre descriptif.',
    stickyBtn: 'Commander',
    eName: 'Entre ton nom complet', ePhone: 'Numéro invalide (ex : 0555 12 34 56)', eWilaya: 'Choisis ta wilaya', eCommune: 'Entre ta commune', eItems: 'Choisis au moins un bonnet', eGen: 'Problème de connexion, réessaie.',
  },
  ar: {
    title: 'HEADZ — قبعات Under Armour و Kalenji | 2100 دج، التوصيل مجاني',
    unit: 'دج',
    r1: '🚚 توصيل مجاني · 58 ولاية', r2: '💵 الدفع عند الاستلام', r3: '🔥 2100 دج فقط', r4: '🧢 Under Armour و Kalenji', r5: '⚡ اطلب في 30 ثانية',
    eyebrow: 'قبعات فاخرة · الجزائر',
    h1: 'قبعة <em>Under&nbsp;Armour</em><br>و Kalenji',
    lead: 'أفضل جودة بأفضل سعر. مثالية للرياضة والشارع والبرد.',
    price: '2100&nbsp;دج', free: 'توصيل مجاني',
    c1: 'جودة عالية — Under Armour و Kalenji', c2: 'الدفع عند الاستلام — تدفع فقط إذا أعجبك المنتج', c3: 'التوصيل إلى 58 ولاية',
    cta: 'اطلب الآن', watch: '▶ شاهد الفيديو على إنستغرام',
    orderH: 'اطلب في 30 ثانية', sub: 'املأ الاستمارة وسنتكفل بالباقي. لا حاجة لمراسلتنا على إنستغرام أو تيك توك أو فيسبوك.',
    perPiece: '2100 دج / للقطعة', lName: 'الاسم الكامل', pName: 'مثال: محمد بن علي', lPhone: 'رقم الهاتف', lWilaya: 'الولاية', choose: 'اختر…',
    lCommune: 'البلدية', pCommune: 'بلديتك', lNote: 'ملاحظة', optional: '(اختياري)', pNote: 'العنوان بدقة، وقت التوصيل…',
    sQty: 'عدد القطع', sDel: 'التوصيل', sFree: 'مجاني', sTotal: 'المبلغ الواجب دفعه عند الاستلام',
    submit: 'تأكيد الطلب', submitTotal: 'تأكيد الطلب — {total}', sending: 'جارٍ الإرسال…', privacy: '🔒 معلوماتك تُستعمل فقط لإتمام التوصيل.',
    okH: 'تم تأكيد طلبك!', thanks: 'شكرًا!', okMsg: 'شكرًا <b>{name}</b>، تم تسجيل طلبك بنجاح.', okNo: 'رقم الطلب', okTot: 'المبلغ عند الاستلام',
    okCall: 'سيتصل بك فريقنا <b>فقط لتحديد موعد التوصيل</b>. أبقِ هاتفك قريبًا منك 📞', okVideo: 'شاهد المنتج في الفيديو',
    videoH: 'شاهده في فيديو', videoBtn: 'شاهد على إنستغرام',
    stepsH: 'كيف يعمل', s1: 'تملأ الاستمارة', s1p: 'الاسم، الهاتف، الولاية. هذا كل شيء.', s2: 'نؤكد ونشحن', s2p: 'مكالمة سريعة لتأكيد العنوان.', s3: 'تستلم وتدفع', s3p: 'الدفع نقدًا للموزع، والتوصيل مجاني.',
    foot: 'HEADZ · قبعات فاخرة · الجزائر', foot2: '© 2026 HEADZ. العلامات المذكورة للوصف فقط.',
    stickyBtn: 'اطلب',
    eName: 'أدخل اسمك الكامل', ePhone: 'رقم غير صحيح (مثال: 0555 12 34 56)', eWilaya: 'اختر ولايتك', eCommune: 'أدخل بلديتك', eItems: 'اختر قبعة واحدة على الأقل', eGen: 'مشكل في الاتصال، حاول مجددًا.',
  },
  en: {
    title: 'HEADZ — Under Armour & Kalenji Beanies | 2100 DA, free delivery',
    unit: 'DA',
    r1: '🚚 Free delivery · 58 wilayas', r2: '💵 Pay on delivery', r3: '🔥 Only 2100 DA', r4: '🧢 Under Armour & Kalenji', r5: '⚡ Order in 30 seconds',
    eyebrow: 'Premium Headwear · Algiers',
    h1: 'Beanie <em>Under&nbsp;Armour</em><br>&amp; Kalenji',
    lead: 'Top quality at the best price. Perfect for sport, the street and the cold.',
    price: '2100&nbsp;DA', free: 'Free delivery',
    c1: 'Premium quality — Under Armour &amp; Kalenji', c2: "Pay on receipt — you only pay if you're happy", c3: 'Delivery to all 58 wilayas',
    cta: 'Order now', watch: '▶ Watch the video on Instagram',
    orderH: 'Order in 30 seconds', sub: 'Fill in the form and we handle the rest. No need to message us on Instagram, TikTok or Facebook.',
    perPiece: '2100 DA / piece', lName: 'Full name', pName: 'e.g. Mohamed Benali', lPhone: 'Phone number', lWilaya: 'Wilaya', choose: 'Select…',
    lCommune: 'Commune', pCommune: 'Your commune', lNote: 'Note', optional: '(optional)', pNote: 'Exact address, delivery time…',
    sQty: 'Items', sDel: 'Delivery', sFree: 'Free', sTotal: 'Total to pay on delivery',
    submit: 'Confirm my order', submitTotal: 'Confirm my order — {total}', sending: 'Sending…', privacy: '🔒 Your details are only used for delivery.',
    okH: 'Order confirmed!', thanks: 'Thank you!', okMsg: 'Thanks <b>{name}</b>, your order is registered.', okNo: 'Order no.', okTot: 'Total on delivery',
    okCall: 'Our team will call you <b>only to arrange delivery</b>. Keep your phone nearby 📞', okVideo: 'Watch the product video again',
    videoH: 'See it on video', videoBtn: 'Watch on Instagram',
    stepsH: 'How it works', s1: 'Fill in the form', s1p: 'Name, phone, wilaya. That\'s it.', s2: 'We confirm and ship', s2p: 'A quick call to check your address.', s3: 'You receive and pay', s3p: 'Cash to the courier, delivery is free.',
    foot: 'HEADZ · Premium Headwear · Algiers, DZ', foot2: '© 2026 HEADZ. Brands mentioned for description only.',
    stickyBtn: 'Order',
    eName: 'Enter your full name', ePhone: 'Invalid number (e.g. 0555 12 34 56)', eWilaya: 'Select your wilaya', eCommune: 'Enter your commune', eItems: 'Choose at least one beanie', eGen: 'Connection problem, please retry.',
  },
};

let lang = 'fr';
try { lang = localStorage.getItem('hz_lang') || 'fr'; } catch {}
if (!D[lang]) lang = 'fr';
let listener = () => {};

export const getLang = () => lang;
export const t = (k, vars = {}) => (D[lang][k] ?? D.fr[k] ?? k).replace(/\{(\w+)\}/g, (_, v) => vars[v] ?? '');
export const onLang = (fn) => (listener = fn);

export function apply() {
  const root = document.documentElement;
  root.lang = lang;
  root.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.title = t('title');
  document.querySelectorAll('[data-i18n]').forEach((el) => (el.textContent = t(el.dataset.i18n)));
  document.querySelectorAll('[data-i18n-html]').forEach((el) => (el.innerHTML = t(el.dataset.i18nHtml, { name: el.dataset.name || '' })));
  document.querySelectorAll('[data-i18n-ph]').forEach((el) => (el.placeholder = t(el.dataset.i18nPh)));
  const cur = document.getElementById('lang-cur');
  if (cur) cur.textContent = lang.toUpperCase();
  document.querySelectorAll('.lang-menu button').forEach((b) => b.setAttribute('aria-current', String(b.dataset.lang === lang)));
  listener();
}

export function setLang(l) {
  if (!D[l]) return;
  lang = l;
  try { localStorage.setItem('hz_lang', l); } catch {}
  apply();
}

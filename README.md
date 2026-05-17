# T-KAI Shop

Site e-commerce **Otaku Streetwear** — Next.js 15 + Tailwind 3 + Prisma + PostgreSQL.
Boutique en ligne avec checkout, gestion admin, notifications push, suivi commande,
stockage images en ligne, et expérience mobile type app.

## ✨ Fonctionnalités

- 🛍️ **Boutique** : catalogue produits avec multi-images par couleur, toggle visuel
- 🎨 **Custom Lab** : demandes de personnalisation
- 🛒 **Panier persistant** (localStorage)
- 💬 **Checkout sans paiement en ligne** : notification équipe pour finalisation manuelle
- 📦 **Suivi commande client** : page `/track/[ref]` avec timeline visuelle
- 🔐 **Admin sécurisé** : bcrypt + cookie HMAC-SHA256, rate-limit, logout
- 📧 **Emails transactionnels** : confirmation client + notification admin (Gmail SMTP)
- 📱 **Push admin** : notifications instantanées via [ntfy.sh](https://ntfy.sh) (gratuit)
- ☁️ **Stockage Cloudinary** : images persistantes avec CDN (fallback local si pas configuré)
- 📲 **Mobile app-like** : bottom navigation fixe, design responsive
- 🌐 **PWA-ready** : favicon, apple-icon, theme color

## 🚀 Installation rapide

```powershell
# 1. Cloner et installer
git clone <ton-repo-url>
cd tkai-shop
npm install

# 2. Configurer l'env
copy .env.example .env
# → édite .env avec tes credentials (voir section ci-dessous)

# 3. Initialiser la DB
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed   # crée le compte admin

# 4. Lancer
npm run dev
# → http://localhost:3000
```

## 🔧 Variables d'environnement

Tout est documenté dans [.env.example](.env.example). Récap des essentielles :

| Variable | Description | Obligatoire |
|---|---|---|
| `DATABASE_URL` | URL PostgreSQL | ✅ |
| `ADMIN_PSEUDO` / `ADMIN_PASSWORD` | Bootstrap du compte admin | ✅ |
| `ADMIN_SESSION_SECRET` | Secret HMAC pour cookies (≥ 32 chars) | ✅ |
| `SMTP_*` + `ADMIN_EMAIL` | Envoi des emails (Gmail App Password) | recommandé |
| `SHOP_WHATSAPP_PHONE` | Numéro WhatsApp du shop (format intl sans +) | optionnel |
| `NTFY_TOPIC` | Topic ntfy pour push admin | optionnel |
| `CLOUDINARY_*` | Stockage images en ligne | optionnel |

Sans Cloudinary, les uploads vont dans `/public/uploads/`.
Sans ntfy, les notifications push admin sont désactivées (mails seuls).

## 📂 Structure

```
app/
  page.tsx              # Accueil
  shop/                 # Catalogue + filtres catégories
  product/[slug]/       # Page produit
  cart/                 # Panier
  checkout/             # Checkout
  track/                # Mes commandes (liste + recherche)
    [ref]/              # Suivi détaillé d'une commande
  custom-lab/           # Demande personnalisation
  admin/                # Dashboard admin (protégé)
    products/           # CRUD produits
    categories/         # CRUD catégories
    orders/             # Gestion commandes
    login/              # Login admin
  api/
    orders/             # Création de commande
    custom-requests/    # Demande Custom Lab
    admin/              # Endpoints admin protégés
components/
  CartContext.tsx       # Panier (localStorage)
  ClientOrdersContext.tsx # Historique commandes client
  BottomNav.tsx         # Navigation mobile app-like
  ProductDetailClient.tsx # Toggle couleur + galerie produit
  admin/                # Composants admin (CRUD, upload, etc.)
lib/
  auth.ts               # HMAC session admin
  mail.ts               # Nodemailer (templates emails)
  notifications.ts      # ntfy.sh + wa.me helpers
  cloudinary.ts         # Upload Cloudinary
  prisma.ts             # Client Prisma singleton
prisma/
  schema.prisma         # Schéma DB
  seed.ts               # Bootstrap admin
```

## 🧪 Scripts utiles

```powershell
npm run dev              # Dev server (port 3000)
npm run build            # Build production
npm run start            # Start production
npm run prisma:generate  # Régénère le client Prisma
npm run prisma:migrate   # Crée + applique une migration
npm run prisma:seed      # Re-seed l'admin
```

## 🔐 Sécurité

- Mots de passe admin **hashés bcrypt** (12 rounds)
- **Session cookie HMAC-SHA256** signé (clé `ADMIN_SESSION_SECRET`)
- **Rate-limit** sur le login admin (6 tentatives / 15 min / IP)
- **Validation côté serveur** des données commande (prix recalculés depuis la DB)
- **Routes admin protégées** par middleware Next.js
- `publicRef` de 24 chars hex (96 bits d'entropie) pour le suivi commande

## 📱 Recommandé

- Node.js 20 LTS
- PostgreSQL 16+
- Windows PowerShell / WSL / Linux / macOS

## 📝 Notes

- Le script dev utilise **Webpack** (pas Turbopack) pour éviter des soucis sur Windows.
- Le binaire `postgresql_18.exe` à la racine est un installeur local — **ne pas commiter** (déjà dans `.gitignore`).

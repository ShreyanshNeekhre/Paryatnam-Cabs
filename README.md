# Paryatnam Cabs - Premium Ride Booking App

A modern, responsive cab booking application built with React, TypeScript, and Tailwind CSS. Features a complete booking flow with real-time location search powered by Google Places API.

## 🚀 Features

### Core Features
- **Real-time Location Search** - Powered by Google Places API
- **Interactive Route Preview** - Visual journey mapping
- **Car Type Selection** - Multiple vehicle options with pricing
- **Trip Scheduling** - Date and time selection
- **Complete Booking Flow** - Step-by-step booking process
- **Trip History** - View past and current rides
- **Referral System** - Earn rewards by referring friends
- **Help & Support** - Comprehensive FAQ and support

### Technical Features
- **TypeScript** - Type-safe development
- **React 18** - Latest React features
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Responsive Design** - Mobile-first approach
- **Google Places Integration** - Real location data

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript 4.9.0
- **Styling**: Tailwind CSS 3.3.0
- **Animations**: Framer Motion 10.0.0
- **Icons**: Lucide React 0.263.0
- **Routing**: React Router 6.8.0
- **Maps & Places**: Google Places API

## 📋 Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Google Cloud Platform account (for Places API)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd paryatnam-cabs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Google Places API**
   
   ### Step 1: Create Google Cloud Project
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable billing for your project

   ### Step 2: Enable Places API
   - Navigate to "APIs & Services" > "Library"
   - Search for "Places API"
   - Click "Enable"

   ### Step 3: Create API Key
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the generated API key

   ### Step 4: Configure Environment Variables
   - Copy `env.example` to `.env.local`
   - Replace `your_google_places_api_key_here` with your actual API key
   ```bash
   cp env.example .env.local
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔐 Google Places API Security

### Recommended Security Measures
1. **Restrict API Key by Domain**
   - Go to Google Cloud Console > Credentials
   - Edit your API key
   - Under "Application restrictions", select "HTTP referrers"
   - Add your domain (e.g., `localhost:3000/*` for development)

2. **Restrict API Key by API**
   - Under "API restrictions", select "Restrict key"
   - Choose "Places API" from the list

3. **Set Usage Quotas**
   - Monitor usage in Google Cloud Console
   - Set daily quotas to prevent unexpected charges

## 📱 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run eject` - Eject from Create React App

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components
│   ├── LocationDropdown.tsx
│   ├── RouteMap.tsx
│   ├── CarSelection.tsx
│   ├── ScheduleSelection.tsx
│   └── BottomNavigation.tsx
├── pages/              # Page components
│   ├── Dashboard.tsx
│   ├── BookingConfirmation.tsx
│   ├── MyRides.tsx
│   ├── ReferEarn.tsx
│   ├── HelpSupport.tsx
│   └── About.tsx
├── services/           # API services
│   └── googlePlaces.ts
├── entities/           # TypeScript interfaces
│   ├── User.ts
│   └── Trip.ts
├── utils/              # Utility functions
│   └── index.ts
└── App.tsx             # Main app component
```

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (`#3B82F6` to `#1D4ED8`)
- **Dark**: Dark blue theme (`#1F2937` to `#111827`)
- **Success**: Green (`#10B981`)
- **Warning**: Yellow (`#F59E0B`)
- **Error**: Red (`#EF4444`)

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 400, 500, 600, 700
- **Sizes**: 12px to 48px

## 🌐 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables for Production
- Set `REACT_APP_GOOGLE_PLACES_API_KEY` in your hosting platform
- Ensure API key restrictions include your production domain

### Recommended Hosting Platforms
- **Vercel** - Easy deployment with automatic builds
- **Netlify** - Great for static sites
- **AWS Amplify** - Full-stack deployment
- **Firebase Hosting** - Google's hosting solution

## 🔧 Configuration

### Google Places API Settings
- **Types**: `establishment|geocode` (businesses and addresses)
- **Country**: Restricted to India (`country:in`)
- **Language**: English (`en`)
- **Session Tokens**: Enabled for billing optimization

### Customization
- Update location restrictions in `src/services/googlePlaces.ts`
- Modify car types and pricing in `src/components/CarSelection.tsx`
- Customize UI colors in `tailwind.config.js`

## 📊 Performance

### Optimizations
- **Debounced Search** - 300ms delay to reduce API calls
- **Session Tokens** - Optimize Google Places API billing
- **Lazy Loading** - Components load on demand
- **Image Optimization** - Optimized assets

### Monitoring
- Monitor Google Places API usage in Google Cloud Console
- Set up alerts for quota limits
- Track performance with browser dev tools

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Check the Help & Support section in the app
- Create an issue in the repository
- Contact the development team

## 🔮 Roadmap

- [ ] Real-time driver tracking
- [ ] Payment gateway integration
- [ ] Push notifications
- [ ] Offline support
- [ ] Multi-language support
- [ ] Advanced analytics dashboard

---

**Made with ❤️ for Paryatnam Cabs** 
# AI LearnMate — React Native Expo App

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure API URL
Open `src/api/axios.js` and replace the BASE_URL with your backend machine's local IP:
```js
const BASE_URL = "http://YOUR_LOCAL_IP:3000/api";
```
> Find your IP with `ipconfig` (Windows) or `ifconfig` (Mac/Linux)

### 3. Add Assets
Place placeholder images in the `assets/` folder:
- `icon.png` (1024x1024)
- `splash.png` (1242x2436)
- `adaptive-icon.png` (1024x1024)
- `favicon.png` (48x48)

You can use any plain colored PNG for development.

### 4. Start the App
```bash
npx expo start
```
Then scan the QR code with the **Expo Go** app on your phone.

---

## 📁 Project Structure
```
ai-learnmate/
├── App.js                        # Root component
├── app.json                      # Expo config
├── babel.config.js               # Babel + NativeWind setup
├── tailwind.config.js            # Tailwind theme config
├── package.json
├── assets/                       # App icons & splash
└── src/
    ├── api/
    │   └── axios.js              # Axios instance + interceptors
    ├── context/
    │   └── AuthContext.js        # Auth state (login/register/logout)
    ├── navigation/
    │   ├── RootNavigator.js      # Auth vs App switch
    │   ├── AuthNavigator.js      # Login / Register stack
    │   └── AppNavigator.js       # Bottom tabs + AI stack
    ├── components/
    │   ├── SoftCard.js           # Reusable card with shadow
    │   ├── SoftButton.js         # Reusable button (variants)
    │   └── SoftInput.js          # Reusable input with icons
    └── screens/
        ├── LoginScreen.js
        ├── RegisterScreen.js
        ├── DashboardScreen.js
        ├── UploadScreen.js
        ├── TranscriptScreen.js
        ├── QuizScreen.js
        ├── RecommendationsScreen.js
        └── ProfileScreen.js
```

---

## 🔌 Backend API
Make sure your Node.js backend is running on port `3000` and the FastAPI AI service is on port `5001`.

| Feature | Endpoint |
|---|---|
| Login | POST `/api/auth/login` |
| Register | POST `/api/auth/register` |
| Courses | GET `/api/courses` |
| Transcribe | POST `/api/ai/transcribe` |
| Summarize | POST `/api/ai/summarize` |
| Quiz | POST `/api/ai/quiz` |
| Recommendations | GET `/api/recommendations/:userId` |

---

## 🎨 Design System
- **Primary:** `#6C63FF` (Purple)
- **Secondary:** `#48CAE4` (Cyan)
- **Success:** `#4CC9A0` (Green)
- **Warning:** `#FFB347` (Orange)
- **Background:** `#F0F4FF` (Soft Blue-White)
- **Cards:** White with soft purple shadows
- **Border Radius:** 14–24px throughout

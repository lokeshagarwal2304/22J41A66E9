# 🔗 SmartURLX – Shorten. Share. Smartly. 🚀

> A complete client-side intelligent URL shortening application built with **React + TypeScript**, featuring custom shortcodes, expiry logic, analytics, light/dark theme, a chatbot, and real-time secure logging to an evaluation server — all with zero backend. ✨

---

## 📌 Project Overview

**SmartURLX** is designed for seamless, secure, and stylish URL shortening. Whether you're sharing links on social platforms or generating custom codes for your resources, this application provides full control over:

* ✅ Custom shortcodes
* 🕒 Link expiry management (auto + custom)
* 📊 Analytics for each shortened link
* 🔐 Secure logging of events via access tokens
* 🌗 Light/Dark mode switching
* 🤖 A helpful chatbot for user guidance

---

## 🚀 Live Demo

👉 [https://smarturlx.vercel.app](https://smarturlx.vercel.app) 

---

## 🌟 Features

| Feature                   | Description                                                |
| ------------------------- | ---------------------------------------------------------- |
| 🔗 URL Shortening         | Converts long URLs into custom shortcodes                  |
| ✍️ Custom Code Support    | User-defined short links with optional expiry              |
| ⏳ Expiry Handling         | Default 30-minute expiry with user-defined overrides       |
| 📈 Analytics Page         | Real-time click count tracking & statistics                |
| 🤖 Chatbot Assistant      | Friendly AI chatbot to assist with common user queries     |
| 🌙 Light/Dark Toggle      | Clean UI with persistent theme switching                   |
| 🔐 Logging Middleware     | Sends logs to a secure evaluation server via access\_token |
| 🧠 Pure Client-Side Logic | Entirely frontend powered with localStorage & fetch APIs   |
| 💬 Dynamic Notifications  | Alerts, errors, and toast messages for feedback            |

---

## 🔐 Logging System

SmartURLX uses a dedicated logging utility `logger.ts` to capture every action. Logs include:

* Component source
* Type (info, warn, error)
* Timestamp
* Message

Logs are stored locally (in `localStorage`) and sent to:

```http
POST http://20.244.56.144/evaluation-service/logs
```

Authorization header is injected dynamically using:

```ts
localStorage.setItem("access_token", "<TOKEN>")
```

---

## 🧠 Tech Stack

* ⚛️ React + TypeScript
* 🎨 Material UI
* 📂 Vercel (Deployment)
* 📦 localStorage (Data Persistence)
* 🔗 Custom Utility Hooks
* 🧾 REST APIs for Logging

---

## 📸 Screenshots (Expected Submission Set)

| Page             | Theme | Device  |
| ---------------- | ----- | ------- |
| Home Page        | Light | Desktop |
| Home Page        | Dark  | Mobile  |
| Analytics Page   | Light | Desktop |
| Chatbot Open     | Dark  | Desktop |
| Expired Redirect | Any   | Desktop |

*Screenshots can be added in `/assets/screenshots/` folder and embedded if needed.*

---

## ⚙️ Local Development

```bash
git clone https://github.com/lokeshagarwal2304/smarturlx.git
cd smarturlx
npm install
npm run dev
```

App runs at `http://localhost:3000`.

---

## 📁 Project Structure

```bash
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── utils/
│   ├── chatbot/
│   └── logger.ts
├── .gitignore
├── README.md
├── package.json
└── tsconfig.json
```

---

## 🧾 .gitignore Essentials

```gitignore
node_modules/
build/
dist/
.vercel/
.next/
.turbo/
.env*
.DS_Store
.vscode/
.idea/
*.log
```

---

## 📞 Contact & Credits

> This project is built and maintained by:

**👤 Lokesh Agarwal**
🔗 [LinkedIn](https://www.linkedin.com/in/lokeshagarwal2304)
📧 [lokeshagarwal2304@gmail.com](mailto:lokeshagarwal2304@gmail.com)
💻 GitHub: [lokeshagarwal2304](https://github.com/lokeshagarwal2304)
🧠 Tech domains: MERN, AI/ML, GenAI, Web3, Ethical Development

**🤝 Collaborators & Supporters:**
*MREC | GenAI Hackathon Team | Exam Portal Community*

---

## 🧪 Submission Checklist

* [x] Shorten URL ✅
* [x] Custom shortcodes ✅
* [x] Expiry Logic ✅
* [x] Analytics ✅
* [x] Light/Dark toggle ✅
* [x] Chatbot ✅
* [x] Logging + Token Auth ✅
* [x] Fully client-side ✅
* [x] Screenshot ready ✅

---

## 💬 Final Thoughts

> "SmartURLX isn’t just a project — it’s a tech showcase of clean frontend power, dynamic UI, API mastery, and smart design thinking."

🧠 Built with logic. Styled with intent. Logged with precision.
Let’s shorten the web, smartly. 🧩

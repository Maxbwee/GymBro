import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import MobileNavBar from "./components/MobileNavBar";
import { ThemeProvider } from "./context/ThemeContext";
import { WorkoutSessionProvider } from "./context/WorkoutSessionContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gym Bro",
  description: "A Progressive Web App for Gym Bro",
  icons: [
      {
        url: '/favicon-for-public/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('gymbro-theme')==='pink'){document.documentElement.classList.add('theme-pink');}}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col pt-6 sm:pt-0 pb-16 sm:pb-10">
        <ThemeProvider>
          <WorkoutSessionProvider>
            <Navbar />
            {children}
            <MobileNavBar />
          </WorkoutSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

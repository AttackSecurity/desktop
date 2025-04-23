import { Inter } from "next/font/google";
import "./globals.css";
import Startup from "@components/Startup";
const inter = Inter({ subsets: ["latin"] });


export default async function RootLayout({children}) {
  return (
      <html className="dark">
          <body className={inter.className}>
          <Startup />
          {children}
          </body>
      </html>
  );
}

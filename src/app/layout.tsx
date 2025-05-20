import { Outfit } from "next/font/google";
import "./globals.css";
import { ProvidersWrapper } from "@/components/ProviderWrapper";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NextTopLoader from "nextjs-toploader";


const outfit = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={outfit.variable}>
                <NextTopLoader height={3} showSpinner={false} color='#D18428' />

        <ProvidersWrapper>{children}</ProvidersWrapper>
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
        />
      </body>
    </html>
  );
}

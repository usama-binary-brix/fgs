import { Outfit } from "next/font/google";
import "./globals.css";
import { ProvidersWrapper } from "@/components/ProviderWrapper";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NextTopLoader from "nextjs-toploader";
import { Metadata } from "next";
import TopLoader from "@/components/TopLoader";


const outfit = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "First Group Services",
    default: "First Group Services",
  },
  description: "",
  // icons: {
  //     icon: [
  //         {
  //             url: "/favicon-light.png",
  //             media: "(prefers-color-scheme: light)",
  //         },
  //         {
  //             url: "/favicon-dark.png",
  //             media: "(prefers-color-scheme: dark)",
  //         },
  //     ],
  // },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={outfit.variable}>
      <TopLoader/>
        <NextTopLoader  
        height={3} 
      color='#D18428'
 />

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

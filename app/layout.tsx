import "./globals.css";import "./ask-aladdin.css";import {AppShell} from "@/app/components/layout/AppShell";
export const metadata={title:"Aladdin Intelligence",description:"Behaviour-first trading intelligence terminal"};
export const viewport={width:"device-width",initialScale:1,maximumScale:1,viewportFit:"cover",themeColor:"#07070a"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><AppShell>{children}</AppShell></body></html>}

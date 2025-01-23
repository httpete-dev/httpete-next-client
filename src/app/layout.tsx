import { CookiesProvider } from "next-client-cookies/server"
import { SessionProvider } from "next-auth/react";
import { GeistSans } from "geist/font/sans";
import { auth } from "~/server/auth";
import "~/styles/globals.css";
import { TooltipProvider } from "@radix-ui/react-tooltip";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  

  return (
    <SessionProvider session={session}>
      <CookiesProvider>

      <TooltipProvider delayDuration={100}>
      <html lang="en" className={`${GeistSans.variable} scrollbar-thin scrollbar-thumb-red-400 scrollbar-track-slate-500`}>
        <body className="bg-gray-900 text-gray-100 scrollbar-thin scrollbar-thumb-red-400 scrollbar-track-slate-500 h-full">
          {children}
          {/* TODO: Re-enable <Analytics  /> */}
        </body>
      </html>
      </TooltipProvider>
      </CookiesProvider>
    </SessionProvider>
  );
}


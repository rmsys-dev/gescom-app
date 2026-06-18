import { Poppins, Inter } from "next/font/google"

import "./globals.css"
import { QueryProvider } from "@/components/providers/clients/query-client-provider"
import { ThemeProvider } from "@/components/providers/theme/theme-provider"
import { AuthProvider } from "@/components/providers/authentication/auth-store"
import { cn } from "@/lib/utils"
import { Toaster } from "sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

const fontPoppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={cn("antialiased", fontPoppins.variable, "font-poppins", inter.variable)}
    >
      <body>
        <QueryProvider>
          <AuthProvider>
            <ThemeProvider>
              <TooltipProvider>
                {children}
                <Toaster richColors position="bottom-center" />
              </TooltipProvider>
            </ThemeProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}

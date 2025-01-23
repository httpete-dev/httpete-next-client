'use client'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { User, Settings, CreditCard } from 'lucide-react'
import DashboardHeader from '~/components/dashboardHeader'
import { SessionProvider } from 'next-auth/react'

const menuItems = [
  { icon: <User />, label: 'Profile', href: '/settings/profile' },
  { icon: <Settings />, label: 'Account', href: '/settings/account' },
  { icon: <CreditCard/>, label: 'Billing', href: '/settings/billing' },
]

type SettingsHeaderProps = {
  isMobile: boolean
}
function isMobile(): boolean {
  const width = window.innerWidth;
  const height = window.innerHeight;
  // Define mobile breakpoint (e.g., 768px)
  const mobileBreakpoint = 768; // Common breakpoint for mobile devices


  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const isMobileAgent = /android|avantgo|blackberry|bada|bb10|iemobile|opera mini|opera mobi|phone|mobile|mini|wap/i.test(userAgent);

  return width < mobileBreakpoint || isMobileAgent;
}

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(true)

  return (
    <SessionProvider>
        <DashboardHeader title='Settings'  isMobile={isMobile()}  />
        <>{children}</>
    </SessionProvider>
  )
}


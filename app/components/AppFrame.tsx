"use client";

import { usePathname } from "next/navigation";

export default function AppFrame({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-5 lg:px-8 py-8 md:py-12">
      {children}
    </main>
  );
}

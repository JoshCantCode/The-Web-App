"use client";

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, useEffect } from "react";
import '@/styles/globals.css'
import { useClientStateSync } from "@/hooks/use-client-state";
import { Toaster } from "@the-web-app/ui";


const client = new QueryClient();

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {

		
	return (
		<html suppressHydrationWarning>
			<body>
				<QueryClientProvider client={client}>
				<ShittySyncHack/>
				<ThemeProvider defaultTheme="dark" attribute="class" enableSystem disableTransitionOnChange>
					<Toaster richColors />
					<div className={`min-h-screen bg-background text-foreground antialiased`}>
					{children}
					</div>
					</ThemeProvider>
				</QueryClientProvider>
			</body>
		</html>
	);
}

function ShittySyncHack() {
	useClientStateSync();
	return null;
}
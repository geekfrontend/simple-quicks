"use client";

import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "@/lib/apollo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ApolloProvider client={apolloClient}>
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </ApolloProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

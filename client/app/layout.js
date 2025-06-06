import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "../stack";
import "./globals.css";
import Provider from "./Provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title:'Agent AI',
  description:'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="root">
      <body      >
        <StackProvider app={stackServerApp}>
          <StackTheme>
        <Provider>
        {children}
        <Toaster/>
        </Provider>
      </StackTheme></StackProvider></body>
    </html>
  );
}

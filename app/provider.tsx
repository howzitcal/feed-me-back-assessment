"use client";
import { Provider } from "@/components/ui/provider";

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;
  return <Provider>{children}</Provider>;
}

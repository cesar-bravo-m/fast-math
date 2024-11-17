import type { ReactNode } from "react";
import { StoreProvider } from "./StoreProvider";

interface Props {
  readonly children: ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
      <html lang="en">
        <body>
          <StoreProvider>
            {children}
          </StoreProvider>
        </body>
      </html>
  );
}

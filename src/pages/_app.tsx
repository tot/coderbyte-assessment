import { type AppType } from "next/app";
import { Inter } from "next/font/google";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { cn } from "~/lib/utils";

const inter = Inter({ subsets: ["latin"] });

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <main className={cn(inter.className, "bg-neutral-100")}>
      <Component {...pageProps} />
    </main>
  );
};

export default api.withTRPC(MyApp);

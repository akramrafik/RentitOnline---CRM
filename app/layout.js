
import "react-toastify/dist/ReactToastify.css";
import "simplebar-react/dist/simplebar.min.css";
import "flatpickr/dist/themes/light.css";
// import "react-svg-map/lib/index.css";
import "leaflet/dist/leaflet.css";
import "./scss/app.scss";

import { Lato } from 'next/font/google';
const lato = Lato({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lato',
  weight: ['100', '300', '400', '700', '900']
});
export const metadata = {
  title: 'rentitonline',
  description: 'one solution for all rental needs',
}

import ThemeProvider from "./theme-provider"
export default function RootLayout({ children }) {
  return (
      <html lang="en">
        <body className={`${lato.variable}`}>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </body>
      </html>
  );
}

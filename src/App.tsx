import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import './index.css'

import './App.css'

import { TonConnectUIProvider } from '@tonconnect/ui-react';

import { router } from "./routes";  
import { Welcome } from "./components/Welcome";


function App() {
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        const cx = setTimeout(setLoaded, 2000, true);
        return () => clearTimeout(cx);
    });
  return (
    <>
      <TonConnectUIProvider manifestUrl={import.meta.env.VITE_MANIFEST_URL}>
        {loaded
          ? <RouterProvider router={router} />
          : <Welcome />
        }
      </TonConnectUIProvider>
    </>
  )
}

export default App

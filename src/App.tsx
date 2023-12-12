import WebApp from "@twa-dev/sdk";

import { RouterProvider } from "react-router-dom";

import './index.css'
import './App.css'

import { TonConnectUIProvider } from '@tonconnect/ui-react';

import { router } from "./routes";

WebApp.ready();
WebApp.BackButton.show();

function App() {
  return (
    <>
      <TonConnectUIProvider manifestUrl={import.meta.env.VITE_MANIFEST_URL}>
        <RouterProvider router={router} />
      </TonConnectUIProvider>
    </>
  )
}

export default App

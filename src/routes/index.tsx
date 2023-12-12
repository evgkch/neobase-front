import { createBrowserRouter } from "react-router-dom";
// import { TonConnectUIProvider } from '@tonconnect/ui-react';
// import { Welcome } from '../components/Welcome';
// import * as Boaring from "./Solo/Boarding/Info";
import { Main } from "./Main";
import { Welcome } from "./Welcome";
  
export const router = createBrowserRouter([
    {
        path: "/",
        element: <Welcome />,
    },
    {
        path: "/main",
        element: <Main />
    }
]);
  
import { createMemoryRouter } from "react-router-dom";
// import { TonConnectUIProvider } from '@tonconnect/ui-react';
// import { Welcome } from '../components/Welcome';
// import * as Boaring from "./Solo/Boarding/Info";
import { Main } from "./Main";
import { Welcome } from "./Welcome";
  
export const router = createMemoryRouter([
    {
        path: "/",
        element: <Welcome />,
        index: true
    },
    {
        path: "/main",
        element: <Main />
    }
]);
  
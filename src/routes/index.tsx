import { createBrowserRouter } from "react-router-dom";
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { Welcome } from '../components/Welcome';
import * as Boaring from "./Solo/Boarding/Info";
  
export const router = createBrowserRouter([
    {
        path: "/",
        element: <Boaring.Info accountCounter="..." fundBalance="..." />,
        
    }
]);
  
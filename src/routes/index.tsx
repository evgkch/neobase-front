import { Route, createMemoryRouter, createRoutesFromElements } from "react-router-dom";
// import { TonConnectUIProvider } from '@tonconnect/ui-react';
// import { Welcome } from '../components/Welcome';
// import * as Boaring from "./Solo/Boarding/Info";
import { Main } from "./Main";
import { Welcome } from "./Welcome";
import * as Solo from "./Solo";
  
export const router = createMemoryRouter(createRoutesFromElements(
    <>
        <Route index path="/" element={<Welcome />} />
        <Route path="/main" element={ <Main />} />
        <Route path="/solo" element={<Solo.Settings />} />
        <Route path="/solo/settings" element={<Solo.Settings/ >} />
    </>
));
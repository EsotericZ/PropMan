// import { LoginButton } from "./components/LoginButton";
// import { LogoutButton } from "./components/LogoutButton";
// import { ProfileInfo } from "./components/ProfileInfo";

// import { useAuth0 } from "@auth0/auth0-react";
import { Routes, Route } from "react-router-dom";

import { Home } from "./pages/home/Home";
import { Layout } from "./pages/Layout";

export const App = () => {
    // const { isLoading, error } = useAuth0();

    // return (
    //     <main>
    //         <h1>Auth0 Login</h1>
    //         {error && 
    //             <p>Authentication Error</p>
    //         }
    //         {!error && isLoading && 
    //             <p>Loading</p>
    //         }
    //         {!error && !isLoading && (
    //             <>
    //                 <LoginButton />
    //                 <LogoutButton />
    //                 <ProfileInfo />
    //             </>
    //         )}
    //     </main>
    // );
    return (
        <>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                </Route>
            </Routes>
        </>
    );
}
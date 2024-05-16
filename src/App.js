import { Routes, Route } from "react-router-dom";

import { Home } from "./pages/home/Home";
import { Layout } from "./pages/Layout";
import { Profile } from "./pages/profile/Profile";
// import { RequireAuth } from "./pages/RequireAuth";

export const App = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />

                    {/* <Route element={<RequireAuth allowedRoles={[ROLES.Tenant]} />}> */}
                        <Route path="/profile" element={<Profile />} />
                    {/* </Route> */}
                </Route>
            </Routes>
        </>
    );
}
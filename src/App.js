import { Routes, Route } from 'react-router-dom';

import { Admin } from './pages/admin/Admin';
import { Home } from './pages/home/Home';
import { Layout } from './pages/Layout';
import { Login } from './pages/login/Login';
import { Missing } from './pages/missing/Missing';
import { PersistLogin } from './pages/PersistLogin';
import { Register } from './pages/register/Register';
import { RequireAuth } from './pages/RequireAuth';
import { Unauthorized } from './pages/unauthorized/Unauthorized';

const ROLES = {
    'Admin': 1089,
    'Tenant': 2001,
}

export const App = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />

                    <Route element={<PersistLogin />}>
                        <Route path="/" element={<Home />} />

                        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                            <Route path="/admin" element={<Admin />} />
                        </Route>

                        <Route element={<RequireAuth allowedRoles={[ROLES.Tenant]} />}>
                            <Route path="/profile" element={<Profile />} />
                        </Route>
                    </Route>

                    <Route path="*" element={<Missing />} />
                </Route>
            </Routes>
        </>
    );
}
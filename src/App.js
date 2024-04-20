import { LoginButton } from "./components/LoginButton";
import { LogoutButton } from "./components/LogoutButton";

export const App = () => {
    return (
        <main>
            <h1>Auth0 Login</h1>
            <LoginButton />
            <LogoutButton />
        </main>
    );
}
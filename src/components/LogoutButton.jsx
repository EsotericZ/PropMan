import { useAuth0 } from "@auth0/auth0-react";

export const LogoutButton = () => {
    const { logoutWithRedirect, isAuthenticated } = useAuth0();

    return (
        isAuthenticated && (
            <button onClick={() => logoutWithRedirect()}>
                Sign Out
            </button>
        )
    );
}
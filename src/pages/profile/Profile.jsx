import { useAuth0 } from "@auth0/auth0-react";

import { LogoutButton } from "../../components/LogoutButton";
import { ProfileInfo } from "../../components/ProfileInfo";

export const Profile = () => {
    const { isLoading, error } = useAuth0();

    return (
        <main>
            <h1>Profile</h1>
            {error && 
                <p>Authentication Error</p>
            }
            {!error && isLoading && 
                <p>Loading</p>
            }
            {!error && !isLoading && (
                <>
                    <LogoutButton />
                    <ProfileInfo />
                </>
            )}
        </main>
    );
}
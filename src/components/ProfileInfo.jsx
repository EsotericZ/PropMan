import { useAuth0 } from "@auth0/auth0-react";

export const ProfileInfo = () => {
    const { user, isAuthenticated } = useAuth0();

    return (
        isAuthenticated && (
            <article>
                {user?.picture && 
                    <img src={user.picture} alt={user?.name} />
                }
                <h2>{user?.name}</h2>
                <ul>
                {Object.keys(user).map((key, index) =>
                    <li key={index}>
                        {key}: {user[key]}
                    </li>
                )}
                </ul>
            </article>
        )
    );
}
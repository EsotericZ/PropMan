import { Link } from "react-router-dom"

export const Missing = () => {
    return (
        <article style={{ padding: "100px" }}>
            <p>Page Not Found</p>
            <div className="flexGrow">
                <Link to="/">Visit Our Homepage</Link>
            </div>
        </article>
    )
}
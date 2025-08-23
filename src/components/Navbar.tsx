import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav style={{ padding: "10px", background: "#eee"}}>
            <Link to="/" style={{ marginRight: "10px"}}>Home</Link>
            <Link to="/langdex" style={{ marginRight: "10px"}}>Langdex</Link>
            <Link to="/battle">Battle</Link>
        </nav>
    )
}
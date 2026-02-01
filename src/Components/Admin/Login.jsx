import React, { useEffect, useState } from 'react'
import { apis } from '../Utils/Util';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const user = { username, password };

        const response = await apis.login(user);

        if (response.status === 'success') {
            setLoading(false);
            navigate('/app-jewerly');
            navigate(0);
        } else {
            setError(response.message);
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-pink-50 p-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-6"
            >
                <h2 className="text-xl font-bold text-pink-600 mb-4 text-center">
                    🔐 Login Admin
                </h2>

                <input
                    type="text"
                    placeholder="Usuario"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full border rounded-xl px-3 py-2 mb-3"
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full border rounded-xl px-3 py-2 mb-3"
                    required
                />

                {error && (
                    <p className="text-sm text-red-500 mb-2 text-center">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-pink-500 text-white py-2 rounded-xl font-semibold disabled:opacity-40"
                >
                    {loading ? "Validando..." : "Ingresar"}
                </button>
            </form>
        </div>
    );
}

export default Login
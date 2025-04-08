'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import Textinput from '@/components/ui/Textinput';
import * as yup from 'yup';
import { login } from '@/lib/api';

// ✅ Yup validation schema
const schema = yup.object().shape({
    email: yup.string().email('Enter a valid email').required('Email is required'),
    password: yup.string().required('Password is required'),
});

export default function LoginPage() {
    const { signIn, user } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Step 1: Frontend validation
        try {
            await schema.validate({ email, password }, { abortEarly: false });
        } catch (err) {
            if (err.name === 'ValidationError') {
                const newErrors = {};
                err.inner.forEach((e) => {
                    newErrors[e.path] = e.message;
                });
                setValidationErrors(newErrors);
            }
            setLoading(false);
            return;
        }

        // Step 2: Clear previous validation errors and try login
        setValidationErrors({});
        try {
            await login(email, password);
            router.push('/dashboard');
        } catch (err) {
            if (err.response) {
                const status = err.response.status;

                if (status === 422 && err.response.data.errors) {
                    const newErrors = {};
                    Object.entries(err.response.data.errors).forEach(([key, value]) => {
                        newErrors[key] = value[0];
                    });
                    setValidationErrors(newErrors);
                } else if (status === 401 || status === 403) {
                    setError('Invalid email or password');
                } else {
                    setError('Login failed. Please try again later');
                }
            } else {
                setError('Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            router.push('/dashboard');
        }
    }, [user, router]);

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="mb-4 text-red-500">{error}</div>}

            <div className="mb-2">
                <label htmlFor="email" className="block text-sm">Email</label>
                <Textinput
                    type="email"
                    id="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full p-2 border rounded"
                />
                {validationErrors.email && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                )}
            </div>

            <div className="mb-4">
                <label htmlFor="password" className="block text-sm">Password</label>
                <Textinput
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full p-2 border rounded"
                />
                {validationErrors.password && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>
                )}
            </div>

            <button
                type="submit"
                className="btn btn-dark block w-full text-center"
                disabled={loading}
            >
                {loading ? (
                    <span>Loading...</span>
                ) : (
                    'Login'
                )}
            </button>
        </form>
    );
}

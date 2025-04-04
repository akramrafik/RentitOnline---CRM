'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import Textinput from '@/components/ui/Textinput';
import * as yup from 'yup';

// Define the validation schema using Yup
const schema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().required('Password is required'),
});

export default function LoginPage() {
    const { signIn, user } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [loading, setLoading] = useState(false);  // New loading state

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setLoading(true); 
        try {
            await schema.validate({ email, password }, { abortEarly: false });

            try {
                await signIn(email, password);
                router.push('/dashboard');
            } catch (err) {
                setError('Invalid email or password');
            }
        } catch (err) {
            const newValidationErrors = {};
            err.inner.forEach((error) => {
                newValidationErrors[error.path] = error.message;
            });
            setValidationErrors(newValidationErrors);
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full p-2 border rounded"
                />
                {validationErrors.email && <p className="text-red-500 text-sm">{validationErrors.email}</p>}
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
                {validationErrors.password && <p className="text-red-500 text-sm">{validationErrors.password}</p>}
            </div>

            <button
                type="submit"
                className="btn btn-dark block w-full text-center"
                disabled={loading}  // Disable button while loading
            >
                {loading ? (
                    <span>Loading...</span>  // You can replace this with a spinner component
                ) : (
                    'Login'
                )}
            </button>
        </form>
    );
}

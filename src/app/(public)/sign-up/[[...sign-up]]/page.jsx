// Muestra el formulario de registro de Clerk en /sign-up
'use client';

import { SignUp } from '@clerk/nextjs';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
    const router = useRouter();
    const { isLoaded, isSignedIn } = useAuth();

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            router.replace('/dashboard');
        }
    }, [isLoaded, isSignedIn, router]);

    if (!isLoaded || isSignedIn) {
        return (
            <main className="grid min-h-screen place-items-center bg-white">
                <div className="text-sm text-slate-400">Cargando...</div>
            </main>
        );
    }

    return (
        <main className="min-h-screen flex items-center justify-center p-4">
            <SignUp />
        </main>
    );
}

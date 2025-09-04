
import React from 'react';

export default function SocialLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
            {children}
        </main>
    )
}


import React from 'react';

export default function SocialLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="min-h-screen bg-background text-foreground">
            {children}
        </main>
    )
}

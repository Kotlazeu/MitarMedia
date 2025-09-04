
import React from 'react';

export default function SocialLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="bg-gray-100 dark:bg-gray-800">
            {children}
        </main>
    )
}

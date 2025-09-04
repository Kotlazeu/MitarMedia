
import { QrGeneratorPanel } from '@/components/qr-generator-panel';
import { LanguageProvider } from '@/context/language-context';
import { LanguageToggle } from '@/components/language-toggle';

export default function QrPage() {
    return (
        <LanguageProvider>
            <div className="relative min-h-screen w-full">
                <div className="absolute top-4 right-4 z-10">
                    <LanguageToggle />
                </div>
                <div className="container mx-auto py-10 flex items-center justify-center min-h-screen">
                    <QrGeneratorPanel />
                </div>
            </div>
        </LanguageProvider>
    );
}

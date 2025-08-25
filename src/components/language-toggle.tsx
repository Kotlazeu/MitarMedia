'use client';

import { useLanguage } from '@/context/language-context';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="language-toggle" className="text-sm font-medium text-white/80">
        EN
      </Label>
      <Switch
        id="language-toggle"
        checked={language === 'ro'}
        onCheckedChange={toggleLanguage}
        aria-label="Toggle language"
      />
      <Label htmlFor="language-toggle" className="text-sm font-medium text-white/80">
        RO
      </Label>
    </div>
  );
}

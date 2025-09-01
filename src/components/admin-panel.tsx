
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getContent, saveContent } from '@/lib/content-store';

export function AdminPanel() {
    const [content, setContent] = useState<any>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadContent = async () => {
            const data = await getContent();
            setContent(data);
            setIsLoading(false);
        };
        loadContent();
    }, []);

    const handleInputChange = (section: string, key: string, value: string) => {
        setContent((prevContent: any) => ({
            ...prevContent,
            [section]: {
                ...prevContent[section],
                [key]: value
            }
        }));
    };
    
    const handleSave = async () => {
        try {
            await saveContent(content);
            alert('Content saved successfully!');
        } catch (error) {
            console.error("Failed to save content", error);
            alert('Failed to save content.');
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Tabs defaultValue="ai-section" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="ai-section">AI Section</TabsTrigger>
                <TabsTrigger value="metrics">Metrics</TabsTrigger>
                <TabsTrigger value="work">Work</TabsTrigger>
                <TabsTrigger value="clients">Clients</TabsTrigger>
                <TabsTrigger value="social">Social</TabsTrigger>
            </TabsList>
            
            <TabsContent value="ai-section">
                <Card>
                    <CardHeader>
                        <CardTitle>AI / Hero Section</CardTitle>
                        <CardDescription>
                            Edit the content for the main section at the top of the page.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="rotating-text-1">Rotating Text 1</Label>
                            <Input 
                                id="rotating-text-1" 
                                value={content.aiSection?.rotatingTexts?.[0] || ''}
                                onChange={(e) => handleInputChange('aiSection', 'rotatingTexts', JSON.stringify([e.target.value, content.aiSection?.rotatingTexts?.[1] || '']))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="rotating-text-2">Rotating Text 2</Label>
                            <Input 
                                id="rotating-text-2" 
                                value={content.aiSection?.rotatingTexts?.[1] || ''}
                                 onChange={(e) => handleInputChange('aiSection', 'rotatingTexts', JSON.stringify([content.aiSection?.rotatingTexts?.[0] || '', e.target.value]))}

                            />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="main-title">Static Title part</Label>
                            <Input 
                                id="main-title" 
                                value={content.aiSection?.staticText || ''}
                                onChange={(e) => handleInputChange('aiSection', 'staticText', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea 
                                id="description" 
                                value={content.aiSection?.description || ''}
                                onChange={(e) => handleInputChange('aiSection', 'description', e.target.value)}
                            />
                        </div>
                        <Button onClick={handleSave}>Save Changes</Button>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="metrics">
                 <Card>
                    <CardHeader>
                        <CardTitle>Metrics Section</CardTitle>
                        <CardDescription>
                            This section is not yet editable.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </TabsContent>
            
            {/* Add other TabsContent sections here */}
        </Tabs>
    );
}


"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getContent, saveContent } from '@/lib/content-store';
import { translations } from '@/lib/translations';

// A simple map to get the translated label
const metricLabels = translations['ro'].metrics;


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

    const handleInputChange = (section: string, key: string, value: any, index?: number) => {
        setContent((prevContent: any) => {
            const newSection = { ...prevContent[section] };
            if (key === 'rotatingTexts' && index !== undefined) {
                const newRotatingTexts = [...(newSection.rotatingTexts || [])];
                newRotatingTexts[index] = value;
                newSection.rotatingTexts = newRotatingTexts;
            } else {
                newSection[key] = value;
            }
            return {
                ...prevContent,
                [section]: newSection
            };
        });
    };

    const handleMetricChange = (index: number, value: string) => {
        const newMetrics = [...content.metrics];
        // Ensure we're updating the value as a number
        newMetrics[index] = { ...newMetrics[index], value: parseInt(value, 10) || 0 };
        setContent((prevContent: any) => ({
            ...prevContent,
            metrics: newMetrics,
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
                                onChange={(e) => handleInputChange('aiSection', 'rotatingTexts', e.target.value, 0)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="rotating-text-2">Rotating Text 2</Label>
                            <Input 
                                id="rotating-text-2" 
                                value={content.aiSection?.rotatingTexts?.[1] || ''}
                                 onChange={(e) => handleInputChange('aiSection', 'rotatingTexts', e.target.value, 1)}

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
                        <Button onClick={handleSave}>Save AI Section</Button>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="metrics">
                 <Card>
                    <CardHeader>
                        <CardTitle>Metrics Section</CardTitle>
                        <CardDescription>
                           Edit the numerical values for the metrics displayed on the homepage.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {content.metrics?.map((metric: any, index: number) => (
                                <div key={index} className="space-y-2">
                                    <Label htmlFor={`metric-value-${index}`}>
                                        {metricLabels[metric.labelKey as keyof typeof metricLabels]} ({metric.unit})
                                    </Label>
                                    <Input
                                        id={`metric-value-${index}`}
                                        type="number"
                                        value={metric.value || ''}
                                        onChange={(e) => handleMetricChange(index, e.target.value)}
                                        placeholder="Enter value"
                                    />
                                </div>
                            ))}
                        </div>
                        <Button onClick={handleSave}>Save Metrics</Button>
                    </CardContent>
                </Card>
            </TabsContent>
            
            <TabsContent value="work">
                 <Card>
                    <CardHeader>
                        <CardTitle>Work Section</CardTitle>
                        <CardDescription>
                            This section is not yet editable. Functionality to manage videos is coming soon.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </TabsContent>

            <TabsContent value="clients">
                 <Card>
                    <CardHeader>
                        <CardTitle>Clients Section</CardTitle>
                        <CardDescription>
                           This section is not yet editable. Functionality to manage client logos is coming soon.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </TabsContent>
            
            <TabsContent value="social">
                 <Card>
                    <CardHeader>
                        <CardTitle>Social Section</CardTitle>
                        <CardDescription>
                           This section is not yet editable.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </TabsContent>
        </Tabs>
    );
}

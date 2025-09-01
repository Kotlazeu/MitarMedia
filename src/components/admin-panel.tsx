
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
import { Checkbox } from '@/components/ui/checkbox';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './sortable-item';
import { AddClientDialog } from './add-client-dialog';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

const metricLabels = translations['ro'].metrics;

export function AdminPanel() {
    const [content, setContent] = useState<any>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isAddClientOpen, setIsAddClientOpen] = useState(false);
    const { toast } = useToast();

    const sensors = useSensors(
        useSensor(PointerSensor)
    );

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
            const newSectionData = { ...(prevContent[section] || {}) };
            if (key === 'rotatingTexts' && typeof index === 'number') {
                const newRotatingTexts = [...(newSectionData.rotatingTexts || [])];
                newRotatingTexts[index] = value;
                newSectionData.rotatingTexts = newRotatingTexts;
            } else {
                newSectionData[key] = value;
            }
            return {
                ...prevContent,
                [section]: newSectionData
            };
        });
    };

    const handleMetricChange = (index: number, value: string) => {
        setContent((prevContent: any) => {
            const newMetrics = [...prevContent.metrics];
            newMetrics[index] = { ...newMetrics[index], value: parseInt(value, 10) || 0 };
            return {
                ...prevContent,
                metrics: newMetrics,
            };
        });
    };

    const handleClientEnabledChange = (id: string, enabled: boolean) => {
        setContent((prevContent: any) => {
            const newClients = prevContent.clients.map((client: any) => 
                client.id === id ? { ...client, enabled } : client
            );
            return {
                ...prevContent,
                clients: newClients,
            };
        });
    };

    const handleRemoveClient = (id: string) => {
         setContent((prevContent: any) => ({
            ...prevContent,
            clients: prevContent.clients.filter((client: any) => client.id !== id),
        }));
    };
    
    const handleAddClient = (newClient: { name: string; logo: string; }) => {
        setContent((prevContent:any) => ({
            ...prevContent,
            clients: [
                ...prevContent.clients,
                { ...newClient, id: `client-${Math.random().toString(36).substr(2, 9)}`, enabled: true }
            ]
        }));
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setContent((prevContent: any) => {
                const oldIndex = prevContent.clients.findIndex((c: any) => c.id === active.id);
                const newIndex = prevContent.clients.findIndex((c: any) => c.id === over.id);
                return {
                    ...prevContent,
                    clients: arrayMove(prevContent.clients, oldIndex, newIndex),
                };
            });
        }
    };

    const handleSave = async () => {
        try {
            await saveContent(content);
            toast({
                title: "Success",
                description: "Content saved successfully!",
            });
        } catch (error) {
            console.error("Failed to save content", error);
             toast({
                title: "Error",
                description: "Failed to save content.",
                variant: "destructive",
            });
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Tabs defaultValue="ai-section" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="ai-section">AI Section</TabsTrigger>
                    <TabsTrigger value="metrics">Metrics</TabsTrigger>
                    <TabsTrigger value="work">Work</TabsTrigger>
                    <TabsTrigger value="clients">Clients</TabsTrigger>
                    <TabsTrigger value="social">Social</TabsTrigger>
                </TabsList>

                {/* AI Section Tab */}
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

                {/* Metrics Tab */}
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

                {/* Work Tab */}
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

                {/* Clients Tab */}
                <TabsContent value="clients">
                    <Card>
                        <CardHeader>
                            <CardTitle>Clients Section</CardTitle>
                            <CardDescription>
                                Manage the client logos displayed on the homepage. Drag to reorder.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <SortableContext items={content.clients?.map((c: any) => c.id) || []} strategy={verticalListSortingStrategy}>
                                    <div className="space-y-2">
                                        {content.clients?.map((client: any) => {
                                            return (
                                                <SortableItem key={client.id} id={client.id}>
                                                    <div className="flex items-center space-x-2 p-2 border rounded-md bg-background hover:bg-accent/50">
                                                        <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                                                        <Checkbox
                                                            id={`client-enabled-${client.id}`}
                                                            checked={client.enabled}
                                                            onCheckedChange={(checked) => handleClientEnabledChange(client.id, !!checked)}
                                                        />
                                                        <Label htmlFor={`client-enabled-${client.id}`} className="flex-grow flex items-center gap-4 cursor-pointer">
                                                            {client.logo && <Image src={client.logo} alt={client.name} width={24} height={24} className="h-6 w-6 object-contain" />}
                                                            <span>{client.name}</span>
                                                        </Label>
                                                        <Button variant="ghost" size="icon" onClick={() => handleRemoveClient(client.id)}>
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </SortableItem>
                                            );
                                        })}
                                    </div>
                                </SortableContext>
                            </DndContext>
                            <div className="flex justify-between items-center pt-4">
                                <Button onClick={() => setIsAddClientOpen(true)}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add New Client
                                </Button>
                                <Button onClick={handleSave}>Save Clients</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Social Tab */}
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
            
            <AddClientDialog
                isOpen={isAddClientOpen}
                onClose={() => setIsAddClientOpen(false)}
                onAddClient={handleAddClient}
            />
        </>
    );
}

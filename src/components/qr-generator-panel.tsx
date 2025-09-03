
"use client";

import React, { useState, useRef, useEffect } from 'react';
import QRCodeStyling, { type Options as QRCodeStylingOptions, type FileExtension } from 'qr-code-styling';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Download } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from './ui/checkbox';

const qrOptions: QRCodeStylingOptions = {
    width: 300,
    height: 300,
    type: 'svg',
    image: '/logo.svg',
    dotsOptions: {
        color: '#000000',
        type: 'square'
    },
    backgroundOptions: {
        color: '#ffffff',
    },
    imageOptions: {
        crossOrigin: 'anonymous',
        margin: 5,
        imageSize: 0.3
    },
    cornersSquareOptions: {
        type: 'square'
    },
    cornersDotOptions: {
        type: 'square'
    }
};

export function QrGeneratorPanel() {
    const [url, setUrl] = useState('https://mitarmedia.ro');
    const [options, setOptions] = useState<QRCodeStylingOptions>(qrOptions);
    const [fileExt, setFileExt] = useState<FileExtension>('png');

    const [gradientType, setGradientType] = useState('linear');
    const [gradientColor1, setGradientColor1] = useState('#000000');
    const [gradientColor2, setGradientColor2] = useState('#000000');
    const [gradientRotation, setGradientRotation] = useState('0');

    const ref = useRef<HTMLDivElement>(null);
    const qrCode = useRef<QRCodeStyling>();

    useEffect(() => {
        if (!qrCode.current) {
            qrCode.current = new QRCodeStyling(options);
            if (ref.current) {
                qrCode.current.append(ref.current);
            }
        } else {
            qrCode.current.update(options);
        }
    }, [options]);

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value);
    const handleSizeChange = (value: number[]) => setOptions(prev => ({ ...prev, width: value[0], height: value[0] }));

    const handleOptionChange = (key: keyof QRCodeStylingOptions, value: any) => {
        setOptions(prev => ({ ...prev, [key]: { ...prev[key as keyof typeof prev], ...value } }));
    };

    const handleGradientChange = () => {
        const gradientOptions = {
            dotsOptions: {
                ...options.dotsOptions,
                gradient: {
                    type: gradientType as 'linear' | 'radial',
                    rotation: parseFloat(gradientRotation),
                    colorStops: [{ offset: 0, color: gradientColor1 }, { offset: 1, color: gradientColor2 }]
                }
            }
        };
        setOptions(prev => ({ ...prev, ...gradientOptions }));
    };
    
    useEffect(() => {
        handleGradientChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gradientType, gradientColor1, gradientColor2, gradientRotation]);

    const handleDownload = () => {
        if (qrCode.current) {
            qrCode.current.download({ name: 'mitarmedia-qr-code', extension: fileExt });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>QR Code Generator</CardTitle>
                <CardDescription>
                    Creați și personalizați coduri QR. Introduceți un URL și stilizați-l mai jos.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Controls Column */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="qr-url">URL</Label>
                            <Input id="qr-url" value={url} onChange={handleUrlChange} placeholder="https://example.com" />
                        </div>

                        {/* Colors */}
                        <div className="space-y-4 rounded-lg border p-4">
                            <Label className="text-base font-semibold">Culori</Label>
                             <div className="space-y-2">
                                <Label htmlFor="qr-bg-color">Fundal</Label>
                                <Input id="qr-bg-color" type="color" value={options.backgroundOptions?.color} onChange={(e) => handleOptionChange('backgroundOptions', { color: e.target.value })} className="p-1 h-10"/>
                            </div>
                            <div className="space-y-2">
                                <Label>Gradient Cod</Label>
                                <div className="flex items-center gap-2">
                                    <Input type="color" value={gradientColor1} onChange={(e) => setGradientColor1(e.target.value)} className="p-1 h-10"/>
                                    <Input type="color" value={gradientColor2} onChange={(e) => setGradientColor2(e.target.value)} className="p-1 h-10"/>
                                </div>
                            </div>
                        </div>

                        {/* Shapes */}
                         <div className="space-y-4 rounded-lg border p-4">
                             <Label className="text-base font-semibold">Forme</Label>
                             <div className="space-y-2">
                                <Label>Stil Puncte</Label>
                                <Select onValueChange={(val) => handleOptionChange('dotsOptions', { type: val })} defaultValue={options.dotsOptions?.type}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="square">Pătrat</SelectItem>
                                        <SelectItem value="dots">Puncte</SelectItem>
                                        <SelectItem value="rounded">Rotunjit</SelectItem>
                                        <SelectItem value="extra-rounded">Extra Rotunjit</SelectItem>
                                        <SelectItem value="classy">Clasic</SelectItem>
                                        <SelectItem value="classy-rounded">Clasic Rotunjit</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Stil Colț Interior</Label>
                                <Select onValueChange={(val) => handleOptionChange('cornersDotOptions', { type: val })} defaultValue={options.cornersDotOptions?.type}>
                                     <SelectTrigger><SelectValue/></SelectTrigger>
                                     <SelectContent>
                                        <SelectItem value="square">Pătrat</SelectItem>
                                        <SelectItem value="dot">Punct</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2">
                                <Label>Stil Colț Exterior</Label>
                                <Select onValueChange={(val) => handleOptionChange('cornersSquareOptions', { type: val })} defaultValue={options.cornersSquareOptions?.type}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="square">Pătrat</SelectItem>
                                        <SelectItem value="dot">Punct</SelectItem>
                                        <SelectItem value="extra-rounded">Extra Rotunjit</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="qr-size">Dimensiune: {options.width}px</Label>
                            <Slider id="qr-size" min={100} max={1000} step={10} value={[options.width || 300]} onValueChange={handleSizeChange} />
                        </div>
                        
                        <div className="space-y-2">
                             <Label>Format Descărcare</Label>
                            <Select onValueChange={(val: FileExtension) => setFileExt(val)} defaultValue={fileExt}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selectează formatul" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="png">PNG</SelectItem>
                                    <SelectItem value="jpeg">JPEG</SelectItem>
                                    <SelectItem value="webp">WEBP</SelectItem>
                                    <SelectItem value="svg">SVG</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <Button onClick={handleDownload} className="w-full">
                            <Download className="mr-2 h-4 w-4" />
                            Descărcare
                        </Button>
                    </div>

                    {/* Preview Column */}
                    <div className="md:col-span-2 flex items-center justify-center bg-muted/30 rounded-lg p-8">
                        <div ref={ref} className="p-4 bg-white rounded-md shadow-md transition-all" style={{ background: options.backgroundOptions?.color }}>
                            
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

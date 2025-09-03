
"use client";

import React, { useState, useRef, useEffect } from 'react';
import type { Options as QRCodeStylingOptions, FileExtension, QRCodeStyling } from 'qr-code-styling';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Download } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function QrGeneratorPanel() {
    // Common settings
    const [size, setSize] = useState(300);
    const [bgColor, setBgColor] = useState('#ffffff');
    const [dotsType, setDotsType] = useState<'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded'>('square');
    const [cornerDotType, setCornerDotType] = useState<'square' | 'dot'>('square');
    const [cornerSquareType, setCornerSquareType] = useState<'square' | 'dot' | 'extra-rounded'>('square');
    const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');
    const [gradientColor1, setGradientColor1] = useState('#000000');
    const [gradientColor2, setGradientColor2] = useState('#000000');
    const [fileExt, setFileExt] = useState<FileExtension>('png');

    // Tab-specific state
    const [qrType, setQrType] = useState('link');
    const [url, setUrl] = useState('https://mitarmedia.ro');
    const [ssid, setSsid] = useState('');
    const [password, setPassword] = useState('');
    const [encryption, setEncryption] = useState('WPA');
    const [hidden, setHidden] = useState(false);
    
    const [qrData, setQrData] = useState(url);

    const ref = useRef<HTMLDivElement>(null);
    const qrCodeInstance = useRef<QRCodeStyling>();

    useEffect(() => {
        let data = '';
        if (qrType === 'link') {
            data = url;
        } else {
            // Format: WIFI:T:<encryption>;S:<ssid>;P:<password>;H:<hidden>;;
            if (ssid) {
                data = `WIFI:T:${encryption};S:${ssid};P:${password};${hidden ? 'H:true;' : ''};`;
            }
        }
        setQrData(data);
    }, [qrType, url, ssid, password, encryption, hidden]);


    useEffect(() => {
        const createOrUpdateQRCode = async () => {
            if (ref.current) {
                const QRCodeStyling = (await import('qr-code-styling')).default;

                const options: QRCodeStylingOptions = {
                    width: size,
                    height: size,
                    type: 'svg',
                    data: qrData,
                    image: '/logo.svg',
                    dotsOptions: {
                        type: dotsType,
                        gradient: {
                            type: gradientType,
                            colorStops: [{ offset: 0, color: gradientColor1 }, { offset: 1, color: gradientColor2 }]
                        }
                    },
                    backgroundOptions: {
                        color: bgColor,
                    },
                    imageOptions: {
                        crossOrigin: 'anonymous',
                        margin: 5,
                        imageSize: 0.4
                    },
                    cornersSquareOptions: {
                        type: cornerSquareType,
                    },
                    cornersDotOptions: {
                        type: cornerDotType,
                    }
                };

                if (!qrCodeInstance.current) {
                    qrCodeInstance.current = new QRCodeStyling(options);
                    ref.current.innerHTML = ''; // Clear previous before appending
                    qrCodeInstance.current.append(ref.current);
                } else {
                    qrCodeInstance.current.update(options);
                }
            }
        };
        if(qrData) {
            createOrUpdateQRCode();
        }
    }, [qrData, size, bgColor, dotsType, cornerDotType, cornerSquareType, gradientType, gradientColor1, gradientColor2]);

    const handleDownload = () => {
        if (qrCodeInstance.current) {
            qrCodeInstance.current.download({ name: 'mitarmedia-qr-code', extension: fileExt });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>QR Code Generator</CardTitle>
                <CardDescription>
                    Creați și personalizați coduri QR. Selectați tipul și stilizați-l mai jos.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="link" onValueChange={(value) => setQrType(value)} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="link">Link</TabsTrigger>
                        <TabsTrigger value="wifi">WiFi</TabsTrigger>
                    </TabsList>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
                        {/* Controls Column */}
                        <div className="md:col-span-1 space-y-6">
                            <TabsContent value="link" className="space-y-6 m-0">
                                <div className="space-y-2">
                                    <Label htmlFor="qr-url">URL</Label>
                                    <Input id="qr-url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" />
                                </div>
                            </TabsContent>
                             <TabsContent value="wifi" className="space-y-6 m-0">
                                <div className="space-y-2">
                                    <Label htmlFor="wifi-ssid">Nume Rețea (SSID)</Label>
                                    <div className="flex items-center space-x-2">
                                        <Input id="wifi-ssid" value={ssid} onChange={(e) => setSsid(e.target.value)} placeholder="Numele rețelei" className="flex-grow" />
                                    </div>
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="wifi-password">Parolă</Label>
                                    <Input id="wifi-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="wifi-hidden" checked={hidden} onCheckedChange={(checked) => setHidden(!!checked)} />
                                    <label htmlFor="wifi-hidden" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Rețea ascunsă
                                    </label>
                                </div>
                                <RadioGroup defaultValue="WPA" onValueChange={setEncryption} value={encryption}>
                                    <Label>Criptare</Label>
                                    <div className="flex items-center space-x-4 pt-2">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="WPA" id="r-wpa" />
                                            <Label htmlFor="r-wpa">WPA/WPA2</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="WEP" id="r-wep" />
                                            <Label htmlFor="r-wep">WEP</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="nopass" id="r-none" />
                                            <Label htmlFor="r-none">None</Label>
                                        </div>
                                    </div>
                                </RadioGroup>
                            </TabsContent>

                            {/* Common Controls */}
                            <div className="space-y-4 rounded-lg border p-4">
                                <Label className="text-base font-semibold">Stil & Culori</Label>
                                <div className="space-y-2">
                                    <Label htmlFor="qr-bg-color">Fundal</Label>
                                    <Input id="qr-bg-color" type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="p-1 h-10"/>
                                </div>
                                <div className="space-y-2">
                                    <Label>Gradient Cod</Label>
                                    <div className="flex items-center gap-2">
                                        <Input type="color" value={gradientColor1} onChange={(e) => setGradientColor1(e.target.value)} className="p-1 h-10"/>
                                        <Input type="color" value={gradientColor2} onChange={(e) => setGradientColor2(e.target.value)} className="p-1 h-10"/>
                                    </div>
                                </div>
                                 <div className="space-y-2">
                                    <Label>Stil Puncte</Label>
                                    <Select onValueChange={(val) => setDotsType(val as any)} defaultValue={dotsType}>
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
                                    <Select onValueChange={(val) => setCornerDotType(val as any)} defaultValue={cornerDotType}>
                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="square">Pătrat</SelectItem>
                                            <SelectItem value="dot">Punct</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Stil Colț Exterior</Label>
                                    <Select onValueChange={(val) => setCornerSquareType(val as any)} defaultValue={cornerSquareType}>
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
                                <Label htmlFor="qr-size">Dimensiune: {size}px</Label>
                                <Slider id="qr-size" min={100} max={400} step={10} value={[size]} onValueChange={(v) => setSize(v[0])} />
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
                            <div ref={ref} className="p-4 bg-white rounded-md shadow-md transition-all" style={{ background: bgColor }}>
                                {/* QR Code will be appended here by the useEffect hook */}
                            </div>
                        </div>
                    </div>
                </Tabs>
            </CardContent>
        </Card>
    );
}

    
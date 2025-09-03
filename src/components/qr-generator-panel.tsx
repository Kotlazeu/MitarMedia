
"use client";

import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Download } from 'lucide-react';

export function QrGeneratorPanel() {
    const [url, setUrl] = useState('https://mitarmedia.ro');
    const [fgColor, setFgColor] = useState('#000000');
    const [bgColor, setBgColor] = useState('#ffffff');
    const [size, setSize] = useState(256);
    const qrRef = useRef<HTMLDivElement>(null);

    const handleDownload = () => {
        if (qrRef.current) {
            const canvas = qrRef.current.querySelector('canvas');
            if (canvas) {
                const pngUrl = canvas
                    .toDataURL("image/png")
                    .replace("image/png", "image/octet-stream");
                let downloadLink = document.createElement("a");
                downloadLink.href = pngUrl;
                downloadLink.download = "mitarmedia-qr-code.png";
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            }
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>QR Code Generator</CardTitle>
                <CardDescription>
                    Create and customize QR codes for your campaigns. Enter a URL and style it below.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Column 1: Controls */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="qr-url">URL</Label>
                            <Input 
                                id="qr-url" 
                                value={url} 
                                onChange={(e) => setUrl(e.target.value)} 
                                placeholder="https://example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Colors</Label>
                            <div className="flex items-center gap-4">
                                <div className="flex-1 space-y-1">
                                    <Label htmlFor="qr-fg-color" className="text-xs text-muted-foreground">Foreground</Label>
                                    <Input 
                                        id="qr-fg-color" 
                                        type="color" 
                                        value={fgColor} 
                                        onChange={(e) => setFgColor(e.target.value)}
                                        className="p-1 h-10"
                                    />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <Label htmlFor="qr-bg-color" className="text-xs text-muted-foreground">Background</Label>
                                    <Input 
                                        id="qr-bg-color" 
                                        type="color" 
                                        value={bgColor} 
                                        onChange={(e) => setBgColor(e.target.value)}
                                        className="p-1 h-10"
                                     />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="qr-size">Size: {size}px</Label>
                             <Slider
                                id="qr-size"
                                min={64}
                                max={1024}
                                step={8}
                                value={[size]}
                                onValueChange={(value) => setSize(value[0])}
                            />
                        </div>
                        <Button onClick={handleDownload} className="w-full">
                            <Download className="mr-2 h-4 w-4" />
                            Download PNG
                        </Button>
                    </div>

                    {/* Column 2: Preview */}
                    <div className="md:col-span-2 flex items-center justify-center bg-muted/30 rounded-lg p-8">
                        <div ref={qrRef} className="p-4 bg-white rounded-md shadow-md transition-all" style={{ background: bgColor }}>
                            <QRCodeCanvas
                                value={url}
                                size={size}
                                fgColor={fgColor}
                                bgColor={bgColor}
                                level={"H"}
                                includeMargin={true}
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

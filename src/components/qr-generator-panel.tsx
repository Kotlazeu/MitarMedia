
"use client";

import React, { useState, useRef, useEffect } from 'react';
import type { Options as QRCodeStylingOptions, FileExtension } from 'qr-code-styling';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLanguage } from '@/context/language-context';

// Dynamic import for qr-code-styling
const QRCodeStyling = typeof window !== 'undefined' ? require('qr-code-styling') : null;


export function QrGeneratorPanel() {
    const { translations } = useLanguage();
    const [url, setUrl] = useState('https://mitarmedia.ro');
    const [ssid, setSsid] = useState('');
    const [password, setPassword] = useState('');
    const [encryption, setEncryption] = useState('WPA');
    const [hidden, setHidden] = useState(false);
    
    const [qrType, setQrType] = useState('link');
    const [qrData, setQrData] = useState(url);

    // Styling options
    const [dotsType, setDotsType] = useState<'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded'>('square');
    const [bgColor, setBgColor] = useState('#ffffff');
    const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');
    const [gradientColor1, setGradientColor1] = useState('#000000');
    const [gradientColor2, setGradientColor2] = useState('#000000');
    const [cornerDotType, setCornerDotType] = useState<'square' | 'dot'>('square');
    const [cornerSquareType, setCornerSquareType] = useState<'square' | 'dot' | 'extra-rounded'>('square');
    const [fileExt, setFileExt] = useState<FileExtension>('png');

    const ref = useRef<HTMLDivElement>(null);
    const qrCodeInstance = useRef<any>();


    useEffect(() => {
        let data = url; // Default to URL
        if (qrType === 'wifi' && ssid) {
            data = `WIFI:T:${encryption};S:${ssid};P:${password};${hidden ? 'H:true;' : ''};`;
        } else if (qrType === 'link') {
            data = url;
        }
        setQrData(data);
    }, [qrType, url, ssid, password, encryption, hidden]);


    useEffect(() => {
      if (!QRCodeStyling || !ref.current || !qrData) return;
      
      const options: QRCodeStylingOptions = {
          width: 300,
          height: 300,
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
          ref.current.innerHTML = '';
          qrCodeInstance.current.append(ref.current);
      } else {
          qrCodeInstance.current.update(options);
      }
    }, [qrData, bgColor, dotsType, cornerDotType, cornerSquareType, gradientType, gradientColor1, gradientColor2]);

    const handleDownload = () => {
        if (qrCodeInstance.current) {
            qrCodeInstance.current.download({ name: 'mitarmedia-qr-code', extension: fileExt });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{translations.qr.title}</CardTitle>
                <CardDescription>
                    {translations.qr.description}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="link" onValueChange={setQrType} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="link">{translations.qr.linkTab}</TabsTrigger>
                        <TabsTrigger value="wifi">{translations.qr.wifiTab}</TabsTrigger>
                    </TabsList>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
                        {/* Controls Column */}
                        <div className="md:col-span-1 space-y-6">
                            <TabsContent value="link" className="space-y-6 m-0">
                                <div className="space-y-2">
                                    <Label htmlFor="qr-url">{translations.qr.urlLabel}</Label>
                                    <Input id="qr-url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" />
                                </div>
                            </TabsContent>
                             <TabsContent value="wifi" className="space-y-6 m-0">
                                <div className="space-y-2">
                                    <Label htmlFor="wifi-ssid">{translations.qr.ssidLabel}</Label>
                                    <Input id="wifi-ssid" value={ssid} onChange={(e) => setSsid(e.target.value)} placeholder={translations.qr.ssidPlaceholder} />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="wifi-password">{translations.qr.passwordLabel}</Label>
                                    <Input id="wifi-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="wifi-hidden" checked={hidden} onCheckedChange={(checked) => setHidden(!!checked)} />
                                    <label htmlFor="wifi-hidden" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        {translations.qr.hiddenLabel}
                                    </label>
                                </div>
                                <RadioGroup defaultValue="WPA" onValueChange={setEncryption} value={encryption}>
                                    <Label>{translations.qr.encryptionLabel}</Label>
                                    <div className="flex items-center space-x-4 pt-2">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="WPA" id="r-wpa" />
                                            <Label htmlFor="r-wpa">{translations.qr.wpa}</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="WEP" id="r-wep" />
                                            <Label htmlFor="r-wep">{translations.qr.wep}</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="nopass" id="r-none" />
                                            <Label htmlFor="r-none">{translations.qr.none}</Label>
                                        </div>
                                    </div>
                                </RadioGroup>
                            </TabsContent>

                            {/* Common Controls */}
                            <div className="space-y-4 rounded-lg border p-4">
                                <Label className="text-base font-semibold">{translations.qr.styleTitle}</Label>
                                <div className="space-y-2">
                                    <Label htmlFor="qr-bg-color">{translations.qr.backgroundLabel}</Label>
                                    <Input id="qr-bg-color" type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="p-1 h-10 w-full"/>
                                </div>
                                <div className="space-y-2">
                                    <Label>{translations.qr.gradientLabel}</Label>
                                    <div className="flex items-center gap-2">
                                        <Input type="color" value={gradientColor1} onChange={(e) => setGradientColor1(e.target.value)} className="p-1 h-10 w-full"/>
                                        <Input type="color" value={gradientColor2} onChange={(e) => setGradientColor2(e.target.value)} className="p-1 h-10 w-full"/>
                                    </div>
                                </div>
                                 <div className="space-y-2">
                                    <Label>{translations.qr.dotsStyleLabel}</Label>
                                    <Select onValueChange={(val) => setDotsType(val as any)} defaultValue={dotsType}>
                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="square">{translations.qr.square}</SelectItem>
                                            <SelectItem value="dots">{translations.qr.dots}</SelectItem>
                                            <SelectItem value="rounded">{translations.qr.rounded}</SelectItem>
                                            <SelectItem value="extra-rounded">{translations.qr.extraRounded}</SelectItem>
                                            <SelectItem value="classy">{translations.qr.classy}</SelectItem>
                                            <SelectItem value="classy-rounded">{translations.qr.classyRounded}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>{translations.qr.cornerInnerStyle}</Label>
                                    <Select onValueChange={(val) => setCornerDotType(val as any)} defaultValue={cornerDotType}>
                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="square">{translations.qr.square}</SelectItem>
                                            <SelectItem value="dot">{translations.qr.dot}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>{translations.qr.cornerOuterStyle}</Label>
                                    <Select onValueChange={(val) => setCornerSquareType(val as any)} defaultValue={cornerSquareType}>
                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="square">{translations.qr.square}</SelectItem>
                                            <SelectItem value="dot">{translations.qr.dot}</SelectItem>
                                            <SelectItem value="extra-rounded">{translations.qr.extraRounded}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            
                            <div className="space-y-2 pt-2">
                                <Label>{translations.qr.downloadFormat}</Label>
                                <Select onValueChange={(val: FileExtension) => setFileExt(val)} defaultValue={fileExt}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={translations.qr.selectFormat} />
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
                                {translations.qr.download}
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

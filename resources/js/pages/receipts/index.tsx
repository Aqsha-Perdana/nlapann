import { Head } from '@inertiajs/react';
import {
    Upload,
    X,
    FileText,
    CheckCircle2,
    AlertCircle,
    Clock,
    Settings,
    ScanLine,
    RefreshCw,
    Info
} from 'lucide-react';
import type { LucideIcon } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface Receipt {
    id: number;
    image_path: string;
    store_name: string | null;
    receipt_date: string | null;
    total_amount: string | null;
    payment_method: string | null;
    raw_ocr_text: string | null;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'duplicate';
    is_duplicate: boolean;
    error_message: string | null;
    created_at: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Receipt Scanner', href: '/receipts' },
];

const statusConfig: Record<
    string,
    { label: string; class: string; icon: LucideIcon }
> = {
    pending: { label: 'Queued', class: '...', icon: Clock },
    processing: { label: 'Processing', class: '...', icon: RefreshCw },
    completed: { label: 'Verified', class: '...', icon: CheckCircle2 },
    failed: { label: 'Rejected', class: '...', icon: AlertCircle },
    duplicate: { label: 'Duplicate', class: '...', icon: AlertCircle },
};

export default function ReceiptsIndex() {
    const [receipts, setReceipts] = useState<Receipt[]>([]);
    const [webhookUrl, setWebhookUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch receipts
    const fetchReceipts = useCallback(async () => {
        try {
            const res = await fetch('/api/receipts');
            const data = await res.json();
            setReceipts(data.receipts || []);
        } catch {
            // silent
        }
    }, []);

    useEffect(() => {
        fetchReceipts();
        const interval = setInterval(fetchReceipts, 5000);
        return () => clearInterval(interval);
    }, [fetchReceipts]);

    // Drag handlers
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files?.[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (file: File) => {
        if (!file.type.startsWith('image/')) {
            setMessage({ text: 'Please upload an image file (JPG, PNG)', type: 'error' });
            return;
        }
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setMessage(null);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        setMessage(null);

        const formData = new FormData();
        formData.append('image', selectedFile);
        if (webhookUrl) {
            formData.append('webhook_url', webhookUrl);
        }

        try {
            const res = await fetch('/api/receipts/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ text: data.message || 'Receipt uploaded successfully', type: 'success' });
                setSelectedFile(null);
                setPreviewUrl(null);
                fetchReceipts();
            } else {
                const errors = data.errors ? Object.values(data.errors).flat().join(', ') : data.message;
                setMessage({ text: errors || 'Failed to upload receipt', type: 'error' });
            }
        } catch {
            setMessage({ text: 'Network error. Please try again.', type: 'error' });
        } finally {
            setUploading(false);
        }
    };

    const clearFile = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const formatCurrency = (amount: string | null) => {
        if (!amount) return '-';
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(amount));
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Receipt Scanner" />
            <div className="flex flex-col gap-8 p-6 md:p-8 animate-fade-in max-w-[1600px] mx-auto w-full bg-muted/5 min-h-[calc(100vh-4rem)]">
                {/* Header */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        <ScanLine className="h-8 w-8 text-blue-600" />
                        Receipt Scanner
                    </h1>
                    <p className="text-muted-foreground ml-11">
                        Upload expenses for automated validation and reimbursement processing.
                    </p>
                </div>

                <div className="grid gap-8 xl:grid-cols-12">
                    {/* Left Column: Upload & Settings (4 cols) */}
                    <div className="xl:col-span-4 flex flex-col gap-6">
                        {/* Upload Card */}
                        <Card className="border-border/60 shadow-md">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <Upload className="h-5 w-5 text-blue-600" />
                                    New Upload
                                </CardTitle>
                                <CardDescription>Scan a new receipt for processing</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-4">
                                    {/* Drop Zone */}
                                    <div
                                        className={`relative flex min-h-[260px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-300 ${dragActive
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[1.02]'
                                            : 'border-muted-foreground/25 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10'
                                            } ${previewUrl ? 'border-none p-0 overflow-hidden bg-black' : ''}`}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                        onClick={() => !previewUrl && fileInputRef.current?.click()}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
                                            }}
                                        />

                                        {previewUrl ? (
                                            <div className="relative w-full h-full flex flex-col items-center justify-center bg-black/90">
                                                <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 animate-shimmer z-10" />
                                                <img
                                                    src={previewUrl}
                                                    alt="Preview"
                                                    className="max-h-[260px] w-full object-contain opacity-80"
                                                />
                                                <Button
                                                    size="icon"
                                                    variant="destructive"
                                                    className="absolute top-2 right-2 rounded-full h-8 w-8 shadow-lg"
                                                    onClick={(e) => { e.stopPropagation(); clearFile(); }}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>

                                                {/* Scanning Overlay Effect */}
                                                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-blue-500/10 to-transparent animate-scan" style={{ animationDuration: '2s' }} />
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-4 p-8 text-center">
                                                <div className="h-16 w-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                                                    <ScanLine className="h-8 w-8 text-blue-500" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-semibold text-foreground">
                                                        Click or drag receipt here
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Supports JPG, PNG (Max 10MB)
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    {selectedFile && (
                                        <div className="flex flex-col gap-3 animate-slide-up">
                                            <div className="flex items-center justify-between text-xs px-1">
                                                <span className="font-medium truncate max-w-[200px]">{selectedFile.name}</span>
                                                <span className="text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                                            </div>
                                            <Button
                                                className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 h-10 font-medium"
                                                onClick={handleUpload}
                                                disabled={uploading}
                                            >
                                                {uploading ? (
                                                    <>
                                                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload className="mr-2 h-4 w-4" />
                                                        Start Processing
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    )}

                                    {/* Message */}
                                    {message && (
                                        <div
                                            className={`rounded-lg p-3 text-sm flex items-start gap-2 ${message.type === 'success'
                                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                                                : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800'
                                                }`}
                                        >
                                            {message.type === 'success' ? <CheckCircle2 className="h-4 w-4 mt-0.5" /> : <AlertCircle className="h-4 w-4 mt-0.5" />}
                                            {message.text}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Config Card */}
                        <Card className="border-border/60 shadow-sm bg-muted/20">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
                                    <Settings className="h-4 w-4" />
                                    Integration Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="webhook-url" className="text-xs">n8n Webhook URL</Label>
                                        <Input
                                            id="webhook-url"
                                            type="url"
                                            placeholder="Enter webhook URL (optional)"
                                            value={webhookUrl}
                                            onChange={(e) => setWebhookUrl(e.target.value)}
                                            className="h-9 text-sm bg-background"
                                        />
                                    </div>
                                    <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3 text-xs text-blue-700 dark:text-blue-300 flex gap-2">
                                        <Info className="h-4 w-4 shrink-0" />
                                        <p>Leave blank if configured in server environment.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: List & Details (8 cols) */}
                    <div className="xl:col-span-8 flex flex-col gap-6">
                        <Card className="border-border/60 shadow-md flex-1 flex flex-col min-h-[600px]">
                            <CardHeader className="border-b border-border/40 bg-muted/40 pb-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                            <FileText className="h-5 w-5 text-blue-600" />
                                            Processed Receipts
                                        </CardTitle>
                                        <CardDescription>
                                            {receipts.length} items • Auto-refreshing
                                        </CardDescription>
                                    </div>
                                    <Button variant="outline" size="sm" className="h-8 gap-2" onClick={fetchReceipts}>
                                        <RefreshCw className="h-3.5 w-3.5" />
                                        Refresh
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0 flex flex-col md:flex-row h-full">
                                {/* Scrollable List */}
                                <div className="flex-1 overflow-auto max-h-[600px] border-r border-border/40">
                                    {receipts.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                                            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                                <FileText className="h-8 w-8 text-muted-foreground/50" />
                                            </div>
                                            <h3 className="font-semibold text-lg text-foreground">No receipts found</h3>
                                            <p className="text-muted-foreground text-sm max-w-xs mt-2">
                                                Upload your first receipt to see the extraction results here.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-border/40">
                                            {receipts.map((receipt) => (
                                                <div
                                                    key={receipt.id}
                                                    className={`p-4 transition-colors hover:bg-muted/30 cursor-pointer flex gap-4 items-start ${selectedReceipt?.id === receipt.id ? 'bg-blue-50/80 dark:bg-blue-900/10' : ''}`}
                                                    onClick={() => setSelectedReceipt(receipt)}
                                                >
                                                    <div className="h-12 w-12 shrink-0 rounded-lg bg-muted border border-border overflow-hidden">
                                                        <img
                                                            src={`/storage/${receipt.image_path}`}
                                                            alt="Thumb"
                                                            className="h-full w-full object-cover"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = '';
                                                                (e.target as HTMLImageElement).className = 'hidden';
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <h4 className="font-medium text-sm truncate pr-2">
                                                                {receipt.store_name || `Store Unknown #${receipt.id}`}
                                                            </h4>
                                                            <span className="font-mono font-medium text-sm">
                                                                {formatCurrency(receipt.total_amount)}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Badge variant="outline" className={`rounded-sm px-1.5 py-0 text-[10px] uppercase tracking-wider font-semibold border ${statusConfig[receipt.status]?.class || ''}`}>
                                                                {statusConfig[receipt.status]?.label || receipt.status}
                                                            </Badge>
                                                            <span className="text-xs text-muted-foreground">
                                                                {formatDate(receipt.receipt_date)}
                                                            </span>
                                                        </div>
                                                        {receipt.error_message && (
                                                            <p className="text-xs text-red-600 truncate bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded">
                                                                {receipt.error_message}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Preview / Details Panel */}
                                <div className="w-full md:w-[350px] p-6 bg-muted/10 shrink-0 border-t md:border-t-0">
                                    {selectedReceipt ? (
                                        <div className="space-y-6 animate-fade-in">
                                            <div className="aspect-[3/4] rounded-lg border border-border bg-black/5 overflow-hidden relative group">
                                                <img
                                                    src={`/storage/${selectedReceipt.image_path}`}
                                                    alt="Receipt Full"
                                                    className="w-full h-full object-contain"
                                                />
                                                <a
                                                    href={`/storage/${selectedReceipt.image_path}`}
                                                    target="_blank"
                                                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-medium transition-opacity"
                                                >
                                                    View Full Image
                                                </a>
                                            </div>

                                            <div className="space-y-4">
                                                <h3 className="font-semibold border-b border-border/50 pb-2">Extraction Results</h3>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-xs text-muted-foreground uppercase font-semibold">Store</label>
                                                        <p className="text-sm font-medium">{selectedReceipt.store_name || '-'}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-muted-foreground uppercase font-semibold">Date</label>
                                                        <p className="text-sm font-medium">{formatDate(selectedReceipt.receipt_date)}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-muted-foreground uppercase font-semibold">Total</label>
                                                        <p className="text-lg font-bold text-blue-600">{formatCurrency(selectedReceipt.total_amount)}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-muted-foreground uppercase font-semibold">Payment</label>
                                                        <p className="text-sm font-medium">{selectedReceipt.payment_method || '-'}</p>
                                                    </div>
                                                </div>

                                                {selectedReceipt.raw_ocr_text && (
                                                    <div className="pt-2">
                                                        <label className="text-xs text-muted-foreground uppercase font-semibold">Raw Data</label>
                                                        <div className="mt-1 p-2 bg-background border border-border rounded-md max-h-[150px] overflow-auto text-[10px] font-mono text-muted-foreground">
                                                            {selectedReceipt.raw_ocr_text}
                                                        </div>
                                                    </div>
                                                )}

                                                {selectedReceipt.status === 'failed' && (
                                                    <div className="rounded-md bg-red-50 dark:bg-red-900/10 border border-red-200 p-3">
                                                        <p className="text-xs font-semibold text-red-700 dark:text-red-400 mb-1">Validation Error</p>
                                                        <p className="text-xs text-red-600 dark:text-red-300">{selectedReceipt.error_message}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-4">
                                            <FileText className="h-10 w-10 mb-3 opacity-20" />
                                            <p className="text-sm">Select a receipt from the list to view details</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import {
    Receipt,
    TrendingUp,
    CheckCircle2,
    AlertCircle,
    Clock,
    Wallet,
    CreditCard,
    Building2,
    Plus
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

interface ReceiptData {
    id: number;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'duplicate';
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

const getStatsConfig = () => [
    {
        title: 'Total Receipts',
        key: 'total' as const,
        icon: Receipt,
        description: 'All time submissions',
        gradient: 'from-blue-600 to-indigo-600',
        iconBg: 'bg-blue-600/10',
        iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
        title: 'Approved',
        key: 'completed' as const,
        icon: CheckCircle2,
        description: 'Successfully validated',
        gradient: 'from-emerald-500 to-teal-500',
        iconBg: 'bg-emerald-500/10',
        iconColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
        title: 'Processing',
        key: 'processing' as const,
        icon: Clock,
        description: 'Analysis in progress',
        gradient: 'from-amber-500 to-orange-500',
        iconBg: 'bg-amber-500/10',
        iconColor: 'text-amber-600 dark:text-amber-400'
    },
    {
        title: 'Attention Needed',
        key: 'failed' as const,
        icon: AlertCircle,
        description: 'Requires review',
        gradient: 'from-red-500 to-rose-500',
        iconBg: 'bg-red-500/10',
        iconColor: 'text-red-600 dark:text-red-400'
    },
];

export default function Dashboard() {
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        processing: 0,
        failed: 0,
    });

    const fetchReceiptStats = useCallback(async () => {
        try {
            const res = await fetch('/api/receipts');
            const data = await res.json();
            const receipts: ReceiptData[] = data.receipts || [];

            // Calculate statistics
            const total = receipts.length;
            const completed = receipts.filter(r => r.status === 'completed').length;
            const processing = receipts.filter(r => r.status === 'processing' || r.status === 'pending').length;
            const failed = receipts.filter(r => r.status === 'failed' || r.status === 'duplicate').length;

            setStats({ total, completed, processing, failed });
        } catch (error) {
            console.error('Failed to fetch receipt stats:', error);
        }
    }, []);

    useEffect(() => {
        fetchReceiptStats();
        // Refresh stats every 5 seconds
        const interval = setInterval(fetchReceiptStats, 5000);
        return () => clearInterval(interval);
    }, [fetchReceiptStats]);

    const statsConfig = getStatsConfig();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-8 p-8 animate-fade-in bg-muted/10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Financial Overview
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Track your reimbursement status and expense analytics.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex flex-col items-end mr-2">
                            <span className="text-xs text-muted-foreground">Current Period</span>
                            <span className="text-sm font-medium text-foreground">February 2026</span>
                        </div>
                        <a
                            href="/receipts"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                        >
                            <Plus className="h-4 w-4" />
                            New Reimbursement
                        </a>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {statsConfig.map((statConfig, index) => {
                        const Icon = statConfig.icon;
                        const value = stats[statConfig.key];
                        return (
                            <Card
                                key={statConfig.title}
                                className="relative overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 animate-slide-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        {statConfig.title}
                                    </CardTitle>
                                    <div className={`${statConfig.iconBg} p-2.5 rounded-xl`}>
                                        <Icon className={`h-4 w-4 ${statConfig.iconColor}`} />
                                    </div>
                                </CardHeader>
                                <CardContent className="relative">
                                    <div className="text-3xl font-bold text-foreground tracking-tight">
                                        {value}
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        {/* Simplified sparkline or trend indicator could go here */}
                                        <div className={`h-1.5 w-full rounded-full bg-muted overflow-hidden`}>
                                            <div className={`h-full bg-gradient-to-r ${statConfig.gradient} w-2/3 rounded-full opacity-80`} />
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        {statConfig.description}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Main Content Area */}
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Welcome/Action Card */}
                    <Card className="lg:col-span-2 border-border/60 shadow-md relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-full blur-3xl -z-10" />

                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Wallet className="h-5 w-5 text-blue-600" />
                                Recent Activity & Actions
                            </CardTitle>
                            <CardDescription>
                                Manage your recent uploads or start a new claim.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid md:grid-cols-3 gap-4">
                                <a href="/receipts" className="group flex flex-col gap-3 p-4 rounded-xl border border-border/60 bg-card/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all hover:border-blue-200 dark:hover:border-blue-800">
                                    <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                        <TrendingUp className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground">Upload Receipt</h4>
                                        <p className="text-xs text-muted-foreground mt-1">Scan and analyze new expense</p>
                                    </div>
                                </a>

                                <div className="group flex flex-col gap-3 p-4 rounded-xl border border-border/60 bg-card/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-all hover:border-indigo-200 dark:hover:border-indigo-800 cursor-pointer">
                                    <div className="h-10 w-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                                        <CreditCard className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground">My Expenses</h4>
                                        <p className="text-xs text-muted-foreground mt-1">View history and reports</p>
                                    </div>
                                </div>

                                <div className="group flex flex-col gap-3 p-4 rounded-xl border border-border/60 bg-card/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-all hover:border-slate-200 dark:hover:border-slate-800 cursor-pointer">
                                    <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 group-hover:scale-110 transition-transform">
                                        <Building2 className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground">Company Policy</h4>
                                        <p className="text-xs text-muted-foreground mt-1">Check limits and rules</p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl bg-muted/40 p-6 flex items-center justify-center text-center">
                                {stats.total > 0 ? (
                                    <div className="space-y-2">
                                        <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
                                        <p className="text-sm font-medium">You have {stats.total} total receipts submitted.</p>
                                        <p className="text-xs text-muted-foreground">Last updated just now</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto">
                                            <Receipt className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium">No expenses yet</h4>
                                            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                                Start your first reimbursement claim by uploading a receipt.
                                            </p>
                                        </div>
                                        <a
                                            href="/receipts"
                                            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                                        >
                                            Submit first receipt <br className="hidden" />
                                        </a>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Info / Policy Card */}
                    <Card className="border-border/60 shadow-md">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-amber-500" />
                                Quick Tips
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-xs leading-relaxed space-y-2">
                                <p className="font-semibold text-blue-700 dark:text-blue-400">💡 Smart Scanning</p>
                                <p className="text-blue-600/80 dark:text-blue-400/80">
                                    Ensure good lighting when taking photos. The OCR works best with high contrast backgrounds.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Recent Updates</h4>
                                <div className="flex gap-3 items-start">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                    <p className="text-sm text-muted-foreground">Reimbursement policy updated for 2026 travel expenses.</p>
                                </div>
                                <div className="flex gap-3 items-start">
                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                    <p className="text-sm text-muted-foreground">System maintenance scheduled for Sunday 2 AM.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

import { Head, Link, usePage } from '@inertiajs/react';
import { Building2, Wallet, ShieldCheck, Clock, ArrowRight, TrendingUp } from 'lucide-react';
import { dashboard, login, register } from '@/routes';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage().props;

    const features = [
        {
            icon: TrendingUp,
            title: 'Automated Finance',
            description: 'Streamline your reimbursement process with AI-driven extraction.',
            gradient: 'from-blue-600 to-indigo-600',
            iconBg: 'bg-blue-600/10',
            iconColor: 'text-blue-600 dark:text-blue-400'
        },
        {
            icon: ShieldCheck,
            title: 'Fraud Detection',
            description: 'Advanced validation to prevent duplicate or modified receipts.',
            gradient: 'from-indigo-600 to-violet-600',
            iconBg: 'bg-indigo-600/10',
            iconColor: 'text-indigo-600 dark:text-indigo-400'
        },
        {
            icon: Clock,
            title: 'Rapid Processing',
            description: 'Get validation results in seconds, 24/7 availability.',
            gradient: 'from-slate-600 to-zinc-600',
            iconBg: 'bg-slate-600/10',
            iconColor: 'text-slate-600 dark:text-slate-400'
        },
    ];

    const steps = [
        {
            number: '1',
            title: 'Scan Receipt',
            description: 'Upload digital copy or photo of your expense receipt.',
            emoji: '📱'
        },
        {
            number: '2',
            title: 'AI Analysis',
            description: 'OCR extracts merchant, date, and total amount automatically.',
            emoji: '⚙️'
        },
        {
            number: '3',
            title: 'Validation',
            description: 'Instant verification against company logic and fraud checks.',
            emoji: '✅'
        },
    ];

    return (
        <>
            <Head title="Corporate Reimbursement System">
                <meta name="description" content="Professional receipt validation and reimbursement automation" />
            </Head>

            {/* Background Gradients */}
            <div className="fixed inset-0 -z-10 overflow-hidden bg-background">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-br from-indigo-600/10 to-violet-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-slate-600/5 to-zinc-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="min-h-screen font-sans">
                {/* Navigation */}
                <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50 backdrop-blur-md">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="flex items-center justify-between h-20">
                            {/* Logo */}
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-800 flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-all duration-300">
                                    <Building2 className="h-5 w-5 text-white" />
                                </div>
                                <span className="text-xl font-bold tracking-tight text-foreground">
                                    Corp<span className="text-blue-700 dark:text-blue-400">Reimburse</span>
                                </span>
                            </div>

                            {/* Auth Links */}
                            <div className="flex items-center gap-4">
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-700 text-white font-medium hover:bg-blue-800 transition-colors shadow-lg hover:shadow-blue-700/20"
                                    >
                                        Dashboard
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={login()}
                                            className="px-5 py-2.5 rounded-lg text-muted-foreground font-medium hover:text-foreground transition-colors"
                                        >
                                            Log in
                                        </Link>
                                        {canRegister && (
                                            <Link
                                                href={register()}
                                                className="px-5 py-2.5 rounded-lg bg-blue-700 text-white font-medium hover:bg-blue-800 transition-colors shadow-lg hover:shadow-blue-700/20"
                                            >
                                                Get Started
                                            </Link>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="pt-32 pb-20 px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center animate-fade-in max-w-4xl mx-auto">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-blue-200/50 bg-blue-50/50 dark:bg-blue-900/20 dark:border-blue-800/50 mb-8 animate-slide-up">
                                <Wallet className="h-4 w-4 text-blue-700 dark:text-blue-400" />
                                <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                                    Enterprise Grade Reimbursement System
                                </span>
                            </div>

                            {/* Main Heading */}
                            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8 animate-slide-up leading-tight" style={{ animationDelay: '100ms' }}>
                                Smart <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Reimbursement</span>
                                <br />
                                Made Simple.
                            </h1>

                            {/* Subtitle */}
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-slide-up leading-relaxed" style={{ animationDelay: '200ms' }}>
                                Automate your expense reporting with our AI-powered validation engine.
                                Seamlessly integrated with <span className="text-foreground font-semibold">n8n workflows</span> to ensure accuracy and compliance.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '300ms' }}>
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 text-white text-lg font-semibold hover:opacity-90 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                                    >
                                        Go to Dashboard
                                        <ArrowRight className="h-5 w-5" />
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={register()}
                                            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 text-white text-lg font-semibold hover:opacity-90 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                                        >
                                            Start Free Trial
                                            <ArrowRight className="h-5 w-5" />
                                        </Link>
                                        <Link
                                            href={login()}
                                            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl glass border border-input text-foreground text-lg font-semibold hover:bg-accent/50 transition-all hover:-translate-y-1"
                                        >
                                            Sign In
                                        </Link>
                                    </>
                                )}
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 pt-8 border-t border-border/40 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '400ms' }}>
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-foreground mb-1">99.9%</div>
                                    <div className="text-sm font-medium text-muted-foreground">Accuracy Rate</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-foreground mb-1">&lt;3s</div>
                                    <div className="text-sm font-medium text-muted-foreground">Processing Time</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-foreground mb-1">Secure</div>
                                    <div className="text-sm font-medium text-muted-foreground">Enterprise Encryption</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-24 px-6 lg:px-8 bg-muted/30">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-foreground mb-4">
                                Why Choose CorpReimburse?
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Enterprise-grade features designed for modern finance teams.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <div
                                        key={feature.title}
                                        className="relative group animate-slide-up"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="glass bg-card border-border p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden h-full">
                                            {/* Gradient Background */}
                                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                                            {/* Icon */}
                                            <div className={`${feature.iconBg} p-4 rounded-xl inline-flex mb-6 relative group-hover:scale-110 transition-transform duration-300`}>
                                                <Icon className={`h-8 w-8 ${feature.iconColor}`} />
                                            </div>

                                            {/* Content */}
                                            <h3 className="text-xl font-bold text-foreground mb-3 relative">
                                                {feature.title}
                                            </h3>
                                            <p className="text-muted-foreground relative leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="py-24 px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-20">
                            <h2 className="text-3xl font-bold text-foreground mb-4">
                                Simple 3-Step Process
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                From receipt to reimbursement in record time.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                            {/* Connector Line (Desktop) */}
                            <div className="hidden md:block absolute top-[2.5rem] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-blue-200 via-indigo-200 to-blue-200 dark:from-blue-800 dark:via-indigo-800 dark:to-blue-800 z-0" />

                            {steps.map((step, index) => (
                                <div
                                    key={step.number}
                                    className="relative animate-fade-in z-10"
                                    style={{ animationDelay: `${index * 150}ms` }}
                                >
                                    <div className="relative text-center group">
                                        {/* Number Badge */}
                                        <div className="mb-8 relative inline-flex">
                                            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-900 border border-blue-100 dark:border-blue-900 flex items-center justify-center text-4xl shadow-lg relative z-10 group-hover:scale-110 transition-transform duration-300">
                                                {step.emoji}
                                            </div>
                                            <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-300" />
                                        </div>

                                        {/* Content */}
                                        <h3 className="text-xl font-bold text-foreground mb-3">
                                            {step.title}
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed px-4">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 px-6 lg:px-8">
                    <div className="max-w-5xl mx-auto">
                        <div className="rounded-3xl p-1 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 shadow-2xl">
                            <div className="rounded-[1.4rem] bg-background p-12 text-center relative overflow-hidden h-full">
                                {/* Background Patterns */}
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                                <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
                                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />

                                <div className="relative z-10">
                                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                        Ready to optimize your expenses?
                                    </h2>
                                    <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                                        Join thousands of finance teams already using CorpReimburse.
                                    </p>

                                    {!auth.user && (
                                        <Link
                                            href={register()}
                                            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-blue-700 text-white text-lg font-semibold hover:bg-blue-800 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                                        >
                                            Get Started Now
                                            <ArrowRight className="h-5 w-5" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-12 px-6 lg:px-8 border-t border-border/60 bg-muted/20">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-2.5">
                                <div className="h-8 w-8 rounded-lg bg-blue-700 flex items-center justify-center">
                                    <Building2 className="h-4 w-4 text-white" />
                                </div>
                                <span className="font-bold text-foreground">
                                    CorpReimburse
                                </span>
                            </div>

                            <p className="text-sm text-muted-foreground">
                                © 2026 CorpReimburse Inc. Powered by Laravel & n8n.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

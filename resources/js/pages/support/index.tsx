import { Head } from '@inertiajs/react';
import { Mail, Phone, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard } from '@/routes';

export default function Support() {
    return (
        <>
            <Head title="Support" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Contact Support</CardTitle>
                        <CardDescription>
                            Need help? Reach out to us through any of the following channels
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <a
                            href="https://wa.me/96171387946"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent"
                        >
                            <MessageCircle className="h-5 w-5 shrink-0 text-muted-foreground" />
                            <div className="flex-1 space-y-0.5">
                                <p className="text-sm font-medium leading-none">WhatsApp</p>
                                <p className="text-sm text-muted-foreground">
                                    Chat with us instantly
                                </p>
                            </div>
                            <p className="text-sm text-muted-foreground">+96171387946</p>
                        </a>

                        <a
                            href="tel:+96171387946"
                            className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent"
                        >
                            <Phone className="h-5 w-5 shrink-0 text-muted-foreground" />
                            <div className="flex-1 space-y-0.5">
                                <p className="text-sm font-medium leading-none">Phone</p>
                                <p className="text-sm text-muted-foreground">
                                    Call us directly
                                </p>
                            </div>
                            <p className="text-sm text-muted-foreground">+96171387946</p>
                        </a>

                        <a
                            href="mailto:omar.7tech@gmail.com"
                            className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent"
                        >
                            <Mail className="h-5 w-5 shrink-0 text-muted-foreground" />
                            <div className="flex-1 space-y-0.5">
                                <p className="text-sm font-medium leading-none">Email</p>
                                <p className="text-sm text-muted-foreground">
                                    We'll respond within 24 hours
                                </p>
                            </div>
                            <p className="text-sm text-muted-foreground break-all">
                                omar.7tech@gmail.com
                            </p>
                        </a>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Support.layout = {
    breadcrumbs: [
        {
            title: 'Support',
            href: dashboard(),
        },
    ],
};

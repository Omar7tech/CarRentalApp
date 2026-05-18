import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { dashboard } from '@/routes';

export default function Support() {
    return (
        <>
            <Head title="Support" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                
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

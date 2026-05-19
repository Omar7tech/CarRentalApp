import { cn } from '@/lib/utils';
import { PaginatedResponse } from '@/types/index.d';
import { Link } from '@inertiajs/react';
import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const paginationVariants = cva(
    'inline-flex items-center justify-center gap-1 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                default: 'hover:bg-accent hover:text-accent-foreground',
                outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
                ghost: 'hover:bg-accent hover:text-accent-foreground',
                simple: 'hover:underline',
            },
            size: {
                default: 'h-9 px-4 py-2',
                sm: 'h-8 px-3 text-xs',
                lg: 'h-10 px-6',
                icon: 'h-9 w-9',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

const activePageVariants = cva('pointer-events-none', {
    variants: {
        variant: {
            default: 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
            outline: 'border-primary bg-primary/10 text-primary',
            ghost: 'bg-accent text-accent-foreground',
            simple: 'font-bold underline',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});

interface DataPaginationProps<T> extends VariantProps<typeof paginationVariants> {
    data: PaginatedResponse<T>;
    className?: string;
    showFirstLast?: boolean;
    showInfo?: boolean;
}

function buildPageUrl(baseUrl: string, page: number): string {
    try {
        const url = new URL(baseUrl);
        url.searchParams.set('page', String(page));
        return url.toString();
    } catch {
        return baseUrl;
    }
}

function isValidUrl(url: string | null | undefined): url is string {
    if (!url) return false;
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

export function DataPagination<T>({
    data,
    variant = 'default',
    className,
    showFirstLast = false,
    showInfo = true,
}: DataPaginationProps<T>) {
    if (!data?.meta || !data?.links) return null;

    const { current_page, last_page, from, to, total } = data.meta;
    const { first, last, next, prev } = data.links;

    if (!last_page || last_page <= 1) return null;

    const pages = Array.from({ length: last_page }, (_, i) => i + 1);

    const getPageUrl = (page: number): string | null => {
        const base = first ?? last ?? next ?? prev;
        return base ? buildPageUrl(base, page) : null;
    };

    const getVisiblePages = (): (number | 'ellipsis')[] => {
        if (last_page <= 7) return pages;

        const result: (number | 'ellipsis')[] = [1];

        if (current_page > 3) result.push('ellipsis');

        for (let i = Math.max(2, current_page - 1); i <= Math.min(last_page - 1, current_page + 1); i++) {
            result.push(i);
        }

        if (current_page < last_page - 2) result.push('ellipsis');

        result.push(last_page);

        return result;
    };

    return (
        <div className={cn('flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between', className)}>
            {showInfo && from != null && to != null && (
                <div className="text-xs text-muted-foreground sm:text-sm">
                    <span className="hidden sm:inline">
                        Showing <span className="font-medium">{from}</span> to{' '}
                        <span className="font-medium">{to}</span> of{' '}
                        <span className="font-medium">{total}</span> results
                    </span>
                    <span className="sm:hidden">
                        {from}–{to} of {total}
                    </span>
                </div>
            )}

            <nav className="flex items-center justify-center gap-0.5 sm:gap-1" aria-label="Pagination">
                {showFirstLast && isValidUrl(first) && current_page > 1 && (
                    <Link
                        href={buildPageUrl(first, 1)}
                        className={cn(paginationVariants({ variant, size: 'icon' }), 'hidden sm:inline-flex')}
                        aria-label="Go to first page"
                    >
                        <ChevronsLeft className="h-4 w-4" />
                    </Link>
                )}

                {isValidUrl(prev) ? (
                    <Link
                        href={prev}
                        className={cn(paginationVariants({ variant, size: variant === 'simple' ? 'default' : 'icon' }), 'touch-manipulation')}
                        aria-label="Go to previous page"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        {variant === 'simple' && <span className="hidden sm:inline">Previous</span>}
                    </Link>
                ) : (
                    <span className={cn(paginationVariants({ variant, size: 'icon' }), 'cursor-not-allowed opacity-50')}>
                        <ChevronLeft className="h-4 w-4" />
                    </span>
                )}

                <div className="flex items-center gap-0.5 sm:gap-1">
                    {getVisiblePages().map((page, index) => {
                        if (page === 'ellipsis') {
                            return (
                                <span
                                    key={`ellipsis-${index}`}
                                    className="hidden h-9 w-9 items-center justify-center text-muted-foreground sm:flex"
                                    aria-hidden="true"
                                >
                                    …
                                </span>
                            );
                        }

                        const pageUrl = getPageUrl(page);
                        const isActive = page === current_page;
                        const isNearCurrent = Math.abs(page - current_page) <= 1;
                        const shouldShowOnMobile = isActive || isNearCurrent;

                        if (!pageUrl) return null;

                        return (
                            <Link
                                key={`page-${page}`}
                                href={pageUrl}
                                aria-current={isActive ? 'page' : undefined}
                                aria-label={`Go to page ${page}`}
                                className={cn(
                                    paginationVariants({ variant, size: 'icon' }),
                                    isActive && activePageVariants({ variant }),
                                    'touch-manipulation',
                                    !shouldShowOnMobile && 'hidden sm:inline-flex',
                                )}
                            >
                                {page}
                            </Link>
                        );
                    })}
                </div>

                {isValidUrl(next) ? (
                    <Link
                        href={next}
                        className={cn(paginationVariants({ variant, size: variant === 'simple' ? 'default' : 'icon' }), 'touch-manipulation')}
                        aria-label="Go to next page"
                    >
                        {variant === 'simple' && <span className="hidden sm:inline">Next</span>}
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                ) : (
                    <span className={cn(paginationVariants({ variant, size: 'icon' }), 'cursor-not-allowed opacity-50')}>
                        <ChevronRight className="h-4 w-4" />
                    </span>
                )}

                {showFirstLast && isValidUrl(last) && current_page < last_page && (
                    <Link
                        href={buildPageUrl(last, last_page)}
                        className={cn(paginationVariants({ variant, size: 'icon' }), 'hidden sm:inline-flex')}
                        aria-label="Go to last page"
                    >
                        <ChevronsRight className="h-4 w-4" />
                    </Link>
                )}
            </nav>
        </div>
    );
}
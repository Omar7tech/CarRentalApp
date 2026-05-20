import { Head } from '@inertiajs/react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Brand, PaginatedBrands } from '@/types';
import { dashboard } from '@/routes';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Globe, MoreHorizontalIcon, XIcon } from 'lucide-react';
import { DataPagination } from '@/components/data-pagination';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { ButtonGroup } from '@/components/ui/button-group';
import { Spinner } from '@/components/ui/spinner';
import BrandController from '@/actions/App/Http/Controllers/BrandController';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { useTableFilters } from '@/hooks/use-table-filters';

function BrandLogo({ logo, name }: { logo: string; name: string }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  if (!logo || error) {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-[11px] font-semibold text-muted-foreground ring-1 ring-border">
        {initials}
      </div>
    );
  }

  return (
    <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white/50 ring-1 ring-border dark:bg-white/50">
      {!loaded && <div className="absolute inset-0 animate-pulse rounded-md bg-muted" />}
      <img
        src={logo}
        alt={name}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`h-6 w-6 object-contain transition-opacity duration-200 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}

export default function Brands({ brands }: { brands: PaginatedBrands }) {
  const { filters, set, isLoading, isActive } = useTableFilters({
    route: BrandController.index(),
    only: ['brands'],
  });

  function handleToggleShowOnWebsite(brand: Brand) {
    router.post(
      BrandController.toggleShowOnWebsite(brand.slug),
      {},
      {
        preserveState: true,
        preserveScroll: true,
        replace: true,
        only: ['brands'],
        showProgress: false,
        optimistic: (props: any) => ({
          brands: {
            ...props.brands,
            data: props.brands.data.map((b: Brand) =>
              b.slug === brand.slug ? { ...b, show_on_website: !b.show_on_website } : b
            ),
          },
        }),
      }
    );
  }

  return (
    <>
      <Head title="Brands" />
      <div className="flex h-full flex-1 flex-col gap-4 p-4">

        {/* Filters */}
        <div className="flex gap-2">
          <ButtonGroup>
            <Input
              placeholder="Type to search..."
              value={filters.name ?? ''}
              onChange={(e) => set('name', e.target.value, 'name')}
            />
            <Button
              onClick={() => set('name', undefined, 'name')}
              variant={isActive('name') ? 'destructive' : 'secondary'}
              disabled={!isActive('name')}
            >
              <XIcon />
            </Button>
          </ButtonGroup>

          <button
            onClick={() => set('show_on_website', isActive('show_on_website') ? undefined : true, 'show_on_website')}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
              isActive('show_on_website')
                ? 'border-transparent bg-primary text-primary-foreground'
                : 'border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground'
            )}
          >
            {isLoading('show_on_website')
              ? <Spinner className="size-3.5" />
              : <Globe className="size-3.5" />
            }
            Website only
          </button>
        </div>

        {/* Table */}
        {isLoading('name') ? (
          <div className="flex items-center justify-center h-full">
            <Spinner role="status" className="size-10" />
          </div>
        ) : (
          <Table>
            <TableCaption>A list of your brands.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Show On Website</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {brands.data.map((brand) => (
                <TableRow key={brand.slug}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <BrandLogo logo={brand.logo} name={brand.name} />
                      <span className="font-medium">{brand.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={brand.show_on_website}
                      onClick={() => handleToggleShowOnWebsite(brand)}
                      className="data-[state=checked]:bg-green-500"
                    />
                  </TableCell>
                  <TableCell>{brand.slug}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontalIcon />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Pagination — just pass filters directly */}
        <DataPagination
          showFirstLast
          variant="ghost"
          data={brands}
          only={['brands']}
          filters={filters}
        />
      </div>
    </>
  );
}

Brands.layout = {
  breadcrumbs: [{ title: 'Brands', href: dashboard() }],
};
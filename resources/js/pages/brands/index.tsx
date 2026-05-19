import { Head } from '@inertiajs/react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PaginatedBrands } from '@/types';
import { dashboard } from '@/routes';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontalIcon } from 'lucide-react';
import { DataPagination } from '@/components/data-pagination';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Input } from '@/components/ui/input';

export default function Brands({ brands }: { brands: PaginatedBrands }) {
  const [search, setSearch] = useState('');
  function handleSearch(value: string) {
    setSearch(value);
    router.get(
      // current URL (e.g. brands.index route)
      window.location.pathname,
      { search: value },
      {
        preserveState: true,   // keeps the input focused/value
        preserveScroll: true,
        replace: true,
        only: ['brands'],      // partial reload — only refetch brands
      }
    );
  }
  return (
    <>
      <Head title="Brands" />
      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        <Input
          placeholder="Search brands..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands.data.map((brand) => (
              <TableRow key={brand.slug}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <img src={brand.logo} alt={brand.name} className="h-7" />
                    <span className="font-medium">{brand.name}</span>
                  </div>
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
                      <DropdownMenuItem variant="destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <DataPagination showFirstLast variant={'ghost'} data={brands} />
      </div>
    </>
  );
}

Brands.layout = {
  breadcrumbs: [
    {
      title: 'Brands',
      href: dashboard(),
    },
  ],
};

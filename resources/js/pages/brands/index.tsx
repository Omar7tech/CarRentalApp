import { Head } from '@inertiajs/react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Brand, PaginatedBrands } from '@/types';
import { dashboard } from '@/routes';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Globe, MoreHorizontalIcon, XIcon, Pencil, Trash2 } from 'lucide-react';
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';

function BrandLogo({ logo, name }: { logo: string; name: string }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  if (!logo || error) {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 text-xs font-bold text-primary">
        {initials}
      </div>
    );
  }

  return (
    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg">
      {!loaded && <div className="absolute inset-0 animate-pulse rounded-lg bg-muted/50" />}
      <img
        src={logo}
        alt={name}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`h-8 w-8 object-contain transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}

export default function Brands({ brands }: { brands: PaginatedBrands }) {
  const { filters, set, isLoading, isActive } = useTableFilters({
    route: BrandController.index(),
    only: ['brands'],
  });

  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [deletingBrand, setDeletingBrand] = useState<Brand | null>(null);
  const [editForm, setEditForm] = useState({ name: '', show_on_website: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleEdit(brand: Brand) {
    setEditingBrand(brand);
    setEditForm({
      name: brand.name,
      show_on_website: brand.show_on_website,
    });
  }

  function handleUpdateSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingBrand) return;

    setIsSubmitting(true);
    router.put(
      BrandController.update(editingBrand.slug),
      editForm,
      {
        preserveState: true,
        preserveScroll: true,
        only: ['brands'],
        onSuccess: () => {
          setEditingBrand(null);
          setIsSubmitting(false);
        },
        onError: () => {
          setIsSubmitting(false);
        },
      }
    );
  }

  function handleDelete() {
    if (!deletingBrand) return;

    setIsSubmitting(true);
    router.delete(BrandController.destroy(deletingBrand.slug), {
      preserveState: true,
      preserveScroll: true,
      only: ['brands'],
      onSuccess: () => {
        setDeletingBrand(null);
        setIsSubmitting(false);
      },
      onError: () => {
        setIsSubmitting(false);
      },
    });
  }

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
          <div className="rounded-md border bg-card">
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
              {brands.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    No brands found.
                  </TableCell>
                </TableRow>
              ) : (
                brands.data.map((brand) => (
                  <TableRow key={brand.slug} className="group hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
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
                    <TableCell>
                      <span className="text-muted-foreground text-sm font-mono">{brand.slug}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontalIcon />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(brand)}>
                            <Pencil className="size-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem variant="destructive" onClick={() => setDeletingBrand(brand)}>
                            <Trash2 className="size-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          </div>
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

      {/* Edit Dialog */}
      <Dialog open={!!editingBrand} onOpenChange={(open) => !open && setEditingBrand(null)}>
        <DialogContent>
          <form onSubmit={handleUpdateSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Brand</DialogTitle>
              <DialogDescription>
                Update the brand details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Brand name"
                  required
                />
              </div>
              <div className="flex items-center gap-2 p-3 rounded-md border bg-muted/50">
                <Switch
                  id="show_on_website"
                  checked={editForm.show_on_website}
                  onCheckedChange={(checked) => setEditForm({ ...editForm, show_on_website: checked })}
                />
                <Label htmlFor="show_on_website" className="cursor-pointer font-normal">Show on website</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingBrand(null)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner className="size-4" />
                    Saving...
                  </>
                ) : (
                  'Save changes'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      <AlertDialog open={!!deletingBrand} onOpenChange={(open) => !open && setDeletingBrand(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{deletingBrand?.name}</strong>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner className="size-4" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

Brands.layout = {
  breadcrumbs: [{ title: 'Brands', href: dashboard() }],
};
import { useForm } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle, Plus, Search, Trash2 } from 'lucide-react';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import type {
    ProcurementProductOption,
    ProcurementSupplierOption,
} from '../types';
import { formatCurrency, formatNumber } from '../formatters';

type ProcurementFormData = {
    supplier_id: string;
    tanggal_pengadaan: string;
    catatan: string;
    items: Array<{
        product_id: string;
        quantity: string;
        price: string;
    }>;
};

const today = () => {
    const date = new Date();
    const localDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60_000,
    );
    return localDate.toISOString().slice(0, 10);
};

const ProcurementForm = ({
    suppliers: initialSuppliers,
    products: initialProducts,
}: {
    suppliers: ProcurementSupplierOption[];
    products: ProcurementProductOption[];
}) => {
    const form = useForm<ProcurementFormData>({
        supplier_id: '',
        tanggal_pengadaan: today(),
        catatan: '',
        items: [{ product_id: '', quantity: '1', price: '' }],
    });
    const [suppliers, setSuppliers] = useState(initialSuppliers);
    const [products, setProducts] = useState(initialProducts);
    const [selectedSupplier, setSelectedSupplier] =
        useState<ProcurementSupplierOption | null>(null);
    const [supplierSearch, setSupplierSearch] = useState('');
    const [supplierOpen, setSupplierOpen] = useState(false);
    const [supplierLoading, setSupplierLoading] = useState(false);
    const [supplierSearchError, setSupplierSearchError] = useState<
        string | null
    >(null);
    const [productSearch, setProductSearch] = useState('');
    const [productSearchRow, setProductSearchRow] = useState<number | null>(
        null,
    );
    const [productLoading, setProductLoading] = useState(false);
    const [productSearchError, setProductSearchError] = useState<string | null>(
        null,
    );
    const [selectedProducts, setSelectedProducts] = useState<
        Record<number, ProcurementProductOption>
    >(() =>
        Object.fromEntries(
            initialProducts.map((product) => [product.id, product]),
        ),
    );

    useEffect(() => {
        const controller = new AbortController();
        const timeout = window.setTimeout(async () => {
            setSupplierLoading(true);
            setSupplierSearchError(null);
            try {
                const response = await fetch(
                    `/admin/procurements/options?type=suppliers&search=${encodeURIComponent(supplierSearch)}`,
                    {
                        headers: { Accept: 'application/json' },
                        signal: controller.signal,
                    },
                );
                if (!response.ok) {
                    throw new Error('Supplier tidak dapat dimuat. Coba lagi.');
                }
                const payload = (await response.json()) as {
                    options: ProcurementSupplierOption[];
                };
                setSuppliers(payload.options);
            } catch (error) {
                if (!controller.signal.aborted) {
                    setSupplierSearchError(
                        error instanceof Error
                            ? error.message
                            : 'Supplier tidak dapat dimuat. Coba lagi.',
                    );
                }
            } finally {
                if (!controller.signal.aborted) {
                    setSupplierLoading(false);
                }
            }
        }, 250);
        return () => {
            window.clearTimeout(timeout);
            controller.abort();
        };
    }, [supplierSearch]);

    useEffect(() => {
        if (productSearchRow === null) {
            return;
        }
        const controller = new AbortController();
        const timeout = window.setTimeout(async () => {
            setProductLoading(true);
            setProductSearchError(null);
            try {
                const response = await fetch(
                    `/admin/procurements/options?type=products&search=${encodeURIComponent(productSearch)}`,
                    {
                        headers: { Accept: 'application/json' },
                        signal: controller.signal,
                    },
                );
                if (!response.ok) {
                    throw new Error('Produk tidak dapat dimuat. Coba lagi.');
                }
                const payload = (await response.json()) as {
                    options: ProcurementProductOption[];
                };
                setProducts(payload.options);
                setSelectedProducts((current) => ({
                    ...current,
                    ...Object.fromEntries(
                        payload.options.map((product) => [product.id, product]),
                    ),
                }));
            } catch (error) {
                if (!controller.signal.aborted) {
                    setProductSearchError(
                        error instanceof Error
                            ? error.message
                            : 'Produk tidak dapat dimuat. Coba lagi.',
                    );
                }
            } finally {
                if (!controller.signal.aborted) {
                    setProductLoading(false);
                }
            }
        }, 250);
        return () => {
            window.clearTimeout(timeout);
            controller.abort();
        };
    }, [productSearch, productSearchRow]);

    const total = useMemo(
        () =>
            form.data.items.reduce(
                (sum, item) =>
                    sum +
                    (Number(item.quantity) || 0) * (Number(item.price) || 0),
                0,
            ),
        [form.data.items],
    );

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.post('/admin/procurements', {
            preserveScroll: true,
        });
    };

    const selectProduct = (row: number, product: ProcurementProductOption) => {
        form.setData(
            'items',
            form.data.items.map((item, index) =>
                index === row
                    ? {
                          ...item,
                          product_id: String(product.id),
                          price: String(product.price),
                      }
                    : item,
            ),
        );
        setSelectedProducts((current) => ({
            ...current,
            [product.id]: product,
        }));
        setProductSearchRow(null);
        setProductSearch('');
    };

    return (
        <form onSubmit={submit} className="space-y-5">
            <section className="rounded-xl border border-[#E5E8EE] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.03)] sm:p-6">
                <div className="mb-5">
                    <h2 className="text-sm font-semibold text-[#203452]">
                        Informasi Pengadaan
                    </h2>
                    <p className="mt-1 text-[11px] text-[#8A95A5]">
                        Pilih supplier dan tanggal pencatatan pengadaan.
                    </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="relative">
                        <label
                            htmlFor="supplier-search"
                            className="mb-1.5 block text-xs font-medium text-[#526072]"
                        >
                            Supplier <span className="text-[#A7795E]">*</span>
                        </label>
                        <div className="relative">
                            <Search
                                aria-hidden="true"
                                size={15}
                                className="absolute top-1/2 left-3 -translate-y-1/2 text-[#98A2B3]"
                            />
                            <input
                                id="supplier-search"
                                value={selectedSupplier?.name ?? supplierSearch}
                                onChange={(event) => {
                                    setSelectedSupplier(null);
                                    form.setData('supplier_id', '');
                                    setSupplierSearch(event.target.value);
                                    setSupplierOpen(true);
                                }}
                                onFocus={() => setSupplierOpen(true)}
                                autoComplete="off"
                                placeholder="Cari nama supplier..."
                                aria-invalid={Boolean(form.errors.supplier_id)}
                                aria-describedby={
                                    form.errors.supplier_id
                                        ? 'supplier-error'
                                        : undefined
                                }
                                className="h-10 w-full rounded-lg border border-[#E2E6ED] bg-white pr-3 pl-9 text-xs text-[#344054] outline-none placeholder:text-[#A0A9B6] focus:border-[#526B91] focus:ring-2 focus:ring-[#526B91]/10"
                            />
                        </div>
                        {supplierOpen && !selectedSupplier && (
                            <div className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-[#E5E8EE] bg-white p-1 shadow-lg">
                                {supplierLoading ? (
                                    <p className="px-3 py-2 text-xs text-[#8A95A5]">
                                        Memuat supplier...
                                    </p>
                                ) : supplierSearchError ? (
                                    <p
                                        role="alert"
                                        className="px-3 py-2 text-xs text-[#9A5E50]"
                                    >
                                        {supplierSearchError}
                                    </p>
                                ) : suppliers.length ? (
                                    suppliers.map((supplier) => (
                                        <button
                                            key={supplier.id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedSupplier(supplier);
                                                form.setData(
                                                    'supplier_id',
                                                    String(supplier.id),
                                                );
                                                setSupplierOpen(false);
                                            }}
                                            className="block w-full rounded-md px-3 py-2 text-left transition hover:bg-[#F8F9FC]"
                                        >
                                            <span className="block text-xs font-medium text-[#344054]">
                                                {supplier.name}
                                            </span>
                                            <span className="mt-0.5 block truncate text-[10px] text-[#98A2B3]">
                                                {supplier.phone ??
                                                    supplier.email}
                                                {supplier.address
                                                    ? ` · ${supplier.address}`
                                                    : ''}
                                            </span>
                                        </button>
                                    ))
                                ) : (
                                    <p className="px-3 py-2 text-xs text-[#8A95A5]">
                                        Supplier tidak ditemukan.
                                    </p>
                                )}
                            </div>
                        )}
                        {form.errors.supplier_id && (
                            <p
                                id="supplier-error"
                                role="alert"
                                className="mt-1.5 text-[11px] text-[#9A5E50]"
                            >
                                {form.errors.supplier_id}
                            </p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="procurement-date"
                            className="mb-1.5 block text-xs font-medium text-[#526072]"
                        >
                            Tanggal pengadaan{' '}
                            <span className="text-[#A7795E]">*</span>
                        </label>
                        <input
                            id="procurement-date"
                            type="date"
                            value={form.data.tanggal_pengadaan}
                            onChange={(event) =>
                                form.setData(
                                    'tanggal_pengadaan',
                                    event.target.value,
                                )
                            }
                            aria-invalid={Boolean(
                                form.errors.tanggal_pengadaan,
                            )}
                            className="h-10 w-full rounded-lg border border-[#E2E6ED] bg-white px-3 text-xs text-[#344054] outline-none focus:border-[#526B91] focus:ring-2 focus:ring-[#526B91]/10"
                        />
                        {form.errors.tanggal_pengadaan && (
                            <p
                                role="alert"
                                className="mt-1.5 text-[11px] text-[#9A5E50]"
                            >
                                {form.errors.tanggal_pengadaan}
                            </p>
                        )}
                    </div>
                    <div className="md:col-span-2">
                        <label
                            htmlFor="procurement-notes"
                            className="mb-1.5 block text-xs font-medium text-[#526072]"
                        >
                            Catatan{' '}
                            <span className="text-[#8A95A5]">(opsional)</span>
                        </label>
                        <textarea
                            id="procurement-notes"
                            rows={3}
                            maxLength={255}
                            value={form.data.catatan}
                            onChange={(event) =>
                                form.setData('catatan', event.target.value)
                            }
                            placeholder="Tambahkan catatan untuk pengadaan ini..."
                            className="w-full resize-y rounded-lg border border-[#E2E6ED] bg-white px-3 py-2.5 text-xs leading-5 text-[#344054] outline-none placeholder:text-[#A0A9B6] focus:border-[#526B91] focus:ring-2 focus:ring-[#526B91]/10"
                        />
                        {form.errors.catatan && (
                            <p
                                role="alert"
                                className="mt-1 text-[11px] text-[#9A5E50]"
                            >
                                {form.errors.catatan}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            <section className="rounded-xl border border-[#E5E8EE] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.03)]">
                <div className="flex flex-col gap-3 border-b border-[#EEF0F4] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>
                        <h2 className="text-sm font-semibold text-[#203452]">
                            Item Pengadaan
                        </h2>
                        <p className="mt-1 text-[11px] text-[#8A95A5]">
                            Pilih produk dan masukkan jumlah serta harga beli.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() =>
                            form.setData('items', [
                                ...form.data.items,
                                { product_id: '', quantity: '1', price: '' },
                            ])
                        }
                        className="inline-flex min-h-9 items-center justify-center gap-1.5 self-start rounded-lg border border-[#DDE3EC] px-3 text-[11px] font-semibold text-[#526B91] transition hover:bg-[#F8F9FC] sm:self-auto"
                    >
                        <Plus size={14} />
                        Tambah Item
                    </button>
                </div>
                <div className="space-y-4 p-4 sm:p-6">
                    {form.data.items.map((item, index) => {
                        const selected =
                            selectedProducts[Number(item.product_id)];
                        const selectedIds = form.data.items
                            .filter((_, itemIndex) => itemIndex !== index)
                            .map((other) => Number(other.product_id));
                        const subtotal =
                            (Number(item.quantity) || 0) *
                            (Number(item.price) || 0);

                        return (
                            <div
                                key={index}
                                className="rounded-lg border border-[#EEF0F4] bg-[#FCFCFD] p-3 sm:p-4"
                            >
                                <div className="mb-3 flex items-center justify-between">
                                    <p className="text-[11px] font-semibold text-[#526072]">
                                        Item {index + 1}
                                    </p>
                                    {form.data.items.length > 1 && (
                                        <button
                                            type="button"
                                            aria-label={`Hapus item ${index + 1}`}
                                            onClick={() =>
                                                form.setData(
                                                    'items',
                                                    form.data.items.filter(
                                                        (_, itemIndex) =>
                                                            itemIndex !== index,
                                                    ),
                                                )
                                            }
                                            className="flex size-8 items-center justify-center rounded-md text-[#A87970] transition hover:bg-[#F7EEEC]"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    )}
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(220px,1.5fr)_minmax(100px,.6fr)_minmax(140px,.8fr)_minmax(130px,.8fr)]">
                                    <div className="relative sm:col-span-2 xl:col-span-1">
                                        <label
                                            htmlFor={`product-search-${index}`}
                                            className="mb-1.5 block text-[10px] font-medium text-[#667085]"
                                        >
                                            Produk
                                        </label>
                                        <input
                                            id={`product-search-${index}`}
                                            value={
                                                productSearchRow === index
                                                    ? productSearch
                                                    : (selected?.name ?? '')
                                            }
                                            onFocus={() => {
                                                setProductSearchRow(index);
                                                setProductSearch('');
                                            }}
                                            onChange={(event) => {
                                                setProductSearchRow(index);
                                                setProductSearch(
                                                    event.target.value,
                                                );
                                            }}
                                            autoComplete="off"
                                            placeholder="Cari nama produk..."
                                            aria-invalid={Boolean(
                                                form.errors[
                                                    `items.${index}.product_id`
                                                ],
                                            )}
                                            className="h-10 w-full rounded-lg border border-[#E2E6ED] bg-white px-3 text-xs text-[#344054] outline-none placeholder:text-[#A0A9B6] focus:border-[#526B91] focus:ring-2 focus:ring-[#526B91]/10"
                                        />
                                        {productSearchRow === index && (
                                            <div className="absolute z-20 mt-1 max-h-52 w-full overflow-y-auto rounded-lg border border-[#E5E8EE] bg-white p-1 shadow-lg">
                                                {productLoading ? (
                                                    <p className="px-3 py-2 text-xs text-[#8A95A5]">
                                                        Memuat produk...
                                                    </p>
                                                ) : productSearchError ? (
                                                    <p
                                                        role="alert"
                                                        className="px-3 py-2 text-xs text-[#9A5E50]"
                                                    >
                                                        {productSearchError}
                                                    </p>
                                                ) : products.filter(
                                                      (product) =>
                                                          !selectedIds.includes(
                                                              product.id,
                                                          ),
                                                  ).length ? (
                                                    products
                                                        .filter(
                                                            (product) =>
                                                                !selectedIds.includes(
                                                                    product.id,
                                                                ),
                                                        )
                                                        .map((product) => (
                                                            <button
                                                                key={product.id}
                                                                type="button"
                                                                onClick={() =>
                                                                    selectProduct(
                                                                        index,
                                                                        product,
                                                                    )
                                                                }
                                                                className="flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left transition hover:bg-[#F8F9FC]"
                                                            >
                                                                <span className="min-w-0">
                                                                    <span className="block truncate text-xs font-medium text-[#344054]">
                                                                        {
                                                                            product.name
                                                                        }
                                                                    </span>
                                                                    <span className="text-[10px] text-[#98A2B3]">
                                                                        Stok
                                                                        saat
                                                                        ini:{' '}
                                                                        {formatNumber(
                                                                            product.stock,
                                                                        )}
                                                                    </span>
                                                                </span>
                                                                <span className="shrink-0 text-[10px] font-medium text-[#526B91]">
                                                                    {formatCurrency(
                                                                        product.price,
                                                                    )}
                                                                </span>
                                                            </button>
                                                        ))
                                                ) : (
                                                    <p className="px-3 py-2 text-xs text-[#8A95A5]">
                                                        Produk tidak ditemukan
                                                        atau sudah ditambahkan.
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                        {form.errors[
                                            `items.${index}.product_id`
                                        ] && (
                                            <p
                                                role="alert"
                                                className="mt-1 text-[10px] text-[#9A5E50]"
                                            >
                                                {
                                                    form.errors[
                                                        `items.${index}.product_id`
                                                    ]
                                                }
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label
                                            htmlFor={`quantity-${index}`}
                                            className="mb-1.5 block text-[10px] font-medium text-[#667085]"
                                        >
                                            Kuantitas
                                        </label>
                                        <input
                                            id={`quantity-${index}`}
                                            type="number"
                                            min="1"
                                            step="1"
                                            value={item.quantity}
                                            onChange={(event) =>
                                                form.setData(
                                                    'items',
                                                    form.data.items.map(
                                                        (row, itemIndex) =>
                                                            itemIndex === index
                                                                ? {
                                                                      ...row,
                                                                      quantity:
                                                                          event
                                                                              .target
                                                                              .value,
                                                                  }
                                                                : row,
                                                    ),
                                                )
                                            }
                                            className="h-10 w-full rounded-lg border border-[#E2E6ED] bg-white px-3 text-xs text-[#344054] outline-none focus:border-[#526B91] focus:ring-2 focus:ring-[#526B91]/10"
                                        />
                                        {form.errors[
                                            `items.${index}.quantity`
                                        ] && (
                                            <p
                                                role="alert"
                                                className="mt-1 text-[10px] text-[#9A5E50]"
                                            >
                                                {
                                                    form.errors[
                                                        `items.${index}.quantity`
                                                    ]
                                                }
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label
                                            htmlFor={`price-${index}`}
                                            className="mb-1.5 block text-[10px] font-medium text-[#667085]"
                                        >
                                            Harga beli per unit
                                        </label>
                                        <input
                                            id={`price-${index}`}
                                            type="number"
                                            min="0.01"
                                            step="0.01"
                                            value={item.price}
                                            disabled
                                            className="h-10 w-full rounded-lg border border-[#E2E6ED] bg-white px-3 text-xs text-[#344054] outline-none focus:border-[#526B91] focus:ring-2 focus:ring-[#526B91]/10"
                                        />
                                        {form.errors[
                                            `items.${index}.price`
                                        ] && (
                                            <p
                                                role="alert"
                                                className="mt-1 text-[10px] text-[#9A5E50]"
                                            >
                                                {
                                                    form.errors[
                                                        `items.${index}.price`
                                                    ]
                                                }
                                            </p>
                                        )}
                                    </div>
                                    <div className="sm:col-span-2 xl:col-span-1">
                                        <p className="mb-1.5 text-[10px] font-medium text-[#667085]">
                                            Subtotal
                                        </p>
                                        <div className="flex h-10 items-center rounded-lg border border-[#EEF0F4] bg-[#F8F9FC] px-3 text-xs font-semibold text-[#203452]">
                                            {formatCurrency(subtotal)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {form.errors.items && (
                        <p role="alert" className="text-xs text-[#9A5E50]">
                            {form.errors.items}
                        </p>
                    )}
                    <div className="flex items-center justify-between gap-4 rounded-lg bg-[#F4F6F9] px-4 py-3">
                        <span className="text-xs font-medium text-[#667085]">
                            Total pengadaan
                        </span>
                        <span className="text-sm font-semibold text-[#203452]">
                            {formatCurrency(total)}
                        </span>
                    </div>
                </div>
            </section>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <a
                    href="/admin/procurements"
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#E2E6ED] px-4 text-xs font-semibold text-[#667085] transition hover:bg-white"
                >
                    <ArrowLeft size={14} />
                    Kembali
                </a>
                <button
                    type="submit"
                    disabled={form.processing}
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#203452] px-5 text-xs font-semibold text-white transition hover:bg-[#314D73] disabled:cursor-wait disabled:opacity-70"
                >
                    {form.processing && (
                        <LoaderCircle size={14} className="animate-spin" />
                    )}
                    Simpan Pengadaan
                </button>
            </div>
        </form>
    );
};

export default ProcurementForm;

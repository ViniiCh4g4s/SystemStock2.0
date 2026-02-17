import FlashToast from "@/components/flash-toast";
import { router, usePage } from "@inertiajs/react";
import { useState, useEffect, useMemo, useRef, type SVGProps, type ReactNode, type ChangeEvent } from "react";
import { Toaster } from "sonner";

// ── Types ──
interface StockItem {
    id: number;
    name: string;
    category: string;
    qty: number;
    minQty: number;
    location: string;
    notes: string;
    photos: string[];
    photoIds: number[];
    createdAt: number;
    updatedAt: number;
}

type ViewMode = "list" | "detail" | "form";
type SortMode = "name" | "qty" | "recent";

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "d"> {
    d: string | string[];
    size?: number;
    className?: string;
}

interface ThumbProps {
    src?: string;
    alt?: string;
    size?: number;
    className?: string;
    onClick?: () => void;
}

interface LightboxProps {
    photos: string[];
    initial?: number;
    onClose: () => void;
}

interface BadgeProps {
    children: ReactNode;
    active?: boolean;
    onClick?: () => void;
    count?: number;
}

interface QtyStepperProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
}

interface EmptyStateProps {
    filtered: boolean;
}

interface PhotoEntry {
    url: string;
    photoId?: number;
    file?: File;
}

interface ProductFormProps {
    item: StockItem | null;
    categories: string[];
    onSave: (data: { item: StockItem | null; name: string; category: string; qty: number; minQty: number; location: string; notes: string; photos: PhotoEntry[]; newFiles: File[] }) => void;
    onDelete: (id: number) => void;
    onClose: () => void;
}

interface ProductDetailProps {
    item: StockItem;
    onEdit: (item: StockItem) => void;
    onClose: () => void;
    onUpdateQty: (id: number, qty: number) => void;
}

interface ProductRowProps {
    item: StockItem;
    onClick: () => void;
}

interface PageProps {
    items: StockItem[];
    [key: string]: unknown;
}

// ── Icons (inline SVG for zero deps) ──
function Icon({ d, size = 20, className = "", ...props }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round"
             strokeLinejoin="round" className={className} {...props}>
            {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
        </svg>
    );
}

type IconComponent = (props: Omit<IconProps, "d">) => React.JSX.Element;

const Icons: Record<string, IconComponent> = {
    plus: (p) => <Icon d="M12 5v14M5 12h14" {...p} />,
    search: (p) => <Icon d={["M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z", "M21 21l-4.35-4.35"]} {...p} />,
    x: (p) => <Icon d={["M18 6L6 18", "M6 6l12 12"]} {...p} />,
    chevLeft: (p) => <Icon d="M15 18l-6-6 6-6" {...p} />,
    edit: (p) => <Icon d={["M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7", "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"]} {...p} />,
    camera: (p) => <Icon d={["M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z", "M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"]} {...p} />,
    package: (p) => <Icon d={["M16.5 9.4l-9-5.19", "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z", "M3.27 6.96L12 12.01l8.73-5.05", "M12 22.08V12"]} {...p} />,
    minus: (p) => <Icon d="M5 12h14" {...p} />,
    sort: (p) => <Icon d={["M11 5h10", "M11 9h7", "M11 13h4", "M3 17l3 3 3-3", "M6 18V4"]} {...p} />,
};

// ── Thumbnail with lazy loading ──
function Thumb({ src, alt = "", size = 48, className = "", onClick }: ThumbProps) {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    if (!src || error) {
        return (
            <div onClick={onClick} className={`flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded-lg ${className}`}
                 style={{ width: size, height: size, minWidth: size }}>
                {Icons.package({ size: size * 0.4, className: "text-zinc-300 dark:text-zinc-600" })}
            </div>
        );
    }

    return (
        <div onClick={onClick} className={`relative overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800 ${className}`}
             style={{ width: size, height: size, minWidth: size }}>
            {!loaded && (
                <div className="absolute inset-0 animate-pulse bg-zinc-200 dark:bg-zinc-700" />
            )}
            <img src={src} alt={alt} loading="lazy"
                 className={`w-full h-full object-cover transition-opacity duration-200 ${loaded ? "opacity-100" : "opacity-0"}`}
                 onLoad={() => setLoaded(true)} onError={() => setError(true)} />
        </div>
    );
}

// ── Photo Gallery Lightbox ──
function Lightbox({ photos, initial = 0, onClose }: LightboxProps) {
    const [idx, setIdx] = useState(initial);
    const photo = photos[idx];

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    return (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col" onClick={onClose}>
            <div className="flex items-center justify-between p-3">
                <span className="text-white/60 text-sm">{idx + 1} / {photos.length}</span>
                <button onClick={onClose} className="text-white/60 hover:text-white p-1">
                    {Icons.x({size: 24})}
                </button>
            </div>
            <div className="flex-1 flex items-center justify-center px-2" onClick={(e) => e.stopPropagation()}>
                <img src={photo} alt="" className="max-w-full max-h-full object-contain rounded-lg" />
            </div>
            {photos.length > 1 && (
                <div className="flex justify-center gap-3 p-4">
                    {photos.map((p, i) => (
                        <button key={i} onClick={(e) => { e.stopPropagation(); setIdx(i); }}
                                className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${i === idx ? "border-white" : "border-transparent opacity-50"}`}>
                            <img src={p} alt="" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ── Category Badge ──
function Badge({ children, active, onClick, count }: BadgeProps) {
    return (
        <button onClick={onClick}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all
        ${active
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                    : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"}`}>
            {children}
            {count !== undefined && (
                <span className={`text-xs ${active ? "text-white/60 dark:text-zinc-900/60" : "text-zinc-400 dark:text-zinc-500"}`}>
          {count}
        </span>
            )}
        </button>
    );
}

// ── Quantity Stepper ──
function QtyStepper({ value, onChange, min = 0 }: QtyStepperProps) {
    return (
        <div className="flex items-center gap-0 border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden">
            <button onClick={() => onChange(Math.max(min, value - 1))}
                    className="px-2.5 py-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:bg-zinc-200 transition-colors">
                {Icons.minus({size: 14})}
            </button>
            <span className="px-3 py-1.5 text-sm font-semibold min-w-[2.5rem] text-center bg-zinc-50 dark:bg-zinc-800/50">
        {value}
      </span>
            <button onClick={() => onChange(value + 1)}
                    className="px-2.5 py-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:bg-zinc-200 transition-colors">
                {Icons.plus({size: 14})}
            </button>
        </div>
    );
}

// ── Empty State ──
function EmptyState({ filtered }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                {Icons.package({size: 28, className: "text-zinc-300 dark:text-zinc-600"})}
            </div>
            <p className="text-zinc-900 dark:text-white font-semibold text-lg mb-1">
                {filtered ? "Nenhum item encontrado" : "Estoque vazio"}
            </p>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-[240px]">
                {filtered
                    ? "Tente buscar por outro termo ou limpe os filtros."
                    : "Toque no botão + para adicionar seu primeiro item ao estoque."}
            </p>
        </div>
    );
}

// ── Product Form (Add / Edit) ──
function ProductForm({ item, categories, onSave, onDelete, onClose }: ProductFormProps) {
    const isEdit = !!item;
    const [name, setName] = useState(item?.name || "");
    const [category, setCategory] = useState(item?.category || "");
    const [newCat, setNewCat] = useState("");
    const [showNewCat, setShowNewCat] = useState(false);
    const [qty, setQty] = useState(item?.qty ?? 1);
    const [minQty, setMinQty] = useState(item?.minQty ?? 0);
    const [notes, setNotes] = useState(item?.notes || "");
    const [location, setLocation] = useState(item?.location || "");
    const fileRef = useRef<HTMLInputElement>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Photos: existing (url+photoId) and new (url+file)
    const [photos, setPhotos] = useState<PhotoEntry[]>(() =>
        (item?.photos || []).map((url, i) => ({ url, photoId: item?.photoIds?.[i] }))
    );
    const [newFiles, setNewFiles] = useState<File[]>([]);

    const handlePhotos = (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const remaining = 5 - photos.length;
        const toAdd = files.slice(0, remaining);
        const newEntries: PhotoEntry[] = toAdd.map((f) => ({ url: URL.createObjectURL(f), file: f }));
        setPhotos((prev) => [...prev, ...newEntries]);
        setNewFiles((prev) => [...prev, ...toAdd]);
        if (fileRef.current) fileRef.current.value = "";
    };

    const removePhoto = (idx: number) => {
        const removed = photos[idx];
        setPhotos((prev) => prev.filter((_, i) => i !== idx));
        if (removed.file) {
            setNewFiles((prev) => prev.filter((f) => f !== removed.file));
        }
    };

    const handleSave = () => {
        if (!name.trim()) return;
        const finalCat = showNewCat && newCat.trim() ? newCat.trim() : category;
        onSave({
            item,
            name: name.trim(),
            category: finalCat,
            qty,
            minQty,
            location: location.trim(),
            notes: notes.trim(),
            photos,
            newFiles,
        });
    };

    return (
        <div className="fixed inset-0 z-40 bg-white dark:bg-zinc-950 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
                <button onClick={onClose} className="flex items-center gap-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
                    {Icons.chevLeft({size: 20})}
                    <span className="text-sm">Voltar</span>
                </button>
                <h2 className="font-semibold text-zinc-900 dark:text-white">
                    {isEdit ? "Editar Item" : "Novo Item"}
                </h2>
                <button onClick={handleSave} disabled={!name.trim()}
                        className="text-sm font-semibold text-zinc-900 dark:text-white disabled:opacity-30 transition-opacity">
                    Salvar
                </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-5">
                    {/* Photos */}
                    <div>
                        <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2 block">
                            Fotos ({photos.length}/5)
                        </label>
                        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
                            {photos.map((p, i) => (
                                <div key={i} className="relative shrink-0">
                                    <img src={p.url} alt="" className="w-20 h-20 rounded-xl object-cover" />
                                    <button onClick={() => removePhoto(i)}
                                            className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow-sm">
                                        {Icons.x({size: 12})}
                                    </button>
                                </div>
                            ))}
                            {photos.length < 5 && (
                                <button onClick={() => fileRef.current?.click()}
                                        className="w-20 h-20 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex flex-col items-center justify-center gap-1 text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors shrink-0">
                                    {Icons.camera({size: 20})}
                                    <span className="text-[10px]">Adicionar</span>
                                </button>
                            )}
                            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
                                   onChange={handlePhotos} />
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5 block">
                            Nome *
                        </label>
                        <input value={name} onChange={(e) => setName(e.target.value)}
                               placeholder="Ex: Compressor 12.000 BTUs"
                               className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-white placeholder:text-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white/30 transition-shadow" />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5 block">
                            Categoria
                        </label>
                        {!showNewCat ? (
                            <div className="space-y-2">
                                <div className="flex flex-wrap gap-1.5">
                                    <Badge active={!category} onClick={() => setCategory("")}>Sem categoria</Badge>
                                    {categories.map((c) => (
                                        <Badge key={c} active={category === c} onClick={() => setCategory(c)}>{c}</Badge>
                                    ))}
                                </div>
                                <button onClick={() => setShowNewCat(true)}
                                        className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 transition-colors">
                                    {Icons.plus({size: 12})} Nova categoria
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <input value={newCat} onChange={(e) => setNewCat(e.target.value)}
                                       placeholder="Nome da categoria"
                                       autoFocus
                                       className="flex-1 px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-white placeholder:text-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white/30 transition-shadow" />
                                <button onClick={() => { setShowNewCat(false); setNewCat(""); }}
                                        className="px-3 py-2 text-zinc-500 text-sm">
                                    Cancelar
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Quantity & Min Quantity */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5 block">
                                Quantidade
                            </label>
                            <QtyStepper value={qty} onChange={setQty} />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5 block">
                                Qtd. mínima
                            </label>
                            <QtyStepper value={minQty} onChange={setMinQty} />
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5 block">
                            Localização
                        </label>
                        <input value={location} onChange={(e) => setLocation(e.target.value)}
                               placeholder="Ex: Prateleira A3, Depósito 2"
                               className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-white placeholder:text-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white/30 transition-shadow" />
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5 block">
                            Observações
                        </label>
                        <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                                  placeholder="Anotações, referências, detalhes..."
                                  rows={3}
                                  className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-white placeholder:text-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white/30 resize-none transition-shadow" />
                    </div>

                    {/* Delete */}
                    {isEdit && item && (
                        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                            {!showDeleteConfirm ? (
                                <button onClick={() => setShowDeleteConfirm(true)}
                                        className="w-full py-2.5 rounded-xl text-red-500 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                                    Excluir item
                                </button>
                            ) : (
                                <div className="space-y-2">
                                    <p className="text-sm text-center text-zinc-600 dark:text-zinc-400">Tem certeza? Essa ação não pode ser desfeita.</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button onClick={() => setShowDeleteConfirm(false)}
                                                className="py-2.5 rounded-xl text-sm font-medium border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400">
                                            Cancelar
                                        </button>
                                        <button onClick={() => onDelete(item.id)}
                                                className="py-2.5 rounded-xl text-sm font-medium bg-red-500 text-white">
                                            Confirmar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Bottom safe area */}
                <div className="h-8" />
            </div>
        </div>
    );
}

// ── Product Detail ──
function ProductDetail({ item, onEdit, onClose, onUpdateQty }: ProductDetailProps) {
    const [lightbox, setLightbox] = useState<number | null>(null);

    const lowStock = item.minQty > 0 && item.qty <= item.minQty;

    return (
        <div className="fixed inset-0 z-40 bg-white dark:bg-zinc-950 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
                <button onClick={onClose} className="flex items-center gap-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
                    {Icons.chevLeft({size: 20})}
                    <span className="text-sm">Voltar</span>
                </button>
                <button onClick={() => onEdit(item)}
                        className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
                    {Icons.edit({size: 16})}
                    Editar
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {/* Photos */}
                {item.photos.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto p-4 pb-2">
                        {item.photos.map((p, i) => (
                            <img key={i} src={p} alt="" onClick={() => setLightbox(i)}
                                 className="w-28 h-28 rounded-xl object-cover shrink-0 cursor-pointer active:scale-95 transition-transform" />
                        ))}
                    </div>
                )}

                <div className="p-4 space-y-5">
                    {/* Title & Category */}
                    <div>
                        <h1 className="text-xl font-bold text-zinc-900 dark:text-white">{item.name}</h1>
                        {item.category && (
                            <span className="inline-block mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                {item.category}
              </span>
                        )}
                    </div>

                    {/* Quick Qty Adjust */}
                    <div className={`p-4 rounded-2xl ${lowStock ? "bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30" : "bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Quantidade</p>
                                <p className={`text-3xl font-bold mt-0.5 ${lowStock ? "text-amber-600 dark:text-amber-400" : "text-zinc-900 dark:text-white"}`}>
                                    {item.qty}
                                </p>
                                {lowStock && (
                                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                                        Estoque baixo (mín: {item.minQty})
                                    </p>
                                )}
                            </div>
                            <QtyStepper value={item.qty} onChange={(val) => onUpdateQty(item.id, val)} />
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="space-y-3">
                        {item.location && (
                            <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
                                <span className="text-sm text-zinc-500 dark:text-zinc-400">Localização</span>
                                <span className="text-sm font-medium text-zinc-900 dark:text-white">{item.location}</span>
                            </div>
                        )}
                        {item.minQty > 0 && (
                            <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
                                <span className="text-sm text-zinc-500 dark:text-zinc-400">Qtd. mínima</span>
                                <span className="text-sm font-medium text-zinc-900 dark:text-white">{item.minQty}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
                            <span className="text-sm text-zinc-500 dark:text-zinc-400">Atualizado</span>
                            <span className="text-sm text-zinc-600 dark:text-zinc-300">
                {new Date(item.updatedAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </span>
                        </div>
                    </div>

                    {/* Notes */}
                    {item.notes && (
                        <div>
                            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5 block">
                                Observações
                            </label>
                            <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                                {item.notes}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {lightbox !== null && (
                <Lightbox photos={item.photos} initial={lightbox} onClose={() => setLightbox(null)} />
            )}
        </div>
    );
}

// ── Product List Item ──
function ProductRow({ item, onClick }: ProductRowProps) {
    const lowStock = item.minQty > 0 && item.qty <= item.minQty;

    return (
        <button onClick={onClick}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 active:bg-zinc-100 dark:active:bg-zinc-800 transition-colors text-left">
            <Thumb src={item.photos[0]} alt={item.name} size={48} />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{item.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                    {item.category && (
                        <span className="text-xs text-zinc-400 dark:text-zinc-500 truncate">{item.category}</span>
                    )}
                    {item.location && (
                        <>
                            <span className="text-zinc-300 dark:text-zinc-700">·</span>
                            <span className="text-xs text-zinc-400 dark:text-zinc-500 truncate">{item.location}</span>
                        </>
                    )}
                </div>
            </div>
            <div className="text-right shrink-0">
        <span className={`text-lg font-bold ${lowStock ? "text-amber-500" : "text-zinc-900 dark:text-white"}`}>
          {item.qty}
        </span>
                {lowStock && <p className="text-[10px] text-amber-500 font-medium">BAIXO</p>}
            </div>
        </button>
    );
}

// ══════════════════════════════════════
// ██  MAIN APP
// ══════════════════════════════════════
export default function StockApp() {
    const { items } = usePage<PageProps>().props;
    const [view, setView] = useState<ViewMode>("list");
    const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
    const [editItem, setEditItem] = useState<StockItem | null>(null);
    const [search, setSearch] = useState("");
    const [filterCat, setFilterCat] = useState("");
    const [sortBy, setSortBy] = useState<SortMode>("name");
    const [showSearch, setShowSearch] = useState(false);
    const searchRef = useRef<HTMLInputElement>(null);

    // Categories
    const categories = useMemo(() => {
        const cats = new Set(items.map((i) => i.category).filter(Boolean));
        return [...cats].sort();
    }, [items]);

    // Category counts
    const catCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        items.forEach((i) => {
            if (i.category) counts[i.category] = (counts[i.category] || 0) + 1;
        });
        return counts;
    }, [items]);

    // Filter & sort
    const filtered = useMemo(() => {
        let list = [...items];
        if (search) {
            const q = search.toLowerCase();
            list = list.filter((i) =>
                i.name.toLowerCase().includes(q) ||
                i.category?.toLowerCase().includes(q) ||
                i.location?.toLowerCase().includes(q) ||
                i.notes?.toLowerCase().includes(q)
            );
        }
        if (filterCat) list = list.filter((i) => i.category === filterCat);

        list.sort((a, b) => {
            if (sortBy === "name") return a.name.localeCompare(b.name, "pt-BR");
            if (sortBy === "qty") return a.qty - b.qty;
            if (sortBy === "recent") return b.updatedAt - a.updatedAt;
            return 0;
        });
        return list;
    }, [items, search, filterCat, sortBy]);

    // Low stock count
    const lowStockCount = useMemo(() =>
            items.filter((i) => i.minQty > 0 && i.qty <= i.minQty).length
        , [items]);

    // Actions
    const saveItem = ({ item, name, category, qty, minQty, location, notes, photos, newFiles }: {
        item: StockItem | null; name: string; category: string; qty: number; minQty: number;
        location: string; notes: string; photos: PhotoEntry[]; newFiles: File[];
    }) => {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("category", category);
        formData.append("qty", String(qty));
        formData.append("min_qty", String(minQty));
        formData.append("location", location);
        formData.append("notes", notes);

        // Kept existing photo IDs
        photos.forEach((p) => {
            if (p.photoId) formData.append("kept_photo_ids[]", String(p.photoId));
        });

        // New files
        newFiles.forEach((f) => formData.append("photos[]", f));

        if (item) {
            router.post(`/stock/${item.id}`, formData, {
                onSuccess: () => { setView("list"); setEditItem(null); },
                preserveScroll: true,
            });
        } else {
            router.post("/stock", formData, {
                onSuccess: () => { setView("list"); setEditItem(null); },
                preserveScroll: true,
            });
        }
    };

    const deleteItem = (id: number) => {
        router.delete(`/stock/${id}`, {
            onSuccess: () => { setView("list"); setEditItem(null); setSelectedItem(null); },
            preserveScroll: true,
        });
    };

    const updateQty = (id: number, qty: number) => {
        router.patch(`/stock/${id}/qty`, { qty }, {
            preserveScroll: true,
        });
        // Optimistic update for detail view
        setSelectedItem((prev) => (prev?.id === id ? { ...prev, qty, updatedAt: Date.now() } : prev));
    };

    const openDetail = (item: StockItem) => { setSelectedItem(item); setView("detail"); };
    const openEdit = (item: StockItem | null) => { setEditItem(item || null); setView("form"); };
    const openAdd = () => { setEditItem(null); setView("form"); };

    // Focus search
    useEffect(() => {
        if (showSearch) searchRef.current?.focus();
    }, [showSearch]);

    const sortLabels: Record<SortMode, string> = { name: "A-Z", qty: "Quantidade", recent: "Recentes" };

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white max-w-lg mx-auto relative">
            <Toaster position="top-center" richColors />
            <FlashToast />

            {/* ── Header ── */}
            <div className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50">
                <div className="px-4 pt-3 pb-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">Estoque</h1>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                                {items.length} {items.length === 1 ? "item" : "itens"}
                                {lowStockCount > 0 && (
                                    <span className="text-amber-500 ml-1">· {lowStockCount} baixo{lowStockCount > 1 ? "s" : ""}</span>
                                )}
                            </p>
                        </div>
                        <div className="flex items-center gap-1">
                            <button onClick={() => setShowSearch(!showSearch)}
                                    className={`p-2 rounded-xl transition-colors ${showSearch ? "bg-zinc-100 dark:bg-zinc-800" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}>
                                {Icons.search({size: 18, className: "text-zinc-600 dark:text-zinc-400"})}
                            </button>
                            <button onClick={() => setSortBy((s) => s === "name" ? "qty" : s === "qty" ? "recent" : "name")}
                                    className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1">
                                {Icons.sort({size: 18, className: "text-zinc-600 dark:text-zinc-400"})}
                                <span className="text-[10px] font-medium text-zinc-400">{sortLabels[sortBy]}</span>
                            </button>
                        </div>
                    </div>

                    {/* Search */}
                    {showSearch && (
                        <div className="mt-2 relative">
                            {Icons.search({size: 16, className: "absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"})}
                            <input ref={searchRef} value={search} onChange={(e) => setSearch(e.target.value)}
                                   placeholder="Buscar por nome, categoria, local..."
                                   className="w-full pl-9 pr-8 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-600 transition-shadow" />
                            {search && (
                                <button onClick={() => setSearch("")}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-600">
                                    {Icons.x({size: 14})}
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Category Pills */}
                {categories.length > 0 && (
                    <div className="flex gap-1.5 overflow-x-auto px-4 pb-2.5 no-scrollbar">
                        <Badge active={!filterCat} onClick={() => setFilterCat("")} count={items.length}>Todos</Badge>
                        {categories.map((c) => (
                            <Badge key={c} active={filterCat === c} onClick={() => setFilterCat(filterCat === c ? "" : c)} count={catCounts[c]}>
                                {c}
                            </Badge>
                        ))}
                    </div>
                )}
            </div>

            {/* ── List ── */}
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                {filtered.length === 0 ? (
                    <EmptyState filtered={!!(search || filterCat)} />
                ) : (
                    filtered.map((item) => (
                        <ProductRow key={item.id} item={item} onClick={() => openDetail(item)} />
                    ))
                )}
            </div>

            {/* Bottom spacer for FAB */}
            <div className="h-24" />

            {/* ── FAB ── */}
            <button onClick={openAdd}
                    className="fixed bottom-6 right-6 w-14 h-14 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center shadow-lg shadow-zinc-900/30 dark:shadow-black/40 active:scale-95 transition-transform z-30 max-w-lg"
                    style={{ right: "max(1.5rem, calc((100vw - 32rem) / 2 + 1.5rem))" }}>
                {Icons.plus({size: 24})}
            </button>

            {/* ── Detail Overlay ── */}
            {view === "detail" && selectedItem && (
                <ProductDetail
                    item={items.find((i) => i.id === selectedItem.id) || selectedItem}
                    onEdit={(it) => openEdit(it)}
                    onClose={() => { setView("list"); setSelectedItem(null); }}
                    onUpdateQty={updateQty}
                />
            )}

            {/* ── Form Overlay ── */}
            {view === "form" && (
                <ProductForm
                    item={editItem}
                    categories={categories}
                    onSave={saveItem}
                    onDelete={deleteItem}
                    onClose={() => { setView("list"); setEditItem(null); }}
                />
            )}

            {/* Hide scrollbar for category pills */}
            <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
        </div>
    );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { FileText, Image as ImageIcon, Trash2 } from 'lucide-react';
import { AdminShell } from '@/components/layout/AdminShell';
import { Button } from '@/components/ui/button';

type BrandAsset = {
  id: string;
  name: string;
  type: string;
  size: number;
  dataUrl: string;
  uploadedAt: string;
};

const storageKey = 'stagepass_admin_brand_assets_v1';

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function loadAssets() {
  try {
    return JSON.parse(window.localStorage.getItem(storageKey) ?? '[]') as BrandAsset[];
  } catch {
    return [];
  }
}

function saveAssets(assets: BrandAsset[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(assets));
}

function readFile(file: File) {
  return new Promise<BrandAsset>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        id: `${Date.now()}-${file.name}-${Math.random().toString(16).slice(2)}`,
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
        dataUrl: String(reader.result),
        uploadedAt: new Date().toISOString(),
      });
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function AdminBrand() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [assets, setAssets] = useState<BrandAsset[]>([]);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setAssets(loadAssets());
    setReady(true);
  }, []);

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return;

    const incoming = Array.from(files).slice(0, 12);
    const nextAssets = await Promise.all(incoming.map(readFile));
    setAssets((prev) => {
      const next = [...nextAssets, ...prev].slice(0, 24);
      saveAssets(next);
      return next;
    });
    setMessage(`${nextAssets.length} asset${nextAssets.length === 1 ? '' : 's'} uploaded.`);
    window.setTimeout(() => setMessage(null), 2500);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function removeAsset(id: string) {
    setAssets((prev) => {
      const next = prev.filter((asset) => asset.id !== id);
      saveAssets(next);
      return next;
    });
  }

  async function copyName(name: string) {
    await navigator.clipboard.writeText(name).catch(() => null);
    setMessage('Asset name copied.');
    window.setTimeout(() => setMessage(null), 1800);
  }

  return (
    <AdminShell>
      <div className="max-w-5xl space-y-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-white">Brand</h1>
            <p className="text-offwhite/40">Upload assets and define creator-ready promo kits.</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.txt,.doc,.docx"
              className="hidden"
              onChange={(event) => void upload(event.target.files)}
            />
            <Button variant="premium" onClick={() => fileInputRef.current?.click()}>
              Upload assets
            </Button>
            {message ? <div className="text-xs text-accent-green">{message}</div> : null}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-5">
          <div>
            <div className="text-white font-bold">Asset library</div>
            <div className="text-sm text-offwhite/50">
              Event hero images, logos, copy packs, and approved messaging for creator campaigns.
            </div>
          </div>

          {!ready ? (
            <div className="rounded-xl border border-white/10 bg-dark p-5 text-sm text-offwhite/50">
              Loading assets...
            </div>
          ) : assets.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => fileInputRef.current?.click()}
                  className="h-32 rounded-xl bg-dark border border-dashed border-white/15 text-sm text-offwhite/40 hover:border-primary/40 hover:text-primary transition-colors"
                >
                  Upload asset
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {assets.map((asset) => {
                const isImage = asset.type.startsWith('image/');
                return (
                  <div key={asset.id} className="rounded-xl border border-white/10 bg-dark overflow-hidden">
                    <div className="h-36 bg-black/60 border-b border-white/10 flex items-center justify-center">
                      {isImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={asset.dataUrl} alt={asset.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-offwhite/45">
                          <FileText className="h-8 w-8" />
                          <span className="text-xs uppercase tracking-widest">Document</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-white">{asset.name}</div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-offwhite/45">
                          {isImage ? <ImageIcon className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}
                          <span>{formatSize(asset.size)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" className="h-8 flex-1 text-white border-white/10 hover:bg-white/5" onClick={() => void copyName(asset.name)}>
                          Copy name
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 text-red-200 border-red-500/25 hover:bg-red-500/10" onClick={() => removeAsset(asset.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="text-xs text-offwhite/30">
          Demo assets are stored in this browser. Production asset storage and permissions can be connected to Supabase Storage, S3, or R2.
        </div>
      </div>
    </AdminShell>
  );
}

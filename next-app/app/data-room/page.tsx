'use client';

import { type ChangeEvent, type DragEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileText, Trash2, BarChart3, Loader } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

interface Dataset {
  id: string;
  name: string;
  fileName: string;
  rowCount: number;
  createdAt: string;
  analyses: Array<{ id: string; title: string; createdAt: string }>;
}

export default function DataRoomPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const fetchDatasets = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('aura_token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/datasets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        router.push('/login');
        return;
      }

      if (!response.ok) throw new Error('Failed to fetch datasets');

      const data = await response.json();
      setDatasets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch datasets');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchDatasets();
  }, [fetchDatasets]);

  async function handleFileUpload(file: File) {
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const fileContent = await file.text();
      const token = localStorage.getItem('aura_token');

      const response = await fetch(`${API_BASE_URL}/api/datasets/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: file.name.replace('.csv', ''),
          data: fileContent,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const dataset = await response.json();
      setDatasets((prev) => [dataset, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  function handleDrag(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  }

  async function handleDeleteDataset(id: string) {
    if (!confirm('Are you sure you want to delete this dataset?')) return;

    try {
      const token = localStorage.getItem('aura_token');
      const response = await fetch(`${API_BASE_URL}/api/datasets/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Delete failed');
      setDatasets((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  }

  function goToInsights(datasetId: string) {
    router.push(`/insights?datasetId=${datasetId}`);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold">Data Room</h1>
          <p className="mt-2 text-slate-400">Upload and manage your datasets for AI analysis</p>
        </div>

        {/* Upload Section */}
        <div className="mb-12">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`rounded-2xl border-2 border-dashed p-12 text-center transition ${
              dragActive ? 'border-violet-400 bg-violet-400/10' : 'border-white/20'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleChange}
              className="hidden"
              disabled={uploading}
            />
            <Upload className="mx-auto h-12 w-12 text-violet-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Drop your CSV file here</h2>
            <p className="text-slate-400 mb-4">or</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 rounded-full bg-violet-500 px-6 py-2 font-semibold text-white transition hover:bg-violet-400 disabled:opacity-60"
            >
              {uploading ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Browse Files
                </>
              )}
            </button>
            <p className="mt-4 text-sm text-slate-500">CSV files only, max 10MB</p>
          </div>
          {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}
        </div>

        {/* Datasets List */}
        <div>
          <h2 className="mb-6 text-2xl font-bold">Your Datasets</h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader className="h-8 w-8 animate-spin text-violet-400" />
            </div>
          ) : datasets.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-slate-600 mb-4" />
              <p className="text-slate-400">No datasets yet. Upload your first CSV file above.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {datasets.map((dataset) => (
                <div
                  key={dataset.id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/50 p-6 hover:border-violet-400/50 hover:bg-slate-900/80 transition"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{dataset.name}</h3>
                    <p className="mt-1 text-sm text-slate-400">
                      {dataset.rowCount} rows • {dataset.fileName}
                    </p>
                    {dataset.analyses.length > 0 && (
                      <div className="mt-3 flex gap-2">
                        {dataset.analyses.map((analysis) => (
                          <span
                            key={analysis.id}
                            className="inline-block px-3 py-1 rounded-full bg-violet-400/10 text-xs text-violet-300 border border-violet-400/20"
                          >
                            ✓ {analysis.title}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => goToInsights(dataset.id)}
                      className="inline-flex items-center gap-2 rounded-lg bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-300 border border-violet-400/20 hover:bg-violet-500/20 transition"
                    >
                      <BarChart3 className="h-4 w-4" />
                      Analyze
                    </button>
                    <button
                      onClick={() => handleDeleteDataset(dataset.id)}
                      className="inline-flex items-center gap-2 rounded-lg bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-300 border border-rose-400/20 hover:bg-rose-500/20 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

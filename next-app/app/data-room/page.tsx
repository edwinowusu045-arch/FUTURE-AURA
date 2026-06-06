'use client';

import { type ChangeEvent, type DragEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileText, Trash2, BarChart3, Loader } from 'lucide-react';
import { API_BASE_URL, API_BASE_URL_ERROR } from '@/lib/api';

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

      if (!API_BASE_URL) {
        setError(API_BASE_URL_ERROR);
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
      if (!API_BASE_URL) {
        setError(API_BASE_URL_ERROR);
        return;
      }

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
      if (!API_BASE_URL) {
        setError(API_BASE_URL_ERROR);
        return;
      }

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
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
        <div className="mb-10 rounded-[2rem] border border-slate-200 bg-white p-10 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-sky-700">Data Room</p>
              <h1 className="mt-4 text-4xl font-semibold text-slate-950 sm:text-5xl">Secure dataset management for trusted analytics.</h1>
              <p className="mt-3 max-w-2xl text-base leading-8 text-slate-600">Upload CSV data, track versions, and prepare your datasets for AI-driven analysis in a polished, enterprise-ready workspace.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-2 rounded-full bg-sky-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:opacity-60"
              >
                {uploading ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5" />
                    Add dataset
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                View dashboard
              </button>
            </div>
          </div>
        </div>

        <div className="mb-12 rounded-[2rem] border border-dashed border-slate-200 bg-white p-10 shadow-sm">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`rounded-3xl border-2 p-12 text-center transition ${
              dragActive ? 'border-sky-600 bg-sky-50' : 'border-slate-200 hover:border-slate-300'
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
            <Upload className="mx-auto h-14 w-14 text-sky-700 mb-6" />
            <h2 className="text-2xl font-semibold mb-3 text-slate-950">Drop your CSV file here</h2>
            <p className="text-slate-600 mb-4 text-lg">or click to browse from your device</p>
            <p className="text-sm text-slate-500">CSV files only · secure upload · <span className="font-semibold text-slate-700">max 10MB</span></p>
          </div>
          {error && <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">{error}</p>}
        </div>

        <div>
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-semibold text-slate-950">Your datasets</h2>
              <p className="text-slate-600">Review uploaded datasets, access analysis, and keep audit-ready records.</p>
            </div>
            <div className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">Connected to: AURA secure workspace</div>
          </div>

          {loading ? (
            <div className="flex justify-center rounded-[2rem] border border-slate-200 bg-white p-16 shadow-sm">
              <Loader className="h-10 w-10 animate-spin text-sky-700" />
            </div>
          ) : datasets.length === 0 ? (
            <div className="rounded-[2rem] border border-slate-200 bg-white p-16 text-center text-slate-600 shadow-sm">
              <FileText className="mx-auto h-16 w-16 text-slate-300 mb-4" />
              <p className="text-lg">No datasets yet. Upload your first CSV file above to begin.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {datasets.map((dataset) => (
                <div key={dataset.id} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-950">{dataset.name}</h3>
                      <p className="mt-2 text-sm text-slate-600">{dataset.rowCount} rows · {dataset.fileName}</p>
                      {dataset.analyses.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {dataset.analyses.map((analysis) => (
                            <span key={analysis.id} className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-700 border border-sky-100">
                              <FileText className="h-3.5 w-3.5" /> {analysis.title}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => goToInsights(dataset.id)}
                        className="inline-flex items-center gap-2 rounded-full bg-sky-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-800"
                      >
                        <BarChart3 className="h-4 w-4" />
                        Analyze
                      </button>
                      <button
                        onClick={() => handleDeleteDataset(dataset.id)}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        title="Delete dataset"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
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

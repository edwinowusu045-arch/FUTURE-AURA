'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader, Play, BarChart3 } from 'lucide-react';
import { API_BASE_URL, API_BASE_URL_ERROR } from '@/lib/api';

interface Analysis {
  id: string;
  title: string;
  summary?: string;
  description?: string;
  insights?: Array<{ title: string; description: string }>;
  anomalies?: Array<{ title: string; description: string }>;
  createdAt: string;
}

interface DatasetDetails {
  id: string;
  name: string;
  fileName: string;
  rowCount: number;
  columns: string[];
  createdAt: string;
  analyses: Analysis[];
}

export default function InsightsPage() {
  const router = useRouter();
  const [datasetId, setDatasetId] = useState<string | null>(null);
  const [dataset, setDataset] = useState<DatasetDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setDatasetId(params.get('datasetId'));
  }, []);

  useEffect(() => {
    if (!datasetId) {
      setError('Missing dataset ID.');
      setLoading(false);
      return;
    }

    async function loadDataset() {
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

        const response = await fetch(`${API_BASE_URL}/api/datasets/${datasetId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 401) {
          router.push('/login');
          return;
        }

        if (!response.ok) {
          throw new Error('Unable to load dataset details.');
        }

        const data = await response.json();
        setDataset(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load dataset details.');
      } finally {
        setLoading(false);
      }
    }

    loadDataset();
  }, [datasetId, router]);

  async function runAnalysis() {
    if (!datasetId) return;

    try {
      setAnalysisLoading(true);
      setMessage('');
      setError('');
      const token = localStorage.getItem('aura_token');
      if (!token) {
        router.push('/login');
        return;
      }

      if (!API_BASE_URL) {
        setError(API_BASE_URL_ERROR);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/analysis/run/${datasetId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: 'Quick AI analysis', description: 'Auto-generated dataset summary' }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error || 'Analysis request failed');
      }

      const analysis = await response.json();
      setDataset((prev) => {
        if (!prev) return prev;
        return { ...prev, analyses: [analysis, ...prev.analyses] };
      });
      setMessage('Analysis created successfully. Refreshing the list.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis request failed');
    } finally {
      setAnalysisLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <button
          onClick={() => router.push('/data-room')}
          className="inline-flex items-center gap-2 text-slate-300 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Data Room
        </button>

        <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900/70 p-10 shadow-xl shadow-slate-950/20">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold">Dataset Insights</h1>
              <p className="mt-2 text-slate-400">View dataset metadata and generate AI analysis results.</p>
            </div>
            <button
              onClick={runAnalysis}
              disabled={!dataset || analysisLoading}
              className="inline-flex items-center gap-2 rounded-full bg-violet-500 px-5 py-3 font-semibold text-white transition hover:bg-violet-400 disabled:opacity-60"
            >
              {analysisLoading ? <Loader className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              Run AI Analysis
            </button>
          </div>

          {loading ? (
            <div className="mt-12 flex justify-center py-12">
              <Loader className="h-8 w-8 animate-spin text-violet-400" />
            </div>
          ) : error ? (
            <div className="mt-12 rounded-2xl bg-rose-500/10 p-6 text-rose-200">
              {error}
            </div>
          ) : dataset ? (
            <div className="mt-10 grid gap-6">
              <div className="grid gap-4 rounded-3xl border border-white/10 bg-slate-950/80 p-6 sm:grid-cols-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Dataset</p>
                  <p className="mt-2 text-xl font-semibold">{dataset.name}</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Rows</p>
                  <p className="mt-2 text-xl font-semibold">{dataset.rowCount}</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Uploaded</p>
                  <p className="mt-2 text-xl font-semibold">{new Date(dataset.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Columns</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {dataset.columns.map((column) => (
                    <span key={column} className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-200">
                      {column}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">Recent Analyses</h2>
                    <p className="mt-1 text-slate-400">Track the latest AI analysis results for this dataset.</p>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-300">
                    <BarChart3 className="h-4 w-4" />
                    {dataset.analyses.length} results
                  </div>
                </div>

                {dataset.analyses.length === 0 ? (
                  <div className="mt-8 rounded-3xl bg-slate-950/80 p-8 text-center text-slate-400">
                    No analysis results yet. Run the AI analysis to generate insights.
                  </div>
                ) : (
                  <div className="mt-8 space-y-4">
                    {dataset.analyses.map((analysis) => (
                      <div key={analysis.id} className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">{analysis.title}</h3>
                            <p className="text-sm text-slate-400">Created {new Date(analysis.createdAt).toLocaleString()}</p>
                          </div>
                          <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-violet-300">
                            Analysis
                          </span>
                        </div>
                        {analysis.summary ? (
                          <p className="mt-4 text-slate-300">{analysis.summary}</p>
                        ) : null}
                        {analysis.insights?.length ? (
                          <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            {analysis.insights.map((insight, index) => (
                              <div key={index} className="rounded-2xl bg-slate-900/80 p-4">
                                <p className="font-semibold">{insight.title}</p>
                                <p className="mt-2 text-sm text-slate-400">{insight.description}</p>
                              </div>
                            ))}
                          </div>
                        ) : null}
                        {analysis.anomalies?.length ? (
                          <div className="mt-4 rounded-2xl bg-rose-500/5 p-4 text-sm text-rose-200">
                            <p className="font-semibold text-rose-200">Anomalies detected</p>
                            <ul className="mt-3 list-disc space-y-1 pl-4 text-slate-300">
                              {analysis.anomalies.map((anomaly, index) => (
                                <li key={index}>{anomaly.title}: {anomaly.description}</li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {message ? <p className="rounded-2xl bg-emerald-500/10 p-4 text-emerald-200">{message}</p> : null}
            </div>
          ) : (
            <div className="mt-12 rounded-2xl bg-slate-900/70 p-8 text-slate-400">Dataset not found.</div>
          )}
        </div>
      </div>
    </main>
  );
}

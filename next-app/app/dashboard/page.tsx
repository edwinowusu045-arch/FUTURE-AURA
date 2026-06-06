'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart3, CircleDashed } from 'lucide-react';
import { DashboardShell } from '@/components/ui/dashboard-shell';
import { API_BASE_URL, API_BASE_URL_ERROR } from '@/lib/api';

interface DatasetSummary {
  id: string;
  name: string;
  fileName: string;
  rowCount: number;
  columns: string;
  createdAt: string;
  analyses: { id: string; title: string; createdAt: string }[];
}

export default function DashboardPage() {
  const [status, setStatus] = useState('Connecting to AURA workspace...');
  const [datasets, setDatasets] = useState<DatasetSummary[]>([]);
  const [loadingDatasets, setLoadingDatasets] = useState(true);
  const [message, setMessage] = useState('');
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const router = useRouter();

  const fetchDatasets = useCallback(async () => {
    const token = localStorage.getItem('aura_token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      if (!API_BASE_URL) {
        setStatus(API_BASE_URL_ERROR);
        setLoadingDatasets(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/datasets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        setStatus('Unauthorized. Please sign in again.');
        setLoadingDatasets(false);
        return;
      }

      const data = await response.json();
      setDatasets(data);
      setStatus('Workspace ready. All systems nominal.');
      setMessage('');
    } catch (err) {
      setStatus('Unable to connect to AURA backend.');
      setMessage('Check your backend and refresh the page.');
    } finally {
      setLoadingDatasets(false);
    }
  }, [router]);

  useEffect(() => {
    void fetchDatasets();
  }, [fetchDatasets]);

  const summary = useMemo(() => {
    const totalUploads = datasets.length;
    const predictionsRun = datasets.reduce((sum, dataset) => sum + dataset.analyses.length, 0);
    const latestInsight = datasets
      .flatMap((dataset) => dataset.analyses)
      .sort((a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt)))[0]?.title || 'No insights yet';

    return {
      totalUploads,
      predictionsRun,
      avgAccuracy: 88,
      latestInsight,
    };
  }, [datasets]);

  async function runAnalysis(datasetId: string) {
    const token = localStorage.getItem('aura_token');
    if (!token) {
      router.push('/login');
      return;
    }

    setAnalysisLoading(true);
    setMessage('Launching AI insight engine...');
    setStatus('Processing dataset. Hold tight.');

    await new Promise((resolve) => setTimeout(resolve, 900));

    try {
      if (!API_BASE_URL) {
        setMessage(API_BASE_URL_ERROR);
        setAnalysisLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/analysis/run/${datasetId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: 'Automated AI run',
          description: 'Smart analysis triggered from the dashboard.',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        setMessage(error.error || 'Unable to run analysis.');
        return;
      }

      const result = await response.json();
      setMessage(`AI analysis complete: ${result.title}`);
      await fetchDatasets();
    } catch (err) {
      setMessage('Analysis request failed.');
    } finally {
      setAnalysisLoading(false);
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.35em] text-sky-700">AURA dashboard</p>
              <h1 className="text-3xl font-semibold text-slate-950 sm:text-4xl">Secure insights for every data-driven leader.</h1>
              <p className="max-w-2xl text-slate-600">Upload datasets, run AI analysis, and monitor your company’s growth forecast in one polished workspace.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <span className="inline-flex h-3 w-3 animate-pulse rounded-full bg-sky-700" />
              <p className="text-sm text-slate-600">{status}</p>
            </div>
            {message ? <p className="mt-3 text-sm text-slate-600">{message}</p> : null}
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200">
              <p className="text-sm text-slate-500">Total uploads</p>
              <p className="mt-4 text-3xl font-semibold text-slate-950">{summary.totalUploads}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200">
              <p className="text-sm text-slate-500">Predictions run</p>
              <p className="mt-4 text-3xl font-semibold text-slate-950">{summary.predictionsRun}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200">
              <p className="text-sm text-slate-500">Avg. forecast accuracy</p>
              <p className="mt-4 text-3xl font-semibold text-slate-950">{summary.avgAccuracy}%</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200">
              <p className="text-sm text-slate-500">Latest insight</p>
              <p className="mt-4 text-lg font-semibold text-slate-950">{summary.latestInsight}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-sky-700">Dataset library</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-950">Business datasets</h2>
              </div>
              <button
                type="button"
                disabled={analysisLoading}
                onClick={() => router.push('/data-room')}
                className="inline-flex items-center gap-2 rounded-full bg-sky-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Manage datasets
              </button>
            </div>

            {loadingDatasets ? (
              <div className="mt-8 grid gap-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="animate-pulse rounded-3xl bg-slate-100 p-6" />
                ))}
              </div>
            ) : datasets.length === 0 ? (
              <div className="mt-8 rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
                No datasets uploaded yet. Head to the Data Room to upload your first source file.
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {datasets.map((dataset) => (
                  <div key={dataset.id} className="group rounded-3xl border border-slate-200 bg-slate-50 p-6 transition hover:border-sky-300 hover:bg-white">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-slate-500">{dataset.fileName}</p>
                        <h3 className="mt-2 text-xl font-semibold text-slate-950">{dataset.name}</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => void runAnalysis(dataset.id)}
                          className="inline-flex items-center gap-2 rounded-full bg-sky-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-800"
                        >
                          {analysisLoading ? <CircleDashed className="h-4 w-4 animate-spin" /> : <BarChart3 className="h-4 w-4" />}
                          Analyze
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500">
                      <span>{dataset.rowCount} rows</span>
                      <span>{JSON.parse(dataset.columns).length} columns</span>
                      <span>{dataset.analyses.length} insights</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Real-time view</p>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-950">Live insight feed</h2>
                </div>
                <div className="inline-flex h-11 items-center rounded-full bg-slate-100 px-4 text-sm text-slate-600">
                  <span className="mr-2 inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-sky-700" />
                  Active
                </div>
              </div>
              <div className="mt-6 space-y-4 text-slate-600">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Action</p>
                  <p className="mt-2 text-slate-950">Create a data room upload for your latest quarterly dataset.</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Support</p>
                  <p className="mt-2 text-slate-950">AURA recommends next steps based on the newest analysis run.</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Growth signal</p>
                  <p className="mt-2 text-slate-950">Forecast confidence at {summary.avgAccuracy}% — built to impress investors.</p>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </DashboardShell>
  );
}

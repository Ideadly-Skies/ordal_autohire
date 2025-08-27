'use client'
import FileUpload from "@/components/file-upload";
import { HeroHeader } from "@/components/header";

import { useState } from 'react';

const Page = () => {
  const [userId, setUserId] = useState('USER_001');
  const [file, setFile] = useState<File | null>(null);
  const [skillsMode, setSkillsMode] = useState<'add'|'replace'>('add');
  type ResumeOutput = {
    [key: string]: unknown;
  } | null;
  const [out, setOut] = useState<ResumeOutput>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setBusy(true);
    setErr(null);
    setOut(null);

    try {
      const fd = new FormData();
      fd.append('userId', userId.trim());
      fd.append('file', file);
      fd.append('skillsMode', skillsMode);

      const res = await fetch('/api/resume/ingest', { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok || !json?.ok) {
        throw new Error(json?.error || `Upload failed (${res.status})`);
      }
      setOut(json);
    } catch (e) {
      if (e instanceof Error) {
      setErr(e.message || 'Something went wrong.');
      } else {
      setErr('Something went wrong.');
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
        <HeroHeader />
        <main className="p-6 w-full max-w-2xl mx-auto space-y-4 bg-white/70 backdrop-blur rounded-2xl shadow">
        <h1 className="text-2xl font-semibold">ATS CV Checker – Resume Parser</h1>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium">User ID</label>
            <input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="border rounded px-3 py-2 w-full"
              placeholder="USER_001"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Resume file (.pdf / .docx / .txt)</label>
            <input
              type="file"
              accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Skills behavior</label>
            <select
              value={skillsMode}
              onChange={(e) => setSkillsMode(e.target.value as 'add' | 'replace')}
              className="border rounded px-3 py-2"
            >
              <option value="add">Add to existing</option>
              <option value="replace">Replace existing</option>
            </select>
          </div>

          <button
            disabled={busy || !file}
            className="bg-black text-white rounded px-4 py-2 disabled:opacity-50"
          >
            {busy ? 'Parsing…' : 'Upload & Parse'}
          </button>

          {err && (
            <p className="text-sm text-red-600" role="alert">
              {err}
            </p>
          )}
        </form>

        {out && (
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-[50vh]">
            {JSON.stringify(out, null, 2)}
          </pre>
        )}
      </main>
    </>
  );
};

export default Page;

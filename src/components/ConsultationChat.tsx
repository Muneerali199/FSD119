'use client';

import { useEffect, useState } from 'react';

type ChatMessage = {
  id: string;
  senderId: string;
  createdAt: string;
  body: string;
};

export default function ConsultationChat() {
  const [consultationId, setConsultationId] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState('');

  async function loadMessages() {
    if (!consultationId) return;
    const res = await fetch(`/api/messages?consultationId=${consultationId}`);
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error ?? 'Unable to load messages.');
      return;
    }
    setMessages(data.messages ?? []);
    setStatus('');
  }

  async function sendMessage() {
    if (!consultationId || !draft) return;
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ consultationId, body: draft }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error ?? 'Unable to send.');
      return;
    }
    setDraft('');
    await loadMessages();
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (consultationId) {
        loadMessages();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [consultationId]);

  return (
    <div className="hv-card p-6">
      <p className="text-sm uppercase tracking-[0.3em] text-[var(--hv-sage)]">Secure chat</p>
      <p className="mt-2 text-sm text-[var(--hv-ink)]">
        Encrypted chat messages linked to each consultation.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <input
          value={consultationId}
          onChange={(event) => setConsultationId(event.target.value)}
          placeholder="Consultation ID"
          className="flex-1 rounded-2xl border border-[var(--hv-mist)] bg-white px-4 py-2 text-sm"
        />
        <button
          type="button"
          onClick={loadMessages}
          className="rounded-full border border-[var(--hv-forest)] px-4 py-2 text-sm font-semibold text-[var(--hv-forest)]"
        >
          Load
        </button>
      </div>
      <div className="mt-4 max-h-48 space-y-2 overflow-y-auto rounded-2xl border border-[var(--hv-mist)] bg-white p-4 text-sm">
        {messages.length === 0 && <p className="text-[var(--hv-sage)]">No messages yet.</p>}
        {messages.map((message) => (
          <div key={message.id} className="rounded-xl bg-[var(--hv-mist)] p-2">
            <p className="text-xs text-[var(--hv-sage)]">{message.senderId}</p>
            <p>{message.body}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Write a message"
          className="flex-1 rounded-2xl border border-[var(--hv-mist)] bg-white px-4 py-2 text-sm"
        />
        <button
          type="button"
          onClick={sendMessage}
          className="rounded-full bg-[var(--hv-forest)] px-4 py-2 text-sm font-semibold text-white"
        >
          Send
        </button>
      </div>
      {status && <p className="mt-2 text-sm text-[var(--hv-ember)]">{status}</p>}
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';

export default function VideoConsultation() {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [offer, setOffer] = useState('');
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState('');
  const [audioOnly, setAudioOnly] = useState(false);

  useEffect(() => {
    return () => {
      peerRef.current?.close();
      localStream?.getTracks().forEach((track) => track.stop());
    };
  }, [localStream]);

  async function startLocal() {
    setStatus('Requesting media...');
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: audioOnly
        ? false
        : {
            width: { ideal: 640 },
            height: { ideal: 360 },
            frameRate: { ideal: 15, max: 20 },
          },
    });
    setLocalStream(stream);
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
    setStatus('Local media ready.');
  }

  function createPeer() {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }],
    });
    peer.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };
    peer.onicecandidate = (event) => {
      if (!event.candidate && peer.localDescription) {
        if (peer.localDescription.type === 'offer') {
          setOffer(JSON.stringify(peer.localDescription));
        } else {
          setAnswer(JSON.stringify(peer.localDescription));
        }
      }
    };
    localStream?.getTracks().forEach((track) => peer.addTrack(track, localStream));
    peerRef.current = peer;
    return peer;
  }

  async function handleCreateOffer() {
    setStatus('Creating offer...');
    const peer = createPeer();
    const offerDesc = await peer.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: !audioOnly,
    });
    await peer.setLocalDescription(offerDesc);
    setStatus('Offer created. Share it with the other participant.');
  }

  async function handleApplyOffer(remoteOffer: string) {
    setStatus('Applying offer...');
    const peer = createPeer();
    const desc = JSON.parse(remoteOffer);
    await peer.setRemoteDescription(desc);
    const answerDesc = await peer.createAnswer();
    await peer.setLocalDescription(answerDesc);
    setStatus('Answer created. Share it back.');
  }

  async function handleApplyAnswer(remoteAnswer: string) {
    if (!peerRef.current) return;
    setStatus('Finalizing connection...');
    const desc = JSON.parse(remoteAnswer);
    await peerRef.current.setRemoteDescription(desc);
    setStatus('Connection established.');
  }

  return (
    <div className="hv-card p-6">
      <p className="text-sm uppercase tracking-[0.3em] text-[var(--hv-sage)]">Encrypted session</p>
      <h3 className="mt-3 text-xl font-semibold text-[var(--hv-ink)]">Low bandwidth WebRTC room</h3>
      <p className="mt-2 text-sm text-[var(--hv-sage)]">
        Use the manual offer/answer exchange if no signaling server is available.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-[var(--hv-ink)]">
          <input
            type="checkbox"
            checked={audioOnly}
            onChange={(event) => setAudioOnly(event.target.checked)}
          />
          Audio only
        </label>
        <button
          className="rounded-full bg-[var(--hv-forest)] px-4 py-2 text-sm font-semibold text-white"
          onClick={startLocal}
          type="button"
        >
          Start media
        </button>
        <button
          className="rounded-full border border-[var(--hv-forest)] px-4 py-2 text-sm font-semibold text-[var(--hv-forest)]"
          onClick={handleCreateOffer}
          type="button"
        >
          Create offer
        </button>
      </div>

      {status && <p className="mt-3 text-sm text-[var(--hv-ember)]">{status}</p>}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--hv-sage)]">Local</p>
          <video ref={localVideoRef} autoPlay playsInline muted className="mt-2 w-full rounded-2xl bg-black" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--hv-sage)]">Remote</p>
          <video ref={remoteVideoRef} autoPlay playsInline className="mt-2 w-full rounded-2xl bg-black" />
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--hv-sage)]">Offer</p>
          <textarea
            className="mt-2 min-h-[120px] w-full rounded-2xl border border-[var(--hv-mist)] bg-white px-4 py-3 text-xs"
            value={offer}
            onChange={(event) => setOffer(event.target.value)}
          />
          <button
            className="mt-2 rounded-full border border-[var(--hv-forest)] px-4 py-2 text-xs font-semibold text-[var(--hv-forest)]"
            onClick={() => handleApplyOffer(offer)}
            type="button"
          >
            Apply offer
          </button>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--hv-sage)]">Answer</p>
          <textarea
            className="mt-2 min-h-[120px] w-full rounded-2xl border border-[var(--hv-mist)] bg-white px-4 py-3 text-xs"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
          />
          <button
            className="mt-2 rounded-full border border-[var(--hv-forest)] px-4 py-2 text-xs font-semibold text-[var(--hv-forest)]"
            onClick={() => handleApplyAnswer(answer)}
            type="button"
          >
            Apply answer
          </button>
        </div>
      </div>
    </div>
  );
}

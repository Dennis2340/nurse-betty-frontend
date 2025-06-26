'use client';

import { useEffect, useState } from 'react';
import { RealtimeAgent, RealtimeSession } from '@openai/agents-realtime';
import { nurseBettyVoice } from '@/lib/nurseBetty';
import axios from 'axios';

export default function Home() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [status, setStatus] = useState('Click "Start Session" to begin.');
  const [agentState, setAgentState] = useState<'listening' | 'processing' | 'speaking'>('listening');
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<RealtimeSession | null>(null);

  const startSession = async () => {
    try {
      setStatus('Initializing...');
      setError(null);

      // Create a new session
      const { data } = await axios.post('/api/session');
      setSessionId(data.sessionId);

      // Generate ephemeral token
      const { data: tokenData } = await axios.post('/api/generate-token', { sessionId: data.sessionId });

      // Create a session
      const newSession = new RealtimeSession(nurseBettyVoice, {
        model: 'gpt-4o-realtime-preview-2025-06-03',
        config: {
          inputAudioFormat: 'pcm16',
          outputAudioFormat: 'pcm16',
          inputAudioTranscription: { model: 'gpt-4o-mini-transcribe' },
        },
      });

      // Connect to the session
      await newSession.connect({ apiKey: tokenData.token });
      setSession(newSession);
      setStatus('Nurse Betty is ready to listen! Speak to start.');

      // Handle interruptions
      newSession.on('audio_interrupted', () => {
        console.log('User interrupted Nurse Betty.');
      });

      // Handle tool calls and responses
      //@ts-ignore
      newSession.on('tool_call', () => {
        setAgentState('processing');
        setStatus('Nurse Betty is thinking...');
      });

      //@ts-ignore
      newSession.on('tool_response', () => {
        setAgentState('speaking');
        setStatus('Nurse Betty is speaking...');
        // Transition back to listening after a delay to simulate speaking duration
        setTimeout(() => {
          setAgentState('listening');
          setStatus('Nurse Betty is ready to listen! Speak to start.');
        }, 2000); // Adjust delay as needed
      });

    } catch (error) {
      console.error('Error initializing session:', error);
      setError('Failed to initialize session. Please try again.');
      setStatus('');
      setSession(null);
    }
  };

  const endSession = async () => {
    if (session) {
      try {
        // Assuming RealtimeSession has a disconnect method; adjust if different
        await session.close?.();
      } catch (error) {
        console.error('Error disconnecting session:', error);
      }
      setSession(null);
      setSessionId(null);
      setAgentState('listening');
      setStatus('Click "Start Session" to begin.');
      setError(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-gray-100 flex flex-col items-center justify-center p-4">
      <style jsx>{`
        @keyframes ripple {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          100% {
            transform: scale(2.4);
            opacity: 0;
          }
        }
        .ripple {
          position: relative;
          width: 64px;
          height: 64px;
        }
        .ripple span {
          position: absolute;
          border: 4px solid #3b82f6;
          border-radius: 50%;
          animation: ripple 1.2s ease-out infinite;
        }
        .ripple span:nth-child(2) {
          animation-delay: 0.3s;
        }
        .ripple span:nth-child(3) {
          animation-delay: 0.6s;
        }
        .avatar-speaking {
          animation: pulse 0.5s ease-in-out infinite alternate;
        }
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.05);
          }
        }
      `}</style>
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-blue-600">AIDARA</h1>
        <p className="text-lg text-gray-700">Your AI Healthcare Assistant</p>
      </header>
      <main className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">Nurse Betty</h2>
        <img
          src="/nurse-betty-avatar.jpg"
          alt="Nurse Betty Avatar"
          className={`w-24 h-24 mx-auto mb-4 rounded-full border-2 border-blue-200 ${
            agentState === 'speaking' ? 'avatar-speaking' : ''
          }`}
        />
        {error && (
          <div className="mb-4">
            <p className="text-red-500">{error}</p>
            <button
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              onClick={startSession}
            >
              Retry
            </button>
          </div>
        )}
        <p className="text-lg mb-4 text-gray-800">{status} {sessionId && `Session: ${sessionId}`}</p>
        <p className="text-sm text-gray-600 mb-4">
          Speak to Nurse Betty! Try saying: "I have a headache and fever."
        </p>
        <div className="flex justify-center mb-4">
          {session ? (
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              onClick={endSession}
            >
              End Session
            </button>
          ) : (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              onClick={startSession}
            >
              Start Session
            </button>
          )}
        </div>
        <div className="flex justify-center">
          {agentState === 'processing' ? (
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          ) : agentState === 'speaking' ? (
            <div className="ripple">
              <span></span>
              <span></span>
              <span></span>
            </div>
          ) : (
            <svg
              className="w-12 h-12 text-blue-600 animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          )}
        </div>
      </main>
    </div>
  );
}
'use client';

import { useSession } from 'next-auth/react';

export function SessionDebug() {
  const { status, data: session } = useSession();
  
  return (
    <div className="fixed bottom-4 right-4 p-4 bg-black/80 text-white rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Session Debug</h3>
      <div>Status: <span className={
        status === 'authenticated' ? 'text-green-400' : 
        status === 'loading' ? 'text-yellow-400' : 'text-red-400'
      }>{status}</span></div>
      {status === 'authenticated' && session?.user && (
        <div className="mt-2">
          <div>User: {session.user.name || session.user.email}</div>
          {session.user.email && <div>Email: {session.user.email}</div>}
          <div className="mt-2 opacity-70">Session Data:</div>
          <pre className="overflow-auto max-h-40 text-[10px] opacity-70">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
      )}
      {status === 'unauthenticated' && (
        <div className="text-red-300 mt-2">No active session</div>
      )}
    </div>
  );
}
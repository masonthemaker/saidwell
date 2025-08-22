'use client';

interface TestCredentialsProps {
  onFillCredentials: (email: string, password: string) => void;
}

export default function TestCredentials({ onFillCredentials }: TestCredentialsProps) {
  return (
    <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
      <h3 className="text-sm font-medium text-blue-300 mb-3">🧪 Test Credentials</h3>
      <p className="text-xs text-blue-200/70 mb-4">
        Use these credentials to test both company and client login flows:
      </p>
      
      <div className="space-y-2">
        <button
          onClick={() => onFillCredentials('mason.adams38@gmail.com', 'your-password')}
          className="w-full text-left p-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/40 rounded-lg transition-all duration-300"
        >
          <div className="text-sm font-medium text-blue-200">Mason Adams (Multi-Access)</div>
          <div className="text-xs text-blue-200/70">
            Company: TechCorp Solutions (admin) + Client: Acme Manufacturing (admin)
          </div>
        </button>
      </div>

      <div className="mt-3 text-xs text-blue-200/60">
        <strong>Expected Flow:</strong> Login → Context Selection → Company or Client Dashboard
      </div>
    </div>
  );
}

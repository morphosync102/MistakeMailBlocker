import { Shield, X, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';

interface ConfirmModalProps {
  onNext: () => void;
  onCancel: () => void;
  toAddresses: string[];
  ccAddresses: string[];
  bccAddresses: string[];
  bodyPreview: string;
  lineCount: number;
}

export function ConfirmModal({
  onNext,
  onCancel,
  toAddresses,
  ccAddresses,
  bccAddresses,
  bodyPreview,
  lineCount,
}: ConfirmModalProps) {
  const [securityCode, setSecurityCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    // Generate 4-digit random code
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setSecurityCode(code);
  }, []);

  const totalRecipients = toAddresses.length + ccAddresses.length + bccAddresses.length;
  const isCodeValid = inputCode.length === 4 && inputCode === securityCode;
  const hasInput = inputCode.length > 0;

  const handleInputChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    setInputCode(digits);
    setShowError(false);
  };

  const handleSubmit = () => {
    if (isCodeValid) {
      onNext();
    } else if (hasInput) {
      setShowError(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[10000] animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[85vh] flex flex-col animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">セキュリティコード入力</h2>
            <p className="text-sm text-gray-500 mt-0.5">送信前に確認してください</p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Email summary */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="text-xs font-medium text-gray-500 mb-1">宛先数</div>
              <div className="text-2xl font-semibold text-gray-900">{totalRecipients}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="text-xs font-medium text-gray-500 mb-1">行数</div>
              <div className="text-2xl font-semibold text-gray-900">{lineCount}</div>
            </div>
          </div>

          {/* Recipients */}
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">宛先</h3>
            <div className="bg-gray-50 rounded-lg border border-gray-200">
              {toAddresses.length > 0 && (
                <div className="p-3 border-b border-gray-200 last:border-b-0">
                  <div className="text-xs font-medium text-gray-500 mb-2">To</div>
                  <div className="flex flex-wrap gap-1.5">
                    {toAddresses.map((email, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-0.5 bg-white border border-gray-300 text-gray-700 text-xs rounded"
                      >
                        {email}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {ccAddresses.length > 0 && (
                <div className="p-3 border-b border-gray-200 last:border-b-0">
                  <div className="text-xs font-medium text-gray-500 mb-2">CC</div>
                  <div className="flex flex-wrap gap-1.5">
                    {ccAddresses.map((email, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-0.5 bg-white border border-gray-300 text-gray-700 text-xs rounded"
                      >
                        {email}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {bccAddresses.length > 0 && (
                <div className="p-3">
                  <div className="text-xs font-medium text-gray-500 mb-2">BCC</div>
                  <div className="flex flex-wrap gap-1.5">
                    {bccAddresses.map((email, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-0.5 bg-white border border-gray-300 text-gray-700 text-xs rounded"
                      >
                        {email}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Body preview */}
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">本文プレビュー</h3>
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-3 max-h-60 overflow-y-auto">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                {bodyPreview || '(本文なし)'}
              </pre>
            </div>
          </div>

          {/* Security code input */}
          <div className="bg-indigo-50 rounded-lg border border-indigo-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="size-5 text-indigo-600" />
              <h3 className="text-sm font-semibold text-gray-900">セキュリティ確認</h3>
            </div>

            <div className="bg-white rounded-lg p-4 mb-4 text-center border border-indigo-200">
              <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">コード</div>
              <div className="text-4xl font-bold text-indigo-600 tracking-[0.3em] font-mono">
                {securityCode}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                上記のコードを入力してください
              </label>
              <Input
                type="text"
                value={inputCode}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && isCodeValid) {
                    handleSubmit();
                  }
                }}
                placeholder="4桁のコード"
                maxLength={4}
                className={`text-center text-2xl font-mono tracking-wider transition-colors ${showError && !isCodeValid
                  ? 'border-red-400 focus-visible:ring-red-400'
                  : isCodeValid
                    ? 'border-green-500 focus-visible:ring-green-500'
                    : 'border-gray-300'
                  }`}
              />
              <div className="mt-2 min-h-[20px]">
                {isCodeValid && (
                  <p className="text-sm text-green-700 flex items-center gap-1.5">
                    <CheckCircle2 className="size-4" />
                    確認完了
                  </p>
                )}
                {showError && !isCodeValid && hasInput && (
                  <p className="text-sm text-red-600 flex items-center gap-1.5">
                    <XCircle className="size-4" />
                    コードが間違っています
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500">
            {!isCodeValid && <span>セキュリティコードを入力してください</span>}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel} className="min-w-[100px]">
              キャンセル
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isCodeValid}
              className="min-w-[100px] bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-gray-300 disabled:text-gray-500"
            >
              次へ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

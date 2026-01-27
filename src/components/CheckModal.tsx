import { AlertCircle, Mail, Paperclip, FileArchive, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';

interface CheckItem {
  id: string;
  label: string;
  value: React.ReactNode;
  isWarning: boolean;
  icon: React.ReactNode;
}

interface CheckModalProps {
  onNext: () => void;
  onCancel: () => void;
  fromAddress: string;
  toAddresses: string[];
  ccAddresses: string[];
  bccAddresses: string[];
  subject: string;
  hasAttachment: boolean;
  hasZipFile: boolean;
  bodyMentionsAttachment: boolean;
  attachments: string[];
}

export function CheckModal({
  onNext,
  onCancel,
  fromAddress,
  toAddresses,
  ccAddresses,
  bccAddresses,
  subject,
  hasAttachment,
  hasZipFile,
  bodyMentionsAttachment,
  attachments,
}: CheckModalProps) {
  const [acknowledgedWarnings, setAcknowledgedWarnings] = useState<Set<string>>(new Set());

  // Warning items
  const warnings: CheckItem[] = [];

  if (!subject.trim()) {
    warnings.push({
      id: 'no-subject',
      label: '件名が空です',
      value: '件名が設定されていません',
      isWarning: true,
      icon: <AlertCircle className="size-4" />,
    });
  }

  if (bodyMentionsAttachment && !hasAttachment) {
    warnings.push({
      id: 'missing-attachment',
      label: '添付忘れの可能性があります',
      value: '本文に添付に関する記述がありますが、ファイルがありません',
      isWarning: true,
      icon: <Paperclip className="size-4" />,
    });
  }

  if (hasAttachment) {
    let id = 'attachment';
    let label = '添付ファイル';
    let value: React.ReactNode;
    let icon = <Paperclip className="size-4" />;

    if (hasZipFile) {
      id = 'zip-file';
      label = 'ZIPファイルが添付されています';
      value = 'パスワードを設定したか確認してください。';
      icon = <FileArchive className="size-4" />;
    } else {
      value = (
        <>
          {attachments.map((name, i) => (
            <div key={i}>{name}</div>
          ))}
          <div>が添付されています。</div>
        </>
      );
    }

    warnings.push({
      id,
      label,
      value,
      isWarning: true,
      icon,
    });
  }

  // Normal check items
  const checkItems: CheckItem[] = [
    {
      id: 'from',
      label: '送信元',
      value: fromAddress,
      isWarning: false,
      icon: <User className="size-4" />,
    },
    {
      id: 'to',
      label: '宛先',
      value: toAddresses.length > 0 ? toAddresses.join(', ') : '(なし)',
      isWarning: false,
      icon: <Mail className="size-4" />,
    },
  ];

  if (ccAddresses.length > 0) {
    checkItems.push({
      id: 'cc',
      label: 'CC',
      value: ccAddresses.join(', '),
      isWarning: false,
      icon: <Mail className="size-4" />,
    });
  }

  if (bccAddresses.length > 0) {
    checkItems.push({
      id: 'bcc',
      label: 'BCC',
      value: bccAddresses.join(', '),
      isWarning: false,
      icon: <Mail className="size-4" />,
    });
  }

  checkItems.push({
    id: 'subject',
    label: '件名',
    value: subject || '(空)',
    isWarning: false,
    icon: <Mail className="size-4" />,
  });

  if (!hasAttachment) {
    checkItems.push({
      id: 'attachment',
      label: '添付ファイル',
      value: 'なし',
      isWarning: false,
      icon: <Paperclip className="size-4" />,
    });
  }

  const allWarningsAcknowledged = warnings.every(w => acknowledgedWarnings.has(w.id));
  const canProceed = warnings.length === 0 || allWarningsAcknowledged;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[10000] animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[85vh] flex flex-col animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">送信確認</h2>
            <p className="text-sm text-gray-500 mt-0.5">メール内容を確認してください</p>
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
          {/* Warnings section */}
          {warnings.length > 0 && (
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="size-4 text-amber-600" />
                <h3 className="text-sm font-semibold text-gray-900">注意点</h3>
              </div>
              <div className="space-y-2">
                {warnings.map(warning => (
                  <div
                    key={warning.id}
                    className="bg-amber-50 border border-amber-200 rounded-lg p-4"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="text-amber-700 mt-0.5">{warning.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900">{warning.label}</div>
                        <div className="text-sm text-gray-600 mt-0.5">{warning.value}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 pt-3 border-t border-amber-200">
                      <Checkbox
                        id={warning.id}
                        checked={acknowledgedWarnings.has(warning.id)}
                        onCheckedChange={(checked) => {
                          const newSet = new Set(acknowledgedWarnings);
                          if (checked) {
                            newSet.add(warning.id);
                          } else {
                            newSet.delete(warning.id);
                          }
                          setAcknowledgedWarnings(newSet);
                        }}
                        className="mt-0.5"
                      />
                      <label
                        htmlFor={warning.id}
                        className="text-sm text-gray-700 cursor-pointer select-none"
                      >
                        確認しました
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Email details section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">メール詳細</h3>
            <div className="space-y-2">
              {checkItems.map(item => (
                <div
                  key={item.id}
                  className="bg-gray-50 rounded-lg p-3.5 border border-gray-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-gray-400 mt-0.5">{item.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-500 mb-1">{item.label}</div>
                      <div className="text-sm text-gray-900 break-words leading-relaxed">{item.value}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500">
            {warnings.length > 0 && !allWarningsAcknowledged && (
              <span>全ての注意点を確認してください</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel} className="min-w-[100px]">
              キャンセル
            </Button>
            <Button
              onClick={onNext}
              disabled={!canProceed}
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

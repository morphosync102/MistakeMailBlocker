import { AlertTriangle, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FinalConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function FinalConfirmModal({ onConfirm, onCancel }: FinalConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[10000] animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">最終確認</h2>
            <p className="text-sm text-gray-500 mt-0.5">送信前の最後のステップです</p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          {/* Warning */}
          <div className="bg-amber-50 rounded-lg border border-amber-200 p-5 mb-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="size-5 text-amber-700" />
                </div>
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-base font-semibold text-gray-900 mb-1">
                  このメールを送信しますか？
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  この操作は取り消せません。最後にメールの内容を確認してください。
                </p>
              </div>
            </div>
          </div>

          {/* Checklist reminder */}
          <div className="space-y-2.5 mb-6">
            <div className="flex items-center gap-2.5 text-sm text-gray-700">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0"></div>
              <span>宛先は正しいですか？</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-gray-700">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0"></div>
              <span>本文の内容は正しいですか？</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-gray-700">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0"></div>
              <span>添付ファイルは正しいですか？</span>
            </div>
          </div>

          {/* Info note */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <p className="text-xs text-gray-600 text-center leading-relaxed">
              送信すると、すべての宛先に即座に配信されます。
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-2 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <Button
            size="lg"
            onClick={onConfirm}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
          >
            <Send className="size-4 mr-2" />
            送信する
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={onCancel}
            className="w-full"
          >
            戻る
          </Button>
        </div>
      </div>
    </div>
  );
}

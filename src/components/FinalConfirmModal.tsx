import React from 'react';

interface FinalConfirmModalProps {
    onBack: () => void;
    onCancel: () => void;
    onSend: () => void;
}

export const FinalConfirmModal: React.FC<FinalConfirmModalProps> = ({
    onBack,
    onCancel,
    onSend,
}) => {
    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-content max-w-md" onClick={(e) => e.stopPropagation()}>
                <div className="bg-red-600 text-white p-6">
                    <h2 className="text-2xl font-bold">最終確認</h2>
                </div>

                <div className="p-8 text-center">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">本当によろしいですか？</h3>
                    <p className="text-gray-600">
                        「送信」ボタンを押すと、メールが直ちに送信されます。<br />
                        取り消しはできません。
                    </p>
                </div>

                <div className="border-t border-gray-200 p-6 flex justify-between bg-gray-50">
                    <button onClick={onBack} className="btn btn-secondary">
                        戻る
                    </button>
                    <div className="flex gap-3">
                        <button onClick={onCancel} className="btn btn-secondary">
                            キャンセル
                        </button>
                        <button
                            onClick={onSend}
                            className="btn btn-danger w-32 font-bold"
                        >
                            送信する
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

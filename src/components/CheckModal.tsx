import React, { useState } from 'react';
import { CheckResults } from '../types';
import { CheckItem } from './CheckItem';

interface CheckModalProps {
    checkResults: CheckResults;
    onCancel: () => void;
    onNext: () => void;
}

export const CheckModal: React.FC<CheckModalProps> = ({
    checkResults,
    onCancel,
    onNext,
}) => {
    const [senderChecked, setSenderChecked] = useState(false);
    const [recipientsChecked, setRecipientsChecked] = useState(false);
    const [attachmentsChecked, setAttachmentsChecked] = useState(false);

    // 次へボタンの有効/無効を判定
    const canProceed =
        !checkResults.subject.checkboxRequired && // 件名エラーがない
        (!checkResults.sender.checkboxRequired || senderChecked) &&
        (!checkResults.recipients.checkboxRequired || recipientsChecked) &&
        (!checkResults.attachments.checkboxRequired || attachmentsChecked);

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {/* ヘッダー */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                    <h2 className="text-2xl font-bold">誤送信防止 - チェック</h2>
                    <p className="text-blue-100 text-sm mt-1">送信前に以下の項目を確認してください</p>
                </div>

                {/* コンテンツ */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                    {/* 送信元 */}
                    <CheckItem
                        title="送信元"
                        result={checkResults.sender}
                        onCheckChange={setSenderChecked}
                        checked={senderChecked}
                    />

                    {/* 送信先 */}
                    <CheckItem
                        title="送信先"
                        result={checkResults.recipients}
                        details={
                            <div>
                                {checkResults.externalRecipients.length > 0 ? (
                                    <div className="mb-3">
                                        <div className="font-semibold text-xs text-gray-500 mb-1">宛先一覧:</div>
                                        <div className="text-gray-700">
                                            {checkResults.externalRecipients.map((r, i) => (
                                                <div key={i}>
                                                    {r.name}
                                                    <br />
                                                    <span className="text-xs text-gray-500">({r.email})</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-gray-500">（宛先なし）</div>
                                )}
                            </div>
                        }
                        onCheckChange={setRecipientsChecked}
                        checked={recipientsChecked}
                    />

                    {/* 件名 */}
                    <CheckItem
                        title="件名"
                        result={checkResults.subject}
                    />

                    {/* 添付ファイル */}
                    <CheckItem
                        title="添付ファイル"
                        result={checkResults.attachments}
                        onCheckChange={setAttachmentsChecked}
                        checked={attachmentsChecked}
                    />
                </div>

                {/* フッター */}
                <div className="border-t border-gray-200 p-6 flex justify-end gap-3 bg-gray-50">
                    <button onClick={onCancel} className="btn btn-secondary">
                        送信キャンセル
                    </button>
                    <button
                        onClick={onNext}
                        className="btn btn-primary"
                        disabled={!canProceed}
                    >
                        次へ
                    </button>
                </div>
            </div>
        </div>
    );
};

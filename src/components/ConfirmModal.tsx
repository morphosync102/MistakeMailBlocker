import React, { useState } from 'react';
import { CheckResults, EmailData } from '../types';
import { getTimeBasedColor } from '../utils';

interface ConfirmModalProps {
    checkResults: CheckResults;
    emailData: EmailData;
    sendCode: string;
    onBack: () => void;
    onCancel: () => void;
    onSend: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    checkResults,
    emailData,
    sendCode,
    onBack,
    onCancel,
    onSend,
}) => {
    const [inputCode, setInputCode] = useState('');

    const hasExternal = checkResults.hasExternalRecipients;
    const canSend = !hasExternal || inputCode === sendCode;

    const timeColor = getTimeBasedColor();

    // 本文の行数を計算
    const bodyLines = emailData.body.split('\n').length;

    const bodyMessage =
        !emailData.body ? '本文がありません。' :
            bodyLines >= 100 ? `本文が ${bodyLines}行あります。返信が延々と残っている可能性があります。` :
                `本文は ${bodyLines}行あります。`;

    const bodyTextColor =
        !emailData.body || bodyLines >= 100 ? 'text-orange-600' : 'text-gray-600';

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {/* ヘッダー - 時間帯による色分け */}
                <div className={`${timeColor} text-white  p-6`}>
                    <h2 className="text-2xl font-bold">誤送信防止 - 最終確認</h2>
                    <p className="text-white text-opacity-90 text-sm mt-1">
                        本当に送信してよろしいですか？
                    </p>
                </div>

                {/* コンテンツ */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                    {/* 警告メッセージ */}
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                        <p className="text-yellow-800 font-semibold">⚠️ 送信前の最終確認</p>
                        <p className="text-yellow-700 text-sm mt-1">
                            宛先と本文を再度確認してください
                        </p>
                    </div>

                    {/* メール内容サマリー */}
                    <div className="section-box">
                        <div className="space-y-3 text-sm">
                            <div>
                                <span className={bodyTextColor}>{bodyMessage}</span>
                            </div>

                            <div>
                                <span className="font-semibold text-gray-700">宛先) </span>
                                <span className="text-gray-700">
                                    {checkResults.externalRecipients.length > 0
                                        ? checkResults.externalRecipients.map(r => r.name).join('; ')
                                        : 'なし'}
                                </span>
                            </div>

                            <div>
                                <span className="font-semibold text-gray-700">件名) </span>
                                <span className="text-gray-600">{emailData.subject}</span>
                            </div>
                        </div>
                    </div>

                    {/* 本文プレビュー */}
                    <div className="section-box">
                        <div className="font-semibold text-gray-700 mb-2">本文プレビュー:</div>
                        <div className="bg-gray-50 p-3 rounded text-sm max-h-48 overflow-y-auto whitespace-pre-wrap text-gray-700">
                            {emailData.body || '(本文なし)'}
                        </div>
                    </div>

                    {/* 送信コード入力 (社外向けの場合のみ) */}
                    {hasExternal && (
                        <div className="section-box bg-blue-50 border-blue-200">
                            <div className="mb-3">
                                <div className="font-semibold text-blue-900 mb-2">
                                    🔐 送信コード: <span className="text-2xl font-mono tracking-wider">{sendCode}</span>
                                </div>
                                <p className="text-sm text-blue-700">
                                    上記の4桁の数字を入力してください
                                </p>
                            </div>

                            <input
                                type="text"
                                value={inputCode}
                                onChange={(e) => setInputCode(e.target.value)}
                                placeholder="送信コードを入力"
                                maxLength={4}
                                className="w-full px-4 py-2 border-2 border-blue-300 rounded-lg text-center text-2xl font-mono tracking-widest focus:outline-none focus:border-blue-500"
                                autoFocus
                            />
                        </div>
                    )}
                </div>

                {/* フッター */}
                <div className="border-t border-gray-200 p-6 flex justify-between bg-gray-50">
                    <button onClick={onBack} className="btn btn-secondary">
                        戻る
                    </button>
                    <div className="flex gap-3">
                        <button onClick={onCancel} className="btn btn-secondary">
                            送信キャンセル
                        </button>
                        <button
                            onClick={onSend}
                            className="btn btn-danger"
                            disabled={!canSend}
                        >
                            送信
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

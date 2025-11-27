import React from 'react';
import { ValidationResult } from '../types';

interface CheckItemProps {
    title: string;
    result: ValidationResult;
    details?: React.ReactNode;
    onCheckChange?: (checked: boolean) => void;
    checked?: boolean;
}

export const CheckItem: React.FC<CheckItemProps> = ({
    title,
    result,
    details,
    onCheckChange,
    checked = false,
}) => {
    const statusClass =
        result.status === 'ok' ? 'status-ok' :
            result.status === 'warning' ? 'status-warning' :
                'status-error';

    const statusText =
        result.status === 'ok' ? 'OK' :
            result.status === 'warning' ? '注意' :
                'エラー';

    return (
        <div className="section-box">
            <div className="flex items-start gap-3 mb-2">
                <span className={`status-badge ${statusClass}`}>
                    {statusText}
                </span>
                <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-1">{title}</h3>
                    <p className={`text-sm whitespace-pre-wrap ${result.status === 'warning' ? 'text-orange-600' :
                            result.status === 'error' ? 'text-red-600' :
                                'text-gray-600'
                        }`}>
                        {result.message}
                    </p>
                </div>
            </div>

            {details && (
                <div className="mt-3 p-3 bg-gray-50 rounded text-sm max-h-32 overflow-y-auto">
                    {details}
                </div>
            )}

            {result.checkboxRequired && onCheckChange && (
                <label className="flex items-center gap-2 mt-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => onCheckChange(e.target.checked)}
                        className="w-4 h-4 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700">確認しました</span>
                </label>
            )}
        </div>
    );
};

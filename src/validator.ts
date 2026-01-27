import { EmailData, CheckResults, Recipient } from './types';

/**
 * メールデータを検証して結果を返す
 */
export function validateEmail(emailData: EmailData): CheckResults {
    const externalRecipients: Recipient[] = [];
    const internalRecipients: Recipient[] = []; // Personal use: Unused, kept for type compatibility
    const domains = new Set<string>();

    // 全ての宛先をチェック対象(external扱い)とする
    emailData.recipients.forEach(recipient => {
        externalRecipients.push(recipient);
        domains.add(recipient.domain);
    });

    const hasExternal = externalRecipients.length > 0;

    // 送信元チェック (個人利用なので常にOK、確認のみ)
    const senderCheck = {
        status: 'ok' as const,
        message: `送信元: ${emailData.sender}\n正しいアカウントから送信していますか？`,
        checkboxRequired: true, // 念のためチェックさせる
    };

    // 送信先チェック
    const recipientsCheck = {
        status: 'warning' as const, // 注意を促すためwarning
        message: '宛先を確認してください',
        checkboxRequired: true,
    };

    // 件名チェック
    const subjectCheck = {
        status: emailData.subject ? 'ok' as const : 'error' as const,
        message: emailData.subject || '件名がありません。',
        checkboxRequired: false,
    };

    // 添付ファイルチェック
    let attachmentsCheck;

    if (emailData.hasAttachmentKeywords && emailData.attachments.length === 0) {
        // 添付の言葉があるのにファイルがない
        attachmentsCheck = {
            status: 'warning' as const,
            message: '件名や本文に"添付"や"attached"、"attachment"の言葉がありますが、添付ファイルがありません。',
            checkboxRequired: true,
        };
    } else if (emailData.attachments.length > 0) {
        // 添付ファイルあり (中身を確認させるためにwarningにする)
        const hasZip = emailData.attachments.some(f => f.toLowerCase().endsWith('.zip'));
        const suffix = hasZip
            ? '\nZIPファイルが添付されています。パスワードを設定したか確認してください。'
            : 'が添付されています。';

        attachmentsCheck = {
            status: 'warning' as const,
            message: emailData.attachments.join('\n') + suffix,
            checkboxRequired: true,
        };
    } else {
        // 添付ファイルなし
        attachmentsCheck = {
            status: 'ok' as const,
            message: 'ファイルは添付されていません',
            checkboxRequired: false,
        };
    }

    return {
        sender: senderCheck,
        recipients: recipientsCheck,
        subject: subjectCheck,
        attachments: attachmentsCheck,
        hasExternalRecipients: hasExternal, // Always true if there are recipients
        externalRecipients,
        internalRecipients,
        domains: Array.from(domains),
    };
}

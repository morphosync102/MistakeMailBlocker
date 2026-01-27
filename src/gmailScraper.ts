import { EmailData, Recipient } from './types';
import { extractDomain, hasAttachmentKeywords } from './utils';

/**
 * Gmailの作成画面からメールデータを抽出
 */
export function extractEmailData(): EmailData | null {
    try {
        // 送信元の取得
        const sender = extractSender();

        // 送信先の取得
        const recipients = extractRecipients();

        // 件名の取得
        const subject = extractSubject();

        // 本文の取得
        const body = extractBody();

        // 添付ファイルの取得
        const attachments = extractAttachments();

        return {
            sender,
            recipients,
            subject,
            body,
            attachments,
            hasAttachmentKeywords: hasAttachmentKeywords(subject + ' ' + body),
            hasZipFiles: attachments.some(f => f.toLowerCase().endsWith('.zip')),
        };
    } catch (error) {
        console.error('メールデータの抽出に失敗しました:', error);
        return null;
    }
}

/**
 * 送信元メールアドレスを抽出
 */
function extractSender(): string {
    const fromField = document.querySelector('[name="from"]') as HTMLInputElement;
    if (fromField && fromField.value) {
        return fromField.value;
    }

    // name="from"がない場合（エイリアスがない場合など）、タイトルバーやその他の場所から探す
    // 一般的なGmailのtitleは "Subject - AccountEmail - Gmail" となっていることが多いが不確実
    // データ属性を探す
    // 基本的には name="from" があるはずだが、ない場合は "自分" として扱うか、空文字
    return '（取得できませんでした）';
}

/**
 * 送信先メールアドレスを抽出
 */
function extractRecipients(): Recipient[] {
    const recipients: Recipient[] = [];

    // To, Cc, Bccのフィールドを取得
    const recipientFields = [
        { selector: '[name="to"]', type: 'to' },
        { selector: '[name="cc"]', type: 'cc' },
        { selector: '[name="bcc"]', type: 'bcc' },
    ];

    recipientFields.forEach(({ selector }) => {
        const field = document.querySelector(selector);
        if (!field) return;

        // Gmailの送信先要素を取得
        // [email]属性または [data-hovercard-id]属性を持つ要素を探す
        const recipientElements = field.querySelectorAll('[email], [data-hovercard-id]');

        recipientElements.forEach((elem) => {
            const email = elem.getAttribute('email') || elem.getAttribute('data-hovercard-id') || '';
            const name = elem.getAttribute('name') || elem.textContent?.trim() || '';

            if (email && email.includes('@')) { // 簡単なバリデーション追加
                // 重複チェック
                const isDuplicate = recipients.some(r => r.email === email);
                if (!isDuplicate) {
                    recipients.push({
                        email,
                        name: name || email,
                        isInternal: false, // Personal use: always external
                        domain: extractDomain(email),
                    });
                }
            }
        });
    });

    return recipients;
}

/**
 * 件名を抽出
 */
function extractSubject(): string {
    const subjectField = document.querySelector('[name="subjectbox"]') as HTMLInputElement;
    return subjectField?.value || '';
}

/**
 * 本文を抽出
 */
function extractBody(): string {
    // Gmailの本文エディタ
    const bodyField = document.querySelector('[g_editable="true"]') as HTMLElement;
    return bodyField?.innerText || bodyField?.textContent || '';
}

/**
 * 添付ファイル名を抽出
 */
function extractAttachments(): string[] {
    const attachments: string[] = [];

    // 添付ファイル表示エリア
    // .vI は添付ファイルチップのクラス
    // [data-tooltip*="添付"] は広すぎるため、ボタンを除外する
    const attachmentElements = document.querySelectorAll('.vI, [data-tooltip*="添付"]:not([role="button"]), [aria-label*="添付"]:not([role="button"])');

    attachmentElements.forEach((elem) => {
        let filename = elem.getAttribute('data-tooltip') ||
            elem.getAttribute('aria-label') ||
            elem.textContent?.trim();

        // 不要な文字列を除外
        if (filename === 'ファイルを添付' || filename === 'Attach files') {
            return;
        }

        // サイズ情報などが含まれる場合があるため、簡易的なクリーニング（必要であれば）
        // Gmailの添付ファイルチップは通常 filename (size) のような形式ではないが、
        // aria-labelには "ファイル名.pdf プレビュー" のような余計な文字が入る可能性がある

        if (filename && !attachments.includes(filename)) {
            // 明らかにボタンっぽい文言は除外
            if (filename.includes('添付') && filename.length < 10 && !filename.includes('.')) {
                return;
            }

            // ゴミ掃除: "添付ファイルを表示するには..." などのアクセシビリティテキストを削除
            // 例: "1-ポートフォリオ.txt。添付ファイルを表示するには Enter キーを..."
            let cleanName = filename.split('添付ファイルを表示するには')[0]
                .split('To view the attachment')[0] // 英語対応
                .trim()
                .replace(/[。\.]$/, ''); // 末尾の句点などを削除

            // 先頭の "添付ファイル " を削除
            cleanName = cleanName.replace(/^添付ファイル\s*/, '');

            if (cleanName && !attachments.includes(cleanName)) {
                attachments.push(cleanName);
            }
        }
    });

    return attachments;
}

/**
 * 送信ボタンを見つける
 */
export function findSendButton(): HTMLElement | null {
    // Gmailの送信ボタンのセレクタ（複数パターン対応）
    const selectors = [
        '[role="button"][data-tooltip*="送信"]',
        '[role="button"][aria-label*="送信"]',
        '[role="button"][data-tooltip*="Send"]',
        '[role="button"][aria-label*="Send"]',
        '.T-I.J-J5-Ji.aoO.v7.T-I-atl.L3',
    ];

    for (const selector of selectors) {
        const button = document.querySelector(selector) as HTMLElement;
        if (button) return button;
    }

    return null;
}

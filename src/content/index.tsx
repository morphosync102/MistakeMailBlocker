import React from 'react';
import ReactDOM from 'react-dom/client';
import { ModalManager } from '../components/ModalManager';
import { extractEmailData, findSendButton } from '../gmailScraper';
import '../styles.css';

let isIntercepting = false;
let allowSend = false; // 送信許可フラグ

/**
 * 送信ボタンのクリックをインターセプト
 */
function interceptSendButton() {
    if (isIntercepting) return;

    const sendButton = findSendButton();
    if (!sendButton) {
        console.log('Gmail mistake blocker: 送信ボタンが見つかりませんでした');
        return;
    }

    console.log('Gmail mistake blocker: 送信ボタンを監視中');
    isIntercepting = true;

    // 送信ボタンのクリックイベントをキャプチャフェーズでインターセプト
    sendButton.addEventListener('click', handleSendClick, true);
}

/**
 * 送信ボタンのクリックハンドラ
 */
function handleSendClick(event: MouseEvent) {
    // 送信が許可されている場合はスルー
    if (allowSend) {
        console.log('Gmail mistake blocker: 送信を許可');
        allowSend = false; // フラグをリセット
        return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    console.log('Gmail mistake blocker: 送信ボタンがクリックされました');

    // メールデータを抽出
    const emailData = extractEmailData();
    if (!emailData) {
        alert('メールデータの取得に失敗しました。通常の送信を試みます。');
        proceedWithSend();
        return;
    }

    // モーダルを表示
    showModal(emailData);
}

/**
 * モーダルを表示
 */
function showModal(emailData: any) {
    // モーダル用のコンテナを作成
    const modalContainer = document.createElement('div');
    modalContainer.id = 'gmail-mistake-blocker-modal';
    document.body.appendChild(modalContainer);

    const root = ReactDOM.createRoot(modalContainer);

    const handleSend = () => {
        root.unmount();
        modalContainer.remove();
        proceedWithSend();
    };

    const handleCancel = () => {
        root.unmount();
        modalContainer.remove();
        console.log('Gmail mistake blocker: 送信がキャンセルされました');
    };

    root.render(
        <React.StrictMode>
            <ModalManager
                emailData={emailData}
                onSend={handleSend}
                onCancel={handleCancel}
            />
        </React.StrictMode>
    );
}

/**
 * 実際にメールを送信
 */
function proceedWithSend() {
    console.log('Gmail mistake blocker: メール送信を実行します');

    const sendButton = findSendButton();
    if (!sendButton) {
        alert('送信ボタンが見つかりませんでした');
        return;
    }

    // 送信許可フラグを立てる
    allowSend = true;

    // 送信ボタンをクリック
    setTimeout(() => {
        sendButton.click();
    }, 100);
}

/**
 * DOMの変更を監視して送信ボタンが追加されたらインターセプト
 */
function observeGmail() {
    const observer = new MutationObserver((_mutations) => {
        if (!isIntercepting) {
            interceptSendButton();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // 初回実行
    interceptSendButton();
}

// ページ読み込み完了後に実行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeGmail);
} else {
    observeGmail();
}

console.log('Gmail mistake blocker: 初期化完了');

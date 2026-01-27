/* global Office */

/**
 * Handle the OnSend event.
 * @param event The OnSend event object.
 */
function onItemSend(event: Office.AddinCommands.Event) {
    // Show the dialog
    const url = new URL('dialog.html', window.location.href).toString();

    // Dialog options
    const options: Office.DialogOptions = {
        height: 60,
        width: 50,
        displayInIframe: true // Recommended for modern Outlook behavior
    };

    Office.context.ui.displayDialogAsync(url, options, (result) => {
        if (result.status === Office.AsyncResultStatus.Failed) {
            console.error('Failed to open dialog:', result.error.message);
            event.completed({ allowEvent: false }); // Block send on error
            return;
        }

        const dialog = result.value;

        // Message handler from the dialog
        dialog.addEventHandler(Office.EventType.DialogMessageReceived, (arg: any) => {
            const message = arg.message;
            if (message === 'ALLOW_SEND') {
                dialog.close();
                event.completed({ allowEvent: true });
            } else if (message === 'CANCEL_SEND') {
                dialog.close();
                event.completed({ allowEvent: false });
            }
        });

        // Event handler for dialog close (e.g. user clicks X)
        dialog.addEventHandler(Office.EventType.DialogEventReceived, () => {
            // Check if errors, but generally if closed without 'ALLOW_SEND', we block.
            // However, native close (X button) should probably count as Cancel.
            // event.completed({ allowEvent: false });
            // Note: If the user closes the dialog manually, we can't easily trigger event.completed from here unless we strove state?
            // Actually, if the dialog is closed, we must call event.completed eventually.
            // But onItemSend has a timeout (approx 5 mins).
            // Proper way: treat close as cancel.
            event.completed({ allowEvent: false });
        });
    });
}

// Register the function
Office.actions.associate('onItemSend', onItemSend);

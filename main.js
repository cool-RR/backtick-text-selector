module.exports = class BacktickTextSelector extends require('obsidian').Plugin {
    onload() {
        console.log("Loading backtick-text-selector");
        this.addCommands();
    }

    onunload() {
        console.log("Unloading backtick-text-selector");
        // No specific unload actions needed
    }

    addCommands() {
        this.addCommand({
            id: 'select-next-backtick',
            name: 'Select next backtick text',
            hotkeys: [
                {
                    modifiers: ["Alt"],
                    key: "'",
                }
            ],
            editorCallback: (editor) => {
                this.selectBacktickText(editor, 'next');
            }
        });

        this.addCommand({
            id: 'select-previous-backtick',
            name: 'Select previous backtick text',
            hotkeys: [
                {
                    modifiers: ["Alt", "Shift"],
                    key: "\"",
                }
            ],
            editorCallback: (editor) => {
                this.selectBacktickText(editor, 'previous');
            }
        });
    }

    selectBacktickText(editor, direction) {
        const cursor = editor.getCursor();
        const cursorOffset = editor.posToOffset(cursor);
        const text = editor.getValue();

        // Updated regex to match both inline code and code fences
        const regex = /(`{1,3})([\s\S]*?[^`])\1/g;
        let match;
        const matches = [];

        while ((match = regex.exec(text)) !== null) {
            const backtickCount = match[1].length;
            const startOffset = match.index + backtickCount;
            const endOffset = match.index + match[0].length - backtickCount;
            matches.push({ startOffset, endOffset });
        }

        let targetMatch = null;

        if (direction === 'next') {
            targetMatch = matches.find(m => m.startOffset > cursorOffset);
        } else {
            // For previous, find the last match before the cursor
            for (let i = matches.length - 1; i >= 0; i--) {
                if (matches[i].endOffset < cursorOffset) {
                    targetMatch = matches[i];
                    break;
                }
            }
        }

        if (targetMatch) {
            const from = editor.offsetToPos(targetMatch.startOffset);
            const to = editor.offsetToPos(targetMatch.endOffset);
            editor.setSelection(from, to);
        } else {
            // Optional: Notify the user if no match is found
            new Notice("No matching backtick text found.");
        }
    }
};

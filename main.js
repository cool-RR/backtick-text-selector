// main.js
module.exports = class BacktickTextSelector extends require('obsidian').Plugin {
    onload() {
        console.log("Loading backtick-text-selector");
        this.addCommands();
    }

    onunload() {
        console.log("Unloading backtick-text-selector");
    }

    addCommands() {
        this.addCommand({
            id: 'select-next-backtick',
            name: 'Select Next Backtick Text',
            hotkeys: [
                {
                    modifiers: ["Alt"],
                    key: "\'",
                }
            ],
            editorCallback: (editor) => {
                this.selectBacktickText(editor, 'next');
            }
        });

        this.addCommand({
            id: 'select-previous-backtick',
            name: 'Select Previous Backtick Text',
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

    getBacktickSpans(text) {
        const regex = /`([^`]+)`/g;
        let match;
        const spans = [];

        while ((match = regex.exec(text)) !== null) {
            spans.push([match.index + 1, match.index + match[0].length - 1]);
        }

        return spans;
    }

    selectBacktickText(editor, direction) {
        const doc = editor;
        const cursor = doc.getCursor();
        const text = doc.getValue();
        const cursorPos = doc.posToOffset(cursor);
        const spans = this.getBacktickSpans(text);

        let index;
        if (direction === 'next') {
            index = spans.findIndex(span => span[0] > cursorPos);
        } else {
            index = spans.slice().reverse().findIndex(span => span[1] < cursorPos);
            if (index !== -1) index = spans.length - 1 - index;
        }

        if (index !== -1 && spans[index]) {
            let startPos = doc.offsetToPos(spans[index][0]);
            let endPos = doc.offsetToPos(spans[index][1]);
            startPos.ch += 0.5;
            doc.setSelection(startPos, endPos);
        }
    }
};

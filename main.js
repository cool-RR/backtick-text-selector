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
        const doc = editor.getDoc();
        const cursorPos = doc.indexFromPos(cursor);
        const regex = /`([^`]+)`/g;
        let searchCursor;

        if (direction === 'next') {
            searchCursor = editor.getSearchCursor(regex, cursor);
            if (searchCursor.findNext()) {
                let from = searchCursor.from();
                let to = searchCursor.to();
                // Adjust to exclude backticks
                from.ch += 1;
                to.ch -= 1;
                editor.getDoc().setSelection(from, to);
            }
        } else {
            // For previous, we need to find all matches before the cursor
            searchCursor = editor.getSearchCursor(regex, { line: 0, ch: 0 });
            let lastMatch = null;
            while (searchCursor.findNext()) {
                if (doc.indexFromPos(searchCursor.to()) >= cursorPos) {
                    break;
                }
                lastMatch = {
                    from: searchCursor.from(),
                    to: searchCursor.to(),
                };
            }
            if (lastMatch) {
                let from = lastMatch.from;
                let to = lastMatch.to;
                // Adjust to exclude backticks
                from.ch += 1;
                to.ch -= 1;
                editor.getDoc().setSelection(from, to);
            }
        }
    }
};

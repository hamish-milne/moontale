using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.EventSystems;
using System.Linq;
using System.Text;

[RequireComponent(typeof(Text))]
class MoontaleUIText : MoontaleRichText, IPointerClickHandler, IPointerMoveHandler
{
    private Text text;
    private RectTransform rectTransform;
    private Stack<string> eventId = new Stack<string>();
    private List<(int idx, string id)> charIdRegions = new List<(int, string)>();

    protected override void Space(int px) {
        OpenTag("size", px.ToString());
        Text("\n");
        CloseTag("size");
    }

    private void UpdateEventId() {
        charIdRegions.Add((buffer.Length, eventId.Count > 0 ? eventId.Peek() : null));
    }

    protected void Awake() {
        text = GetComponent<Text>();
        rectTransform = GetComponent<RectTransform>();
    }

    protected override void Pop(string tag)
    {
        switch (tag) {
        case "a":
            eventId.Pop();
            UpdateEventId();
            break;
        default:
            base.Pop(tag);
            break;
        }
    }

    public override void Push(string tag, string arg)
    {
        switch (tag) {
        case "a":
            tags.Push(tag);
            eventId.Push(arg);
            UpdateEventId();
            break;
        default:
            base.Push(tag, arg);
            break;
        }
    }

    public override void Clear()
    {
        base.Clear();
        eventId.Clear();
        charIdRegions.Clear();
    }

    private string CloseAll() {
        var prev = buffer;
        try {
            buffer = new StringBuilder();
            foreach (var tag in tags) {
                if (tag != "a") {
                    Pop(tag);
                }
            }
            return buffer.ToString();
        } finally {
            buffer = prev;
        }
    }

    public override void Flush() {
        text.text = buffer.ToString() + CloseAll();
    }

    private string CharacterIdxToEventId(int cidx) {
        if (charIdRegions.Count == 1) {
            if (cidx >= charIdRegions[0].idx) {
                return charIdRegions[0].id;
            } else {
                return null;
            }
        } else if (charIdRegions.Count > 1) {
            if (cidx < charIdRegions[0].idx) {
                return null;
            }
            for (int i = 1; i < charIdRegions.Count; i++) {
                if (charIdRegions[i].idx > cidx) {
                    return charIdRegions[i - 1].id;
                }
            }
        }
        return null;
    }

    protected override string GetLinkId(PointerEventData eventData) {
        var textInfo = text.cachedTextGenerator;
        RectTransformUtility.ScreenPointToLocalPointInRectangle(rectTransform, eventData.position, null, out var pos);

        // Find the clicked line based on the Y position
        var line = textInfo.lines.Select((l, i) => (l, i))
            .FirstOrDefault(x => pos.y > (x.l.topY - x.l.height) && pos.y <= x.l.topY);
        if (line.l.height <= 0f) {
            return null;
        }

        // From the line, find the individual character we clicked on
        var lineLength = line.i >= (textInfo.lineCount - 1)
            ? textInfo.characterCountVisible - line.l.startCharIdx
            : (1 + textInfo.lines[line.i + 1].startCharIdx - line.l.startCharIdx);
        var character = textInfo.characters
            .Select((c, i) => (c, i))
            .Skip(line.l.startCharIdx)
            .Take(lineLength)
            .FirstOrDefault(x => pos.x >= x.c.cursorPos.x && pos.x < (x.c.cursorPos.x + x.c.charWidth));
        if (character.c.charWidth <= 0) {
            return null;
        }

        // Look up the event ID from the character index
        return CharacterIdxToEventId(character.i);
    }
}
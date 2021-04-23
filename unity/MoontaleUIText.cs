using System.Collections.Generic;
using System.Text;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.EventSystems;
using System.Linq;

[RequireComponent(typeof(Text), typeof(MoontaleStory))]
class MoontaleUIText : MonoBehaviour, MoontaleOutput, IPointerClickHandler
{
    private Text text;
    private RectTransform rectTransform;
    private MoontaleStory story;
    private StringBuilder buffer = new StringBuilder();
    private Stack<string> tags = new Stack<string>();
    private Stack<string> eventId = new Stack<string>();
    private List<(int idx, string id)> charIdRegions = new List<(int, string)>();

    public int[] headerSizes = {
        96, 60, 48, 34, 24, 20
    };
    public int paragraphSpace = 12;
    public Color32 linkColor = new Color32(139, 0, 0, 255);

    private void OpenTag(string tag) {
        buffer.Append('<').Append(tag).Append('>'); 
    }

    private void OpenTag(string tag, string value) {
        buffer.Append('<').Append(tag).Append('=').Append(value).Append('>');
    }

    private void CloseTag(string tag) {
        buffer.Append("</").Append(tag).Append('>');
    }

    private void Space(int px) {
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
        story = GetComponent<MoontaleStory>();
    }

    public void Object(string tag, string arg)
    {
        switch (tag) {
        case "br": buffer.Append('\n'); break;
        }
    }

    public void Pop()
    {
        var tag = tags.Pop();
        switch (tag) {
        case "p":
            Space(paragraphSpace);
            break;
        case "h":
            CloseTag("size");
            Space(paragraphSpace);
            break;
        case "a":
            CloseTag("color");
            eventId.Pop();
            UpdateEventId();
            break;
        case null:
            break;
        default:
            CloseTag(tag);
            break;
        }
    }

    private static string HexColor(Color32 c) {
        return $"#{c.r:X2}{c.g:X2}{c.b:X2}{c.a:X2}";
    }

    public void Push(string tag, string arg)
    {
        switch (tag) {
        case "a":
            tags.Push(tag);
            eventId.Push(arg);
            UpdateEventId();
            OpenTag("color", HexColor(linkColor));
            break;
        case "p":
            tags.Push(tag);
            break;
        case "li":
            buffer.Append(" \u2022 ");
            tags.Push(null);
            break;
        case "i":
        case "em":
            tags.Push("i");
            OpenTag("i");
            break;
        case "b":
        case "strong":
            tags.Push("b");
            OpenTag("b");
            break;
        case "color":
        case "size":
            tags.Push(tag);
            OpenTag(tag, arg);
            break;
        default:
            if (tag.StartsWith("h")) {
                tags.Push("h");
                OpenTag("size", headerSizes[int.Parse(tag.Substring(1))].ToString());
            } else {
                tags.Push(null);
            }
            break;
        }
    }

    public void Text(string text)
    {
        buffer.Append(text);
    }

    public void Clear()
    {
        buffer.Clear();
        tags.Clear();
        eventId.Clear();
        charIdRegions.Clear();
    }

    public void Flush() {
        text.text = buffer.ToString();
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

    public void OnPointerClick(PointerEventData eventData) {
        var textInfo = text.cachedTextGenerator;
        RectTransformUtility.ScreenPointToLocalPointInRectangle(rectTransform, eventData.position, null, out var pos);

        // Find the clicked line based on the Y position
        var line = textInfo.lines.Select((l, i) => (l, i))
            .FirstOrDefault(x => pos.y > (x.l.topY - x.l.height) && pos.y <= x.l.topY);
        if (line.l.height <= 0f) {
            return;
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
            return;
        }

        // Look up the event ID from the character index
        var eventId = CharacterIdxToEventId(character.i);
        if (eventId != null) {
            story.RaiseEvent("click", eventId);
        }
    }
}
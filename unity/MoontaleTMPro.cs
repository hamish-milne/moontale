using System.Collections.Generic;
using System.Text;
using UnityEngine;
using UnityEngine.EventSystems;
using TMPro;

[RequireComponent(typeof(TMP_Text), typeof(MoontaleStory))]
class MoontaleTMPro : MonoBehaviour, MoontaleOutput, IPointerClickHandler
{
    private TMP_Text text;
    private RectTransform rectTransform;
    private MoontaleStory story;
    private StringBuilder buffer = new StringBuilder();
    private Stack<string> tags = new Stack<string>();

    public int[] headerSizes = {
        96, 60, 48, 34, 24, 20
    };
    public int paragraphSpace = 12;
    public Color32 linkColor = new Color32(139, 0, 0, 255);

    private void OpenTag(string tag) {
        buffer.Append('<').Append(tag).Append('>'); 
    }

    private void OpenTag(string tag, string value) {
        if (tag == "color") {
            buffer.Append('<').Append(tag).Append("=").Append(value).Append(">");
        } else {
            buffer.Append('<').Append(tag).Append("=\"").Append(value).Append("\">");
        }
    }

    private void CloseTag(string tag) {
        buffer.Append("</").Append(tag).Append('>');
    }

    private void Space(int px) {
        OpenTag("line-height", px.ToString());
        Text("\n");
        CloseTag("line-height");
    }

    protected void Awake() {
        text = GetComponent<TMP_Text>();
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
            CloseTag("link");
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
            OpenTag("link", arg);
            OpenTag("color", HexColor(linkColor));
            break;
        case "p":
            tags.Push(tag);
            break;
        case "li":
            buffer.Append(" \u2022 ");
            tags.Push(null);
            break;
        case "em":
            tags.Push("i");
            OpenTag("i");
            break;
        case "strong":
            tags.Push("b");
            OpenTag("b");
            break;
        case "pre":
            tags.Push("mspace");
            OpenTag("mspace");
            break;
        case "b":
        case "i":
        case "mark":
        case "s":
        case "u":
        case "sub":
        case "sup":
        case "smallcaps":
            tags.Push(tag);
            OpenTag(tag);
            break;
        case "font":
        case "color":
        case "size":
        case "align":
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
    }

    public void Flush() {
        text.text = buffer.ToString();
    }

    public void OnPointerClick(PointerEventData eventData) {
        var linkId = TMP_TextUtilities.FindIntersectingLink(text, eventData.position, eventData.pressEventCamera);
        if (linkId >= 0) {
            story.RaiseEvent("click", text.textInfo.linkInfo[linkId].GetLinkID());
        }
    }
}
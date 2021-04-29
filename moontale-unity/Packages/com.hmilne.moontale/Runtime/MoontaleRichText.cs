using System.Collections.Generic;
using System.Text;
using UnityEngine;
using UnityEngine.EventSystems;

public abstract class MoontaleRichText : MoontaleSink, IPointerClickHandler, IPointerMoveHandler
{
    protected StringBuilder buffer = new StringBuilder();
    protected readonly Stack<string> tags = new Stack<string>();
    private string lastLink = null;

    public int[] headerSizes = {
        96, 60, 48, 34, 24, 20
    };
    public int paragraphSpace = 12;

    protected void OpenTag(string tag) {
        buffer.Append('<').Append(tag).Append('>'); 
    }

    protected void OpenTag(string tag, string value) {
        buffer.Append('<').Append(tag).Append("=\"").Append(value).Append("\">");
    }

    protected void OpenTagNoQuotes(string tag, string value) {
        buffer.Append('<').Append(tag).Append("=").Append(value).Append(">");
    }

    protected void CloseTag(string tag) {
        buffer.Append("</").Append(tag).Append('>');
    }

    protected abstract void Space(int px);

    public override void Object(string tag, string arg)
    {
        switch (tag) {
        case "br":
            buffer.Append('\n');
            break;
        }
    }

    public override void Pop()
    {
        Pop(tags.Pop());
    }

    protected virtual void Pop(string tag)
    {
        switch (tag) {
        case "p":
            Space(paragraphSpace);
            break;
        case "h":
            CloseTag("size");
            Space(paragraphSpace);
            break;
        case null:
            break;
        default:
            CloseTag(tag);
            break;
        }
    }

    protected static string HexColor(Color32 c) {
        return $"#{c.r:X2}{c.g:X2}{c.b:X2}{c.a:X2}";
    }

    public override void Push(string tag, string arg)
    {
        switch (tag) {
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
        case "color":
            tags.Push(tag);
            OpenTagNoQuotes(tag, arg);
            break;
        case "font":
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

    public override void Text(string text)
    {
        buffer.Append(text);
    }

    public override void Clear()
    {
        buffer.Clear();
        tags.Clear();
    }

    protected abstract string GetLinkId(PointerEventData eventData);

    public void OnPointerClick(PointerEventData eventData) {
        var linkId = GetLinkId(eventData);
        if (!string.IsNullOrEmpty(linkId)) {
            Source.RaiseEvent("click", linkId);
        }
    }

    public void OnPointerMove(PointerEventData eventData)
    {
        var linkId = GetLinkId(eventData);
        if (linkId == lastLink) {
            return;
        }
        if (!string.IsNullOrEmpty(lastLink)) {
            Source.RaiseEvent("mouseout", lastLink);
        }
        if (!string.IsNullOrEmpty(linkId)) {
            Source.RaiseEvent("mouseover", linkId);
        }
        lastLink = linkId;
    }
}
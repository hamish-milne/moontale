#if ENABLE_TMP
using UnityEngine;
using UnityEngine.EventSystems;
using TMPro;

namespace Moontale {

[RequireComponent(typeof(TMP_Text))]
public class MoontaleTextMeshProSink : RichTextSink
{
    private TMP_Text text;
    private RectTransform rectTransform;

    protected override int baseSize => (int)text.fontSize;

    protected override void Space(int px) {
        Text("\n");
        OpenTag("line-height", px.ToString());
        Text("\n");
        CloseTag("line-height");
    }

    internal void Awake() {
        text = GetComponent<TMP_Text>();
        rectTransform = GetComponent<RectTransform>();
    }

    protected override void Pop(string tag)
    {
        switch (tag) {
        case "a":
            CloseTag("link");
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
            OpenTag("link", arg);
            break;
        default:
            base.Push(tag, arg);
            break;
        }
    }

    public override void Flush() {
        text.text = buffer.ToString();
    }

    protected override string GetLinkId(PointerEventData eventData)
    {
        var linkId = TMP_TextUtilities.FindIntersectingLink(text, eventData.position,
            eventData.pressEventCamera ? eventData.pressEventCamera : Camera.main
        );
        if (linkId >= 0 && linkId < text.textInfo.linkCount) {
            return text.textInfo.linkInfo[linkId].GetLinkID();
        } else {
            return null;
        }
    }
}

}
#endif

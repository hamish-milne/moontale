using System.Collections.Generic;
using UnityEngine;

namespace Moontale {

public class MoontaleTooltip : Sink
{
    public Sink mainScreen;
    public Sink subScreen;
    public bool isSubScreen = false;

    private Stack<string> tags = new Stack<string>();

    public override void Clear()
    {
        mainScreen.Clear();
        subScreen.Clear();
    }

    public override void Invalidate()
    {
        mainScreen.Invalidate();
        subScreen.Invalidate();
    }    

    public override void Flush()
    {
        mainScreen.Source = Source;
        subScreen.Source = Source;
        mainScreen.Flush();
        subScreen.Flush();
    }

    public override void Object(string tag, string arg)
    {
        (isSubScreen ? subScreen : mainScreen).Object(tag, arg);
    }

    public override void Pop()
    {
        var tag = tags.Pop();
        if (tag == "tooltip") {
            isSubScreen = false;
        } else {
            (isSubScreen ? subScreen : mainScreen).Pop();
        }
    }

    public override void Push(string tag, string arg)
    {
        tags.Push(tag);
        if (tag == "tooltip") {
            isSubScreen = true;
        } else {
            (isSubScreen ? subScreen : mainScreen).Push(tag, arg);
        }
    }

    public override void Text(string text)
    {
        (isSubScreen ? subScreen : mainScreen).Text(text);
    }
}

}
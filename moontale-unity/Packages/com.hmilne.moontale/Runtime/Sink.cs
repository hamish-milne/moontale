using UnityEngine;

namespace Moontale {

public abstract class Sink : Source {
    public virtual Source Source { get; set; }
    public abstract void Push(string tag, string arg);
    public abstract void Pop();
    public abstract void Text(string text);
    public abstract void Object(string tag, string arg);
    public abstract void Flush();
    public abstract void Clear();
    public abstract void Invalidate();

    public override void RaiseEvent(string tag, string id)
    {
        Source.RaiseEvent(tag, id);
    }
}

}
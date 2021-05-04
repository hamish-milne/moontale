using UnityEngine;

namespace Moontale {

public abstract class Sink : MonoBehaviour {
    public virtual Source Source { get; set; }
    public abstract void Push(string tag, string arg);
    public abstract void Pop();
    public abstract void Text(string text);
    public abstract void Object(string tag, string arg);
    public abstract void Flush();
    public abstract void Clear();
    public abstract void Invalidate();
}

}
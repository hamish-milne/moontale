using UnityEngine;

public abstract class MoontaleSink : MonoBehaviour {
    public virtual MoontaleSource Source { get; set; }
    public abstract void Push(string tag, string arg);
    public abstract void Pop();
    public abstract void Text(string text);
    public abstract void Object(string tag, string arg);
    public abstract void Flush();
    public abstract void Clear();
}

public abstract class MoontaleSource : MonoBehaviour {
    public abstract void RaiseEvent(string tag, string id);
}
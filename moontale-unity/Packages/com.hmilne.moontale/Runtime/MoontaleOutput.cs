using UnityEngine;

public abstract class MoontaleOutput : MonoBehaviour {
    public abstract void Push(string tag, string arg);
    public abstract void Pop();
    public abstract void Text(string text);
    public abstract void Object(string tag, string arg);
    public abstract void Flush();
    public abstract void Clear();
}

public interface MoontaleInput {
    void RaiseEvent(string tag, string id);
}
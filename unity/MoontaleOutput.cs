interface MoontaleOutput {
    void Push(string tag, string arg);
    void Pop();
    void Text(string text);
    void Object(string tag, string arg);
    void Flush();
    void Clear();
}
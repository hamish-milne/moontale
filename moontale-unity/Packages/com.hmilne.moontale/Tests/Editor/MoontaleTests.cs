using NUnit.Framework;
using UnityEngine;
using UnityEngine.UI;

namespace Moontale {

public class Tests
{
    [Test]
    public void StartStory()
    {
        var go = new GameObject();
        var sink = go.AddComponent<MoontaleTextSink>();
        sink.Awake();
        var source = new GameObject().AddComponent<MoontaleStory>();
        source.Awake();
        source.sink = sink;
        source.scriptAssets.Add(new TextAsset(@"
        
        StartPassage = 'foo';
        Passages = {foo = {content = function() Style.b('Hello world!') end}}

        "));
        source.Start();
        Assert.AreEqual("<b>Hello world!</b>", go.GetComponent<Text>().text);
    }

    [Test]
    public void OutputToUIText()
    {
        var go = new GameObject();
        var sink = go.AddComponent<MoontaleTextSink>();
        sink.Awake();
        sink.Push("color", "#123456");
        sink.Text("Hello");
        sink.Pop();
        sink.Flush();
        Assert.AreEqual("<color=#123456>Hello</color>", go.GetComponent<Text>().text);
        sink.Clear();
        sink.Flush();
        Assert.AreEqual("", go.GetComponent<Text>().text);
    }

    [Test]
    public void OutputToTextMeshPro()
    {
        var go = new GameObject();
        go.AddComponent<TMPro.TextMeshProUGUI>();
        var sink = go.AddComponent<MoontaleTextMeshProSink>();
        sink.Awake();
        sink.Push("color", "#123456");
        sink.Text("Hello");
        sink.Pop();
        sink.Flush();
        Assert.AreEqual("<color=#123456>Hello</color>", go.GetComponent<TMPro.TMP_Text>().text);
        sink.Clear();
    }

    [Test]
    public void NoEmptyParagraphs()
    {
        var go = new GameObject();
        var sink = go.AddComponent<MoontaleTextSink>();
        go.GetComponent<Text>().fontSize = 10;
        sink.Awake();
        sink.Push("p", null);
        sink.Text("");
        sink.Pop();
        sink.Push("p", null);
        sink.Text("Text!");
        sink.Pop();
        sink.Push("p", null);
        sink.Pop();
        sink.Push("p", null);
        sink.Pop();
        sink.Push("p", null);
        sink.Pop();
        sink.Flush();
        Assert.AreEqual("Text!\n<size=\"5\">\n</size>", go.GetComponent<Text>().text);
    }

    [Test]
    public void Tooltip()
    {
        var go1 = new GameObject();
        var sink1 = go1.AddComponent<MoontaleTextSink>();
        var text1 = go1.GetComponent<Text>();
        sink1.Awake();

        var go2 = new GameObject();
        var sink2 = go2.AddComponent<MoontaleTextSink>();
        var text2 = go2.GetComponent<Text>();
        sink2.Awake();

        var go = new GameObject();
        var sink = go.AddComponent<MoontaleTooltip>();
        sink.mainScreen = sink1;
        sink.subScreen = sink2;

        sink.Text("Hello");
        sink.Push("tooltip", null);
        sink.Text("World");
        sink.Pop();
        sink.Text("!");
        sink.Flush();

        Assert.AreEqual("Hello!", text1.text);
        Assert.AreEqual("World", text2.text);
    }
}

}
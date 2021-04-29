using System.Collections;
using System.Collections.Generic;
using NUnit.Framework;
using UnityEngine;
using UnityEngine.TestTools;
using UnityEngine.UI;
using UnityEditor;

public class MoontaleTests
{
    [Test]
    public void StartStory()
    {
        var go = new GameObject();
        var sink = go.AddComponent<MoontaleUIText>();
        sink.Awake();
        var source = new GameObject().AddComponent<MoontaleStory>();
        source.Awake();
        source.sink = sink;
        source.scriptAssets.Add(new TextAsset(@"
        
        startPassage = 'foo';
        passages = {foo = {content = function() style.b('Hello world!') end}}

        "));
        source.Start();
        Assert.AreEqual("<b>Hello world!</b>", go.GetComponent<Text>().text);
    }

    [Test]
    public void OutputToUIText()
    {
        var go = new GameObject();
        var sink = go.AddComponent<MoontaleUIText>();
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
        var sink = go.AddComponent<MoontaleTMPro>();
        sink.Awake();
        sink.Push("color", "#123456");
        sink.Text("Hello");
        sink.Pop();
        sink.Flush();
        Assert.AreEqual("<color=#123456>Hello</color>", go.GetComponent<TMPro.TMP_Text>().text);
        sink.Clear();
    }

    [UnityTest]
    public IEnumerator TypewriterEffect()
    {
        yield return new EnterPlayMode();
        var go = new GameObject();
        var sink = go.AddComponent<MoontaleUIText>();
        var text = go.GetComponent<Text>();
        var tw = go.AddComponent<MoontaleTypewriter>();
        tw.charsPerSecond = 1000; // Force one char per frame
        tw.sink = sink;
        tw.typeOn = true;
        tw.Text("abcde");
        tw.Flush();
        Assert.AreEqual("a", text.text);
        yield return null;
        Assert.AreEqual("ab", text.text);
        yield return null;
        Assert.AreEqual("abc", text.text);
        yield return null;
        Assert.AreEqual("abcd", text.text);
        yield return null;
        Assert.AreEqual("abcde", text.text);
        yield return new ExitPlayMode();
    }

    [Test]
    public void Tooltip()
    {
        var go1 = new GameObject();
        var sink1 = go1.AddComponent<MoontaleUIText>();
        var text1 = go1.GetComponent<Text>();
        sink1.Awake();

        var go2 = new GameObject();
        var sink2 = go2.AddComponent<MoontaleUIText>();
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

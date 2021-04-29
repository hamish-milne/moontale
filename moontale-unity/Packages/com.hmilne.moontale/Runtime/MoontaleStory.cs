using System.Runtime.CompilerServices;
using UnityEngine;
using MoonSharp.Interpreter;
using System.IO;
using System.Linq;
using System.Collections.Generic;

[assembly: InternalsVisibleTo("Moontale.EditorTests")]

[RequireComponent(typeof(MoontaleSink))]
public class MoontaleStory : MoontaleSource
{
    public TextAsset stdlib;
    public List<TextAsset> scriptAssets = new List<TextAsset>();
    public List<string> scriptStreamingAssets = new List<string>();
    private Script script = new Script();
    public MoontaleSink sink;

    private DynValue Push(ScriptExecutionContext context, CallbackArguments args) {
        sink.Push(args[0].String, args.Count > 0 ? args[1].CastToString() : null);
        return DynValue.Nil;
    }

    private DynValue Pop(ScriptExecutionContext context, CallbackArguments args) {
        sink.Pop();
        return DynValue.Nil;
    }

    private DynValue Text(ScriptExecutionContext context, CallbackArguments args) {
        sink.Text(args[0].String);
        return DynValue.Nil;
    }

    private DynValue Clear(ScriptExecutionContext context, CallbackArguments args) {
        sink.Clear();
        return DynValue.Nil;
    }

    private DynValue Object(ScriptExecutionContext context, CallbackArguments args) {
        sink.Object(args[0].String, args.Count > 0 ? args[1].CastToString() : null);
        return DynValue.Nil;
    }

    internal void Awake() {
        sink = GetComponent<MoontaleSink>();
        script.Globals.Set("push", DynValue.NewCallback(Push));
        script.Globals.Set("pop", DynValue.NewCallback(Pop));
        script.Globals.Set("text", DynValue.NewCallback(Text));
        script.Globals.Set("clear", DynValue.NewCallback(Clear));
        script.Globals.Set("object", DynValue.NewCallback(Object));
    }

    internal void Start()
    {
        sink.Source = this;
        try {
            script.DoString(stdlib.text, null, stdlib.name);
            foreach (var asset in scriptAssets) {
                script.DoString(asset.text, null, asset.name);
            }
            foreach (var path in scriptStreamingAssets) {
                script.DoString(File.ReadAllText(Application.streamingAssetsPath + "/" + path), null, path);
            }
            script.Call(script.Globals["softReset"]);
        } catch (ScriptRuntimeException e) {
            Debug.LogError(e.Message + "\n" + string.Join("\n    ", e.CallStack.Select(x => $"{x.Name}:{x.Location}")));
        }
        sink.Flush();
    }

    public override void RaiseEvent(string eventType, string id)
    {
        sink.Source = this;
        try {
            script.Call(script.Globals["raiseEvent"], eventType, int.Parse(id));
        } catch (ScriptRuntimeException e) {
            Debug.LogError(e.Message + "\n" + string.Join("\n    ", e.CallStack.Select(x => $"{x.Name}:{x.Location}")));
        }
        sink.Flush();
    }
}
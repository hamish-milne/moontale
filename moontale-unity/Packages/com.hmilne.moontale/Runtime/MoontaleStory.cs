using System.Runtime.CompilerServices;
using UnityEngine;
using MoonSharp.Interpreter;
using System.IO;
using System.Linq;
using System.Collections.Generic;

[assembly: InternalsVisibleTo("Moontale.EditorTests")]

namespace Moontale {

public class MoontaleStory : Source
{
    [HideInInspector, SerializeField]
    public TextAsset standardLibrary;

    [Tooltip("Your story scripts, stored as TextAssets")]
    public List<TextAsset> scriptAssets = new List<TextAsset>();

    [Tooltip("Your story scripts, stored in StreamingAssets")]
    public List<string> scriptStreamingAssets = new List<string>();

    [Tooltip("Whether to start the story immediately, or wait for a call to SoftReset")]
    public bool AutoStart = true;
    
    public Sink sink;

    public Script script;

    private bool _changed = false;

    private DynValue Push(ScriptExecutionContext context, CallbackArguments args) {
        sink.Push(args[0].String, args.Count > 0 ? args[1].CastToString() : null);
        return DynValue.Nil;
    }

    private DynValue Pop(ScriptExecutionContext context, CallbackArguments args) {
        sink.Pop();
        return DynValue.Nil;
    }

    private DynValue Text(ScriptExecutionContext context, CallbackArguments args) {
        _changed = true;
        sink.Text(args[0].String);
        return DynValue.Nil;
    }

    private DynValue Clear(ScriptExecutionContext context, CallbackArguments args) {
        _changed = true;
        sink.Clear();
        return DynValue.Nil;
    }

    private DynValue Invalidate(ScriptExecutionContext context, CallbackArguments args) {
        _changed = true;
        sink.Invalidate();
        return DynValue.Nil;
    }

    private DynValue Object(ScriptExecutionContext context, CallbackArguments args) {
        _changed = true;
        sink.Object(args[0].String, args.Count > 0 ? args[1].CastToString() : null);
        return DynValue.Nil;
    }

    private static void PrintError(ScriptRuntimeException e) {
        Debug.LogError(e.Message + "\n" + string.Join("\n    ", e.CallStack.Select(x => $"{x.Name}:{x.Location}")));
    }

    internal void Start() {
        script = new Script();
        script.Globals.Set("Push", DynValue.NewCallback(Push));
        script.Globals.Set("Pop", DynValue.NewCallback(Pop));
        script.Globals.Set("Text", DynValue.NewCallback(Text));
        script.Globals.Set("Clear", DynValue.NewCallback(Clear));
        script.Globals.Set("Object", DynValue.NewCallback(Object));
        script.Globals.Set("Invalidate", DynValue.NewCallback(Invalidate));
        sink.Source = this;
        try {
            script.DoString(standardLibrary.text, null, standardLibrary.name);
            foreach (var asset in scriptAssets) {
                script.DoString(asset.text, null, asset.name);
            }
            foreach (var path in scriptStreamingAssets) {
                script.DoString(File.ReadAllText(Application.streamingAssetsPath + "/" + path), null, path);
            }
        } catch (ScriptRuntimeException e) {
            PrintError(e);
        }
        if (AutoStart) {
            SoftReset();
        }
    }

    public void SoftReset() {
        try {
            script.Call(script.Globals["SoftReset"]);
        } catch (ScriptRuntimeException e) {
            PrintError(e);
        }
        _changed = false;
        sink.Flush();
    }

    public override void RaiseEvent(string eventType, string id)
    {
        sink.Source = this;
        try {
            script.Call(script.Globals["RaiseEvent"], eventType, int.Parse(id));
        } catch (ScriptRuntimeException e) {
            PrintError(e);
        }
        if (_changed) {
            _changed = false;
            sink.Flush();
        }
    }

    protected virtual void Update()
    {
        try {
            script.Call(script.Globals["Update"], Time.deltaTime);
        } catch (ScriptRuntimeException e) {
            PrintError(e);
        }
        if (_changed) {
            _changed = false;
            sink.Flush();
        }
    }
}

}
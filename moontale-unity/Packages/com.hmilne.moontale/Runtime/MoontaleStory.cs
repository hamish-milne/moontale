using UnityEngine;
using MoonSharp.Interpreter;
using System.IO;
using System.Linq;

[RequireComponent(typeof(MoontaleOutput))]
public class MoontaleStory : MonoBehaviour
{
    public string storyPath = "main.lua";
    private Script script = new Script();
    private MoontaleOutput output;

    private DynValue Push(ScriptExecutionContext context, CallbackArguments args) {
        output.Push(args[0].String, args.Count > 0 ? args[1].CastToString() : null);
        return DynValue.Nil;
    }

    private DynValue Pop(ScriptExecutionContext context, CallbackArguments args) {
        output.Pop();
        return DynValue.Nil;
    }

    private DynValue Text(ScriptExecutionContext context, CallbackArguments args) {
        output.Text(args[0].String);
        return DynValue.Nil;
    }

    private DynValue Clear(ScriptExecutionContext context, CallbackArguments args) {
        output.Clear();
        return DynValue.Nil;
    }

    private DynValue Object(ScriptExecutionContext context, CallbackArguments args) {
        output.Object(args[0].String, args.Count > 0 ? args[1].CastToString() : null);
        return DynValue.Nil;
    }

    protected void Awake() {
        output = GetComponent<MoontaleOutput>();
        script.Globals.Set("push", DynValue.NewCallback(Push));
        script.Globals.Set("pop", DynValue.NewCallback(Pop));
        script.Globals.Set("text", DynValue.NewCallback(Text));
        script.Globals.Set("clear", DynValue.NewCallback(Clear));
        script.Globals.Set("object", DynValue.NewCallback(Object));
    }

    protected void Start()
    {
        try {
            script.DoString(File.ReadAllText(Application.streamingAssetsPath + "/moontale.lua"), null, "StdLib");
            script.DoString(File.ReadAllText(Application.streamingAssetsPath + "/" + storyPath), null, "MainStory");
            script.Call(script.Globals["softReset"]);
        } catch (ScriptRuntimeException e) {
            Debug.LogError(e.Message + "\n" + string.Join("\n    ", e.CallStack.Select(x => $"{x.Name}:{x.Location}")));
        }
        output.Flush();
    }

    public void RaiseEvent(string eventType, string id) {
        try {
            script.Call(script.Globals["raiseEvent"], eventType, int.Parse(id));
        } catch (ScriptRuntimeException e) {
            Debug.LogError(e.Message + "\n" + string.Join("\n    ", e.CallStack.Select(x => $"{x.Name}:{x.Location}")));
        }
        output.Flush();
    }    
}

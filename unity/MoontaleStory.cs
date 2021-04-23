using System.Text;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using MoonSharp.Interpreter;
using System.IO;
using System.Linq;

[RequireComponent(typeof(MoontaleOutput))]
public class MoontaleStory : MonoBehaviour
{

    private Script script = new Script();
    private MoontaleOutput output;
    // private StringBuilder buffer = new StringBuilder();
    // private Stack<string> tags = new Stack<string>();
    // public UnityEngine.UI.Text text;

    private DynValue Push(ScriptExecutionContext context, CallbackArguments args) {
        // var tag = args[0].String;
        // switch (tag) {
        // case "em": tag = "i"; break;
        // case "strong": tag = "b"; break;
        // }
        // tags.Push(tag);
        // switch (tag) {
        // case "b":
        // case "i":
        //     buffer.Append('<').Append(tag).Append('>');
        //     break;
        // case "color":
        // case "size":
        //     buffer.Append('<').Append(tag).Append('=').Append(args[1]).Append('>');
        //     break;
        // case "li":
        //     buffer.Append(" \u2022 ");
        //     break;
        // case "h1":
        //     buffer.Append("<size=30>");
        //     break;
        // }
        output.Push(args[0].String, args.Count > 0 ? args[1].ToString() : null);
        return DynValue.Nil;
    }

    private DynValue Pop(ScriptExecutionContext context, CallbackArguments args) {
        // var tag = tags.Pop();
        // switch (tag) {
        // case "b":
        // case "i":
        // case "color":
        // case "size":
        //     buffer.Append("</").Append(tag).Append('>');
        //     break;
        // case "p":
        //     buffer.Append("\n\n");
        //     break;
        // case "h1":
        //     buffer.Append("</size>\n\n");
        //     break;
        // }
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
        output.Object(args[0].String, args.Count > 0 ? args[1].ToString() : null);
        return DynValue.Nil;
    }

    // private void Flush() {
    //     text.text = buffer.ToString();
    // }

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
        script.DoString(File.ReadAllText(Application.streamingAssetsPath + "/moontale.lua"), null, "StdLib");
        script.DoString(File.ReadAllText(Application.streamingAssetsPath + "/main.lua"), null, "MainStory");
        script.Call(script.Globals["softReset"]);
        // Flush();
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

using UnityEngine;
using UnityEditor;
using UnityEditor.AssetImporters;
using System.IO;
 
[ScriptedImporter(1, "lua")]
public class LuaImporter : ScriptedImporter {
    public override void OnImportAsset(AssetImportContext ctx) {
        TextAsset subAsset = new TextAsset( File.ReadAllText( ctx.assetPath ) );
        ctx.AddObjectToAsset( "text", subAsset );
        ctx.SetMainObject( subAsset );
    }
}
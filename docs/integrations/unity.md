# Unity

Moontale provides a standard integration with the Unity engine \(Moontale for Unity - 'MFU'\), which lets you play back your stories on a UI canvas or using TextMeshPro. It handles basic formatting, hover and click events, images, and audio, while being fairly easy to extend for your specific application.

MFU leverages [MoonSharp](https://www.moonsharp.org/) \(no affiliation!\) as a cross-platform Lua runtime. This allows Moontale to \(in principle\) support all the build targets that Unity offers.

## Installing

```text
npm install -g openupm-cli
cd my/unity/project
openupm add moonsharp com.hmilne.moontale@https://github.com/hamish-milne/moontale.git?path=/moontale-unity/Packages/com.hmilne.moontale
```

## Components

MFU operates as a 'pipeline', with the Story component as the top-level 'source', and text output components as the 'sinks', with other components acting as transformers, multiplexers and so on.

If this sounds a little complicated, don't worry - for simple use cases, all you need is a Story to load your Lua script, and an Output to put text on the screen. When you come to add your own functionality, you can implement it as a pipeline component without having to touch any other code.

### Source

The **Moontale Story** component is what runs your story's code, listens for the emission functions and passes them to a Sink \(which draws text on the screen\). It loads the standard library, followed by the scripts you specify in the component.

You can add your story script in two ways: you can simply drop the Lua file somewhere in your Assets folder, which will import it as a TextAsset that you can add to the Story component. Alternatively you can put it into StreamingAssets and type in the path to load, which is a little less compatible \(notably, WebGL builds don't support this at the moment\) but makes modding a lot easier.

### Sinks

MFU has two output components built-in:

The **TextMeshPro Sink** links to any TextMeshPro instance. It supports a wide array of formatting tags and allows use of TextMeshPro's full feature set, which is quite large.

The **UI Text Sink** links to a standard UI text component. It supports a limited set of formatting tags; notably, there is no ability to switch fonts mid-text, nor the ability to draw images inline. The visual output is a little higher quality, and more flexible with changing size, on account of using true dynamic font rendering rather than a pre-baked texture.




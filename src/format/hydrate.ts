import { modeFactory } from "../mode"
import { setup } from "../setup";

setup();
(this as any).editorExtensions.twine['^2.4.0'].codeMirror.mode = modeFactory;

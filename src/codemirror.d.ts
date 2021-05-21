import 'codemirror'
import 'codemirror/addon/mode/simple'

declare module 'codemirror' {

    function simpleMode<K extends string>(
        config: EditorConfiguration,
        // tslint:disable-next-line:no-unnecessary-generics
        states: { [P in K]: P extends 'meta' ? Record<string, any> : Rule[] } & { start: Rule[] },
    ): Mode<unknown>;
}
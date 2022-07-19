import type { Editor } from "codemirror";

type CommandKey = keyof typeof import('./commands');

interface TwineEnvironment {
    readonly appTheme: 'dark' | 'light';
    readonly foregroundColor: string;
    readonly backgroundColor: string;
    readonly locale: string;
}

interface ToolbarButton {
    type: 'button';
    command: CommandKey;
    disabled?: boolean;
    icon: string;
    iconOnly?: boolean;
    label: string;
}

interface ToolbarMenu {
    type: 'menu';
    disabled?: boolean;
    icon: string;
    iconOnly?: boolean;
    items: ToolbarMenuItem[];
    label: string;
}

interface Separator {
    type: 'separator';
}

type ToolbarMenuItem = Omit<ToolbarButton, 'icon'> | Separator;

type ToolbarItem = ToolbarButton | ToolbarMenu;

export default function(editor: Editor, environment: TwineEnvironment): ToolbarItem[] {
    return [];
}

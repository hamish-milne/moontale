using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Linq;

namespace Moontale {

public class MoontaleTypewriter : Sink
{
    public Sink sink;
    public int charsPerSecond = 50;
    public bool typeOn = true;
    private int charsEmitted = 0;
    private int totalCharsEmitted = 0;

    private enum ItemType {
        Push,
        Pop,
        Text,
        Object,
        Char,
    }
    private struct QueueItem {
        public ItemType type;
        public string arg1;
        public string arg2;
    }

    private Queue<QueueItem> queue = new Queue<QueueItem>();

    public override void Clear()
    {
        sink.Source = Source;
        charsEmitted = 0;
        queue.Clear();
        sink.Clear();
    }

    public override void Flush()
    {
        StopAllCoroutines();
        StartCoroutine(DoFlush());
    }

    public override void Object(string tag, string arg)
    {
        queue.Enqueue(new QueueItem {
            type = ItemType.Object,
            arg1 = tag,
            arg2 = arg
        });
    }

    public override void Pop()
    {
        queue.Enqueue(new QueueItem {
            type = ItemType.Pop,
        });
    }

    public override void Push(string tag, string arg)
    {
        queue.Enqueue(new QueueItem {
            type = ItemType.Push,
            arg1 = tag,
            arg2 = arg
        });
    }

    public override void Text(string text)
    {
        if (typeOn) {
            foreach (var c in text) {
                queue.Enqueue(new QueueItem {
                    type = ItemType.Char,
                    arg1 = c.ToString(),
                });
            }
        } else {
            queue.Enqueue(new QueueItem {
                type = ItemType.Text,
                arg1 = text
            });
        }
    }

    private IEnumerator DoFlush()
    {
        sink.Source = Source;
        while (queue.Count > 0) {
            var item = queue.Dequeue();
            switch (item.type) {
            case ItemType.Push:
                sink.Push(item.arg1, item.arg2);
                break;
            case ItemType.Pop:
                sink.Pop();
                break;
            case ItemType.Text:
                sink.Text(item.arg1);
                sink.Flush();
                break;
            case ItemType.Char:
                sink.Text(item.arg1);
                sink.Flush();
                charsEmitted++;
                if (charsEmitted > totalCharsEmitted) {
                    yield return new WaitForSeconds(1f / charsPerSecond);
                    totalCharsEmitted++;
                }
                break;
            }
        }
    }
}

}
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Linq;

public class MoontaleTypewriter : MoontaleOutput
{
    public MoontaleOutput inner;
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
        charsEmitted = 0;
        queue.Clear();
        inner.Clear();
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
        while (queue.Count > 0) {
            var item = queue.Dequeue();
            switch (item.type) {
            case ItemType.Push:
                inner.Push(item.arg1, item.arg2);
                break;
            case ItemType.Pop:
                inner.Pop();
                break;
            case ItemType.Text:
                inner.Text(item.arg1);
                inner.Flush();
                break;
            case ItemType.Char:
                inner.Text(item.arg1);
                inner.Flush();
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
using UnityEngine;

namespace Moontale {

public abstract class Source : MonoBehaviour {
    public abstract void RaiseEvent(string tag, string id);
}

}
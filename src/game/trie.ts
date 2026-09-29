/**
 * Prefix trie for fast dictionary lookups.
 * find() returns the node for a prefix; its isWord flag says whether it's a full word.
 */
class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isWord = false;
}

export class Trie {
  root = new TrieNode();

  insert(word: string): void {
    let node = this.root;
    for (const ch of word) {
      let child = node.children.get(ch);
      if (!child) {
        child = new TrieNode();
        node.children.set(ch, child);
      }
      node = child;
    }
    node.isWord = true;
  }

  find(prefix: string): TrieNode | undefined {
    let node: TrieNode | undefined = this.root;
    for (const ch of prefix) {
      node = node.children.get(ch);
      if (!node) return undefined;
    }
    return node;
  }
}

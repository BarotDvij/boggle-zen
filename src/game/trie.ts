/**
 * Prefix trie for fast dictionary lookups.
 * Supports isWord() and hasPrefix() for the solver.
 */
export class TrieNode {
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

  hasPrefix(prefix: string): boolean {
    let node = this.root;
    for (const ch of prefix) {
      const child = node.children.get(ch);
      if (!child) return false;
      node = child;
    }
    return true;
  }

  isWord(word: string): boolean {
    let node = this.root;
    for (const ch of word) {
      const child = node.children.get(ch);
      if (!child) return false;
      node = child;
    }
    return node.isWord;
  }

  /**
   * Returns a Set of all words for fast O(1) has checks,
   * plus retains the trie for prefix checks.
   */
  buildWordSet(): Set<string> {
    const words = new Set<string>();
    const traverse = (node: TrieNode, prefix: string) => {
      if (node.isWord) words.add(prefix);
      for (const [ch, child] of node.children) {
        traverse(child, prefix + ch);
      }
    };
    traverse(this.root, "");
    return words;
  }
}

# Contributing

The whole program is `index.html`. There is no build step, no package manager and no
`node_modules` — you edit the file, you reload the page, you are testing the thing that
ships. Please keep it that way.

## The constraints that are not negotiable

These are the reasons the tool exists, and CI fails on every one of them:

- **`crypto.getRandomValues` is the only source of randomness.** `Math.random()` anywhere in
  the file fails the build, including in code that has nothing to do with generation.
- **Nothing reaches the network.** No external script, stylesheet, font or image, no
  `fetch`, no `XMLHttpRequest`, no `WebSocket`, no beacon, no dynamic `import()`. The page
  has to work identically with the machine unplugged.
- **One HTML file.** No second HTML file, no `package.json`. Assets that are not the page
  itself belong in `assets/`.
- **The page carries its own CSP.** The `default-src 'none'` meta tag stays, and a change
  that needs it loosened is a change that needs discussing first.

Run the same checks locally before you open a pull request:

```bash
grep -n "Math\.random" index.html          # must find nothing
grep -q "crypto.getRandomValues" index.html
grep -q "default-src 'none'" index.html
npx --yes htmlhint index.html
```

## Changing how passwords are generated

Anything touching the alphabet, the length maths or the entropy figure shown on screen
needs to explain its arithmetic in the pull request. The number the page displays is a
promise to whoever reads it, and a generator that quietly rejects candidates — to satisfy a
character-class rule, say — is no longer drawing uniformly and the figure stops being true.
If a change does that deliberately, the displayed entropy has to move with it.

## Style

Match what is there. The file is plain HTML, CSS and JavaScript with no framework, written
to be read top to bottom by someone auditing it in one sitting — that audience is the point
of the project, so a clever abstraction that saves ten lines and costs a reader five minutes
is a bad trade here.

## Reporting a bug

Use the bug report template. Say whether you opened the file from disk or the hosted demo;
browsers apply different rules to `file://` and it changes what is reachable.

A weakness in the generation itself is not a public issue — `SECURITY.md` has the address.

## Licence

MIT, same as the project. By sending a patch you agree to it being published under those
terms.

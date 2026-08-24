# Security policy

TLK Pass generates passwords, so a flaw in it is a flaw in every password someone made with it.
Please report one privately.

## Reporting

Mail **talkdedsec@proton.me** with `tlk-pass` in the subject. Acknowledgement within 72 hours,
assessment within 7 days. Since the whole program is one file with no release pipeline, a fix ships
as soon as it is written.

## In scope

- Anything that makes the output predictable: a path that reaches `Math.random()`, a modulo bias, a
  seeded or reused buffer, a shuffle that leaks the position of the guaranteed characters.
- An entropy figure that overstates the real strength of what was generated.
- A network request, a external reference, or anything that could exfiltrate a generated password.
- A CSP bypass in the page's own policy.
- Anything written to storage beyond `localStorage.tlkpass` preferences.

## Out of scope

- The clipboard not clearing when the tab is unfocused. That is a documented browser limitation, not
  a bug — see the README.
- The 92-word passphrase list being small. It is documented, the entropy readout is honest about it,
  and expanding it is a feature request.
- `localStorage` being readable by anything with access to the browser profile.
- Attacks that require code execution on the machine already.

## Verifying it yourself

The point of a one-file generator is that you can check the claims without trusting me:

```bash
grep -c "Math.random" index.html          # 0
grep -cE 'src="http|href="http|fetch\(|XMLHttpRequest|@import' index.html   # 0
```

Then open the file with DevTools on the Network tab. Generate a hundred passwords. The request count
stays at zero. CI runs both of those greps on every push, so a regression cannot land quietly.

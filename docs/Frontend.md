# Frontend Design Choices

### Transitions

Each transition will be given a code, ex. l, r, tr etc.
Where l = left, r = right, tr = top right, etc

This is to add smooth transitions without breaking website layout between each step.
`transform` doesn't work due to breaking layout during animations.

This format also allows for an abstraction wherein adding transitions involves:
lfr: ref={addTransition('r')}
tfb: ref={addTransition('tr')}
for each react element doing the translating.

To prevent class overlap, 'transition-' will be prefixed to every node using
the ref callback behind the scenes.

t
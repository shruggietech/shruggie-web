# Transient UI state

There is no new stored data or persistence contract.

The reveal wrapper transitions from visible server HTML to either permanently visible initial content or pending below-viewport enhancement. Pending content becomes revealed on intersection, focus, reduced motion, or an error. A completed reveal must not be hidden on prop changes. Cleanup restores the original inline values and releases observation/animation resources.

Carousel selection and consent cookie states retain their existing source and transition rules.

Native illustration state is transient and one-way: pending → active on intersection, reduced motion or observer failure. Activation disconnects observation; cleanup releases the media listener. The process accordion retains its existing single active-phase index. Inactive panels stay in the DOM for native size/opacity transitions but are inert and aria-hidden, with zero layout height after the transition. No persistence is added.

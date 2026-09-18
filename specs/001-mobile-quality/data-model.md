# Transient UI state

There is no new stored data or persistence contract.

The reveal wrapper transitions from visible server HTML to either permanently visible initial content or pending below-viewport enhancement. Pending content becomes revealed on intersection, focus, reduced motion, or an error. A completed reveal must not be hidden on prop changes. Cleanup restores the original inline values and releases observation/animation resources.

Carousel selection and consent cookie states retain their existing source and transition rules.
